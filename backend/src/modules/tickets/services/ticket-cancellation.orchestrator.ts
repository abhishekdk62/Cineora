import { ApiResponse, createResponse } from "../../../utils/createResponse";
import { ITicket } from "../interfaces/ticket.model.interface";
import { RefundCalculationDto } from "../dtos/dto";
import { ISeatPricing } from "../../bookings/interfaces/bookings.model.interface";
import {
  getPopulatedStringField,
  PopulatedTicketDocument,
} from "../../../types/mongoose.types";
import { IWalletService } from "../../wallet/interfaces/wallet.service.interface";
import { IWalletTransactionService } from "../../walletTransaction/interfaces/walletTransaction.service.interface";
import { IBookingService } from "../../bookings/interfaces/bookings.service.interface";
import { INotificationService } from "../../notification/interfaces/notification.service.interface";
import { NotificationScheduler } from "../../../services/scheduler.service";
import { ITheaterService } from "../../theaters/interfaces/theater.service.interface";
import { IShowtimeService } from "../../showtimes/interfaces/showtimes.service.interface";
import { TICKET_MESSAGES } from "../../../utils/messages.constants";
import {
  BookingCancellationInput,
  ITicketCancellationOrchestrator,
  SingleTicketCancellationInput,
} from "../interfaces/ticket-cancellation.orchestrator.interface";

export class TicketCancellationOrchestrator implements ITicketCancellationOrchestrator {
  constructor(
    private readonly walletService: IWalletService,
    private readonly walletTransactionService: IWalletTransactionService,
    private readonly bookingService: IBookingService,
    private readonly notificationService: INotificationService,
    private readonly notificationScheduler: NotificationScheduler,
    private readonly theaterService: ITheaterService,
    private readonly showtimeService: IShowtimeService
  ) {}

  async processSingleTicketCancellation(
    input: SingleTicketCancellationInput
  ): Promise<ApiResponse<unknown>> {
    const { userId, cancelledTickets, cancellationData, totalAmount } = input;

    await this._handleSeatRelease(cancelledTickets, userId);
    await this._handleBookingUpdateAfterCancellation(cancelledTickets, totalAmount);

    for (const ticket of cancelledTickets) {
      await this._handleSingleTicketPaymentReversal(
        totalAmount,
        ticket,
        cancellationData.refundPercentage
      );
    }

    const walletProcessed = await this._handleSingleTicketWalletRefund(
      userId,
      cancelledTickets,
      cancellationData.refundAmount,
      cancellationData.refundPercentage,
      cancellationData
    );

    if (!walletProcessed) {
      return createResponse({
        success: false,
        message: TICKET_MESSAGES.WALLET_NOT_FOUND,
      });
    }

    await this._handleSingleTicketCancellationNotifications(
      userId,
      cancelledTickets,
      cancellationData
    );

    return this._formatSingleTicketCancellationResponse(cancellationData, totalAmount);
  }

  async processBookingCancellation(
    input: BookingCancellationInput
  ): Promise<ApiResponse<unknown>> {
    const { userId, bookingId, amount, cancellationData } = input;
    const { refundAmount, refundPercentage, cancelledTickets } = cancellationData;

    await this._handleBookingCancellation(bookingId, userId);

    await this._handlePaymentReversal(
      amount,
      cancelledTickets[0],
      refundPercentage
    );

    const walletProcessed = await this._handleWalletRefund(
      userId,
      bookingId,
      refundAmount,
      refundPercentage,
      cancellationData
    );

    if (!walletProcessed) {
      return createResponse({
        success: false,
        message: TICKET_MESSAGES.WALLET_NOT_FOUND,
      });
    }

    await this._handleCancellationNotifications(userId, bookingId, cancellationData);

    return this._formatCancellationResponse(bookingId, cancellationData, amount);
  }

  private async _handleSeatRelease(cancelledTickets: ITicket[], userId: string) {
    try {
      const showtimeGroups = cancelledTickets.reduce((groups, ticket) => {
        const showtimeId = ticket.showtimeId.toString();
        if (!groups[showtimeId]) groups[showtimeId] = [];
        groups[showtimeId].push(`${ticket.seatRow}${ticket.seatNumber}`);
        return groups;
      }, {} as Record<string, string[]>);

      for (const [showtimeId, seatIds] of Object.entries(showtimeGroups)) {
        await this.showtimeService.releaseShowtimeSeats(
          showtimeId,
          seatIds as string[],
          userId,
          "single_ticket_cancellation"
        );
      }
    } catch (error) {
      console.error("Failed to release seats:", error);
    }
  }

  private async _handleBookingUpdateAfterCancellation(
    cancelledTickets: ITicket[],
    cancelledAmount: number
  ) {
    try {
      const firstTicket = cancelledTickets[0];
      const bookingId =
        typeof firstTicket.bookingId === "object" &&
        firstTicket.bookingId !== null &&
        "_id" in firstTicket.bookingId
          ? String((firstTicket.bookingId as { _id?: { toString(): string } })._id)
          : firstTicket.bookingId.toString();

      const bookingResult = await this.bookingService.getBookingById(bookingId);
      if (!bookingResult.success) {
        console.error("Failed to get booking for update:", bookingResult.message);
        return;
      }

      const booking = bookingResult.data;
      const cancelledSeatIds = cancelledTickets.map(
        (ticket) => `${ticket.seatRow}${ticket.seatNumber}`
      );

      const updatedSelectedSeats = booking.selectedSeats.filter(
        (seat: string) => !cancelledSeatIds.includes(seat)
      );
      const updatedSelectedSeatIds = booking.selectedSeatIds.filter(
        (seatId: string) => !cancelledSeatIds.includes(seatId)
      );
      const updatedSeatPricing = booking.seatPricing.filter((pricing: ISeatPricing) => {
        const allRowSeats = booking.selectedSeats.filter((seat: string) =>
          seat.startsWith(pricing.rowLabel)
        );
        const remainingRowSeats = allRowSeats.filter(
          (seat: string) => !cancelledSeatIds.includes(seat)
        );
        return remainingRowSeats.length > 0;
      });

      const originalSubtotal = booking.priceDetails.subtotal || 0;
      const newSubtotal = Math.max(0, originalSubtotal - cancelledAmount);
      const convenienceFeeRatio =
        originalSubtotal > 0
          ? (booking.priceDetails.convenienceFee || 0) / originalSubtotal
          : 0;
      const taxRatio =
        originalSubtotal > 0
          ? (booking.priceDetails.taxes || 0) / originalSubtotal
          : 0;

      const newConvenienceFee = Math.round(newSubtotal * convenienceFeeRatio);
      const newTaxes = Math.round(newSubtotal * taxRatio);
      const newTotal = Math.max(
        0,
        newSubtotal +
          newConvenienceFee +
          newTaxes -
          (booking.priceDetails.discount || 0)
      );

      const newBookingStatus =
        updatedSelectedSeats.length === 0 ? "cancelled" : "confirmed";

      await this.bookingService.updateBookingById(bookingId, {
        selectedSeats: updatedSelectedSeats,
        selectedSeatIds: updatedSelectedSeatIds,
        seatPricing: updatedSeatPricing,
        priceDetails: {
          subtotal: newSubtotal,
          convenienceFee: newConvenienceFee,
          taxes: newTaxes,
          discount: booking.priceDetails.discount || 0,
          total: newTotal,
        },
        bookingStatus: newBookingStatus,
        ...(newBookingStatus === "cancelled" && { cancelledAt: new Date() }),
      } as import("../dtos/dto").bookingInfo);
    } catch (error) {
      console.error("Failed to update booking after cancellation:", error);
    }
  }

  private async _handleSingleTicketPaymentReversal(
    totalAmount: number,
    cancelledTicket: ITicket,
    refundPercentage: number
  ) {
    try {
      const theaterResult = await this.theaterService.getTheaterById(
        cancelledTicket.theaterId.toString()
      );
      if (!theaterResult.success) {
        console.error("Theater not found for payment reversal");
        return;
      }

      const ownerId = String(theaterResult.data?.ownerId ?? "");
      const originalAdminCommission = Math.round(totalAmount * 0.15);
      const originalOwnerShare = totalAmount - originalAdminCommission;
      const refundRatio = refundPercentage / 100;

      await this._debitOwnerWalletForCancellation(
        ownerId,
        Math.round(originalOwnerShare * refundRatio),
        cancelledTicket
      );
      await this._debitAdminWalletForCancellation(
        Math.round(originalAdminCommission * refundRatio),
        cancelledTicket
      );
    } catch (error) {
      console.error("Single ticket payment reversal error:", error);
    }
  }

  private async _handlePaymentReversal(
    amount: number,
    cancelledTicket: ITicket,
    refundPercentage: number
  ) {
    try {
      const theaterResult = await this.theaterService.getTheaterById(
        cancelledTicket.theaterId.toString()
      );
      if (!theaterResult.success) {
        console.error("Theater not found for payment reversal");
        return;
      }

      const ownerId = String(theaterResult.data?.ownerId ?? "");
      const originalBaseAmount = amount || 300;
      const originalAdminCommission = Math.round(originalBaseAmount * 0.15);
      const originalOwnerShare = originalBaseAmount - originalAdminCommission;
      const refundRatio = refundPercentage / 100;

      await this._debitOwnerWalletForCancellation(
        ownerId,
        Math.round(originalOwnerShare * refundRatio),
        cancelledTicket
      );
      await this._debitAdminWalletForCancellation(
        Math.round(originalAdminCommission * refundRatio),
        cancelledTicket
      );
    } catch (error) {
      console.error("Payment reversal error:", error);
    }
  }

  private async _handleSingleTicketWalletRefund(
    userId: string,
    cancelledTickets: ITicket[],
    refundAmount: number,
    refundPercentage: number,
    cancellationData: RefundCalculationDto
  ): Promise<boolean> {
    try {
      const wallet = await this.walletService.getWalletDetails(userId, "User");
      if (!wallet.success) return false;

      const ticketCount = cancelledTickets.length;
      const creditResult = await this.walletService.creditWallet({
        userId,
        userModel: "User",
        amount: refundAmount,
        description: `${ticketCount} ticket(s) cancelled - ${refundPercentage}% refund (₹${refundAmount})`,
      });

      if (!creditResult.success) {
        console.error("Failed to credit wallet:", creditResult.message);
        return false;
      }

      const walletId = String((wallet.data as { _id?: unknown })._id ?? "");
      const firstTicket = cancelledTickets[0];

      const walletTransactionResult =
        await this.walletTransactionService.createWalletTransaction({
          userId,
          userModel: "User",
          walletId,
          type: "credit",
          amount: refundAmount,
          category: "refund",
          description: `Movie ticket refund - ${refundPercentage}% refund for ${ticketCount} ticket(s)`,
          referenceId: String(firstTicket.bookingId),
          movieId: String(firstTicket.movieId),
          theaterId: String(firstTicket.theaterId),
        });

      if (!walletTransactionResult.success) {
        console.error("Wallet transaction failed:", walletTransactionResult.message);
      }

      return true;
    } catch (error) {
      console.error("Single ticket wallet refund process failed:", error);
      return false;
    }
  }

  private async _handleWalletRefund(
    userId: string,
    bookingId: string,
    refundAmount: number,
    refundPercentage: number,
    cancellationData: RefundCalculationDto
  ): Promise<boolean> {
    try {
      const wallet = await this.walletService.getWalletDetails(userId, "User");
      if (!wallet.success) return false;

      const creditResult = await this.walletService.creditWallet({
        userId,
        userModel: "User",
        amount: refundAmount,
        description: `Booking cancelled - ${refundPercentage}% refund (₹${refundAmount})`,
      });

      if (!creditResult.success) {
        console.error("Failed to credit wallet:", creditResult.message);
        return false;
      }

      const walletId = String((wallet.data as { _id?: unknown })._id ?? "");
      const walletTransactionResult =
        await this.walletTransactionService.createWalletTransaction({
          userId,
          userModel: "User",
          walletId,
          type: "credit",
          amount: refundAmount,
          category: "refund",
          description: `Movie ticket refund - ${refundPercentage}% refund for booking ${bookingId}`,
          referenceId: bookingId,
          movieId: cancellationData.movieId,
          theaterId: cancellationData.theaterId,
        });

      if (!walletTransactionResult.success) {
        console.error("Wallet transaction failed:", walletTransactionResult.message);
      }

      return true;
    } catch (error) {
      console.error("Wallet refund process failed:", error);
      return false;
    }
  }

  private async _debitOwnerWalletForCancellation(
    ownerId: string,
    amount: number,
    cancelledTicket: ITicket
  ) {
    try {
      if (amount <= 0) return;

      const debitResult = await this.walletService.debitWalletAllowNegative({
        userId: ownerId,
        userModel: "Owner",
        amount,
      });

      if (debitResult.success) {
        await this.walletTransactionService.createWalletTransaction({
          userId: ownerId,
          userModel: "Owner",
          walletId: String(debitResult.data._id),
          type: "debit",
          amount,
          category: "refund",
          description: `Revenue reversal for cancellation - ${this._getCancelledTicketTitle(cancelledTicket)}`,
          referenceId: String(cancelledTicket.bookingId),
          movieId: String(cancelledTicket.movieId),
          theaterId: String(cancelledTicket.theaterId),
        });
      }
    } catch (error) {
      console.error("Owner wallet debit error:", error);
    }
  }

  private async _debitAdminWalletForCancellation(
    amount: number,
    cancelledTicket: ITicket
  ) {
    try {
      if (amount <= 0) return;

      const ADMIN_USER_ID = process.env.ADMIN_USER_ID || "your-default-admin-id";
      const debitResult = await this.walletService.debitWalletAllowNegative({
        userId: ADMIN_USER_ID,
        userModel: "Admin",
        amount,
      });

      if (debitResult.success) {
        await this.walletTransactionService.createWalletTransaction({
          userId: ADMIN_USER_ID,
          userModel: "Admin",
          walletId: String(debitResult.data._id),
          type: "debit",
          amount,
          category: "refund",
          description: `Commission reversal for cancellation - ${this._getCancelledTicketTitle(cancelledTicket)}`,
          referenceId: String(cancelledTicket.bookingId),
          movieId: String(cancelledTicket.movieId),
          theaterId: String(cancelledTicket.theaterId),
        });
      }
    } catch (error) {
      console.error("Admin wallet debit error:", error);
    }
  }

  private async _handleBookingCancellation(bookingId: string, userId: string) {
    try {
      await this.bookingService.cancelBooking(bookingId, userId);
    } catch (error) {
      console.error("Failed to cancel booking:", error);
    }
  }

  private async _handleSingleTicketCancellationNotifications(
    userId: string,
    cancelledTickets: ITicket[],
    cancellationData: RefundCalculationDto
  ) {
    try {
      const firstTicket = cancelledTickets[0];
      await this.notificationService.sendCancellationNotification(userId, {
        bookingId: String(firstTicket.bookingId),
        refundAmount: cancellationData.refundAmount,
        ticketCount: cancelledTickets.length,
      });
    } catch (error) {
      console.error("Failed to send single ticket cancellation notifications:", error);
    }
  }

  private async _handleCancellationNotifications(
    userId: string,
    bookingId: string,
    cancellationData: RefundCalculationDto
  ) {
    try {
      await this.notificationService.sendCancellationNotification(userId, {
        bookingId,
        refundAmount: cancellationData.refundAmount,
      });
      await this.notificationScheduler.cancelReminderByBookingId(bookingId);
    } catch (error) {
      console.error("Failed to send cancellation notifications:", error);
    }
  }

  private _getCancelledTicketTitle(ticket: ITicket): string {
    const populated = ticket as ITicket & PopulatedTicketDocument;
    return getPopulatedStringField(populated.movieId, "title", "Movie Ticket");
  }

  private _formatSingleTicketCancellationResponse(
    cancellationData: RefundCalculationDto,
    originalAmount: number
  ): ApiResponse<unknown> {
    const { refundAmount, refundPercentage, cancelledTickets, showDate, showTime } =
      cancellationData;
    const ticketCount = cancelledTickets.length;

    return createResponse({
      success: true,
      message: `${ticketCount} ticket(s) cancelled successfully. ₹${refundAmount} (${refundPercentage}%) refunded to your wallet.`,
      data: {
        cancelledTickets,
        ticketCount,
        refundDetails: {
          originalAmount,
          refundAmount,
          refundPercentage,
          cancellationFee: originalAmount - refundAmount,
        },
        showDetails: { showDate, showTime },
        walletCredited: true,
      },
    });
  }

  private _formatCancellationResponse(
    bookingId: string,
    cancellationData: RefundCalculationDto,
    originalAmount: number
  ): ApiResponse<unknown> {
    const { refundAmount, refundPercentage, cancelledTickets, showDate, showTime } =
      cancellationData;

    const message = TICKET_MESSAGES.BOOKING_CANCEL_SUCCESS.replace(
      "{refundAmount}",
      refundAmount.toString()
    ).replace("{refundPercentage}", refundPercentage.toString());

    return createResponse({
      success: true,
      message,
      data: {
        bookingId,
        cancelledTickets,
        refundDetails: {
          originalAmount,
          refundAmount,
          refundPercentage,
          cancellationFee: originalAmount - refundAmount,
        },
        showDetails: { showDate, showTime },
        walletCredited: true,
      },
    });
  }
}

import { Request, Response } from "express";
import { ITicketService } from "../interfaces/ticket.service.interface";
import {
  CancelTicketDto,
  GetUserTicketsDto,
  ValidateTicketDto,
} from "../dtos/dto";
import { createResponse } from "../../../utils/createResponse";
import { IWalletService } from "../../wallet/interfaces/wallet.service.interface";
import { IWalletTransactionService } from "../../walletTransaction/interfaces/walletTransaction.service.interface";
import { IBookingService } from "../../bookings/interfaces/bookings.service.interface";
import { INotificationService } from "../../notification/interfaces/notification.service.interface";
import { NotificationScheduler } from "../../../services/scheduler.service";
import { StatusCodes } from "../../../utils/statuscodes";
import { TICKET_MESSAGES } from "../../../utils/messages.constants";
import { ITheaterService } from "../../theaters/interfaces/theater.service.interface";
import { IShowtimeService } from "../../showtimes/interfaces/showtimes.service.interface";

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

export class TicketController {
  constructor(
    private readonly ticketService: ITicketService,
    private readonly walletService: IWalletService,
    private readonly walletTransactionService: IWalletTransactionService,
    private readonly bookingService: IBookingService,
    private readonly notificationService: INotificationService,
    private readonly notificationScheduler: NotificationScheduler,
    private readonly theaterService: ITheaterService,
    private readonly showtimeService: IShowtimeService
  ) {}

  async getTicketById(req: Request, res: Response): Promise<void> {
    try {
      const { ticketId } = req.params;

      if (!ticketId) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: "Ticket ID is required",
          })
        );
        return;
      }

      const result = await this.ticketService.getTicketById(ticketId);

      if (result.success) {
        res.status(StatusCodes.OK).json(result);
      } else {
        res.status(StatusCodes.NOT_FOUND).json(result);
      }
    } catch (error: unknown) {
      this._handleControllerError(
        res,
        error,
        TICKET_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Add all these methods to your existing TicketController class

  // Main controller method for single ticket cancellation
  async cancelSingleTicket(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { ticketIds, totalAmount } = req.body; // Array of ticket IDs and total amount
      const userId = req.user?.id;

      if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: TICKET_MESSAGES.AUTH_REQUIRED,
          })
        );
        return;
      }

      const validationError = this.validateCancelSingleTicketParams(
        ticketIds,
        totalAmount
      );
      if (validationError) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: validationError,
          })
        );
        return;
      }

      const cancelDto = {
        ticketIds,
        userId,
        totalAmount: Number(totalAmount),
      };

      const result = await this.ticketService.cancelSingleTicket(cancelDto);

      if (!result.success) {
        res.status(StatusCodes.BAD_REQUEST).json(result);
        return;
      }

      await this._handleSeatRelease(result.data.cancelledTickets, userId);

      // Update booking data - remove cancelled seats and update pricing
      await this._handleBookingUpdateAfterCancellation(
        result.data.cancelledTickets,
        Number(totalAmount)
      );

      // Handle payment reversal for each cancelled ticket
      for (const ticket of result.data.cancelledTickets) {
        await this._handleSingleTicketPaymentReversal(
          ticket,
          result.data.refundPercentage
        );
      }

      // Handle wallet refund for user
      const walletProcessed = await this._handleSingleTicketWalletRefund(
        userId,
        result.data.cancelledTickets,
        result.data.refundAmount,
        result.data.refundPercentage,
        result.data
      );

      if (!walletProcessed) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: TICKET_MESSAGES.WALLET_NOT_FOUND,
          })
        );
        return;
      }

      // Send notifications
      await this._handleSingleTicketCancellationNotifications(
        userId,
        result.data.cancelledTickets,
        result.data
      );

      const response = this._formatSingleTicketCancellationResponse(
        result.data,
        Number(totalAmount)
      );
      res.status(StatusCodes.OK).json(response);
    } catch (error: unknown) {
      console.error("Cancel single ticket error:", error);
      this._handleControllerError(
        res,
        error,
        TICKET_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Validation method
  private validateCancelSingleTicketParams(
    ticketIds: string[],
    totalAmount: any
  ): string | null {
    if (!ticketIds || !Array.isArray(ticketIds) || ticketIds.length === 0) {
      return "At least one ticket ID is required";
    }

    // Check if all ticketIds are valid strings
    for (const ticketId of ticketIds) {
      if (
        !ticketId ||
        typeof ticketId !== "string" ||
        ticketId.trim().length === 0
      ) {
        return "All ticket IDs must be valid strings";
      }
    }

    if (!totalAmount) {
      return "Total amount is required";
    }

    const amountNumber = Number(totalAmount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      return "Amount must be a valid number greater than 0";
    }

    return null;
  }

  // Handle seat release
  private async _handleSeatRelease(
    cancelledTickets: any[],
    userId: string
  ): Promise<void> {
    try {
      // Group tickets by showtime for efficient seat release
      const showtimeGroups = cancelledTickets.reduce((groups, ticket) => {
        const showtimeId = ticket.showtimeId.toString();
        if (!groups[showtimeId]) groups[showtimeId] = [];
        groups[showtimeId].push(`${ticket.seatRow}${ticket.seatNumber}`);
        return groups;
      }, {} as Record<string, string[]>);

      // Release seats for each showtime
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
    cancelledTickets: any[],
    cancelledAmount: number
  ): Promise<void> {
    try {
      const firstTicket = cancelledTickets[0];

      // FIX: Extract the actual string ID from the ObjectId
      const bookingId = firstTicket.bookingId._id
        ? firstTicket.bookingId._id.toString()
        : firstTicket.bookingId.toString();

      console.log("Booking ID for update:", bookingId); // Debug log

      const bookingResult = await this.bookingService.getBookingById(bookingId);
      if (!bookingResult.success) {
        console.error(
          "Failed to get booking for update:",
          bookingResult.message
        );
        return;
      }

      const booking = bookingResult.data;
      const cancelledSeatIds = cancelledTickets.map(
        (ticket) => `${ticket.seatRow}${ticket.seatNumber}`
      );
      console.log("cancelled ticks :", cancelledTickets);

      const updatedSelectedSeats = booking.selectedSeats.filter(
        (seat) => !cancelledSeatIds.includes(seat)
      );
      console.log("updated sel tick", updatedSelectedSeats);

      const updatedSelectedSeatIds = booking.selectedSeatIds.filter(
        (seatId) => !cancelledSeatIds.includes(seatId)
      );
      console.log("updated sel seet ids tick", updatedSelectedSeatIds);

      // Better seat pricing filter logic - keep pricing but remove specific seats
      const updatedSeatPricing = booking.seatPricing.filter((pricing) => {
        // Keep the pricing row if there are still seats in this row that aren't cancelled
        const allRowSeats = booking.selectedSeats.filter((seat) =>
          seat.startsWith(pricing.rowLabel)
        );
        const remainingRowSeats = allRowSeats.filter(
          (seat) => !cancelledSeatIds.includes(seat)
        );
        return remainingRowSeats.length > 0; // Keep pricing if this row still has active seats
      });
      console.log("updated sel updatedSeatPricing", updatedSeatPricing);

      // FIX: Better price calculation with safety checks
      const originalSubtotal = booking.priceDetails.subtotal || 0;
      const newSubtotal = Math.max(0, originalSubtotal - cancelledAmount);

      // Avoid division by zero
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

      const updatedPriceDetails = {
        subtotal: newSubtotal,
        convenienceFee: newConvenienceFee,
        taxes: newTaxes,
        discount: booking.priceDetails.discount || 0,
        total: newTotal,
      };

      let newBookingStatus = booking.bookingStatus;
      if (updatedSelectedSeats.length === 0) {
        newBookingStatus = "cancelled";
      } else {
        newBookingStatus = "confirmed";
      }

      const updateData = {
        selectedSeats: updatedSelectedSeats,
        selectedSeatIds: updatedSelectedSeatIds,
        seatPricing: updatedSeatPricing,
        priceDetails: updatedPriceDetails,
        bookingStatus: newBookingStatus,
        ...(newBookingStatus === "cancelled" && { cancelledAt: new Date() }),
      };

      console.log("updateData", updateData);

      // Use the string booking ID
      await this.bookingService.updateBookingById(bookingId, updateData);

      console.log(
        `✅ Booking ${bookingId} updated: ${updatedSelectedSeats.length} seats remaining, new total: ₹${newTotal}`
      );
    } catch (error) {
      console.error("Failed to update booking after cancellation:", error);
    }
  }

  // Handle payment reversal for single tickets
  private async _handleSingleTicketPaymentReversal(
    cancelledTicket: any,
    refundPercentage: number
  ): Promise<void> {
    try {
      const theaterResult = await this.theaterService.getTheaterById(
        cancelledTicket.theaterId
      );

      if (!theaterResult.success) {
        console.error("Theater not found for payment reversal");
        return;
      }

      const ownerId = theaterResult.data.ownerId;
      const ticketPrice = cancelledTicket.price;

      // Calculate original shares for this single ticket
      const originalAdminCommission = Math.round(ticketPrice * 0.15);
      const originalOwnerShare = ticketPrice - originalAdminCommission;

      // Calculate debit amounts based on refund percentage
      const refundRatio = refundPercentage / 100;
      const ownerDebit = Math.round(originalOwnerShare * refundRatio);
      const adminDebit = Math.round(originalAdminCommission * refundRatio);

      // Debit wallets
      await this._debitOwnerWalletForCancellation(
        ownerId,
        ownerDebit,
        cancelledTicket
      );
      await this._debitAdminWalletForCancellation(adminDebit, cancelledTicket);

      console.log(
        `💸 Single ticket payment reversed - Owner debited: ₹${ownerDebit}, Admin debited: ₹${adminDebit}`
      );
    } catch (error) {
      console.error("Single ticket payment reversal error:", error);
    }
  }

  private async _handleSingleTicketWalletRefund(
    userId: string,
    cancelledTickets: any[],
    refundAmount: number,
    refundPercentage: number,
    cancellationData: any
  ): Promise<boolean> {
    try {
      const wallet = await this.walletService.getWalletDetails(userId, "User");
      if (!wallet.success) {
        return false;
      }

      const ticketCount = cancelledTickets.length;
      const refundDescription = `${ticketCount} ticket(s) cancelled - ${refundPercentage}% refund (₹${refundAmount})`;

      const creditResult = await this.walletService.creditWallet({
        userId,
        userModel: "User",
        amount: refundAmount,
        description: refundDescription,
      });

      if (!creditResult.success) {
        console.error("Failed to credit wallet:", creditResult.message);
        return false;
      }

      const walletId = (wallet.data as any)._id;
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
          referenceId: firstTicket.bookingId,
          movieId: firstTicket.movieId,
          theaterId: firstTicket.theaterId,
        });

      if (!walletTransactionResult.success) {
        console.error(
          "Wallet transaction failed:",
          walletTransactionResult.message
        );
      }

      return true;
    } catch (error) {
      console.error("Single ticket wallet refund process failed:", error);
      return false;
    }
  }

  // Handle notifications
  private async _handleSingleTicketCancellationNotifications(
    userId: string,
    cancelledTickets: any[],
    cancellationData: any
  ): Promise<void> {
    try {
      const firstTicket = cancelledTickets[0];

      await this.notificationService.sendCancellationNotification(userId, {
        bookingId: firstTicket.bookingId,
        refundAmount: cancellationData.refundAmount,
        ticketCount: cancelledTickets.length,
      });
    } catch (error) {
      console.error(
        "Failed to send single ticket cancellation notifications:",
        error
      );
    }
  }

  private _formatSingleTicketCancellationResponse(
    cancellationData: any,
    originalAmount: number
  ): any {
    const {
      refundAmount,
      refundPercentage,
      cancelledTickets,
      showDate,
      showTime,
    } = cancellationData;

    const ticketCount = cancelledTickets.length;
    const message = `${ticketCount} ticket(s) cancelled successfully. ₹${refundAmount} (${refundPercentage}%) refunded to your wallet.`;

    return createResponse({
      success: true,
      message,
      data: {
        cancelledTickets,
        ticketCount,
        refundDetails: {
          originalAmount,
          refundAmount,
          refundPercentage,
          cancellationFee: originalAmount - refundAmount,
        },
        showDetails: {
          showDate,
          showTime,
        },
        walletCredited: true,
      },
    });
  }

  private async _handlePaymentReversal(
    cancelledTicket: any,
    refundPercentage: number
  ): Promise<void> {
    try {
      const theaterResult = await this.theaterService.getTheaterById(
        cancelledTicket.theaterId
      );

      if (!theaterResult.success) {
        console.error("Theater not found for payment reversal");
        return;
      }

      const ownerId = theaterResult.data.ownerId;
      const originalBaseAmount = cancelledTicket.amount || 300; // Base ticket price
      const originalAdminCommission = Math.round(originalBaseAmount * 0.15);
      const originalOwnerShare = originalBaseAmount - originalAdminCommission;
      const refundRatio = refundPercentage / 100;
      const ownerDebit = Math.round(originalOwnerShare * refundRatio);
      const adminDebit = Math.round(originalAdminCommission * refundRatio);
      await this._debitOwnerWalletForCancellation(
        ownerId,
        ownerDebit,
        cancelledTicket
      );
      await this._debitAdminWalletForCancellation(adminDebit, cancelledTicket);
    } catch (error) {
      console.error("Payment reversal error:", error);
    }
  }

  async cancelTicket(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { bookingId, amount } = req.query;
      const userId = req.user?.id;

      if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: TICKET_MESSAGES.AUTH_REQUIRED,
          })
        );
        return;
      }

      const validationError = this.validateCancelTicketParams(
        bookingId as string,
        amount
      );
      if (validationError) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: validationError,
          })
        );
        return;
      }

      const amountNumber = this.parseAmount(amount);
      const cancelDto: CancelTicketDto = {
        bookingId: bookingId as string,
        userId,
        amount: amountNumber,
      };

      const result = await this.ticketService.cancelTicket(cancelDto);

      if (!result.success) {
        res.status(StatusCodes.BAD_REQUEST).json(result);
        return;
      }

      await this._handleBookingCancellation(
        result.data.cancelledTickets[0].bookingId,
        userId
      );

      const { refundAmount, refundPercentage } = result.data;

      // **ADD THIS: Handle payment reversal**
      await this._handlePaymentReversal(
        result.data.cancelledTickets[0],
        refundPercentage
      );

      const walletProcessed = await this._handleWalletRefund(
        userId,
        bookingId as string,
        refundAmount,
        refundPercentage,
        result.data
      );

      if (!walletProcessed) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: TICKET_MESSAGES.WALLET_NOT_FOUND,
          })
        );
        return;
      }

      await this._handleCancellationNotifications(
        userId,
        bookingId as string,
        result.data
      );

      const response = this._formatCancellationResponse(
        bookingId as string,
        result.data,
        amountNumber
      );

      res.status(StatusCodes.OK).json(response);
    } catch (error: unknown) {
      console.error("Cancel ticket error:", error);
      this._handleControllerError(
        res,
        error,
        TICKET_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  private validateCancelTicketParams(
    bookingId: string,
    amount: any
  ): string | null {
    if (!bookingId) {
      return "Booking ID is required";
    }

    if (!amount) {
      return "Amount is required";
    }

    const amountNumber = this.parseAmount(amount);
    if (amountNumber <= 0) {
      return "Amount must be greater than 0";
    }

    return null;
  }

  private validateTicketParams(
    ticketId: string,
    qrCode: string
  ): string | null {
    if (!ticketId || !qrCode) {
      return "Ticket ID and QR code are required";
    }
    return null;
  }

  private parseAmount(amount: any): number {
    return Array.isArray(amount) ? Number(amount[0]) : Number(amount);
  }

  private async _handleBookingCancellation(
    bookingId: string,
    userId: string
  ): Promise<void> {
    try {
      await this.bookingService.cancelBooking(bookingId, userId);
    } catch (error) {
      console.error("Failed to cancel booking:", error);
    }
  }

  private async _handleWalletRefund(
    userId: string,
    bookingId: string,
    refundAmount: number,
    refundPercentage: number,
    cancellationData: any
  ): Promise<boolean> {
    try {
      const wallet = await this.walletService.getWalletDetails(userId, "User");
      if (!wallet.success) {
        return false;
      }

      const refundDescription = `Booking cancelled - ${refundPercentage}% refund (\u20B9${refundAmount})`;

      const creditResult = await this.walletService.creditWallet({
        userId,
        userModel: "User",
        amount: refundAmount,
        description: refundDescription,
      });

      if (!creditResult.success) {
        console.error("Failed to credit wallet:", creditResult.message);
        return false;
      }
      const walletId = (wallet.data as any)._id;

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
        console.error(
          "Wallet transaction failed:",
          walletTransactionResult.message
        );
      }

      return true;
    } catch (error) {
      console.error("Wallet refund process failed:", error);
      return false;
    }
  }

  private async _handleCancellationNotifications(
    userId: string,
    bookingId: string,
    cancellationData: any
  ): Promise<void> {
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

  private _formatCancellationResponse(
    bookingId: string,
    cancellationData: any,
    originalAmount: number
  ): any {
    const {
      refundAmount,
      refundPercentage,
      cancelledTickets,
      showDate,
      showTime,
    } = cancellationData;

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
        showDetails: {
          showDate,
          showTime,
        },
        walletCredited: true,
      },
    });
  }

  private _formatPaginatedTicketsResponse(
    result: any,
    page: number,
    limit: number
  ): any {
    return createResponse({
      success: true,
      message: result.message || "User tickets retrieved successfully",
      data: result.data?.tickets || result.data,
      meta: {
        pagination: {
          currentPage: page,
          totalPages:
            result.data?.totalPages ||
            Math.ceil((result.data?.total || 0) / limit),
          total: result.data?.total || 0,
          limit,
          hasNextPage: page < (result.data?.totalPages || 0),
          hasPrevPage: page > 1,
        },
      },
    });
  }

  private _handleControllerError(
    res: Response,
    error: unknown,
    defaultMessage: string
  ): void {
    const errorMessage =
      error instanceof Error ? error.message : defaultMessage;

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      createResponse({
        success: false,
        message: errorMessage,
      })
    );
  }
  async getUserTickets(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      const { page = "1", limit = "10", type = "all" } = req.query;

      if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: TICKET_MESSAGES.AUTH_REQUIRED,
          })
        );
        return;
      }

      const types = (type as string).split(",") as (
        | "upcoming"
        | "past"
        | "cancelled"
        | "all"
      )[];

      const getUserTicketsDto: GetUserTicketsDto = {
        userId,
        page: parseInt(page as string) || 1,
        limit: parseInt(limit as string) || 10,
        types,
      };

      const result = await this.ticketService.getUserTickets(getUserTicketsDto);

      if (!result.success) {
        res.status(StatusCodes.BAD_REQUEST).json(result);
        return;
      }

      const responseWithMeta = this._formatPaginatedTicketsResponse(
        result,
        getUserTicketsDto.page!,
        getUserTicketsDto.limit!
      );

      res.status(StatusCodes.OK).json(responseWithMeta);
    } catch (error: unknown) {
      this._handleControllerError(
        res,
        error,
        TICKET_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async markTicketAsUsed(req: Request, res: Response): Promise<void> {
    try {
      const { ticketId } = req.params;

      if (!ticketId) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: "Ticket ID is required",
          })
        );
        return;
      }

      const result = await this.ticketService.markTicketAsUsed(ticketId);

      if (result.success) {
        res.status(StatusCodes.OK).json(result);
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(result);
      }
    } catch (error: unknown) {
      this._handleControllerError(
        res,
        error,
        TICKET_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async validateTicket(req: Request, res: Response): Promise<void> {
    try {
      const { ticketId, qrCode } = req.body;

      const validationError = this.validateTicketParams(ticketId, qrCode);
      if (validationError) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: validationError,
          })
        );
        return;
      }

      const validateDto: ValidateTicketDto = {
        ticketId,
        qrCode,
      };

      const result = await this.ticketService.validateTicket(validateDto);

      if (result.success) {
        res.status(StatusCodes.OK).json(result);
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(result);
      }
    } catch (error: unknown) {
      this._handleControllerError(
        res,
        error,
        TICKET_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async verifyTicketFromQrCode(req: Request, res: Response): Promise<void> {
    try {
      const { data } = req.params;

      if (!data) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: "QR code data is required",
          })
        );
        return;
      }

      const decodedData = decodeURIComponent(data);
      const result = await this.ticketService.verifyTicket(decodedData);

      if (!result.success) {
        res.status(StatusCodes.BAD_REQUEST).json(result);
        return;
      }

      res.status(StatusCodes.OK).json(result);
    } catch (error: unknown) {
      this._handleControllerError(
        res,
        error,
        TICKET_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  private async _debitOwnerWalletForCancellation(
    ownerId: string,
    amount: number,
    cancelledTicket: any
  ): Promise<void> {
    try {
      if (amount <= 0) return;

      const debitResult = await this.walletService.debitWalletAllowNegative({
        userId: ownerId,
        userModel: "Owner",
        amount: amount,
      });

      if (debitResult.success) {
        await this.walletTransactionService.createWalletTransaction({
          userId: ownerId,
          userModel: "Owner",
          walletId: debitResult.data._id,
          type: "debit",
          amount: amount,
          category: "refund",
          description: `Revenue reversal for cancellation - ${
            cancelledTicket.movieTitle || "Movie Ticket"
          }`,
          referenceId: cancelledTicket.bookingId,
          movieId: cancelledTicket.movieId,
          theaterId: cancelledTicket.theaterId,
        });
      }
    } catch (error) {
      console.error("Owner wallet debit error:", error);
    }
  }

  private async _debitAdminWalletForCancellation(
    amount: number,
    cancelledTicket: any
  ): Promise<void> {
    try {
      if (amount <= 0) return;

      const ADMIN_USER_ID =
        process.env.ADMIN_USER_ID || "your-default-admin-id";

      const debitResult = await this.walletService.debitWalletAllowNegative({
        userId: ADMIN_USER_ID,
        userModel: "Admin",
        amount: amount,
      });

      if (debitResult.success) {
        console.log(`✅ Admin wallet debited ₹${amount}`);

        await this.walletTransactionService.createWalletTransaction({
          userId: ADMIN_USER_ID,
          userModel: "Admin",
          walletId: debitResult.data._id,
          type: "debit",
          amount: amount,
          category: "refund",
          description: `Commission reversal for cancellation - ${
            cancelledTicket.movieTitle || "Movie Ticket"
          }`,
          referenceId: cancelledTicket.bookingId,
          movieId: cancelledTicket.movieId,
          theaterId: cancelledTicket.theaterId,
        });
      }
    } catch (error) {
      console.error("Admin wallet debit error:", error);
    }
  }
}

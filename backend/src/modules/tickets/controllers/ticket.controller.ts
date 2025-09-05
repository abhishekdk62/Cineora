import { Request, Response } from "express";
import { ITicketService } from "../interfaces/ticket.service.interface";
import { 
  CancelTicketDto,
  GetUserTicketsDto,
  ValidateTicketDto 
} from "../dtos/dto";
import { createResponse } from "../../../utils/createResponse";
import { IWalletService } from "../../wallet/interfaces/wallet.service.interface";
import { IWalletTransactionService } from "../../walletTransaction/interfaces/walletTransaction.service.interface";
import { IBookingService } from "../../bookings/interfaces/bookings.service.interface";
import { INotificationService } from "../../notification/interfaces/notification.service.interface";
import { NotificationScheduler } from "../../../services/scheduler.service";
import { StatusCodes } from "../../../utils/statuscodes";
import { TICKET_MESSAGES } from "../../../utils/messages.constants";

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
    private readonly notificationScheduler: NotificationScheduler
  ) {}

  async getTicketById(req: Request, res: Response): Promise<void> {
    try {
      const { ticketId } = req.params;

      if (!ticketId) {
        res.status(StatusCodes.BAD_REQUEST).json(createResponse({
          success: false,
          message: "Ticket ID is required",
        }));
        return;
      }

      const result = await this.ticketService.getTicketById(ticketId);

      if (result.success) {
        res.status(StatusCodes.OK).json(result);
      } else {
        res.status(StatusCodes.NOT_FOUND).json(result);
      }
    } catch (error: unknown) {
      this._handleControllerError(res, error, TICKET_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async cancelTicket(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { bookingId, amount } = req.query;
      const userId = req.user?.id;

      if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json(createResponse({
          success: false,
          message: TICKET_MESSAGES.AUTH_REQUIRED,
        }));
        return;
      }

      const validationError = this.validateCancelTicketParams(bookingId as string, amount);
      if (validationError) {
        res.status(StatusCodes.BAD_REQUEST).json(createResponse({
          success: false,
          message: validationError,
        }));
        return;
      }

      const amountNumber = this.parseAmount(amount);
      const cancelDto: CancelTicketDto = {
        bookingId: bookingId as string,
        userId,
        amount: amountNumber
      };

      const result = await this.ticketService.cancelTicket(cancelDto);

      if (!result.success) {
        res.status(StatusCodes.BAD_REQUEST).json(result);
        return;
      }

      // Handle booking cancellation
      await this._handleBookingCancellation(result.data.cancelledTickets[0].bookingId, userId);

      const { refundAmount, refundPercentage } = result.data;

      // Handle wallet operations
      const walletProcessed = await this._handleWalletRefund(
        userId, 
        bookingId as string, 
        refundAmount, 
        refundPercentage, 
        result.data
      );

      if (!walletProcessed) {
        res.status(StatusCodes.BAD_REQUEST).json(createResponse({
          success: false,
          message: TICKET_MESSAGES.WALLET_NOT_FOUND,
        }));
        return;
      }

      // Handle notifications
      await this._handleCancellationNotifications(userId, bookingId as string, result.data);

      const response = this._formatCancellationResponse(
        bookingId as string, 
        result.data, 
        amountNumber
      );

      res.status(StatusCodes.OK).json(response);
    } catch (error: unknown) {
      console.error("Cancel ticket error:", error);
      this._handleControllerError(res, error, TICKET_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserTickets(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { page = "1", limit = "10" } = req.query;

      if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json(createResponse({
          success: false,
          message: TICKET_MESSAGES.AUTH_REQUIRED,
        }));
        return;
      }

      const getUserTicketsDto: GetUserTicketsDto = {
        userId,
        page: parseInt(page as string) || 1,
        limit: parseInt(limit as string) || 10
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
      this._handleControllerError(res, error, TICKET_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async markTicketAsUsed(req: Request, res: Response): Promise<void> {
    try {
      const { ticketId } = req.params;

      if (!ticketId) {
        res.status(StatusCodes.BAD_REQUEST).json(createResponse({
          success: false,
          message: "Ticket ID is required",
        }));
        return;
      }

      const result = await this.ticketService.markTicketAsUsed(ticketId);

      if (result.success) {
        res.status(StatusCodes.OK).json(result);
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(result);
      }
    } catch (error: unknown) {
      this._handleControllerError(res, error, TICKET_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async validateTicket(req: Request, res: Response): Promise<void> {
    try {
      const { ticketId, qrCode } = req.body;

      const validationError = this.validateTicketParams(ticketId, qrCode);
      if (validationError) {
        res.status(StatusCodes.BAD_REQUEST).json(createResponse({
          success: false,
          message: validationError,
        }));
        return;
      }

      const validateDto: ValidateTicketDto = {
        ticketId,
        qrCode
      };

      const result = await this.ticketService.validateTicket(validateDto);

      if (result.success) {
        res.status(StatusCodes.OK).json(result);
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(result);
      }
    } catch (error: unknown) {
      this._handleControllerError(res, error, TICKET_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async verifyTicketFromQrCode(req: Request, res: Response): Promise<void> {
    try {
      const { data } = req.params;

      if (!data) {
        res.status(StatusCodes.BAD_REQUEST).json(createResponse({
          success: false,
          message: "QR code data is required",
        }));
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
      this._handleControllerError(res, error, TICKET_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  // Private helper methods for controller logic (SRP - Single Responsibility)
  private validateCancelTicketParams(bookingId: string, amount: any): string | null {
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

  private validateTicketParams(ticketId: string, qrCode: string): string | null {
    if (!ticketId || !qrCode) {
      return "Ticket ID and QR code are required";
    }
    return null;
  }

  private parseAmount(amount: any): number {
    return Array.isArray(amount) ? Number(amount[0]) : Number(amount);
  }

  private async _handleBookingCancellation(bookingId: string, userId: string): Promise<void> {
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

      // Credit wallet with refund (using Unicode escape for rupee symbol)
      const refundDescription = `Booking cancelled - ${refundPercentage}% refund (\u20B9${refundAmount})`;
      
      const creditResult = await this.walletService.creditWallet({
        userId,
        userModel: "User",
        amount: refundAmount,
        description: refundDescription
      });

      if (!creditResult.success) {
        console.error("Failed to credit wallet:", creditResult.message);
        return false;
      }
const walletId = (wallet.data as any)._id;

      // Create wallet transaction record
      const walletTransactionResult = await this.walletTransactionService.createWalletTransaction({
        userId,
        userModel: "User",
        walletId ,
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

  private async _handleCancellationNotifications(userId: string, bookingId: string, cancellationData: any): Promise<void> {
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

  private _formatCancellationResponse(bookingId: string, cancellationData: any, originalAmount: number): any {
    const { refundAmount, refundPercentage, cancelledTickets, showDate, showTime } = cancellationData;

    const message = TICKET_MESSAGES.BOOKING_CANCEL_SUCCESS
      .replace('{refundAmount}', refundAmount.toString())
      .replace('{refundPercentage}', refundPercentage.toString());

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

  private _formatPaginatedTicketsResponse(result: any, page: number, limit: number): any {
    return createResponse({
      success: true,
      message: result.message || "User tickets retrieved successfully",
      data: result.data?.tickets || result.data,
      meta: {
        pagination: {
          currentPage: page,
          totalPages: result.data?.totalPages || Math.ceil((result.data?.total || 0) / limit),
          total: result.data?.total || 0,
          limit,
          hasNextPage: page < (result.data?.totalPages || 0),
          hasPrevPage: page > 1,
        },
      },
    });
  }

  private _handleControllerError(res: Response, error: unknown, defaultMessage: string): void {
    const errorMessage = error instanceof Error ? error.message : defaultMessage;
    
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(createResponse({
      success: false,
      message: errorMessage,
    }));
  }
}

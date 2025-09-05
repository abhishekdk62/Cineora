import { Request, Response } from "express";
import { 
  CreateBookingDto, 
  UpdatePaymentStatusDto, 
  BookingParamsDto,
  AuthenticatedRequest 
} from "../dtos/dto";
import { IBookingService } from "../interfaces/bookings.service.interface";
import { ITicketService } from "../../tickets/interfaces/ticket.service.interface";
import { IUserService } from "../../user/interfaces/user.service.interface";
import { IWalletTransactionService } from "../../walletTransaction/interfaces/walletTransaction.service.interface";
import { IWalletService } from "../../wallet/interfaces/wallet.service.interface";
import { INotificationService } from "../../notification/interfaces/notification.service.interface";
import { NotificationScheduler } from "../../../services/scheduler.service";
import { StatusCodes } from "../../../utils/statuscodes";
import { BOOKING_MESSAGES } from "../../../utils/messages.constants";
import { createResponse } from "../../../utils/createResponse";

export class BookingController  {
  constructor(
    private readonly bookingService: IBookingService,
    private readonly ticketService: ITicketService,
    private readonly userService: IUserService,
    private readonly walletService: IWalletService,
    private readonly walletTransactionService: IWalletTransactionService,
    private readonly notificationService: INotificationService,
    private readonly notificationScheduler: NotificationScheduler
  ) {}

  async createBooking(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const bookingDto: CreateBookingDto = this._mapBodyToCreateBookingDto(req.body);
      const userId = this._extractAuthenticatedUserId(req);

      if (!userId) {
        return this._sendErrorResponse(
          res,
          StatusCodes.UNAUTHORIZED,
          BOOKING_MESSAGES.AUTH_REQUIRED
        );
      }

      // Handle wallet payment if applicable
      if (bookingDto.paymentMethod === "wallet") {
        const walletValidationResult = await this._validateWalletPayment(userId, bookingDto, res);
        if (!walletValidationResult.isValid) {
          return walletValidationResult.response!;
        }
      }

      const bookingResult = await this._processBookingCreation(userId, bookingDto);
      if (!bookingResult.success) {
        return this._sendErrorResponse(res, StatusCodes.BAD_REQUEST, bookingResult.message);
      }

      await this._handlePostBookingOperations(userId, bookingDto, bookingResult.data);

      return this._sendSuccessResponse(res, StatusCodes.CREATED, {
        message: BOOKING_MESSAGES.BOOKING_TICKET_SUCCESS,
        data: {
          booking: bookingResult.data,
          tickets: await this._createTicketsForBooking(userId, bookingDto, bookingResult.data),
        },
      });
    } catch (error: any) {
      return this._sendErrorResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        error.message || BOOKING_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getBookingById(req: Request, res: Response): Promise<Response> {
    try {
      const { bookingId } = this._mapParamsToBookingParams(req.params);
      const result = await this.bookingService.getBookingByBookingId(bookingId!);

      if (result.success) {
        return this._sendSuccessResponse(res, StatusCodes.OK, {
          message: result.message,
          data: result.data,
        });
      } else {
        return this._sendErrorResponse(res, StatusCodes.NOT_FOUND, result.message);
      }
    } catch (error: any) {
      return this._sendErrorResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        error.message || BOOKING_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getUpcomingBookings(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const { userId } = this._mapParamsToBookingParams(req.params);
      const authenticatedUserId = this._extractAuthenticatedUserId(req);

      if (!this._validateUserAccess(userId!, authenticatedUserId)) {
        return this._sendErrorResponse(res, StatusCodes.FORBIDDEN, BOOKING_MESSAGES.ACCESS_DENIED);
      }

      const result = await this.bookingService.getUpcomingBookings(userId!);

      return this._sendSuccessResponse(res, StatusCodes.OK, {
        message: result.message || "Upcoming bookings retrieved successfully",
        data: result.data,
      });
    } catch (error: any) {
      return this._sendErrorResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        error.message || BOOKING_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async cancelBooking(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const { bookingId } = this._mapParamsToBookingParams(req.params);
      const userId = this._extractAuthenticatedUserId(req);

      if (!userId) {
        return this._sendErrorResponse(res, StatusCodes.UNAUTHORIZED, BOOKING_MESSAGES.AUTH_REQUIRED);
      }

      const result = await this.bookingService.cancelBooking(bookingId!, userId);

      if (result.success) {
        return this._sendSuccessResponse(res, StatusCodes.OK, {
          message: result.message,
          data: result.data,
        });
      } else {
        return this._sendErrorResponse(res, StatusCodes.BAD_REQUEST, result.message);
      }
    } catch (error: any) {
      return this._sendErrorResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        error.message || BOOKING_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updatePaymentStatus(req: Request, res: Response): Promise<Response> {
    try {
      const { bookingId } = this._mapParamsToBookingParams(req.params);
      const paymentData: UpdatePaymentStatusDto = this._mapBodyToUpdatePaymentStatusDto(req.body);

      const result = await this.bookingService.updatePaymentStatus(
        bookingId!,
        paymentData.paymentStatus,
        paymentData.paymentId
      );

      if (result.success) {
        return this._sendSuccessResponse(res, StatusCodes.OK, {
          message: result.message,
          data: result.data,
        });
      } else {
        return this._sendErrorResponse(res, StatusCodes.NOT_FOUND, result.message);
      }
    } catch (error: any) {
      return this._sendErrorResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        error.message || BOOKING_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getBookingHistory(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const { userId } = this._mapParamsToBookingParams(req.params);
      const authenticatedUserId = this._extractAuthenticatedUserId(req);

      if (!this._validateUserAccess(userId!, authenticatedUserId)) {
        return this._sendErrorResponse(res, StatusCodes.FORBIDDEN, BOOKING_MESSAGES.ACCESS_DENIED);
      }

      const result = await this.bookingService.getBookingHistory(userId!);

      return this._sendSuccessResponse(res, StatusCodes.OK, {
        message: result.message || "Booking history retrieved successfully",
        data: result.data,
      });
    } catch (error: any) {
      return this._sendErrorResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        error.message || BOOKING_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getBookingHistoryOwner(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const { userId } = this._mapParamsToBookingParams(req.params);
      const authenticatedUserId = this._extractAuthenticatedUserId(req);

      if (!this._validateUserAccess(userId!, authenticatedUserId)) {
        return this._sendErrorResponse(res, StatusCodes.FORBIDDEN, BOOKING_MESSAGES.ACCESS_DENIED);
      }

      const result = await this.bookingService.getBookingHistory(userId!);

      return this._sendSuccessResponse(res, StatusCodes.OK, {
        message: result.message || "Owner booking history retrieved successfully",
        data: result.data,
      });
    } catch (error: any) {
      return this._sendErrorResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        error.message || BOOKING_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getBookingsByShowtimeId(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const { showtimeId } = this._mapParamsToBookingParams(req.params);

      const result = await this.bookingService.getBookingsByShowtime(showtimeId!);

      return this._sendSuccessResponse(res, StatusCodes.OK, {
        message: result.message || "Bookings by showtime retrieved successfully",
        data: result.data,
      });
    } catch (error: any) {
      return this._sendErrorResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        error.message || BOOKING_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Private helper methods for request/response mapping and validation
  private _mapBodyToCreateBookingDto(body: any): CreateBookingDto {
    return body as CreateBookingDto;
  }

  private _mapBodyToUpdatePaymentStatusDto(body: any): UpdatePaymentStatusDto {
    return body as UpdatePaymentStatusDto;
  }

  private _mapParamsToBookingParams(params: any): BookingParamsDto {
    return params as BookingParamsDto;
  }

  private _extractAuthenticatedUserId(req: AuthenticatedRequest): string | undefined {
    return req.user?.id;
  }

  private _validateUserAccess(requestedUserId: string, authenticatedUserId: string | undefined): boolean {
    return requestedUserId === authenticatedUserId;
  }

  // FIXED: Added res parameter to the method
  private async _validateWalletPayment(
    userId: string, 
    bookingDto: CreateBookingDto,
    res: Response  // Added this parameter
  ): Promise<{ isValid: boolean; response?: Response }> {
    const wallet = await this.walletService.getWalletDetails(userId, "User");

    if (!wallet.success) {
      return {
        isValid: false,
        response: this._sendErrorResponse(
          res,
          StatusCodes.NOT_FOUND,
          BOOKING_MESSAGES.WALLET_NOT_FOUND
        ),
      };
    }

    if (wallet.data.balance < bookingDto.priceDetails.total) {
      return {
        isValid: false,
        response: this._sendErrorResponse(
          res,
          StatusCodes.BAD_REQUEST,
          BOOKING_MESSAGES.INSUFFICIENT_BALANCE
        ),
      };
    }

    // Process wallet transaction
    await this.walletTransactionService.createWalletTransaction({
      userId,
      userModel: "User",
      walletId: wallet.data._id,
      type: "debit",
      amount: bookingDto.priceDetails.total,
      category: "booking",
      description: `Movie ticket booking - ${bookingDto.movieTitle || "Movie Ticket"}`,
      movieId: bookingDto.movieId,
      theaterId: bookingDto.theaterId,
    });

    return { isValid: true };
  }

  private async _processBookingCreation(userId: string, bookingDto: CreateBookingDto) {
    const bookingDataWithUser = {
      ...bookingDto,
      userId,
    };

    return await this.bookingService.createBooking(bookingDataWithUser);
  }

private async _createTicketsForBooking(
  userId: string, 
  bookingDto: CreateBookingDto, 
  bookingData: any
) {
  const user = await this.userService.getUserProfile(userId);

  // Transform selectedRows to match ticket service expectations
  const transformedSelectedRows = bookingDto.selectedRows?.map(row => ({
    rowLabel: row.rowLabel,
    seatsSelected: row.seatsSelected.map(seat => 
      typeof seat === 'string' ? parseInt(seat, 10) : seat
    ),
    seatType: this._determineSeatType(row.rowLabel),
    pricePerSeat: this._calculatePricePerSeat(row.rowLabel, bookingDto.seatPricing)
  })) || [];

  // FIXED: Use 'bookingInfo' instead of 'ticketData'
  const ticketResult = await this.ticketService.createTicketsFromRows({
    bookingId: bookingData._id.toString(),
    selectedRows: transformedSelectedRows,
    bookingInfo: {
      userId,
      movieId: bookingData.movieId,
      theaterId: bookingData.theaterId,
      screenId: bookingData.screenId,
      showtimeId: bookingData.showtimeId,
      showDate: new Date(bookingDto.showDate), // Convert string to Date
      showTime: bookingDto.showTime,
      email: user.data.email,
    }
  });

  return ticketResult.success ? ticketResult.data : [];
}

// Helper methods for data transformation
private _determineSeatType(rowLabel: string): "VIP" | "Premium" | "Normal" {
  const firstChar = rowLabel.charAt(0).toLowerCase();
  if (['a', 'b', 'c'].includes(firstChar)) return "VIP";
  if (['d', 'e', 'f'].includes(firstChar)) return "Premium";
  return "Normal";
}

private _calculatePricePerSeat(rowLabel: string, seatPricing: any[]): number {
  const pricing = seatPricing.find(p => p.rowLabel === rowLabel);
  return pricing?.finalPrice || 0;
}



  private async _handlePostBookingOperations(
    userId: string, 
    bookingDto: CreateBookingDto, 
    bookingData: any
  ): Promise<void> {
    // Send booking notification
    const bookingNotificationData = {
      bookingId: bookingData.bookingId || bookingData._id.toString(),
      movieTitle: bookingDto.movieTitle,
      theaterName: bookingDto.theaterName,
      showDate: bookingDto.showDate,
      showTime: bookingDto.showTime,
      seats: bookingDto.selectedSeats?.join(", "),
      totalAmount: bookingDto.priceDetails.total,
    };

    await this.notificationService.sendBookingNotification(userId, bookingNotificationData);

    // Schedule reminder notification
    const showDateTime = new Date(`${bookingDto.showDate.split("T")[0]}T${bookingDto.showTime}:00`);

    // await this.notificationScheduler.scheduleReminder(userId, showDateTime, {
    //   bookingId: bookingData.bookingId,
    //   movieTitle: bookingDto.movieTitle,
    //   theaterName: bookingDto.theaterName,
    //   showTime: bookingDto.showTime,
    //   seats: bookingDto.selectedSeats?.join(", "),
    // });
  }

  private _sendSuccessResponse(
    res: Response,
    statusCode: number,
    payload: { message?: string; data?: any }
  ): Response {
    return res.status(statusCode).json(
      createResponse({
        success: true,
        ...payload,
      })
    );
  }

  private _sendErrorResponse(res: Response, statusCode: number, message: string): Response {
    return res.status(statusCode).json(
      createResponse({
        success: false,
        message,
      })
    );
  }
}

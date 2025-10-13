import { Request, Response } from "express";
import {
  CreateBookingDto,
  UpdatePaymentStatusDto,
  BookingParamsDto,
  AuthenticatedRequest,
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
import { OwnerService } from "../../owner/services/owner.service";
import { ITheaterService } from "../../theaters/interfaces/theater.service.interface";
import { CreateWalletDto, CreditWalletDto } from "../../wallet/dtos/dto";
import { ICouponService } from "../../coupons/interfaces/coupons.service.interface";
import mongoose from "mongoose";
import { bookingInfo } from "../../tickets/dtos/dto";
import { IPaymentService } from "../../payment/interfaces/payment.service.interface";
import redis from "../../../config/redis.config";

export class BookingController {
  constructor(
    private readonly bookingService: IBookingService,
    private readonly ticketService: ITicketService,
    private readonly userService: IUserService,
    private readonly walletService: IWalletService,
    private readonly walletTransactionService: IWalletTransactionService,
    private readonly notificationService: INotificationService,
    private readonly notificationScheduler: NotificationScheduler,
    private readonly theaterService: ITheaterService,
    private readonly paymentService: IPaymentService
  ) {}

  async createBooking(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const bookingDto: CreateBookingDto = this._mapBodyToCreateBookingDto(
        req.body
      );
      const userId = this._extractAuthenticatedUserId(req);
      const { walletTransactionId } = req.body;

      if (!walletTransactionId) {
        return this._sendErrorResponse(
          res,
          400,
          BOOKING_MESSAGES.NO_TRANSACTION_ID
        );
      }

      const walletData = await redis.get(
        `wallet_idempotency:${walletTransactionId}`
      );

      if (walletData) {
        const wallet = JSON.parse(walletData);

        if (wallet.userId !== userId) {
          return this._sendErrorResponse(
            res,
            400,
            "Unauthorized - Wallet transaction mismatch"
          );
        }
        console.log("wallet idem", wallet);

        await redis.del(`wallet_idempotency:${walletTransactionId}`);
      } else {
        const orderData = await redis.get(
          `razorpay_order:${walletTransactionId}`
        );

        if (!orderData) {
          return this._sendErrorResponse(
            res,
            400,
            "Invalid or expired order ID"
          );
        }
        const order = JSON.parse(orderData);
        if (order.userId !== userId) {
          return this._sendErrorResponse(
            res,
            403,
            "Unauthorized - Order belongs to different user"
          );
        }
        if (order.amount !== bookingDto.totalAmount) {
          return this._sendErrorResponse(res, 400, "Order amount mismatch");
        }
        await redis.del(`razorpay_order:${walletTransactionId}`);
      }

      if (!userId) {
        return this._sendErrorResponse(
          res,
          StatusCodes.UNAUTHORIZED,
          BOOKING_MESSAGES.AUTH_REQUIRED
        );
      }

      const bookingResult = await this._processBookingCreation(
        userId,
        bookingDto
      );

      if (!bookingResult.success) {
        return this._sendErrorResponse(
          res,
          StatusCodes.BAD_REQUEST,
          bookingResult.message
        );
      }

      await this._handlePostBookingOperations(
        userId,
        bookingDto,
        bookingResult.data
      );

      if (bookingDto.appliedCoupon && bookingDto.appliedCoupon._id) {
        try {
          await this.couponService.incrementCouponUsage(
            bookingDto.appliedCoupon._id
          );
        } catch (error) {
          console.error("Failed to increment coupon usage:", error);
        }
      }
      await this._distributePayment(bookingDto);
      return this._sendSuccessResponse(res, StatusCodes.CREATED, {
        message: BOOKING_MESSAGES.BOOKING_TICKET_SUCCESS,
        data: {
          booking: bookingResult.data,
          tickets: await this._createTicketsForBooking(
            userId,
            bookingDto,
            bookingResult.data
          ),
        },
      });
    } catch (error: unknown) {
      return this._sendErrorResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        error.message || BOOKING_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }
  async getAllBookingsByOwnerIdForPanel(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const ownerId = req.owner.ownerId;

      if (!ownerId) {
        return this._sendErrorResponse(
          res,
          StatusCodes.UNAUTHORIZED,
          "Owner authentication required"
        );
      }

      const result = await this.bookingService.getAllBookingsByOwnerId(ownerId);

      if (!result.success) {
        return this._sendErrorResponse(
          res,
          StatusCodes.BAD_REQUEST,
          result.message
        );
      }

      return this._sendSuccessResponse(res, StatusCodes.OK, {
        message: "Bookings fetched successfully",
        data: result.data,
      });
    } catch (error: unknown) {
      return this._sendErrorResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        error.message || "Internal server error"
      );
    }
  }

  async getTheaterBookings(req: Request, res: Response): Promise<Response> {
    try {
      const { theaterId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const { startDate, endDate } = req.query as {
        startDate?: string;
        endDate?: string;
      };

      if (!theaterId) {
        return this._sendErrorResponse(
          res,
          StatusCodes.BAD_REQUEST,
          "Theater ID is required"
        );
      }

      if (!mongoose.Types.ObjectId.isValid(theaterId)) {
        return this._sendErrorResponse(
          res,
          StatusCodes.BAD_REQUEST,
          "Invalid theater ID format"
        );
      }

      if (page < 1 || limit < 1 || limit > 100) {
        return this._sendErrorResponse(
          res,
          StatusCodes.BAD_REQUEST,
          "Invalid pagination parameters (page >= 1, limit between 1-100)"
        );
      }

      const result = await this.bookingService.getBookingsByTheaterId(
        theaterId,
        page,
        limit,
        startDate,
        endDate
      );

      if (!result.success) {
        return this._sendErrorResponse(
          res,
          StatusCodes.BAD_REQUEST,
          result.message
        );
      }

      return this._sendSuccessResponse(res, StatusCodes.OK, {
        message: BOOKING_MESSAGES.BOOKINGS_RETRIEVED_SUCCESS,
        data: result.data,
      });
    } catch (error: unknown) {
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
      const result = await this.bookingService.getBookingByBookingId(
        bookingId!
      );

      if (result.success) {
        return this._sendSuccessResponse(res, StatusCodes.OK, {
          message: result.message,
          data: result.data,
        });
      } else {
        return this._sendErrorResponse(
          res,
          StatusCodes.NOT_FOUND,
          result.message
        );
      }
    } catch (error: unknown) {
      return this._sendErrorResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        error.message || BOOKING_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getUpcomingBookings(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const { userId } = this._mapParamsToBookingParams(req.params);
      const authenticatedUserId = this._extractAuthenticatedUserId(req);

      if (!this._validateUserAccess(userId!, authenticatedUserId)) {
        return this._sendErrorResponse(
          res,
          StatusCodes.FORBIDDEN,
          BOOKING_MESSAGES.ACCESS_DENIED
        );
      }

      const result = await this.bookingService.getUpcomingBookings(userId!);

      return this._sendSuccessResponse(res, StatusCodes.OK, {
        message: result.message || "Upcoming bookings retrieved successfully",
        data: result.data,
      });
    } catch (error: unknown) {
      return this._sendErrorResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        error.message || BOOKING_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async cancelBooking(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const { bookingId } = this._mapParamsToBookingParams(req.params);
      const userId = this._extractAuthenticatedUserId(req);

      if (!userId) {
        return this._sendErrorResponse(
          res,
          StatusCodes.UNAUTHORIZED,
          BOOKING_MESSAGES.AUTH_REQUIRED
        );
      }

      const result = await this.bookingService.cancelBooking(
        bookingId!,
        userId
      );

      if (result.success) {
        return this._sendSuccessResponse(res, StatusCodes.OK, {
          message: result.message,
          data: result.data,
        });
      } else {
        return this._sendErrorResponse(
          res,
          StatusCodes.BAD_REQUEST,
          result.message
        );
      }
    } catch (error: unknown) {
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
      const paymentData: UpdatePaymentStatusDto =
        this._mapBodyToUpdatePaymentStatusDto(req.body);

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
        return this._sendErrorResponse(
          res,
          StatusCodes.NOT_FOUND,
          result.message
        );
      }
    } catch (error: unknown) {
      return this._sendErrorResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        error.message || BOOKING_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getBookingHistory(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const { userId } = this._mapParamsToBookingParams(req.params);
      const authenticatedUserId = this._extractAuthenticatedUserId(req);

      if (!this._validateUserAccess(userId!, authenticatedUserId)) {
        return this._sendErrorResponse(
          res,
          StatusCodes.FORBIDDEN,
          BOOKING_MESSAGES.ACCESS_DENIED
        );
      }

      const result = await this.bookingService.getBookingHistory(userId!);

      return this._sendSuccessResponse(res, StatusCodes.OK, {
        message: result.message || "Booking history retrieved successfully",
        data: result.data,
      });
    } catch (error: unknown) {
      return this._sendErrorResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        error.message || BOOKING_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getBookingHistoryOwner(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const { userId } = this._mapParamsToBookingParams(req.params);
      const authenticatedUserId = this._extractAuthenticatedUserId(req);

      if (!this._validateUserAccess(userId!, authenticatedUserId)) {
        return this._sendErrorResponse(
          res,
          StatusCodes.FORBIDDEN,
          BOOKING_MESSAGES.ACCESS_DENIED
        );
      }

      const result = await this.bookingService.getBookingHistory(userId!);

      return this._sendSuccessResponse(res, StatusCodes.OK, {
        message:
          result.message || "Owner booking history retrieved successfully",
        data: result.data,
      });
    } catch (error: unknown) {
      return this._sendErrorResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        error.message || BOOKING_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getBookingsByShowtimeId(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const { showtimeId } = this._mapParamsToBookingParams(req.params);

      const result = await this.bookingService.getBookingsByShowtime(
        showtimeId!
      );

      return this._sendSuccessResponse(res, StatusCodes.OK, {
        message:
          result.message || "Bookings by showtime retrieved successfully",
        data: result.data,
      });
    } catch (error: unknown) {
      return this._sendErrorResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        error.message || BOOKING_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  private _mapBodyToCreateBookingDto(body: CreateBookingDto): CreateBookingDto {
    return body as CreateBookingDto;
  }

  private _mapBodyToUpdatePaymentStatusDto(
    body: UpdatePaymentStatusDto
  ): UpdatePaymentStatusDto {
    return body as UpdatePaymentStatusDto;
  }

  private _mapParamsToBookingParams(
    params: BookingParamsDto
  ): BookingParamsDto {
    return params as BookingParamsDto;
  }

  private _extractAuthenticatedUserId(
    req: AuthenticatedRequest
  ): string | undefined {
    return req.user?.id;
  }

  private _validateUserAccess(
    requestedUserId: string,
    authenticatedUserId: string | undefined
  ): boolean {
    return requestedUserId === authenticatedUserId;
  }

  private async _processBookingCreation(
    userId: string,
    bookingDto: CreateBookingDto
  ) {
    const bookingDataWithUser = {
      ...bookingDto,
      userId,
    };

    return await this.bookingService.createBooking(bookingDataWithUser);
  }
  private async _createTicketsForBooking(
    userId: string,
    bookingDto: CreateBookingDto,
    bookingData: bookingInfo
  ) {
    const user = await this.userService.getUserProfile(userId);

    if (!bookingDto.selectedRows || bookingDto.selectedRows.length === 0) {
      const transformedSelectedRows =
        bookingDto.selectedSeats?.map((seatNumber, index) => {
          const seatPricing = bookingDto.seatPricing[index];
          return {
            rowLabel: seatPricing.rowLabel,
            seatsSelected: [parseInt(seatNumber.replace(/[A-Z]/g, ""), 10)],
            seatType: seatPricing.seatType,
            pricePerSeat: seatPricing.finalPrice,
          };
        }) || [];

      const ticketResult = await this.ticketService.createTicketsFromRows({
        bookingId: bookingData._id.toString(),
        selectedRows: transformedSelectedRows,
        ...(bookingDto.isInvited !== undefined && {
          isInvited: bookingDto.isInvited,
        }),
        bookingInfo: {
          userId,
          movieId: bookingData.movieId,
          theaterId: bookingData.theaterId,
          screenId: bookingData.screenId,
          showtimeId: bookingData.showtimeId,
          showDate: new Date(bookingDto.showDate),
          showTime: bookingDto.showTime,
          email: user.data.email,
          ...(bookingDto.appliedCoupon &&
            bookingDto.appliedCoupon._id && {
              couponId: bookingDto.appliedCoupon._id,
            }),
        },
      });

      return ticketResult.success ? ticketResult.data : [];
    }

    const transformedSelectedRows =
      bookingDto.selectedRows?.map((row) => ({
        rowLabel: row.rowLabel,
        seatsSelected: row.seatsSelected.map((seat) =>
          typeof seat === "string" ? parseInt(seat, 10) : seat
        ),
        seatType: row.seatType,
        pricePerSeat: row.pricePerSeat,
      })) || [];

    const ticketResult = await this.ticketService.createTicketsFromRows({
      bookingId: bookingData._id.toString(),
      selectedRows: transformedSelectedRows,
      ...(bookingDto.isInvited !== undefined && {
        isInvited: bookingDto.isInvited,
      }),
      bookingInfo: {
        userId,
        movieId: bookingData.movieId,
        theaterId: bookingData.theaterId,
        screenId: bookingData.screenId,
        showtimeId: bookingData.showtimeId,
        showDate: new Date(bookingDto.showDate),
        showTime: bookingDto.showTime,
        email: user.data.email,
        ...(bookingDto.appliedCoupon &&
          bookingDto.appliedCoupon._id && {
            couponId: bookingDto.appliedCoupon._id,
          }),
      },
    });

    return ticketResult.success ? ticketResult.data : [];
  }

  private async _handlePostBookingOperations(
    userId: string,
    bookingDto: CreateBookingDto,
    bookingData: bookingInfo
  ): Promise<void> {
    const bookingNotificationData = {
      bookingId: bookingData.bookingId || bookingData._id.toString(),
      movieTitle: bookingDto.movieTitle,
      theaterName: bookingDto.theaterName,
      showDate: bookingDto.showDate,
      showTime: bookingDto.showTime,
      seats: bookingDto.selectedSeats?.join(", "),
      totalAmount: bookingDto.priceDetails.total,
    };

    await this.notificationService.sendBookingNotification(
      userId,
      bookingNotificationData
    );

    const showDateTime = new Date(
      `${bookingDto.showDate.split("T")[0]}T${bookingDto.showTime}:00`
    );

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
    payload: { message?: string; data?: bookingInfo }
  ): Response {
    return res.status(statusCode).json(
      createResponse({
        success: true,
        ...payload,
      })
    );
  }
  private async _distributePayment(
    bookingDto: CreateBookingDto
  ): Promise<void> {
    try {
      const theaterResult = await this.theaterService.getTheaterById(
        bookingDto.theaterId
      );
      if (!theaterResult.success) {
        return;
      }
      const ownerId = theaterResult.data.ownerId;
      const baseAmount = bookingDto.totalAmount;

      const adminCommission = Math.round(baseAmount * 0.15);
      const ownerShare = baseAmount - adminCommission;

      await this._creditOwnerWallet(ownerId, ownerShare, bookingDto);

      await this._creditAdminWallet(adminCommission, bookingDto);
    } catch (error) {
      console.error("Payment distribution error:", error);
    }
  }
  private async _creditOwnerWallet(
    ownerId: string,
    amount: number,
    bookingDto: CreateBookingDto
  ): Promise<void> {
    try {
      const creditData: CreditWalletDto = {
        userId: ownerId,
        userModel: "Owner",
        amount: amount,
      };

      const result = await this.walletService.creditWallet(creditData);

      if (!result.success && result.message === "Wallet not found") {
        const createWalletData: CreateWalletDto = {
          userId: ownerId,
          userModel: "Owner",
          balance: amount,
          status: "active",
        };

        const createResult = await this.walletService.createWallet(
          createWalletData
        );

        if (!createResult.success) {
          console.error("Failed to create owner wallet:", createResult.message);
        } else {
          await this.walletTransactionService.createWalletTransaction({
            userId: ownerId,
            userModel: "Owner",
            walletId: createResult.data._id,
            type: "credit",
            amount: amount,
            category: "revenue",
            description: `Initial revenue from ticket booking - ${
              bookingDto.movieTitle || "Movie Ticket"
            }`,
            referenceId: bookingDto.showtimeId,
            movieId: bookingDto.movieId,
            theaterId: bookingDto.theaterId,
          });
        }
      } else if (!result.success) {
        console.error("Failed to credit owner wallet:", result.message);
      } else {
        await this.walletTransactionService.createWalletTransaction({
          userId: ownerId,
          userModel: "Owner",
          walletId: result.data._id,
          type: "credit",
          amount: amount,
          category: "revenue",
          description: `Ticket booking revenue - ${
            bookingDto.movieTitle || "Movie Ticket"
          }`,
          referenceId: bookingDto.showtimeId,
          movieId: bookingDto.movieId,
          theaterId: bookingDto.theaterId,
        });
      }
    } catch (error) {
      console.error("Owner wallet credit error:", error);
    }
  }

  private async _creditAdminWallet(
    amount: number,
    bookingDto: CreateBookingDto
  ): Promise<void> {
    try {
      const ADMIN_USER_ID =
        process.env.ADMIN_USER_ID || "your-default-admin-id";

      const creditData: CreditWalletDto = {
        userId: ADMIN_USER_ID,
        userModel: "Admin",
        amount: amount,
      };

      const result = await this.walletService.creditWallet(creditData);

      if (!result.success && result.message === "Wallet not found") {
        // Create wallet if it doesn't exist

        const createWalletData: CreateWalletDto = {
          userId: ADMIN_USER_ID,
          userModel: "Admin",
          balance: amount,
          status: "active",
        };

        const createResult = await this.walletService.createWallet(
          createWalletData
        );

        if (!createResult.success) {
          console.error("Failed to create admin wallet:", createResult.message);
        } else {
          await this.walletTransactionService.createWalletTransaction({
            userId: ADMIN_USER_ID,
            userModel: "Admin",
            walletId: createResult.data._id,
            type: "credit",
            amount: amount,
            category: "revenue",
            description: `Initial platform commission - ${
              bookingDto.movieTitle || "Movie Ticket"
            }`,
            referenceId: bookingDto.showtimeId,
            movieId: bookingDto.movieId,
            theaterId: bookingDto.theaterId,
          });
        }
      } else if (!result.success) {
        console.error("Failed to credit admin wallet:", result.message);
      } else {
        await this.walletTransactionService.createWalletTransaction({
          userId: ADMIN_USER_ID,
          userModel: "Admin",
          walletId: result.data._id,
          type: "credit",
          amount: amount,
          category: "revenue",
          description: `Platform commission - ${
            bookingDto.movieTitle || "Movie Ticket"
          }`,
          referenceId: bookingDto.showtimeId,
          movieId: bookingDto.movieId,
          theaterId: bookingDto.theaterId,
        });
      }
    } catch (error) {
      console.error("Admin wallet credit error:", error);
    }
  }

  private _sendErrorResponse(
    res: Response,
    statusCode: number,
    message: string
  ): Response {
    return res.status(statusCode).json(
      createResponse({
        success: false,
        message,
      })
    );
  }
}

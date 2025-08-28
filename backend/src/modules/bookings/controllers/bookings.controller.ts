import { Request, Response } from "express";
import { CreateBookingDto, UpdatePaymentStatusDto } from "../dtos/dto";
import { IBookingService } from "../interfaces/bookings.service.interface";
import { ITicketService } from "../../tickets/interfaces/ticket.service.interface";
import { IUserService } from "../../user/interfaces/user.service.interface";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export class BookingController {
  constructor(
    private readonly bookingService: IBookingService,
    private readonly ticketService: ITicketService,
    private readonly userService: IUserService
  ) {}

  async createBooking(req: AuthenticatedRequest, res: Response): Promise<any> {
    try {
      const bookingDto: CreateBookingDto = req.body;
      const userId = req.user.id;

      if (!userId) {
        console.log("user auth req");
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const bookingDataWithUser = {
        ...bookingDto,
        userId,
      };
      const user = await this.userService.getUserProfile(userId);

      const bookingResult = await this.bookingService.createBooking(
        bookingDataWithUser
      );

      if (!bookingResult.success) {
        return res.status(400).json(bookingResult);
      }

      const ticketResult = await this.ticketService.createTicketsFromRows(
        bookingResult.data._id.toString(),
        bookingDto.selectedRows || [],
        {
          email: user.data.email,
          userId,
          movieId: bookingResult.data.movieId,
          theaterId: bookingResult.data.theaterId,
          screenId: bookingResult.data.screenId,
          showtimeId: bookingResult.data.showtimeId,
          paymentMethod: bookingDto.paymentMethod,
          showDate: bookingDto.showDate,
          showTime: bookingDto.showTime,
        }
      );

      const response = {
        success: true,
        message: "Booking and tickets created successfully",
        data: {
          booking: bookingResult.data,
          tickets: ticketResult.success ? ticketResult.data : [],
          ticketCreationError: !ticketResult.success
            ? ticketResult.message
            : null,
        },
      };
      res.status(201).json(response);
    } catch (error: any) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }
  async getBookingById(req: Request, res: Response): Promise<any> {
    try {
      const { bookingId } = req.params;
      const result = await this.bookingService.getBookingByBookingId(bookingId);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  async getUserBookings(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<any> {
    try {
      const { userId } = req.params;
      const authenticatedUserId = req.user?.id;
      if (userId !== authenticatedUserId) {
        return res.status(403).json({
          success: false,
          message: "Access denied. You can only view your own bookings.",
        });
      }
      const { page = 1, limit = 10 } = req.query;
      const result = await this.bookingService.getUserBookings(
        userId,
        Number(page),
        Number(limit)
      );
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  async getUpcomingBookings(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<any> {
    try {
      const { userId } = req.params;
      const authenticatedUserId = req.user?.id;

      if (userId !== authenticatedUserId) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      const result = await this.bookingService.getUpcomingBookings(userId);

      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  async cancelBooking(req: AuthenticatedRequest, res: Response): Promise<any> {
    try {
      const { bookingId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const result = await this.bookingService.cancelBooking(bookingId, userId);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  async updatePaymentStatus(req: Request, res: Response): Promise<any> {
    try {
      const { bookingId } = req.params;
      const { paymentStatus, paymentId }: UpdatePaymentStatusDto = req.body;

      const result = await this.bookingService.updatePaymentStatus(
        bookingId,
        paymentStatus,
        paymentId
      );

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  async getBookingHistory(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<any> {
    try {
      const { userId } = req.params;
      const authenticatedUserId = req.user?.id;

      if (userId !== authenticatedUserId) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      const result = await this.bookingService.getBookingHistory(userId);

      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }
}

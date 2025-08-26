import { Request, Response } from "express";
import { CreateBookingDto, UpdatePaymentStatusDto } from "../dtos/dto";
import { IBookingService } from "../interfaces/bookings.service.interface";
import { ITicketService } from "../../tickets/interfaces/ticket.service.interface";


export class BookingController {
  constructor(private readonly bookingService: IBookingService,private readonly ticketService:ITicketService) {}
  
  async createBooking(req: Request, res: Response): Promise<any> {
    try {
      const bookingDto: CreateBookingDto = req.body;
      
      const bookingResult = await this.bookingService.createBooking(bookingDto);
      
      if (!bookingResult.success) {
        return res.status(400).json(bookingResult);
      }
      
      const ticketResult = await this.ticketService.createTicketsFromBooking(
        bookingResult.data._id.toString(),
        {
          userId: bookingDto.userId,
          selectedSeats: bookingDto.selectedSeats,
          seatBreakdown: bookingDto.seatPricing,
          movieTitle: bookingResult.data.movieId?.title || "Movie",
          theaterName: bookingResult.data.theaterId?.name || "Theater",
          screenName: `Screen ${bookingResult.data.screenId?.name || 1}`,
          showDate: bookingDto.showDate,
          showTime: bookingDto.showTime,
        }
      );
      
      // 3. Return combined response
      const response = {
        success: true,
        message: "Booking and tickets created successfully",
        data: {
          booking: bookingResult.data,
          tickets: ticketResult.success ? ticketResult.data : [],
          ticketCreationError: !ticketResult.success ? ticketResult.message : null
        }
      };
      
      res.status(201).json(response);
      
    } catch (error: any) {
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
  
  async getUserBookings(req: Request, res: Response): Promise<any> {
    try {
      const { userId } = req.params;
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
  
  async getUpcomingBookings(req: Request, res: Response): Promise<any> {
    try {
      const { userId } = req.params;
      const result = await this.bookingService.getUpcomingBookings(userId);
      
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }
  
  async cancelBooking(req: Request, res: Response): Promise<any> {
    try {
      const { bookingId } = req.params;
      const { userId } = req.body;
      
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
  
  async getBookingHistory(req: Request, res: Response): Promise<any> {
    try {
      const { userId } = req.params;
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

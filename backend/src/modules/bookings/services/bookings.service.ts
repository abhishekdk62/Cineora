import { ITicketService } from "../../tickets/interfaces/ticket.service.interface";
import { IShowtimeRepository } from "../../showtimes/interfaces/showtimes.repository.interface";
import { ServiceResponse } from "../../../interfaces/interface";
import mongoose from "mongoose";
import { CreateBookingDto } from "../dtos/dto";
import { IBookingRepository } from "../interfaces/bookings.repository.interface";
import { IBookingService } from "../interfaces/bookings.service.interface";

export class BookingService implements IBookingService {
  constructor(
    private readonly bookingRepo: IBookingRepository,
    private readonly showtimeRepo: IShowtimeRepository
  ) {}
  async createBooking(bookingData: CreateBookingDto): Promise<ServiceResponse> {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Generate booking ID
      const bookingId = `BK${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      
      // Convert string IDs to ObjectId before database operations
      const bookingPayload = {
        ...bookingData,
        bookingId,
        userId: new mongoose.Types.ObjectId(bookingData.userId),
        movieId: new mongoose.Types.ObjectId(bookingData.movieId),
        theaterId: new mongoose.Types.ObjectId(bookingData.theaterId),
        screenId: new mongoose.Types.ObjectId(bookingData.screenId),
        showtimeId: new mongoose.Types.ObjectId(bookingData.showtimeId),
        paymentStatus: "completed" as const,
        bookingStatus: "confirmed" as const,
      };
      
      // 1. Check seat availability (race condition protection)
      const showtime = await this.showtimeRepo.findById(bookingData.showtimeId);
      if (!showtime) {
        throw new Error("Showtime not found");
      }
      
      const conflictSeats = bookingData.selectedSeats.filter(seat => 
        showtime.bookedSeats.includes(seat)
      );
      
      if (conflictSeats.length > 0) {
        throw new Error(`Seats ${conflictSeats.join(', ')} are already booked`);
      }
      
      // 2. Create booking record with converted ObjectIds
      const booking = await this.bookingRepo.create(bookingPayload);
      
      if (!booking) {
        throw new Error("Failed to create booking");
      }
      
      // 3. Update showtime - Mark seats as booked
      await this.showtimeRepo.bookSeats(
        bookingData.showtimeId,
        bookingData.selectedSeats
      );
      
      await session.commitTransaction();
      
      return {
        success: true,
        message: "Booking created successfully",
        data: booking, // 🎯 Only return booking, not tickets
      };
      
    } catch (error: any) {
      await session.abortTransaction();
      return {
        success: false,
        message: error.message || "Failed to create booking",
        data: null,
      };
    } finally {
      session.endSession();
    }
  }


  
  async getBookingByBookingId(bookingId: string): Promise<ServiceResponse> {
    try {
      const booking = await this.bookingRepo.findByBookingId(bookingId);
      
      if (!booking) {
        return {
          success: false,
          message: "Booking not found",
          data: null,
        };
      }
      
      return {
        success: true,
        message: "Booking found",
        data: booking,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to get booking",
        data: null,
      };
    }
  }
  
  async getUserBookings(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ServiceResponse> {
    try {
      const result = await this.bookingRepo.findByUserIdPaginated(userId, page, limit);
      
      return {
        success: true,
        message: "User bookings retrieved successfully",
        data: result,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to get user bookings",
        data: null,
      };
    }
  }
  
  async cancelBooking(bookingId: string, userId: string): Promise<ServiceResponse> {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // 1. Find and validate booking
      const booking = await this.bookingRepo.findByBookingId(bookingId);
      
      if (!booking) {
        throw new Error("Booking not found");
      }
      
      if (booking.userId.toString() !== userId) {
        throw new Error("Unauthorized to cancel this booking");
      }
      
      if (booking.bookingStatus === "cancelled") {
        throw new Error("Booking is already cancelled");
      }
      
      // 2. Check cancellation policy (24 hours before show)
      const showDateTime = new Date(booking.showDate);
      const currentTime = new Date();
      const timeDifference = showDateTime.getTime() - currentTime.getTime();
      const hoursDifference = timeDifference / (1000 * 3600);
      
      if (hoursDifference < 24) {
        throw new Error("Cannot cancel booking within 24 hours of show time");
      }
      
      // 3. Cancel booking
      const cancelledBooking = await this.bookingRepo.cancelBooking(bookingId);
      
      // 4. Release seats in showtime
      await this.showtimeRepo.releaseSeats(
        booking.showtimeId.toString(),
        booking.selectedSeats,
        userId,
        "cancellation"
      );
      
      // 5. Update payment status for refund
      await this.bookingRepo.updatePaymentStatus(
        bookingId,
        "refunded"
      );
      
      await session.commitTransaction();
      
      return {
        success: true,
        message: "Booking cancelled successfully",
        data: cancelledBooking,
      };
      
    } catch (error: any) {
      await session.abortTransaction();
      return {
        success: false,
        message: error.message || "Failed to cancel booking",
        data: null,
      };
    } finally {
      session.endSession();
    }
  }
  
  async getUpcomingBookings(userId: string): Promise<ServiceResponse> {
    try {
      const bookings = await this.bookingRepo.findUpcomingBookings(userId);
      
      return {
        success: true,
        message: "Upcoming bookings retrieved successfully",
        data: bookings,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to get upcoming bookings",
        data: null,
      };
    }
  }
  
  async updatePaymentStatus(
    bookingId: string,
    paymentStatus: string,
    paymentId?: string
  ): Promise<ServiceResponse> {
    try {
      const booking = await this.bookingRepo.updatePaymentStatus(
        bookingId,
        paymentStatus,
        paymentId
      );
      
      if (!booking) {
        return {
          success: false,
          message: "Booking not found",
          data: null,
        };
      }
      
      return {
        success: true,
        message: "Payment status updated successfully",
        data: booking,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to update payment status",
        data: null,
      };
    }
  }
  
  // Additional methods...
  async getBookingById(bookingId: string): Promise<ServiceResponse> {
    return this.getBookingByBookingId(bookingId);
  }
  
  async getBookingHistory(userId: string): Promise<ServiceResponse> {
    try {
      const bookings = await this.bookingRepo.findBookingHistory(userId);
      
      return {
        success: true,
        message: "Booking history retrieved successfully",
        data: bookings,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to get booking history",
        data: null,
      };
    }
  }
  
  async processBookingExpiry(): Promise<ServiceResponse> {
    try {
      const expiredBookings = await this.bookingRepo.findExpiredBookings();
      
      for (const booking of expiredBookings) {
        await this.bookingRepo.updateById(booking._id.toString(), {
          bookingStatus: "expired",
        });
      }
      
      return {
        success: true,
        message: `${expiredBookings.length} bookings expired`,
        data: expiredBookings.length,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to process expired bookings",
        data: null,
      };
    }
  }
  
  async getBookingsByShowtime(showtimeId: string): Promise<ServiceResponse> {
    try {
      const bookings = await this.bookingRepo.findByShowtimeId(showtimeId);
      
      return {
        success: true,
        message: "Showtime bookings retrieved successfully",
        data: bookings,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to get showtime bookings",
        data: null,
      };
    }
  }
  
  async validateBooking(bookingId: string): Promise<ServiceResponse> {
    return this.getBookingByBookingId(bookingId);
  }
  
  async refundBooking(bookingId: string): Promise<ServiceResponse> {
    try {
      const booking = await this.bookingRepo.updatePaymentStatus(
        bookingId,
        "refunded"
      );
      
      return {
        success: true,
        message: "Refund processed successfully",
        data: booking,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to process refund",
        data: null,
      };
    }
  }
}

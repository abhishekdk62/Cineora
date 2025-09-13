import mongoose from "mongoose";
import { ServiceResponse } from "../../../interfaces/interface";
import { CreateBookingDto } from "../dtos/dto";
import { IBookingService } from "../interfaces/bookings.service.interface";
import { IBookingRepository } from "../interfaces/bookings.repository.interface";
import { IShowtimeRepository } from "../../showtimes/interfaces/showtimes.repository.interface";

export class BookingService implements IBookingService {
  constructor(
    private readonly bookingRepository: IBookingRepository,
    private readonly showtimeRepository: IShowtimeRepository
  ) {}

  async createBooking(bookingData: CreateBookingDto): Promise<ServiceResponse> {

    
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const bookingPayload = this._buildBookingPayload(bookingData);
      const allSelectedSeats = this._extractSelectedSeats(bookingData);

      await this._validateShowtimeAndSeats(bookingData.showtimeId, allSelectedSeats);

      const booking = await this.bookingRepository.createBooking(bookingPayload);
      if (!booking) {
        throw new Error("Failed to create booking");
      }

      await this.showtimeRepository.bookShowtimeSeats(bookingData.showtimeId, allSelectedSeats);
      await session.commitTransaction();

      return this._createSuccessResponse("Booking created successfully", booking);
    } catch (error) {
      await session.abortTransaction();
      return this._createErrorResponse(error.message || "Failed to create booking");
    } finally {
      session.endSession();
    }
  }

  async getBookingByBookingId(bookingId: string): Promise<ServiceResponse> {
    try {
      const booking = await this.bookingRepository.findBookingByBookingId(bookingId);

      if (!booking) {
        return this._createErrorResponse("Booking not found");
      }

      return this._createSuccessResponse("Booking found", booking);
    } catch (error) {
      return this._createErrorResponse(error.message || "Failed to get booking");
    }
  }

  async getUserBookings(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ServiceResponse> {
    try {
      const result = await this.bookingRepository.findBookingsByUserIdPaginated(
        userId,
        page,
        limit
      );

      return this._createSuccessResponse("User bookings retrieved successfully", result);
    } catch (error) {
      return this._createErrorResponse(error.message || "Failed to get user bookings");
    }
  }

  async cancelBooking(bookingId: string, userId: string): Promise<ServiceResponse> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const booking = await this._validateBookingForCancellation(bookingId, userId);
      
      const cancelledBooking = await this.bookingRepository.cancelBooking(bookingId);
      
      await this.showtimeRepository.releaseShowtimeSeats(
        booking.showtimeId.toString(),
        booking.selectedSeats,
        userId,
        "cancellation"
      );

      await this.bookingRepository.updatePaymentStatus(bookingId, "refunded");
      await session.commitTransaction();

      return this._createSuccessResponse("Booking cancelled successfully", cancelledBooking);
    } catch (error) {
      await session.abortTransaction();
      return this._createErrorResponse(error.message || "Failed to cancel booking");
    } finally {
      session.endSession();
    }
  }

  async getUpcomingBookings(userId: string): Promise<ServiceResponse> {
    try {
      const bookings = await this.bookingRepository.findUpcomingBookings(userId);
      return this._createSuccessResponse("Upcoming bookings retrieved successfully", bookings);
    } catch (error) {
      return this._createErrorResponse(error.message || "Failed to get upcoming bookings");
    }
  }

  async updatePaymentStatus(
    bookingId: string,
    paymentStatus: string,
    paymentId?: string
  ): Promise<ServiceResponse> {
    try {
      const booking = await this.bookingRepository.updatePaymentStatus(
        bookingId,
        paymentStatus,
        paymentId
      );

      if (!booking) {
        return this._createErrorResponse("Booking not found");
      }

      return this._createSuccessResponse("Payment status updated successfully", booking);
    } catch (error) {
      return this._createErrorResponse(error.message || "Failed to update payment status");
    }
  }

  async getBookingById(bookingId: string): Promise<ServiceResponse> {
    return this.getBookingByBookingId(bookingId);
  }

  async getBookingHistory(userId: string): Promise<ServiceResponse> {
    try {
      const bookings = await this.bookingRepository.findBookingHistory(userId);
      return this._createSuccessResponse("Booking history retrieved successfully", bookings);
    } catch (error) {
      return this._createErrorResponse(error.message || "Failed to get booking history");
    }
  }

  async processBookingExpiry(): Promise<ServiceResponse> {
    try {
      const expiredBookings = await this.bookingRepository.findExpiredBookings();

      for (const booking of expiredBookings) {
        await this.bookingRepository.updateBookingById(booking._id.toString(), {
          bookingStatus: "expired",
        });
      }

      return this._createSuccessResponse(
        `${expiredBookings.length} bookings expired`,
        expiredBookings.length
      );
    } catch (error) {
      return this._createErrorResponse(error.message || "Failed to process expired bookings");
    }
  }

  async getBookingsByShowtime(showtimeId: string): Promise<ServiceResponse> {
    try {
      const bookings = await this.bookingRepository.findBookingsByShowtimeId(showtimeId);
      return this._createSuccessResponse("Showtime bookings retrieved successfully", bookings);
    } catch (error) {
      return this._createErrorResponse(error.message || "Failed to get showtime bookings");
    }
  }

  async validateBooking(bookingId: string): Promise<ServiceResponse> {
    return this.getBookingByBookingId(bookingId);
  }

  async refundBooking(bookingId: string): Promise<ServiceResponse> {
    try {
      const booking = await this.bookingRepository.updatePaymentStatus(bookingId, "refunded");
      return this._createSuccessResponse("Refund processed successfully", booking);
    } catch (error) {
      return this._createErrorResponse(error.message || "Failed to process refund");
    }
  }

  private _buildBookingPayload(bookingData: CreateBookingDto): CreateBookingDto {
    const bookingId = `BK${Date.now()}${Math.random()
      .toString(36)
      .substr(2, 4)
      .toUpperCase()}`;

    const allSelectedSeats = this._extractSelectedSeats(bookingData);

    return {
      ...bookingData,
      bookingId,
      selectedSeats: allSelectedSeats,
      paymentStatus: "completed" as const,
      bookingStatus: "confirmed" as const,
    };
  }

  private _extractSelectedSeats(bookingData: CreateBookingDto): string[] {
    if (bookingData.selectedRows && bookingData.selectedRows.length > 0) {
      return bookingData.selectedRows.flatMap((row) =>
        row.seatsSelected.map((seatNum) => `${row.rowLabel}${seatNum}`)
      );
    } else if (bookingData.selectedSeats) {
      return bookingData.selectedSeats;
    } else {
      throw new Error("No seats selected");
    }
  }

  private async _validateShowtimeAndSeats(showtimeId: string, selectedSeats: string[]): Promise<void> {
    const showtime = await this.showtimeRepository.getShowtimeById(showtimeId);
    if (!showtime) {
      throw new Error("Showtime not found");
    }

    const conflictSeats = selectedSeats.filter((seat) =>
      showtime.bookedSeats.includes(seat)
    );

    if (conflictSeats.length > 0) {
      throw new Error(`Seats ${conflictSeats.join(", ")} are already booked`);
    }
  }

  private async _validateBookingForCancellation(bookingId: string, userId: string) {
    const booking = await this.bookingRepository.findBookingByBookingId(bookingId);

    if (!booking) {
      throw new Error("Booking not found");
    }

    const bookingUserId = booking.userId._id
      ? booking.userId._id.toString()
      : booking.userId.toString();

    if (bookingUserId !== userId) {
      throw new Error("Unauthorized to cancel this booking");
    }

    if (booking.bookingStatus === "cancelled") {
      throw new Error("Booking is already cancelled");
    }

    return booking;
  }

  private _createSuccessResponse(message: string, data?: any): ServiceResponse {
    return {
      success: true,
      message,
      data,
    };
  }

  private _createErrorResponse(message: string): ServiceResponse {
    return {
      success: false,
      message,
      data: null,
    };
  }
}

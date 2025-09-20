import mongoose from "mongoose";
import { ServiceResponse } from "../../../interfaces/interface";
import { CreateBookingDto } from "../dtos/dto";
import { IBookingService } from "../interfaces/bookings.service.interface";
import { IBookingRepository } from "../interfaces/bookings.repository.interface";
import { IShowtimeService } from "../../showtimes/interfaces/showtimes.service.interface";
import { IShowtimeRepository } from "../../showtimes/interfaces/showtimes.repository.interface";

export class BookingService implements IBookingService {
  constructor(
    private readonly bookingRepository: IBookingRepository,
    private readonly showtimeServices: IShowtimeService,
    private readonly showtimeRepo: IShowtimeRepository
  ) {}

  async createBooking(bookingData: CreateBookingDto): Promise<ServiceResponse> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const bookingPayload = this._buildBookingPayload(bookingData);
      const allSelectedSeats = this._extractSelectedSeats(bookingData);

      await this._validateShowtimeAndSeats(
        bookingData.showtimeId,
        allSelectedSeats
      );

      const booking = await this.bookingRepository.createBooking(
        bookingPayload
      );
      
      if (!booking) {
        throw new Error("Failed to create booking");
      }

      await this.showtimeServices.bookShowtimeSeats(
        bookingData.showtimeId,
        allSelectedSeats
      );
      await session.commitTransaction();

      return this._createSuccessResponse(
        "Booking created successfully",
        booking
      );
    } catch (error) {
      await session.abortTransaction();
      return this._createErrorResponse(
        error.message || "Failed to create booking"
      );
    } finally {
      session.endSession();
    }
  }
  async getAllBookingsByOwnerId(ownerId: string): Promise<ServiceResponse> {
    try {
      const bookings = await this.bookingRepository.findAllBookingsByOwnerId(
        ownerId
      );

      return this._createSuccessResponse("Bookings fetched successfully", {
        bookings,
      });
    } catch (error) {
      return this._createErrorResponse(
        error.message || "Failed to fetch bookings"
      );
    }
  }

  async getBookingsByTheaterId(
    theaterId: string,
    page: number = 1,
    limit: number = 10,
    startDate?: string,
    endDate?: string
  ): Promise<ServiceResponse> {
    try {
      // Validate theater ID
      if (!mongoose.Types.ObjectId.isValid(theaterId)) {
        return this._createErrorResponse("Invalid theater ID format");
      }

      // Validate dates if provided
      if (startDate && !this._isValidDateFormat(startDate)) {
        return this._createErrorResponse(
          "Invalid start date format. Use YYYY-MM-DD"
        );
      }

      if (endDate && !this._isValidDateFormat(endDate)) {
        return this._createErrorResponse(
          "Invalid end date format. Use YYYY-MM-DD"
        );
      }

      if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        return this._createErrorResponse(
          "Start date cannot be later than end date"
        );
      }

      const { bookings, totalBookings } =
        await this.bookingRepository.getBookingsByTheaterId(
          theaterId,
          page,
          limit,
          startDate,
          endDate
        );

      const totalPages = Math.ceil(totalBookings / limit);

      const responseData = {
        bookings,
        pagination: {
          currentPage: page,
          totalPages,
          totalBookings,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };

      return this._createSuccessResponse(
        "Theater bookings retrieved successfully",
        responseData
      );
    } catch (error) {
      return this._createErrorResponse(
        error.message || "Failed to retrieve theater bookings"
      );
    }
  }

  // Add this helper method
  private _isValidDateFormat(dateString: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) return false;

    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }

  async getBookingByBookingId(bookingId: string): Promise<ServiceResponse> {
    try {
      const booking = await this.bookingRepository.findBookingByBookingId(
        bookingId
      );

      if (!booking) {
        return this._createErrorResponse("Booking not found");
      }

      return this._createSuccessResponse("Booking found", booking);
    } catch (error) {
      return this._createErrorResponse(
        error.message || "Failed to get booking"
      );
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

      return this._createSuccessResponse(
        "User bookings retrieved successfully",
        result
      );
    } catch (error) {
      return this._createErrorResponse(
        error.message || "Failed to get user bookings"
      );
    }
  }

  async cancelBooking(
    bookingId: string,
    userId: string
  ): Promise<ServiceResponse> {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const booking = await this._validateBookingForCancellation(
        bookingId,
        userId
      );

      const cancelledBooking = await this.bookingRepository.cancelBooking(
        bookingId
      );

      await this.showtimeServices.releaseShowtimeSeats(
        booking.showtimeId.toString(),
        booking.selectedSeats,
        userId,
        "cancellation"
      );

      await this.bookingRepository.updatePaymentStatus(bookingId, "refunded");
      await session.commitTransaction();

      return this._createSuccessResponse(
        "Booking cancelled successfully",
        cancelledBooking
      );
    } catch (error) {
      await session.abortTransaction();
      return this._createErrorResponse(
        error.message || "Failed to cancel booking"
      );
    } finally {
      session.endSession();
    }
  }

  async getUpcomingBookings(userId: string): Promise<ServiceResponse> {
    try {
      const bookings = await this.bookingRepository.findUpcomingBookings(
        userId
      );
      return this._createSuccessResponse(
        "Upcoming bookings retrieved successfully",
        bookings
      );
    } catch (error) {
      return this._createErrorResponse(
        error.message || "Failed to get upcoming bookings"
      );
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

      return this._createSuccessResponse(
        "Payment status updated successfully",
        booking
      );
    } catch (error) {
      return this._createErrorResponse(
        error.message || "Failed to update payment status"
      );
    }
  }
  // Add this method to your existing BookingService class

  async updateBookingById(
    bookingId: string,
    updateData: any
  ): Promise<ServiceResponse> {
    try {
      if (!bookingId) {
        return this._createErrorResponse("Booking ID is required");
      }

      const updatedBooking = await this.bookingRepository.updateBookingById(
        bookingId,
        updateData
      );

      if (!updatedBooking) {
        return this._createErrorResponse("Booking not found or update failed");
      }

      return this._createSuccessResponse(
        "Booking updated successfully",
        updatedBooking
      );
    } catch (error) {
      return this._createErrorResponse(
        error.message || "Failed to update booking"
      );
    }
  }

  async updateBookingAfterTicketCancellation(
    bookingId: string,
    cancelledSeats: string[],
    newPricing: any,
    newSeatPricing: any[]
  ): Promise<ServiceResponse> {
    try {
      const booking = await this.bookingRepository.findBookingById(bookingId);

      if (!booking) {
        return this._createErrorResponse("Booking not found");
      }

      const updatedSelectedSeats = booking.selectedSeats.filter(
        (seat) => !cancelledSeats.includes(seat)
      );

      const updatedSelectedSeatIds = booking.selectedSeatIds.filter(
        (seatId) => !cancelledSeats.includes(seatId)
      );

      // Determine booking status
      const newStatus =
        updatedSelectedSeats.length === 0 ? "cancelled" : "confirmed";

      const updateData = {
        selectedSeats: updatedSelectedSeats,
        selectedSeatIds: updatedSelectedSeatIds,
        seatPricing: newSeatPricing,
        priceDetails: newPricing,
        bookingStatus: newStatus,
        ...(newStatus === "cancelled" && { cancelledAt: new Date() }),
      };

      const updatedBooking = await this.bookingRepository.updateBookingById(
        bookingId,
        updateData
      );

      return this._createSuccessResponse(
        `Booking updated - ${updatedSelectedSeats.length} seats remaining`,
        updatedBooking
      );
    } catch (error) {
      return this._createErrorResponse(
        error.message || "Failed to update booking after cancellation"
      );
    }
  }

  async getBookingById(bookingId: string): Promise<ServiceResponse> {
    return this.getBookingByBookingId(bookingId);
  }

  async getBookingHistory(userId: string): Promise<ServiceResponse> {
    try {
      const bookings = await this.bookingRepository.findBookingHistory(userId);
      return this._createSuccessResponse(
        "Booking history retrieved successfully",
        bookings
      );
    } catch (error) {
      return this._createErrorResponse(
        error.message || "Failed to get booking history"
      );
    }
  }

  async processBookingExpiry(): Promise<ServiceResponse> {
    try {
      const expiredBookings =
        await this.bookingRepository.findExpiredBookings();

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
      return this._createErrorResponse(
        error.message || "Failed to process expired bookings"
      );
    }
  }

  async getBookingsByShowtime(showtimeId: string): Promise<ServiceResponse> {
    try {
      const bookings = await this.bookingRepository.findBookingsByShowtimeId(
        showtimeId
      );
      return this._createSuccessResponse(
        "Showtime bookings retrieved successfully",
        bookings
      );
    } catch (error) {
      return this._createErrorResponse(
        error.message || "Failed to get showtime bookings"
      );
    }
  }

  async validateBooking(bookingId: string): Promise<ServiceResponse> {
    return this.getBookingByBookingId(bookingId);
  }

  async refundBooking(bookingId: string): Promise<ServiceResponse> {
    try {
      const booking = await this.bookingRepository.updatePaymentStatus(
        bookingId,
        "refunded"
      );
      return this._createSuccessResponse(
        "Refund processed successfully",
        booking
      );
    } catch (error) {
      return this._createErrorResponse(
        error.message || "Failed to process refund"
      );
    }
  }

  private _buildBookingPayload(
    bookingData: CreateBookingDto
  ): CreateBookingDto {
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

  private async _validateShowtimeAndSeats(
    showtimeId: string,
    selectedSeats: string[]
  ): Promise<void> {
    const showtime = await this.showtimeRepo.getShowtimeById(showtimeId);
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

  private async _validateBookingForCancellation(
    bookingId: string,
    userId: string
  ) {
    const booking = await this.bookingRepository.findBookingByBookingId(
      bookingId
    );

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

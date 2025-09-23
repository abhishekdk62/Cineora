import mongoose, { FilterQuery } from "mongoose";
import {
  CreateBookingDto,
  UpdateBookingDto,
  BookingRepositoryFindResult,
} from "../dtos/dto";
import { IBooking } from "../interfaces/bookings.model.interface";
import {
  IBookingReadRepository,
  IBookingWriteRepository,
  IBookingRepository,
} from "../interfaces/bookings.repository.interface";
import Booking from "../models/bookings.model";
import { bookingInfo } from "../../tickets/dtos/dto";

export class BookingRepository implements IBookingRepository {
  async findBookingById(bookingId: string): Promise<IBooking | null> {
    try {
      return await Booking.findById(bookingId)
        .populate("movieId")
        .populate("theaterId")
        .populate("screenId")
        .populate("userId", "firstName lastName email phone")
        .exec();
    } catch (error) {
      throw new Error(`Failed to find booking by id: ${error.message}`);
    }
  }
  async getBookingsByTheaterId(
    theaterId: string,
    page: number = 1,
    limit: number = 10,
    startDate?: string,
    endDate?: string
  ): Promise<{ bookings: IBooking[]; totalBookings: number }> {
    try {
      const skip = (page - 1) * limit;

      const dateFilter: FilterQuery = {};
      if (startDate && endDate) {
        dateFilter.bookedAt = {
          $gte: new Date(startDate + "T00:00:00.000Z"), 
          $lte: new Date(endDate + "T23:59:59.999Z"), 
        };
      } else if (startDate) {
        dateFilter.bookedAt = {
          $gte: new Date(startDate + "T00:00:00.000Z"),
        };
      } else if (endDate) {
        dateFilter.bookedAt = {
          $lte: new Date(endDate + "T23:59:59.999Z"),
        };
      }

      const filter = { theaterId, ...dateFilter };

      const [bookings, totalBookings] = await Promise.all([
        Booking.find(filter)
          .populate("movieId", "title genre duration language poster")
          .populate("userId", "firstName lastName email phone")
          .populate("screenId", "name screenType totalSeats")
          .populate("showtimeId", "showDate showTime")
          .sort({ bookedAt: -1 }) 
          .skip(skip)
          .limit(limit)
          .exec(),
        Booking.countDocuments(filter),
      ]);

      return { bookings, totalBookings };
    } catch (error) {
      throw new Error(
        `Failed to fetch bookings by theater id: ${error.message}`
      );
    }
  }
async findAllBookingsByOwnerId(ownerId: string): Promise<IBooking[]> {
  try {
    return await Booking.find({
      paymentStatus: "completed",
      bookingStatus: "confirmed"
    })
    .populate({
      path: "theaterId",
      match: { ownerId: new mongoose.Types.ObjectId(ownerId) },
      select: "name ownerId"
    })
    .populate("screenId", "name")
    .populate("movieId", "title")
    .populate("userId", "firstName lastName email")
    .exec()
    .then(bookings => bookings.filter(booking => booking.theaterId !== null));
  } catch (error) {
    throw new Error(`Failed to find bookings by owner id: ${error.message}`);
  }
}

  async getBookingsCountByTheaterId(theaterId: string): Promise<number> {
    try {
      return await Booking.countDocuments({ theaterId });
    } catch (error) {
      throw new Error(
        `Failed to count bookings by theater id: ${error.message}`
      );
    }
  }

  async findBookingByBookingId(bookingId: string): Promise<IBooking | null> {
    try {
      return await Booking.findById(bookingId)
        .populate("movieId")
        .populate("theaterId")
        .populate("screenId")
        .populate("userId", "firstName lastName email phone")
        .exec();
    } catch (error) {
      throw new Error(`Failed to find booking by booking id: ${error.message}`);
    }
  }

  async findBookingsByUserId(userId: string): Promise<IBooking[]> {
    try {
      return await Booking.find({ userId })
        .populate("movieId")
        .populate("theaterId")
        .populate("screenId")
        .sort({ bookedAt: -1 })
        .exec();
    } catch (error) {
      throw new Error(`Failed to find bookings by user id: ${error.message}`);
    }
  }

  async findBookingsByUserIdPaginated(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<BookingRepositoryFindResult> {
    try {
      const skip = (page - 1) * limit;
      const [bookings, total] = await Promise.all([
        Booking.find({ userId })
          .populate("movieId")
          .populate("theaterId")
          .populate("screenId")
          .sort({ bookedAt: -1 })
          .skip(skip)
          .limit(limit)
          .exec(),
        Booking.countDocuments({ userId }).exec(),
      ]);

      return {
        bookings,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new Error(`Failed to find bookings paginated: ${error.message}`);
    }
  }

  async findBookingsByShowtimeId(showtimeId: string): Promise<IBooking[]> {
    try {
      return await Booking.find({ showtimeId })
        .populate("userId", "firstName lastName email phone")
        .exec();
    } catch (error) {
      throw new Error(
        `Failed to find bookings by showtime id: ${error.message}`
      );
    }
  }

  async findUpcomingBookings(userId: string): Promise<IBooking[]> {
    try {
      const currentDate = new Date();
      return await Booking.find({
        userId,
        showDate: { $gte: currentDate },
        bookingStatus: "confirmed",
      })
        .populate("movieId")
        .populate("theaterId")
        .populate("screenId")
        .sort({ showDate: 1 })
        .exec();
    } catch (error) {
      throw new Error(`Failed to find upcoming bookings: ${error.message}`);
    }
  }

  async findBookingHistory(userId: string): Promise<IBooking[]> {
    try {
      return await Booking.find({ userId })
        .populate("movieId")
        .populate("theaterId")
        .populate("screenId")
        .sort({ bookedAt: -1 })
        .exec();
    } catch (error) {
      throw new Error(`Failed to find booking history: ${error.message}`);
    }
  }

  async findExpiredBookings(): Promise<IBooking[]> {
    try {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - 1);
      return await Booking.find({
        bookedAt: { $lt: currentDate },
        paymentStatus: "pending",
        bookingStatus: "confirmed",
      }).exec();
    } catch (error) {
      throw new Error(`Failed to find expired bookings: ${error.message}`);
    }
  }

  async findBookingByPaymentId(paymentId: string): Promise<IBooking | null> {
    try {
      return await Booking.findOne({ paymentId }).exec();
    } catch (error) {
      throw new Error(`Failed to find booking by payment id: ${error.message}`);
    }
  }
  async createBooking(bookingData: bookingInfo): Promise<IBooking | null> {
    try {

      let transformedBookingData = {
        bookingId: bookingData.bookingId,
        userId: bookingData.userId,
        movieId: bookingData.movieId,
        theaterId: bookingData.theaterId,
        screenId: bookingData.screenId,
        showtimeId: bookingData.showtimeId,
        selectedSeats: bookingData.selectedSeats,
        selectedSeatIds: bookingData.selectedSeatIds,
        seatPricing: bookingData.seatPricing,
        priceDetails: bookingData.priceDetails,
        paymentStatus: bookingData.paymentStatus,
        paymentMethod: bookingData.paymentMethod,
        bookingStatus: bookingData.bookingStatus,
        showDate: bookingData.showDate,
        showTime: bookingData.showTime,
        contactInfo: bookingData.contactInfo,
      };

      if (bookingData.appliedCoupon) {
        transformedBookingData.couponUsed = {
          couponId: bookingData.appliedCoupon._id,
          couponCode: bookingData.appliedCoupon.uniqueId,
          couponName: bookingData.appliedCoupon.name,
          discountPercentage: bookingData.appliedCoupon.discountPercentage,
          discountAmount: bookingData.discountApplied,
          appliedAt: new Date(),
        };
      }

      const booking = new Booking(transformedBookingData);
      return await booking.save();
    } catch (error) {
      throw new Error(
        `Failed to create booking: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async updateBookingById(
    bookingId: string,
    updateData: UpdateBookingDto
  ): Promise<IBooking | null> {
    try {
      return await Booking.findByIdAndUpdate(bookingId, updateData, {
        new: true,
      }).exec();
    } catch (error) {
      throw new Error(`Failed to update booking by id: ${error.message}`);
    }
  }

  async updateBookingByBookingId(
    bookingId: string,
    updateData: UpdateBookingDto
  ): Promise<IBooking | null> {
    try {
      return await Booking.findOneAndUpdate({ bookingId }, updateData, {
        new: true,
      }).exec();
    } catch (error) {
      throw new Error(
        `Failed to update booking by booking id: ${error.message}`
      );
    }
  }

  async cancelBooking(bookingId: string): Promise<IBooking | null> {
    try {
      return await Booking.findOneAndUpdate(
        { _id: bookingId },
        {
          bookingStatus: "cancelled",
          cancelledAt: new Date(),
        },
        { new: true }
      ).exec();
    } catch (error) {
      throw new Error(`Failed to cancel booking: ${error.message}`);
    }
  }

  async updatePaymentStatus(
    bookingId: string,
    paymentStatus: string,
    paymentId?: string
  ): Promise<IBooking | null> {
    try {
      const updateData: Record<string, any> = { paymentStatus };
      if (paymentId) {
        updateData.paymentId = paymentId;
      }
      return await Booking.findOneAndUpdate({ _id: bookingId }, updateData, {
        new: true,
      }).exec();
    } catch (error) {
      throw new Error(`Failed to update payment status: ${error.message}`);
    }
  }

  async deleteBookingById(bookingId: string): Promise<boolean> {
    try {
      const result = await Booking.findByIdAndDelete(bookingId).exec();
      return !!result;
    } catch (error) {
      throw new Error(`Failed to delete booking: ${error.message}`);
    }
  }
}

import { 
  CreateBookingDto, 
  UpdateBookingDto, 
  BookingRepositoryFindResult 
} from "../dtos/dto";
import { IBooking } from "../interfaces/bookings.model.interface";
import { 
  IBookingReadRepository, 
  IBookingWriteRepository, 
  IBookingRepository 
} from "../interfaces/bookings.repository.interface";
import Booking from "../models/bookings.model";

export class BookingRepository implements IBookingRepository {
  
  // Read Operations
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
        Booking.countDocuments({ userId }).exec()
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
      throw new Error(`Failed to find bookings by showtime id: ${error.message}`);
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

  // Write Operations
  async createBooking(bookingData: CreateBookingDto): Promise<IBooking | null> {
    try {
      const booking = new Booking(bookingData);
      return await booking.save();
    } catch (error) {
      throw new Error(`Failed to create booking: ${error.message}`);
    }
  }

  async updateBookingById(
    bookingId: string,
    updateData: UpdateBookingDto
  ): Promise<IBooking | null> {
    try {
      return await Booking.findByIdAndUpdate(bookingId, updateData, { new: true }).exec();
    } catch (error) {
      throw new Error(`Failed to update booking by id: ${error.message}`);
    }
  }

  async updateBookingByBookingId(
    bookingId: string,
    updateData: UpdateBookingDto
  ): Promise<IBooking | null> {
    try {
      return await Booking.findOneAndUpdate({ bookingId }, updateData, { new: true }).exec();
    } catch (error) {
      throw new Error(`Failed to update booking by booking id: ${error.message}`);
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
      return await Booking.findOneAndUpdate({ _id: bookingId }, updateData, { new: true }).exec();
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

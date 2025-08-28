import { IBooking } from "../interfaces/bookings.model.interface";
import { IBookingRepository } from "../interfaces/bookings.repository.interface";
import Booking from '../models/bookings.model'

export class BookingRepository implements IBookingRepository {
  async create(bookingData: Partial<IBooking>): Promise<IBooking | null> {
    const booking = new Booking(bookingData);
    return booking.save();
  }
  
  async findById(id: string): Promise<IBooking | null> {
    return Booking.findById(id)
      .populate("movieId")
      .populate("theaterId")
      .populate("screenId")
      .populate("userId", "firstName lastName email phone");
  }
  
  async findByBookingId(bookingId: string): Promise<IBooking | null> {
    return Booking.findOne({ bookingId })
      .populate("movieId")
      .populate("theaterId")
      .populate("screenId")
      .populate("userId", "firstName lastName email phone");
  }
  
  async findByUserId(userId: string): Promise<IBooking[]> {
    return Booking.find({ userId })
      .populate("movieId")
      .populate("theaterId")
      .populate("screenId")
      .sort({ bookedAt: -1 });
  }
  
  async findByUserIdPaginated(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    bookings: IBooking[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const bookings = await Booking.find({ userId })
      .populate("movieId")
      .populate("theaterId")
      .populate("screenId")
      .sort({ bookedAt: -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await Booking.countDocuments({ userId });
    
    return {
      bookings,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
  
  async findByShowtimeId(showtimeId: string): Promise<IBooking[]> {
    return Booking.find({ showtimeId, bookingStatus: "confirmed" })
      .populate("userId", "firstName lastName email phone");
  }
  
  async updateById(
    id: string,
    updateData: Partial<IBooking>
  ): Promise<IBooking | null> {
    return Booking.findByIdAndUpdate(id, updateData, { new: true });
  }
  
  async updateByBookingId(
    bookingId: string,
    updateData: Partial<IBooking>
  ): Promise<IBooking | null> {
    return Booking.findOneAndUpdate({ bookingId }, updateData, { new: true });
  }
  
  async cancelBooking(bookingId: string): Promise<IBooking | null> {
    return Booking.findOneAndUpdate(
      { bookingId },
      {
        bookingStatus: "cancelled",
        cancelledAt: new Date(),
      },
      { new: true }
    );
  }
  
  async updatePaymentStatus(
    bookingId: string,
    paymentStatus: string,
    paymentId?: string
  ): Promise<IBooking | null> {
    const updateData: any = { paymentStatus };
    if (paymentId) {
      updateData.paymentId = paymentId;
    }
    
    return Booking.findOneAndUpdate(
      { bookingId },
      updateData,
      { new: true }
    );
  }
  
  async findUpcomingBookings(userId: string): Promise<IBooking[]> {
    const currentDate = new Date();
    return Booking.find({
      userId,
      showDate: { $gte: currentDate },
      bookingStatus: "confirmed",
    })
      .populate("movieId")
      .populate("theaterId")
      .populate("screenId")
      .sort({ showDate: 1 });
  }
  
  async findBookingHistory(userId: string): Promise<IBooking[]> {
    return Booking.find({ userId })
      .populate("movieId")
      .populate("theaterId")
      .populate("screenId")
      .sort({ bookedAt: -1 });
  }
  
  async deleteById(id: string): Promise<boolean> {
    const result = await Booking.findByIdAndDelete(id);
    return !!result;
  }
  
  async findByPaymentId(paymentId: string): Promise<IBooking | null> {
    return Booking.findOne({ paymentId });
  }
  
  async findExpiredBookings(): Promise<IBooking[]> {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1); 
    
    return Booking.find({
      bookedAt: { $lt: currentDate },
      paymentStatus: "pending",
      bookingStatus: "confirmed",
    });
  }
}

import { IBooking } from "./bookings.model.interface";

export interface IBookingRepository {
  create(bookingData: Partial<IBooking>): Promise<IBooking | null>;
  
  findById(id: string): Promise<IBooking | null>;
  
  findByBookingId(bookingId: string): Promise<IBooking | null>;
  
  findByUserId(userId: string): Promise<IBooking[]>;
  
  findByUserIdPaginated(
    userId: string,
    page: number,
    limit: number
  ): Promise<{
    bookings: IBooking[];
    total: number;
    page: number;
    totalPages: number;
  }>;
  
  findByShowtimeId(showtimeId: string): Promise<IBooking[]>;
  
  updateById(
    id: string,
    updateData: Partial<IBooking>
  ): Promise<IBooking | null>;
  
  updateByBookingId(
    bookingId: string,
    updateData: Partial<IBooking>
  ): Promise<IBooking | null>;
  
  cancelBooking(bookingId: string): Promise<IBooking | null>;
  
  updatePaymentStatus(
    bookingId: string,
    paymentStatus: string,
    paymentId?: string
  ): Promise<IBooking | null>;
  
  findUpcomingBookings(userId: string): Promise<IBooking[]>;
  
  findBookingHistory(userId: string): Promise<IBooking[]>;
  
  deleteById(id: string): Promise<boolean>;
  
  findByPaymentId(paymentId: string): Promise<IBooking | null>;
  
  findExpiredBookings(): Promise<IBooking[]>;
}

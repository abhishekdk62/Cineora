import { 
  CreateBookingDto, 
  UpdateBookingDto, 
  BookingRepositoryFindResult 
} from "../dtos/dto";
import { IBooking } from "./bookings.model.interface";

// Interface Segregation Principle - Separate read and write operations
export interface IBookingReadRepository {
  findBookingById(bookingId: string): Promise<IBooking | null>;
  findBookingByBookingId(bookingId: string): Promise<IBooking | null>;
  findBookingsByUserId(userId: string): Promise<IBooking[]>;
  findBookingsByUserIdPaginated(
    userId: string, 
    page?: number, 
    limit?: number
  ): Promise<BookingRepositoryFindResult>;
  findBookingsByShowtimeId(showtimeId: string): Promise<IBooking[]>;
  findUpcomingBookings(userId: string): Promise<IBooking[]>;
  findBookingHistory(userId: string): Promise<IBooking[]>;
  findExpiredBookings(): Promise<IBooking[]>;
  findBookingByPaymentId(paymentId: string): Promise<IBooking | null>;
}

export interface IBookingWriteRepository {
  createBooking(bookingData: CreateBookingDto): Promise<IBooking | null>;
  updateBookingById(bookingId: string, updateData: UpdateBookingDto): Promise<IBooking | null>;
  updateBookingByBookingId(bookingId: string, updateData: UpdateBookingDto): Promise<IBooking | null>;
  cancelBooking(bookingId: string): Promise<IBooking | null>;
  updatePaymentStatus(
    bookingId: string, 
    paymentStatus: string, 
    paymentId?: string
  ): Promise<IBooking | null>;
  deleteBookingById(bookingId: string): Promise<boolean>;
}

// Combined interface following Interface Segregation Principle
export interface IBookingRepository extends IBookingReadRepository, IBookingWriteRepository {}

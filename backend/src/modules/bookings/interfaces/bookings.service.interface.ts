import { ServiceResponse } from "../../../interfaces/interface";
import { bookingInfo } from "../../tickets/dtos/dto";
import { CreateBookingDto } from "../dtos/dto";

export interface IBookingService {
  createBooking(bookingData: CreateBookingDto): Promise<ServiceResponse>;
  getBookingByBookingId(bookingId: string): Promise<ServiceResponse>;
  getUserBookings(
    userId: string,
    page?: number,
    limit?: number
  ): Promise<ServiceResponse>;
  cancelBooking(bookingId: string, userId: string): Promise<ServiceResponse>;
  getAllBookingsByOwnerId(ownerId: string): Promise<ServiceResponse> 
  getUpcomingBookings(userId: string): Promise<ServiceResponse>;
  updatePaymentStatus(
    bookingId: string,
    paymentStatus: string,
    paymentId?: string
  ): Promise<ServiceResponse>;
  getBookingById(bookingId: string): Promise<ServiceResponse>;
  getBookingsByTheaterId(
    theaterId: string,
    page: number,
    limit: number,
    startDate?: string,
    endDate?: string
  ): Promise<ServiceResponse>;
  updateBookingById(
    bookingId: string,
    updateData: bookingInfo
  ): Promise<ServiceResponse>;
  getBookingHistory(userId: string): Promise<ServiceResponse>;
  processBookingExpiry(): Promise<ServiceResponse>;
  getBookingsByShowtime(showtimeId: string): Promise<ServiceResponse>;
  validateBooking(bookingId: string): Promise<ServiceResponse>;
  refundBooking(bookingId: string): Promise<ServiceResponse>;
}

import { ServiceResponse } from "../../../interfaces/interface";

export interface IBookingService {
  createBooking(bookingData: any): Promise<ServiceResponse>;
  
  getBookingById(bookingId: string): Promise<ServiceResponse>;
  
  getBookingByBookingId(bookingId: string): Promise<ServiceResponse>;
  
  getUserBookings(
    userId: string,
    page?: number,
    limit?: number
  ): Promise<ServiceResponse>;
  
  getUpcomingBookings(userId: string): Promise<ServiceResponse>;
  
  getBookingHistory(userId: string): Promise<ServiceResponse>;
  
  cancelBooking(bookingId: string, userId: string): Promise<ServiceResponse>;
  
  updatePaymentStatus(
    bookingId: string,
    paymentStatus: string,
    paymentId?: string
  ): Promise<ServiceResponse>;
  
  processBookingExpiry(): Promise<ServiceResponse>;
  
  getBookingsByShowtime(showtimeId: string): Promise<ServiceResponse>;
  
  validateBooking(bookingId: string): Promise<ServiceResponse>;
  
  refundBooking(bookingId: string): Promise<ServiceResponse>;
}

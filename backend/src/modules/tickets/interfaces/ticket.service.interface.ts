import { ServiceResponse } from "../../../interfaces/interface";

export interface ITicketService {
  createTicketsFromBooking(
    bookingId: string,
    bookingData: any
  ): Promise<ServiceResponse>;
  
  getTicketById(ticketId: string): Promise<ServiceResponse>;
  
  getTicketsByBookingId(bookingId: string): Promise<ServiceResponse>;
  
  getUserTickets(
    userId: string,
    page?: number,
    limit?: number
  ): Promise<ServiceResponse>;
  
  getUpcomingTickets(userId: string): Promise<ServiceResponse>;
  
  getTicketHistory(userId: string): Promise<ServiceResponse>;
  
  markTicketAsUsed(ticketId: string): Promise<ServiceResponse>;
  
  validateTicket(ticketId: string, qrCode: string): Promise<ServiceResponse>;
  
  generateQRCode(ticketId: string): Promise<ServiceResponse>;
  
  deleteTicket(ticketId: string): Promise<ServiceResponse>;
}

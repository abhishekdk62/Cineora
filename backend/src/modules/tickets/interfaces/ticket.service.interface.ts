import { ServiceResponse } from "../../../interfaces/interface";

export interface ITicketService {
  
  createTicketsFromRows(
    bookingId: string,
    selectedRows: any[],
    bookingInfo: any
  ): Promise<ServiceResponse>;
 verifyTicket(encryptedData: string): Promise<ServiceResponse> ;
  createTicketsFromBooking(
    bookingId: string,
    bookingData: any
  ): Promise<ServiceResponse>;
  cancelTicket(ticketId: string, userId: string,amount:number): Promise<ServiceResponse>;
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

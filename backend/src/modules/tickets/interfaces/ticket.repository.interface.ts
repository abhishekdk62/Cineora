import { ITicket } from "./ticket.model.interface";

export interface ITicketRepository {
  create(ticketData: Partial<ITicket>): Promise<ITicket | null>;
  
  findById(id: string): Promise<ITicket | null>;
  
  findByTicketId(ticketId: string): Promise<ITicket | null>;
  
  findByBookingId(bookingId: string): Promise<ITicket[]>;
  
  findByUserId(userId: string): Promise<ITicket[]>;
  
  findByUserIdPaginated(
    userId: string, 
    page: number, 
    limit: number
  ): Promise<{
    tickets: ITicket[];
    total: number;
    page: number;
    totalPages: number;
  }>;
  
  updateById(
    id: string, 
    updateData: Partial<ITicket>
  ): Promise<ITicket | null>;
  
  markAsUsed(ticketId: string): Promise<ITicket | null>;
  
  createBulkTickets(ticketsData: Partial<ITicket>[]): Promise<ITicket[]>;
  
  findUpcomingTickets(userId: string): Promise<ITicket[]>;
  
  findTicketHistory(userId: string): Promise<ITicket[]>;
  
  deleteById(id: string): Promise<boolean>;
  
  validateTicket(ticketId: string, qrCode: string): Promise<ITicket | null>;
}

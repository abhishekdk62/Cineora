import { ITicket } from './ticket.model.interface';

// Interface Segregation Principle - separate read and write operations
export interface IReadTicketRepository {
  findTicketById(ticketId: string): Promise<ITicket | null>;
  findTicketByTicketId(ticketId: string): Promise<ITicket | null>;
  findTicketsByBookingId(bookingId: string): Promise<ITicket[]>;
  findTicketsByUserId(userId: string): Promise<ITicket[]>;
  findTicketsByUserIdPaginated(
    userId: string,
    page: number,
    limit: number
  ): Promise<{
    tickets: ITicket[];
    total: number;
    page: number;
    totalPages: number;
  }>;
  findUpcomingTickets(userId: string): Promise<ITicket[]>;
  findTicketHistory(userId: string): Promise<ITicket[]>;
  validateTicket(ticketId: string, qrCode: string): Promise<ITicket | null>;
}

export interface IWriteTicketRepository {
  createTicket(ticketData: Partial<ITicket>): Promise<ITicket | null>;
  createBulkTickets(ticketsData: Partial<ITicket>[]): Promise<ITicket[]>;
  updateTicketById(ticketId: string, updateData: Partial<ITicket>): Promise<ITicket | null>;
  markTicketAsUsed(ticketId: string): Promise<ITicket | null>;
  deleteTicketById(ticketId: string): Promise<boolean>;
}

// Combined interface following ISP
export interface ITicketRepository 
  extends IReadTicketRepository, IWriteTicketRepository {}

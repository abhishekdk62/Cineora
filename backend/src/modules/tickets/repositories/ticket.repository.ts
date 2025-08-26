import Ticket from "../models/ticket.model";
import { ITicketRepository } from "../interfaces/ticket.repository.interface";
import { ITicket } from "../interfaces/ticket.model.interface";

export class TicketRepository implements ITicketRepository {
  async create(ticketData: Partial<ITicket>): Promise<ITicket | null> {
    const ticket = new Ticket(ticketData);
    return ticket.save();
  }
  
  async findById(id: string): Promise<ITicket | null> {
    return Ticket.findById(id).populate("bookingId").populate("userId");
  }
  
  async findByTicketId(ticketId: string): Promise<ITicket | null> {
    return Ticket.findOne({ ticketId }).populate("bookingId").populate("userId");
  }
  
  async findByBookingId(bookingId: string): Promise<ITicket[]> {
    return Ticket.find({ bookingId }).populate("userId");
  }
  
  async findByUserId(userId: string): Promise<ITicket[]> {
    return Ticket.find({ userId }).sort({ showDate: -1 });
  }
  
  async findByUserIdPaginated(
    userId: string, 
    page: number = 1, 
    limit: number = 10
  ): Promise<{
    tickets: ITicket[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const tickets = await Ticket.find({ userId })
      .sort({ showDate: -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await Ticket.countDocuments({ userId });
    
    return {
      tickets,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
  
  async updateById(
    id: string, 
    updateData: Partial<ITicket>
  ): Promise<ITicket | null> {
    return Ticket.findByIdAndUpdate(id, updateData, { new: true });
  }
  
  async markAsUsed(ticketId: string): Promise<ITicket | null> {
    return Ticket.findOneAndUpdate(
      { ticketId },
      { isUsed: true, usedAt: new Date() },
      { new: true }
    );
  }
  
  async createBulkTickets(ticketsData: Partial<ITicket>[]): Promise<ITicket[]> {
    const result = await Ticket.insertMany(ticketsData);
    return result as ITicket[];
  }

  async findUpcomingTickets(userId: string): Promise<ITicket[]> {
    const currentDate = new Date();
    return Ticket.find({
      userId,
      showDate: { $gte: currentDate },
      isUsed: false,
    }).sort({ showDate: 1 });
  }
  
  async findTicketHistory(userId: string): Promise<ITicket[]> {
    return Ticket.find({ userId }).sort({ showDate: -1 });
  }
  
  async deleteById(id: string): Promise<boolean> {
    const result = await Ticket.findByIdAndDelete(id);
    return !!result;
  }
  
  async validateTicket(ticketId: string, qrCode: string): Promise<ITicket | null> {
    return Ticket.findOne({ ticketId, qrCode, isUsed: false });
  }
}

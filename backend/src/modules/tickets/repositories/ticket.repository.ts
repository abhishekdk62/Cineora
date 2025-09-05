import Ticket from "../models/ticket.model";
import { ITicketRepository } from "../interfaces/ticket.repository.interface";
import { ITicket } from "../interfaces/ticket.model.interface";

export class TicketRepository implements ITicketRepository {
  
  // IWriteTicketRepository methods
  async createTicket(ticketData: Partial<ITicket>): Promise<ITicket | null> {
    try {
      const ticket = new Ticket(ticketData);
      return await ticket.save();
    } catch (error) {
      throw new Error(`Failed to create ticket: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createBulkTickets(ticketsData: Partial<ITicket>[]): Promise<ITicket[]> {
    try {
      const result = await Ticket.insertMany(ticketsData);
      return result as ITicket[];
    } catch (error) {
      throw new Error(`Failed to create bulk tickets: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateTicketById(ticketId: string, updateData: Partial<ITicket>): Promise<ITicket | null> {
    try {
      return await Ticket.findByIdAndUpdate(ticketId, updateData, { new: true });
    } catch (error) {
      throw new Error(`Failed to update ticket: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async markTicketAsUsed(ticketId: string): Promise<ITicket | null> {
    try {
      return await Ticket.findOneAndUpdate(
        { ticketId },
        { isUsed: true, usedAt: new Date() },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Failed to mark ticket as used: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteTicketById(ticketId: string): Promise<boolean> {
    try {
      const result = await Ticket.findByIdAndDelete(ticketId);
      return !!result;
    } catch (error) {
      throw new Error(`Failed to delete ticket: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // IReadTicketRepository methods
  async findTicketById(ticketId: string): Promise<ITicket | null> {
    try {
      return await Ticket.findById(ticketId).populate("bookingId").populate("userId");
    } catch (error) {
      throw new Error(`Failed to find ticket by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findTicketByTicketId(ticketId: string): Promise<ITicket | null> {
    try {
      return await Ticket.findOne({ ticketId })
        .populate("bookingId")
        .populate("userId");
    } catch (error) {
      throw new Error(`Failed to find ticket by ticket ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findTicketsByBookingId(bookingId: string): Promise<ITicket[]> {
    try {
      return await Ticket.find({ bookingId }).populate("userId");
    } catch (error) {
      throw new Error(`Failed to find tickets by booking ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findTicketsByUserId(userId: string): Promise<ITicket[]> {
    try {
      return await Ticket.find({ userId }).sort({ showDate: -1 });
    } catch (error) {
      throw new Error(`Failed to find tickets by user ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findTicketsByUserIdPaginated(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    tickets: ITicket[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const skipCount = (page - 1) * limit;
      const tickets = await Ticket.find({ userId })
        .populate("movieId", "title poster")
        .populate("theaterId", "name")
        .populate("screenId", "name")
        .populate('showtimeId','endTime showTime')
        .sort({ showDate: -1 })
        .skip(skipCount)
        .limit(limit);

      const total = await Ticket.countDocuments({ userId });

      return {
        tickets,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new Error(`Failed to find paginated tickets by user ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findUpcomingTickets(userId: string): Promise<ITicket[]> {
    try {
      const currentDate = new Date();
      return await Ticket.find({
        userId,
        showDate: { $gte: currentDate },
        isUsed: false,
      }).sort({ showDate: 1 });
    } catch (error) {
      throw new Error(`Failed to find upcoming tickets: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findTicketHistory(userId: string): Promise<ITicket[]> {
    try {
      return await Ticket.find({ userId }).sort({ showDate: -1 });
    } catch (error) {
      throw new Error(`Failed to find ticket history: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async validateTicket(ticketId: string, qrCode: string): Promise<ITicket | null> {
    try {
      return await Ticket.findOne({ ticketId, qrCode, isUsed: false });
    } catch (error) {
      throw new Error(`Failed to validate ticket: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

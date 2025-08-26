import { ITicketService } from "../interfaces/ticket.service.interface";
import { ITicketRepository } from "../interfaces/ticket.repository.interface";
import { ServiceResponse } from "../../../interfaces/interface";

export class TicketService implements ITicketService {
  constructor(private readonly ticketRepo: ITicketRepository) {}
  
  async createTicketsFromBooking(
    bookingId: string,
    bookingData: any
  ): Promise<ServiceResponse> {
    try {
      const tickets = bookingData.selectedSeats.map((seat: any, index: number) => ({
        ticketId: `TK${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        bookingId,
        userId: bookingData.userId,
        seatNumber: seat,
        seatType: bookingData.seatBreakdown[index]?.type || "Normal",
        price: bookingData.seatBreakdown[index]?.price || 0,
        movieTitle: bookingData.movieTitle,
        theaterName: bookingData.theaterName,
        screenName: bookingData.screenName,
        showDate: bookingData.showDate,
        showTime: bookingData.showTime,
        qrCode: `QR${Date.now()}${index}`,
      }));
      
      const createdTickets = await this.ticketRepo.createBulkTickets(tickets);
      
      return {
        success: true,
        message: "Tickets created successfully",
        data: createdTickets,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to create tickets",
        data: null,
      };
    }
  }
  
  async getTicketById(ticketId: string): Promise<ServiceResponse> {
    try {
      const ticket = await this.ticketRepo.findByTicketId(ticketId);
      
      if (!ticket) {
        return {
          success: false,
          message: "Ticket not found",
          data: null,
        };
      }
      
      return {
        success: true,
        message: "Ticket found",
        data: ticket,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to get ticket",
        data: null,
      };
    }
  }
  
  async getUserTickets(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ServiceResponse> {
    try {
      const result = await this.ticketRepo.findByUserIdPaginated(userId, page, limit);
      
      return {
        success: true,
        message: "User tickets retrieved successfully",
        data: result,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to get user tickets",
        data: null,
      };
    }
  }
  
  async getUpcomingTickets(userId: string): Promise<ServiceResponse> {
    try {
      const tickets = await this.ticketRepo.findUpcomingTickets(userId);
      
      return {
        success: true,
        message: "Upcoming tickets retrieved successfully",
        data: tickets,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to get upcoming tickets",
        data: null,
      };
    }
  }
  
  async markTicketAsUsed(ticketId: string): Promise<ServiceResponse> {
    try {
      const ticket = await this.ticketRepo.markAsUsed(ticketId);
      
      if (!ticket) {
        return {
          success: false,
          message: "Ticket not found",
          data: null,
        };
      }
      
      return {
        success: true,
        message: "Ticket marked as used",
        data: ticket,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to mark ticket as used",
        data: null,
      };
    }
  }
  
  async validateTicket(ticketId: string, qrCode: string): Promise<ServiceResponse> {
    try {
      const ticket = await this.ticketRepo.validateTicket(ticketId, qrCode);
      
      if (!ticket) {
        return {
          success: false,
          message: "Invalid ticket or already used",
          data: null,
        };
      }
      
      return {
        success: true,
        message: "Ticket is valid",
        data: ticket,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to validate ticket",
        data: null,
      };
    }
  }
  
  async getTicketsByBookingId(bookingId: string): Promise<ServiceResponse> {
    try {
      const tickets = await this.ticketRepo.findByBookingId(bookingId);
      
      return {
        success: true,
        message: "Tickets retrieved successfully",
        data: tickets,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to get tickets",
        data: null,
      };
    }
  }
  
  async getTicketHistory(userId: string): Promise<ServiceResponse> {
    try {
      const tickets = await this.ticketRepo.findTicketHistory(userId);
      
      return {
        success: true,
        message: "Ticket history retrieved successfully",
        data: tickets,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to get ticket history",
        data: null,
      };
    }
  }
  
  async generateQRCode(ticketId: string): Promise<ServiceResponse> {
    // QR code generation logic here
    return {
      success: true,
      message: "QR code generated",
      data: { qrCode: `QR_${ticketId}_${Date.now()}` },
    };
  }
  
  async deleteTicket(ticketId: string): Promise<ServiceResponse> {
    try {
      const deleted = await this.ticketRepo.deleteById(ticketId);
      
      return {
        success: deleted,
        message: deleted ? "Ticket deleted successfully" : "Ticket not found",
        data: null,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to delete ticket",
        data: null,
      };
    }
  }
}

import { ITicketService } from "../interfaces/ticket.service.interface";
import { ITicketRepository } from "../interfaces/ticket.repository.interface";
import { ServiceResponse } from "../../../interfaces/interface";
import crypto from "crypto";
import mongoose from "mongoose";
import { config } from "../../../config";
import { EmailService, IEmailService } from "../../../services/email.service";

export class TicketService implements ITicketService {
  constructor(private readonly ticketRepo: ITicketRepository,private emailService:IEmailService) {}

  private generateQREncryptedData(ticketData: any): string {
    const qrPayload = {
      tid: ticketData,
    };

    const jsonString = JSON.stringify(qrPayload);

    const algorithm = "aes-256-cbc";
    const key = crypto.scryptSync(config.qrCodeSecret, "salt", 32);
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(jsonString, "utf8", "hex");
    encrypted += cipher.final("hex");

    return iv.toString("hex") + ":" + encrypted;
  }

  private createVerificationUrl(encryptedData: string): string {
    return `${process.env.FRONTEND_URL}/verify-ticket/${encryptedData}`;
  }

  async createTicketsFromRows(
    bookingId: string,
    selectedRows: any[],
    bookingInfo: any
  ): Promise<ServiceResponse> {
    try {
      const tickets: any[] = [];

      for (const row of selectedRows) {
        for (const seatNum of row.seatsSelected) {
          const ticketId = `TK${Date.now()}${Math.random()
            .toString(36)
            .substr(2, 4)
            .toUpperCase()}`;

          const encryptedQRData = this.generateQREncryptedData(
            ticketId,
          );

          tickets.push({
            ticketId,
            bookingId: new mongoose.Types.ObjectId(bookingId),
            userId: new mongoose.Types.ObjectId(bookingInfo.userId),
            movieId: new mongoose.Types.ObjectId(bookingInfo.movieId),
            theaterId: new mongoose.Types.ObjectId(bookingInfo.theaterId),
            screenId: new mongoose.Types.ObjectId(bookingInfo.screenId),
            showtimeId: new mongoose.Types.ObjectId(bookingInfo.showtimeId),
            seatNumber: seatNum.toString(),
            seatRow: row.rowLabel,
            seatType: row.seatType,
            price: row.pricePerSeat,
            showDate: bookingInfo.showDate,
            showTime: bookingInfo.showTime,
            qrCode: encryptedQRData,
            status: "confirmed",
            isUsed: false,
          });
        }
      }

      const createdTickets = await this.ticketRepo.createBulkTickets(tickets);
    try {
      const emailSent = await this.emailService.sendTicketsEmail(
        bookingInfo.email, 
        createdTickets, 
        bookingInfo
      );
      console.log(`Ticket email sent: ${emailSent}`);
    } catch (emailError) {
      console.error("Failed to send ticket email:", emailError);
    }

      return {
        success: true,
        message: "Tickets created from rows successfully",
        data: createdTickets,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to create tickets from rows",
        data: null,
      };
    }
  }

  async createTicketsFromBooking(
    bookingId: string,
    bookingData: any
  ): Promise<ServiceResponse> {
    try {
      const tickets = bookingData.selectedSeats.map(
        (seat: any, index: number) => {
          const seatRow = seat.charAt(0);
          const seatNumber = seat.slice(1);
          const ticketId = `TK${Date.now()}${Math.random()
            .toString(36)
            .substr(2, 4)
            .toUpperCase()}`;

          const encryptedQRData = this.generateQREncryptedData({
            ticketId,
          });

          return {
            ticketId,
            bookingId: new mongoose.Types.ObjectId(bookingId),
            userId: new mongoose.Types.ObjectId(bookingData.userId),
            movieId: new mongoose.Types.ObjectId(bookingData.movieId),
            theaterId: new mongoose.Types.ObjectId(bookingData.theaterId),
            screenId: new mongoose.Types.ObjectId(bookingData.screenId),
            showtimeId: new mongoose.Types.ObjectId(bookingData.showtimeId),
            seatNumber: seatNumber,
            seatRow: seatRow,
            seatType: bookingData.seatBreakdown[index]?.type || "Normal",
            price: bookingData.seatBreakdown[index]?.price || 0,
            showDate: bookingData.showDate,
            showTime: bookingData.showTime,
            qrCode: encryptedQRData,
            status: "confirmed",
            isUsed: false,
          };
        }
      );

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
async cancelTicket(bookingId: string, userId: string, amount: number): Promise<ServiceResponse> {
    try {
      
      const tickets = await this.ticketRepo.findByBookingId(bookingId);
      
      if (!tickets || tickets.length === 0) {
        return {
          success: false,
          message: "Tickets not found",
          data: null,
        };
      }
      const firstTicket = tickets[0];


      if (firstTicket.userId._id.toString() !== userId) {
        return {
          success: false,
          message: "Unauthorized: You can only cancel your own tickets",
          data: null,
        };
      }

      const alreadyCancelledTickets = tickets.filter(ticket => ticket.status === 'cancelled');
      if (alreadyCancelledTickets.length > 0) {
        return {
          success: false,
          message: "Booking is already cancelled",
          data: null,
        };
      }

      const usedTickets = tickets.filter(ticket => ticket.status === 'used');
      if (usedTickets.length > 0) {
        return {
          success: false,
          message: "Cannot cancel booking with used tickets",
          data: null,
        };
      }

      const showDateTime = new Date(firstTicket.showDate);
      const [hours, minutes] = firstTicket.showTime.split(':');
      showDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      const now = new Date();
      
      if (showDateTime <= now) {
        return {
          success: false,
          message: "Cannot cancel booking for past shows",
          data: null,
        };
      }

      const refundPercentage = this.calculateRefundPercentage(showDateTime);
      
      const updatePromises = tickets.map(ticket => 
        this.ticketRepo.updateById(
          (ticket as any)._id.toString(),
          { 
            status: 'cancelled',
            updatedAt: new Date()
          }
        )
      );

      const updatedTickets = await Promise.all(updatePromises);

      return {
        success: true,
        message: "Booking cancelled successfully",
        data: {
          cancelledTickets: updatedTickets,
          refundPercentage: refundPercentage,
          originalAmount: amount,
          refundAmount: Math.round(amount * refundPercentage / 100),
          showDate: firstTicket.showDate,
          showTime: firstTicket.showTime
        },
      };

    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to cancel booking",
        data: null,
      };
    }
}


private calculateRefundPercentage(showDateTime: Date): number {
    const now = new Date();
    const hoursUntilShow = Math.ceil((showDateTime.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (hoursUntilShow >= 4) {
        return 75; 
    } else if (hoursUntilShow >= 2) {
        return 50;   
    } else if (hoursUntilShow >= 0.5) { 
        return 25; 
    } else {
        return 0; 
    }
}


  async verifyTicket(encryptedData: string): Promise<ServiceResponse> {
    try {

      const [ivHex, encrypted] = encryptedData.split(":");
      const iv = Buffer.from(ivHex, "hex");

      const algorithm = "aes-256-cbc";
      const key = crypto.scryptSync(
        process.env.QR_VERIFICATION_SECRET!
,
        "salt",
        32
      );

      const decipher = crypto.createDecipheriv(algorithm, key, iv);
      let decrypted = decipher.update(encrypted, "hex", "utf8");
      decrypted += decipher.final("utf8");
      const qrData = JSON.parse(decrypted);

      const ticket = await this.ticketRepo.findByTicketId(qrData.tid);

      if (!ticket || ticket.status === "cancelled") {
        return {
          success: false,
          message: "Ticket not found or cancelled",
          data: null,
        };
      }

      if (ticket.isUsed) {
        return {
          success: false,
          message: "Ticket already used",
          data: null,
        };
      }
      const showDateTime = new Date(`${qrData.dt} ${qrData.tm}`);
      const showEndTime = new Date(showDateTime.getTime() + 3 * 60 * 60 * 1000);
      if (new Date() > showEndTime) {
        return {
          success: false,
          message: "Show has ended",
          data: null,
        };
      }
      return {
        success: true,
        message: "Ticket is valid",
        data: {
          ticketData: qrData,
          databaseTicket: ticket,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        message: "Invalid QR code",
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
      const result = await this.ticketRepo.findByUserIdPaginated(
        userId,
        page,
        limit
      );

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

  async validateTicket(
    ticketId: string,
    qrCode: string
  ): Promise<ServiceResponse> {
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

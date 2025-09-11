import { ITicketService } from "../interfaces/ticket.service.interface";
import { ITicketRepository } from "../interfaces/ticket.repository.interface";
import { 
  CreateTicketFromRowsDto,
  CreateTicketFromBookingDto,
  CancelTicketDto,
  GetUserTicketsDto,
  ValidateTicketDto,
  RefundCalculationDto
} from "../dtos/dto";
import { ApiResponse, createResponse } from "../../../utils/createResponse";
import { ITicket } from "../interfaces/ticket.model.interface";
import { IEmailService } from "../../../services/email.service";
import crypto from "crypto";
import mongoose from "mongoose";
import { config } from "../../../config";

export class TicketService implements ITicketService {
  constructor(
    private readonly ticketRepository: ITicketRepository,
    private readonly emailService: IEmailService
  ) {}

  async createTicketsFromRows(data: CreateTicketFromRowsDto): Promise<ApiResponse<ITicket[]>> {
    try {
      this._validateCreateTicketsFromRowsData(data);

      const tickets = this._prepareTicketsFromRows(data);
      const createdTickets = await this.ticketRepository.createBulkTickets(tickets);

      await this._sendTicketEmail(data.bookingInfo.email, createdTickets, data.bookingInfo);

      return createResponse({
        success: true,
        message: "Tickets created from rows successfully",
        data: createdTickets
      });
    } catch (error: unknown) {
      return this._handleServiceError(error, "Failed to create tickets from rows");
    }
  }

  async createTicketsFromBooking(data: CreateTicketFromBookingDto): Promise<ApiResponse<ITicket[]>> {
    try {
      this._validateCreateTicketsFromBookingData(data);

      const tickets = this._prepareTicketsFromBooking(data);
      const createdTickets = await this.ticketRepository.createBulkTickets(tickets);

      return createResponse({
        success: true,
        message: "Tickets created successfully",
        data: createdTickets
      });
    } catch (error: unknown) {
      return this._handleServiceError(error, "Failed to create tickets");
    }
  }

  async cancelTicket(data: CancelTicketDto): Promise<ApiResponse<RefundCalculationDto>> {
    try {
      this._validateCancelTicketData(data);

      const tickets = await this.ticketRepository.findTicketsByBookingId(data.bookingId);
      
      if (!tickets || tickets.length === 0) {
        return createResponse({
          success: false,
          message: "Tickets not found"
        });
      }

      const validationError = this._validateCancellationEligibility(tickets, data.userId);
      if (validationError) {
        return createResponse({
          success: false,
          message: validationError
        });
      }

      const firstTicket = tickets[0];
      const showDateTime = this._parseShowDateTime(firstTicket.showDate, firstTicket.showTime);
      const refundPercentage = this._calculateRefundPercentage(showDateTime);

      const updatedTickets = await this._cancelAllTicketsInBooking(tickets);

      const refundData: RefundCalculationDto = {
        cancelledTickets: updatedTickets,
        refundPercentage,
        originalAmount: data.amount,
        refundAmount: Math.round(data.amount * refundPercentage / 100),
        showDate: firstTicket.showDate,
        showTime: firstTicket.showTime
      };

      return createResponse({
        success: true,
        message: "Booking cancelled successfully",
        data: refundData
      });
    } catch (error: unknown) {
      return this._handleServiceError(error, "Failed to cancel booking");
    }
  }

  async verifyTicket(encryptedData: string): Promise<ApiResponse<any>> {
    try {
      const decryptedData = this._decryptQRData(encryptedData);
      const ticket = await this.ticketRepository.findTicketByTicketId(decryptedData.tid);

      if (!ticket || ticket.status === "cancelled") {
        return createResponse({
          success: false,
          message: "Ticket not found or cancelled"
        });
      }

      if (ticket.isUsed) {
        return createResponse({
          success: false,
          message: "Ticket already used"
        });
      }

      const isShowActive = this._validateShowTiming(decryptedData);
      if (!isShowActive) {
        return createResponse({
          success: false,
          message: "Show has ended"
        });
      }

      return createResponse({
        success: true,
        message: "Ticket is valid",
        data: {
          ticketData: decryptedData,
          databaseTicket: ticket
        }
      });
    } catch (error: unknown) {
      return this._handleServiceError(error, "Invalid QR code");
    }
  }

  async getTicketById(ticketId: string): Promise<ApiResponse<any>> {
    try {
      this._validateTicketId(ticketId);

      const ticket = await this.ticketRepository.findTicketByTicketId(ticketId);

      if (!ticket) {
        return createResponse({
          success: false,
          message: "Ticket not found"
        });
      }

      return createResponse({
        success: true,
        message: "Ticket found",
        data: ticket
      });
    } catch (error: unknown) {
      return this._handleServiceError(error, "Failed to get ticket");
    }
  }

async getUserTickets(data: GetUserTicketsDto): Promise<ApiResponse<any>> {
  try {
    this._validateGetUserTicketsData(data);

    const result = await this.ticketRepository.findTicketsByUserIdPaginated(
      data.userId,
      data.page || 1,
      data.limit || 10,
      data.types || ["all"]
    );

    return createResponse({
      success: true,
      message: "User tickets retrieved successfully",
      data: result,
    });
  } catch (error: unknown) {
    return this._handleServiceError(error, "Failed to get user tickets");
  }
}


  async markTicketAsUsed(ticketId: string): Promise<ApiResponse<any>> {
    try {
      this._validateTicketId(ticketId);

      const ticket = await this.ticketRepository.markTicketAsUsed(ticketId);

      if (!ticket) {
        return createResponse({
          success: false,
          message: "Ticket not found"
        });
      }

      return createResponse({
        success: true,
        message: "Ticket marked as used",
        data: ticket
      });
    } catch (error: unknown) {
      return this._handleServiceError(error, "Failed to mark ticket as used");
    }
  }

  async validateTicket(data: ValidateTicketDto): Promise<ApiResponse<any>> {
    try {
      this._validateTicketValidationData(data);

      const ticket = await this.ticketRepository.validateTicket(data.ticketId, data.qrCode);

      if (!ticket) {
        return createResponse({
          success: false,
          message: "Invalid ticket or already used"
        });
      }

      return createResponse({
        success: true,
        message: "Ticket is valid",
        data: ticket
      });
    } catch (error: unknown) {
      return this._handleServiceError(error, "Failed to validate ticket");
    }
  }

  async getTicketsByBookingId(bookingId: string): Promise<ApiResponse<ITicket[]>> {
    try {
      this._validateBookingId(bookingId);

      const tickets = await this.ticketRepository.findTicketsByBookingId(bookingId);

      return createResponse({
        success: true,
        message: "Tickets retrieved successfully",
        data: tickets
      });
    } catch (error: unknown) {
      return this._handleServiceError(error, "Failed to get tickets");
    }
  }

  async getTicketHistory(userId: string): Promise<ApiResponse<ITicket[]>> {
    try {
      this._validateUserId(userId);

      const tickets = await this.ticketRepository.findTicketHistory(userId);

      return createResponse({
        success: true,
        message: "Ticket history retrieved successfully",
        data: tickets
      });
    } catch (error: unknown) {
      return this._handleServiceError(error, "Failed to get ticket history");
    }
  }

  async generateQRCode(ticketId: string): Promise<ApiResponse<{ qrCode: string }>> {
    try {
      this._validateTicketId(ticketId);

      const qrCode = `QR_${ticketId}_${Date.now()}`;

      return createResponse({
        success: true,
        message: "QR code generated",
        data: { qrCode }
      });
    } catch (error: unknown) {
      return this._handleServiceError(error, "Failed to generate QR code");
    }
  }

  async deleteTicket(ticketId: string): Promise<ApiResponse<boolean>> {
    try {
      this._validateTicketId(ticketId);

      const deleted = await this.ticketRepository.deleteTicketById(ticketId);

      return createResponse({
        success: deleted,
        message: deleted ? "Ticket deleted successfully" : "Ticket not found",
        data: deleted
      });
    } catch (error: unknown) {
      return this._handleServiceError(error, "Failed to delete ticket");
    }
  }

  private _generateQREncryptedData(ticketData: any): string {
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

  private _decryptQRData(encryptedData: string): any {
    const [ivHex, encrypted] = encryptedData.split(":");
    const iv = Buffer.from(ivHex, "hex");

    const algorithm = "aes-256-cbc";
    const key = crypto.scryptSync(process.env.QR_VERIFICATION_SECRET!, "salt", 32);

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return JSON.parse(decrypted);
  }

  private _generateTicketId(): string {
    return `TK${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  }

  private _prepareTicketsFromRows(data: CreateTicketFromRowsDto): Partial<ITicket>[] {
    const tickets: Partial<ITicket>[] = [];

    for (const row of data.selectedRows) {
      for (const seatNum of row.seatsSelected) {
        const ticketId = this._generateTicketId();
        const encryptedQRData = this._generateQREncryptedData(ticketId);

        tickets.push({
          ticketId,
          bookingId: new mongoose.Types.ObjectId(data.bookingId),
          userId: new mongoose.Types.ObjectId(data.bookingInfo.userId),
          movieId: new mongoose.Types.ObjectId(data.bookingInfo.movieId),
          theaterId: new mongoose.Types.ObjectId(data.bookingInfo.theaterId),
          screenId: new mongoose.Types.ObjectId(data.bookingInfo.screenId),
          showtimeId: new mongoose.Types.ObjectId(data.bookingInfo.showtimeId),
          seatNumber: seatNum.toString(),
          seatRow: row.rowLabel,
          seatType: row.seatType,
          price: row.pricePerSeat,
          showDate: data.bookingInfo.showDate,
          showTime: data.bookingInfo.showTime,
          qrCode: encryptedQRData,
          status: "confirmed",
          isUsed: false,
        });
      }
    }

    return tickets;
  }

  private _prepareTicketsFromBooking(data: CreateTicketFromBookingDto): Partial<ITicket>[] {
    return data.bookingData.selectedSeats.map((seat: any, index: number) => {
      const seatRow = seat.charAt(0);
      const seatNumber = seat.slice(1);
      const ticketId = this._generateTicketId();
      const encryptedQRData = this._generateQREncryptedData({ ticketId });

      return {
        ticketId,
        bookingId: new mongoose.Types.ObjectId(data.bookingId),
        userId: new mongoose.Types.ObjectId(data.bookingData.userId),
        movieId: new mongoose.Types.ObjectId(data.bookingData.movieId),
        theaterId: new mongoose.Types.ObjectId(data.bookingData.theaterId),
        screenId: new mongoose.Types.ObjectId(data.bookingData.screenId),
        showtimeId: new mongoose.Types.ObjectId(data.bookingData.showtimeId),
        seatNumber: seatNumber,
        seatRow: seatRow,
        seatType: data.bookingData.seatBreakdown[index]?.type || "Normal",
        price: data.bookingData.seatBreakdown[index]?.price || 0,
        showDate: data.bookingData.showDate,
        showTime: data.bookingData.showTime,
        qrCode: encryptedQRData,
        status: "confirmed",
        isUsed: false,
      };
    });
  }

  private _validateCancellationEligibility(tickets: ITicket[], userId: string): string | null {
    const firstTicket = tickets[0];

    if (firstTicket.userId._id.toString() !== userId) {
      return "Unauthorized: You can only cancel your own tickets";
    }

    const alreadyCancelledTickets = tickets.filter(ticket => ticket.status === 'cancelled');
    if (alreadyCancelledTickets.length > 0) {
      return "Booking is already cancelled";
    }

    const usedTickets = tickets.filter(ticket => ticket.status === 'used');
    if (usedTickets.length > 0) {
      return "Cannot cancel booking with used tickets";
    }

    const showDateTime = this._parseShowDateTime(firstTicket.showDate, firstTicket.showTime);
    if (showDateTime <= new Date()) {
      return "Cannot cancel booking for past shows";
    }

    return null;
  }

  private _parseShowDateTime(showDate: Date, showTime: string): Date {
    const showDateTime = new Date(showDate);
    const [hours, minutes] = showTime.split(':');
    showDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return showDateTime;
  }

  private _calculateRefundPercentage(showDateTime: Date): number {
    const now = new Date();
    const hoursUntilShow = Math.ceil((showDateTime.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (hoursUntilShow >= 4) return 75;
    if (hoursUntilShow >= 2) return 50;
    if (hoursUntilShow >= 0.5) return 25;
    return 0;
  }

  private async _cancelAllTicketsInBooking(tickets: ITicket[]): Promise<ITicket[]> {
    const updatePromises = tickets.map(ticket => 
      this.ticketRepository.updateTicketById(
        (ticket as any)._id.toString(),
        { 
          status: 'cancelled',
          updatedAt: new Date()
        }
      )
    );

    return await Promise.all(updatePromises);
  }

  private _validateShowTiming(qrData: any): boolean {
    const showDateTime = new Date(`${qrData.dt} ${qrData.tm}`);
    const showEndTime = new Date(showDateTime.getTime() + 3 * 60 * 60 * 1000);
    return new Date() <= showEndTime;
  }

  private async _sendTicketEmail(email: string, tickets: ITicket[], bookingInfo: any): Promise<void> {
    try {
      await this.emailService.sendTicketsEmail(email, tickets, bookingInfo);
    } catch (emailError) {
      console.error("Failed to send ticket email:", emailError);
    }
  }

  private _validateCreateTicketsFromRowsData(data: CreateTicketFromRowsDto): void {
    if (!data.bookingId || !data.selectedRows || !data.bookingInfo) {
      throw new Error("Missing required fields for ticket creation");
    }

    if (!this._isValidObjectId(data.bookingId)) {
      throw new Error("Invalid booking ID format");
    }

    if (!data.selectedRows.length) {
      throw new Error("No rows selected for ticket creation");
    }
  }

  private _validateCreateTicketsFromBookingData(data: CreateTicketFromBookingDto): void {
    if (!data.bookingId || !data.bookingData) {
      throw new Error("Missing required fields for ticket creation");
    }

    if (!this._isValidObjectId(data.bookingId)) {
      throw new Error("Invalid booking ID format");
    }

    if (!data.bookingData.selectedSeats || !data.bookingData.selectedSeats.length) {
      throw new Error("No seats selected for ticket creation");
    }
  }

  private _validateCancelTicketData(data: CancelTicketDto): void {
    if (!data.bookingId || !data.userId || data.amount <= 0) {
      throw new Error("Missing required fields for ticket cancellation");
    }

    if (!this._isValidObjectId(data.bookingId) || !this._isValidObjectId(data.userId)) {
      throw new Error("Invalid booking ID or user ID format");
    }
  }

  private _validateGetUserTicketsData(data: GetUserTicketsDto): void {
    if (!data.userId) {
      throw new Error("User ID is required");
    }

    if (!this._isValidObjectId(data.userId)) {
      throw new Error("Invalid user ID format");
    }

    if (data.page && data.page < 1) {
      throw new Error("Page must be greater than 0");
    }

    if (data.limit && (data.limit < 1 || data.limit > 100)) {
      throw new Error("Limit must be between 1 and 100");
    }
  }

  private _validateTicketValidationData(data: ValidateTicketDto): void {
    if (!data.ticketId || !data.qrCode) {
      throw new Error("Ticket ID and QR code are required");
    }
  }

  private _validateTicketId(ticketId: string): void {
    if (!ticketId || typeof ticketId !== 'string' || ticketId.trim().length === 0) {
      throw new Error("Valid ticket ID is required");
    }
  }

  private _validateBookingId(bookingId: string): void {
    if (!bookingId) {
      throw new Error("Booking ID is required");
    }

    if (!this._isValidObjectId(bookingId)) {
      throw new Error("Invalid booking ID format");
    }
  }

  private _validateUserId(userId: string): void {
    if (!userId) {
      throw new Error("User ID is required");
    }

    if (!this._isValidObjectId(userId)) {
      throw new Error("Invalid user ID format");
    }
  }

  private _isValidObjectId(id: string): boolean {
    return mongoose.Types.ObjectId.isValid(id);
  }

  private _handleServiceError(error: unknown, defaultMessage: string): ApiResponse<any> {
    const errorMessage = error instanceof Error ? error.message : defaultMessage;
    
    return createResponse({
      success: false,
      message: errorMessage
    });
  }
}

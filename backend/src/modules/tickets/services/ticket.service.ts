import { ITicketService } from "../interfaces/ticket.service.interface";
import { ITicketRepository } from "../interfaces/ticket.repository.interface";
import {
  CreateTicketFromRowsDto,
  CreateTicketFromBookingDto,
  CancelTicketDto,
  GetUserTicketsDto,
  ValidateTicketDto,
  RefundCalculationDto,
  CancelSingleTicketDto,
  TicketResponseDto,
  bookingInfo,
} from "../dtos/dto";
import { ApiResponse, createResponse } from "../../../utils/createResponse";
import { ITicket } from "../interfaces/ticket.model.interface";
import { IEmailService } from "../../../services/email.service";
import crypto from "crypto";
import mongoose from "mongoose";
import { config } from "../../../config";
import { Staff } from "../../staff/model/staff.model";
export class TicketService implements ITicketService {
  constructor(
    private readonly ticketRepository: ITicketRepository,
    private readonly emailService: IEmailService
  ) {}

  async createTicketsFromRows(
    data: CreateTicketFromRowsDto
  ): Promise<ApiResponse<ITicket[]>> {
    try {
      this._validateCreateTicketsFromRowsData(data);

      const tickets = this._prepareTicketsFromRows(data);

      const createdTickets = await this.ticketRepository.createBulkTickets(
        tickets
      );

      await this._sendTicketEmail(
        data.bookingInfo.email,
        createdTickets,
        data.bookingInfo
      );

      return createResponse({
        success: true,
        message: "Tickets created from rows successfully",
        data: createdTickets,
      });
    } catch (error: unknown) {
      return this._handleServiceError(
        error,
        "Failed to create tickets from rows"
      );
    }
  }

  async cancelSingleTicket(
    data: CancelSingleTicketDto
  ): Promise<ApiResponse<RefundCalculationDto>> {
    try {
      this._validateCancelSingleTicketData(data);

      const tickets = await this._getTicketsForCancellation(data.ticketIds);
      if (tickets.length === 0) {
        return createResponse({
          success: false,
          message: "No valid tickets found for cancellation",
        });
      }

      

      const validationError = this._validateSingleTicketCancellationEligibility(
        tickets,
        data.userId
      );
      if (validationError) {
        return createResponse({
          success: false,
          message: validationError,
        });
      }

      const firstTicket = tickets[0];
      const showDateTime = this._parseShowDateTime(
        firstTicket.showDate,
        firstTicket.showTime
      );
      const refundPercentage = this._calculateRefundPercentage(showDateTime);

      const updatedTickets = await this._cancelSelectedTickets(tickets);

      const refundData: RefundCalculationDto = {
        cancelledTickets: updatedTickets,
        refundPercentage,
        originalAmount: data.totalAmount,
        refundAmount: Math.round((data.totalAmount * refundPercentage) / 100),
        showDate: firstTicket.showDate,
        showTime: firstTicket.showTime,
        totalAmount: data.totalAmount,
      };

      return createResponse({
        success: true,
        message: "Selected tickets cancelled successfully",
        data: refundData,
      });
    } catch (error: unknown) {
      return this._handleServiceError(
        error,
        "Failed to cancel selected tickets"
      );
    }
  }

  private _validateCancelSingleTicketData(data: CancelSingleTicketDto): void {
    if (
      !data.ticketIds ||
      !Array.isArray(data.ticketIds) ||
      data.ticketIds.length === 0
    ) {
      throw new Error("At least one ticket ID is required");
    }

    if (!data.userId || data.totalAmount <= 0) {
      throw new Error("Missing required fields for ticket cancellation");
    }

    if (!this._isValidObjectId(data.userId)) {
      throw new Error("Invalid user ID format");
    }

    for (const ticketId of data.ticketIds) {
      if (!this._isValidObjectId(ticketId)) {
        throw new Error(`Invalid ticket ID format: ${ticketId}`);
      }
    }
  }

  private async _getTicketsForCancellation(
    ticketIds: string[]
  ): Promise<ITicket[]> {
    const tickets: ITicket[] = [];

    for (const ticketId of ticketIds) {
      const ticket = await this.ticketRepository.findTicketById(ticketId);
      if (ticket) {
        tickets.push(ticket);
      }
    }

    return tickets;
  }

  private _validateSingleTicketCancellationEligibility(
    tickets: ITicket[],
    userId: string
  ): string | null {
    for (const ticket of tickets) {
      if (ticket.userId._id.toString() !== userId) {
        return "Unauthorized: You can only cancel your own tickets";
      }

      if (ticket.status === "cancelled") {
        return `Ticket ${ticket.ticketId} is already cancelled`;
      }

      if (ticket.status === "used") {
        return `Cannot cancel used ticket ${ticket.ticketId}`;
      }
    }

    const firstTicket = tickets[0];
    const showDateTime = this._parseShowDateTime(
      firstTicket.showDate,
      firstTicket.showTime
    );
    if (showDateTime <= new Date()) {
      return "Cannot cancel tickets for past shows";
    }

    const firstBookingId = tickets[0].bookingId.toString();
    const firstShowtimeId = tickets[0].showtimeId.toString();

    for (const ticket of tickets) {
      if (ticket.bookingId.toString() !== firstBookingId) {
        return "All tickets must be from the same booking";
      }

      if (ticket.showtimeId.toString() !== firstShowtimeId) {
        return "All tickets must be from the same showtime";
      }
    }

    return null;
  }

  private async _cancelSelectedTickets(tickets: ITicket[]): Promise<ITicket[]> {
    const updatePromises = tickets.map((ticket) =>
      this.ticketRepository.updateTicketById((ticket as any)._id.toString(), {
        status: "cancelled",
        updatedAt: new Date(),
      })
    );

    return await Promise.all(updatePromises);
  }

  async createTicketsFromBooking(
    data: CreateTicketFromBookingDto
  ): Promise<ApiResponse<ITicket[]>> {
    try {
      this._validateCreateTicketsFromBookingData(data);

      const tickets = this._prepareTicketsFromBooking(data);

      const createdTickets = await this.ticketRepository.createBulkTickets(
        tickets
      );

      return createResponse({
        success: true,
        message: "Tickets created successfully",
        data: createdTickets,
      });
    } catch (error: unknown) {
      return this._handleServiceError(error, "Failed to create tickets");
    }
  }

  async cancelTicket(
    data: CancelTicketDto
  ): Promise<ApiResponse<RefundCalculationDto>> {
    try {
      this._validateCancelTicketData(data);

      const tickets = await this.ticketRepository.findTicketsByBookingId(
        data.bookingId
      );

      if (tickets[0].status == "cancelled") {
        return createResponse({
          success: false,
          message: "Ticket already cancelled",
        });
      }

      if (!tickets || tickets.length === 0) {
        return createResponse({
          success: false,
          message: "Tickets not found",
        });
      }

      const validationError = this._validateCancellationEligibility(
        tickets,
        data.userId
      );
      if (validationError) {
        return createResponse({
          success: false,
          message: validationError,
        });
      }

      const firstTicket = tickets[0];
      const showDateTime = this._parseShowDateTime(
        firstTicket.showDate,
        firstTicket.showTime
      );
      const refundPercentage = this._calculateRefundPercentage(showDateTime);

      const updatedTickets = await this._cancelAllTicketsInBooking(tickets);

      const refundData: RefundCalculationDto = {
        cancelledTickets: updatedTickets,
        refundPercentage,
        originalAmount: data.amount,
        refundAmount: Math.round((data.amount * refundPercentage) / 100),
        showDate: firstTicket.showDate,
        showTime: firstTicket.showTime,
      };

      return createResponse({
        success: true,
        message: "Booking cancelled successfully",
        data: refundData,
      });
    } catch (error: unknown) {
      return this._handleServiceError(error, "Failed to cancel booking");
    }
  }
  async verifyTicket(
    encryptedData: string,
    staffId: string
  ): Promise<ApiResponse<TicketResponseDto>> {
    try {
      const decryptedData = this._decryptQRData(encryptedData);
      const ticket = await this.ticketRepository.findTicketByTicketId(
        decryptedData.tid
      );

      if (!ticket || ticket.status === "cancelled") {
        return createResponse({
          success: false,
          message: "Ticket not found or cancelled",
        });
      }

      if (ticket.isUsed) {
        return createResponse({
          success: false,
          message: "Ticket already used",
          data: {
            usedAt: ticket.usedAt,
            ticketDetails: {
              ticketId: ticket.ticketId,
              movieTitle: ticket.movieId?.title || "N/A",
              theater: ticket.theaterId?.name || "N/A",
              screen: ticket.screenId?.name || "N/A",
              seat: `${ticket.seatRow}${ticket.seatNumber}`,
              showDate: ticket.showDate,
              showTime: ticket.showTime,
            },
          },
        });
      }

      const staff = await Staff.findById(staffId);
      if (!staff) {
        return createResponse({
          success: false,
          message: "Staff not found",
        });
      }

      if (
        staff.theaterId &&
        staff.theaterId.toString() !== ticket.theaterId._id.toString()
      ) {
        return createResponse({
          success: false,
          message:
            "Unauthorized: You can only verify tickets for your assigned theater",
        });
      }

      const isShowActive = this._validateShowTiming(ticket);
      if (!isShowActive) {
        return createResponse({
          success: false,
          message: "Show has ended",
        });
      }

      const updatedTicket = await this.ticketRepository.markTicketAsUsed(
        ticket.ticketId
      );

      return createResponse({
        success: true,
        message: "Ticket verified successfully! Entry granted.",
        data: {
          ticket: {
            ticketId: updatedTicket.ticketId,
            movieTitle: ticket.movieId?.title || "N/A",
            theater: ticket.theaterId?.name || "N/A",
            screen: ticket.screenId?.name || "N/A",
            seat: `${ticket.seatRow}${ticket.seatNumber}`,
            seatType: ticket.seatType,
            showDate: ticket.showDate,
            showTime: ticket.showTime,
            price: ticket.price,
            verifiedAt: updatedTicket.usedAt,
            verifiedBy: `${staff.firstName} ${staff.lastName}`,
          },
          customer: {
            name: ticket.userId?.firstName || "N/A",
            email: ticket.userId?.email || "N/A",
          },
        },
      });
    } catch (error: unknown) {
      return this._handleServiceError(
        error,
        "Invalid QR code or verification failed"
      );
    }
  }
  async getTicketByIds(id: string[]) {
    try {
      const tickets = await this.ticketRepository.findTicketsByIds(id);
      return createResponse({
        success: true,
        message: "Tickets found",
        data: tickets,
      });
    } catch (error) {
      return this._handleServiceError(error, "Failed to get ticket");
    }
  }

  async getTicketById(
    ticketId: string
  ): Promise<ApiResponse<TicketResponseDto>> {
    try {
      this._validateTicketId(ticketId);

      const ticket = await this.ticketRepository.findTicketByTicketId(ticketId);

      if (!ticket) {
        return createResponse({
          success: false,
          message: "Ticket not found",
        });
      }

      return createResponse({
        success: true,
        message: "Ticket found",
        data: ticket,
      });
    } catch (error: unknown) {
      return this._handleServiceError(error, "Failed to get ticket");
    }
  }

  async getUserTickets(
    data: GetUserTicketsDto
  ): Promise<ApiResponse<TicketResponseDto>> {
    try {
      this._validateGetUserTicketsData(data);

      const result = await this.ticketRepository.findTicketsByUserIdPaginated(
        data.userId,
        data.page || 1,
        data.limit || 10,
        data.types || ["upcoming"]
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

  async markTicketAsUsed(
    ticketId: string
  ): Promise<ApiResponse<TicketResponseDto>> {
    try {
      this._validateTicketId(ticketId);

      const ticket = await this.ticketRepository.markTicketAsUsed(ticketId);

      if (!ticket) {
        return createResponse({
          success: false,
          message: "Ticket not found",
        });
      }

      return createResponse({
        success: true,
        message: "Ticket marked as used",
        data: ticket,
      });
    } catch (error: unknown) {
      return this._handleServiceError(error, "Failed to mark ticket as used");
    }
  }

  async validateTicket(
    data: ValidateTicketDto
  ): Promise<ApiResponse<TicketResponseDto>> {
    try {
      this._validateTicketValidationData(data);

      const ticket = await this.ticketRepository.validateTicket(
        data.ticketId,
        data.qrCode
      );

      if (!ticket) {
        return createResponse({
          success: false,
          message: "Invalid ticket or already used",
        });
      }

      return createResponse({
        success: true,
        message: "Ticket is valid",
        data: ticket,
      });
    } catch (error: unknown) {
      return this._handleServiceError(error, "Failed to validate ticket");
    }
  }

  async getTicketsByBookingId(
    bookingId: string
  ): Promise<ApiResponse<ITicket[]>> {
    try {
      this._validateBookingId(bookingId);

      const tickets = await this.ticketRepository.findTicketsByBookingId(
        bookingId
      );

      return createResponse({
        success: true,
        message: "Tickets retrieved successfully",
        data: tickets,
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
        data: tickets,
      });
    } catch (error: unknown) {
      return this._handleServiceError(error, "Failed to get ticket history");
    }
  }

  async generateQRCode(
    ticketId: string
  ): Promise<ApiResponse<{ qrCode: string }>> {
    try {
      this._validateTicketId(ticketId);

      const qrCode = `QR_${ticketId}_${Date.now()}`;

      return createResponse({
        success: true,
        message: "QR code generated",
        data: { qrCode },
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
        data: deleted,
      });
    } catch (error: unknown) {
      return this._handleServiceError(error, "Failed to delete ticket");
    }
  }

  private _generateQREncryptedData(ticketData: TicketResponseDto): string {
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

  private _decryptQRData(encryptedData: string): string {
    const decodedData = decodeURIComponent(encryptedData);
    console.log("🔓 Decoded data:", decodedData);

    const [ivHex, encrypted] = decodedData.split(":");

    if (!ivHex || !encrypted) {
      throw new Error("Invalid QR code format - missing IV or encrypted data");
    }

    const iv = Buffer.from(ivHex, "hex");

    const algorithm = "aes-256-cbc";
    const key = crypto.scryptSync(
      process.env.QR_VERIFICATION_SECRET!,
      "salt",
      32
    );

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return JSON.parse(decrypted);
  }

  private _generateTicketId(): string {
    return `TK${Date.now()}${Math.random()
      .toString(36)
      .substr(2, 4)
      .toUpperCase()}`;
  }

  private _prepareTicketsFromRows(
    data: CreateTicketFromRowsDto
  ): Partial<ITicket>[] {
    const tickets: Partial<ITicket>[] = [];

    for (const row of data.selectedRows) {
      for (const seatNum of row.seatsSelected) {
        const ticketId = this._generateTicketId();
        const encryptedQRData = this._generateQREncryptedData(ticketId);

        tickets.push({
          ticketId,
          isInvited: data.isInvited,
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
          ...(data.bookingInfo.couponId && {
            couponId: data.bookingInfo.couponId,
          }),
        });
      }
    }

    return tickets;
  }

  private _prepareTicketsFromBooking(
    data: CreateTicketFromBookingDto
  ): Partial<ITicket>[] {
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
        couponId: data.bookingData.couponId,
      };
    });
  }

  private _validateCancellationEligibility(
    tickets: ITicket[],
    userId: string
  ): string | null {
    const firstTicket = tickets[0];

    if (firstTicket.userId._id.toString() !== userId) {
      return "Unauthorized: You can only cancel your own tickets";
    }

    const usedTickets = tickets.filter((ticket) => ticket.status === "used");
    if (usedTickets.length > 0) {
      return "Cannot cancel booking with used tickets";
    }

    const showDateTime = this._parseShowDateTime(
      firstTicket.showDate,
      firstTicket.showTime
    );
    if (showDateTime <= new Date()) {
      return "Cannot cancel booking for past shows";
    }

    return null;
  }

  private _parseShowDateTime(showDate: Date, showTime: string): Date {
    const showDateTime = new Date(showDate);
    const [hours, minutes] = showTime.split(":");
    showDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return showDateTime;
  }
  //!refund calculaation
  private _calculateRefundPercentage(showDateTime: Date): number {
    const now = new Date();
    const hoursUntilShow = Math.ceil(
      (showDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)
    );

    if (hoursUntilShow >= 4) return 75;
    if (hoursUntilShow >= 2) return 50;
    if (hoursUntilShow >= 0.5) return 25;
    return 0;
  }

  private async _cancelAllTicketsInBooking(
    tickets: ITicket[]
  ): Promise<ITicket[]> {
    const updatePromises = tickets.map((ticket) =>
      this.ticketRepository.updateTicketById(
        (ticket as TicketResponseDto)._id.toString(),
        {
          status: "cancelled",
          updatedAt: new Date(),
        }
      )
    );

    return await Promise.all(updatePromises);
  }

  private _validateShowTiming(ticket: ITicket): boolean {
    const showDateTime = this._parseShowDateTime(
      ticket.showDate,
      ticket.showTime
    );
    const showEndTime = new Date(showDateTime.getTime() + 3 * 60 * 60 * 1000);
    return new Date() <= showEndTime;
  }

  private async _sendTicketEmail(
    email: string,
    tickets: ITicket[],
    bookingInfo: bookingInfo
  ): Promise<void> {
    try {
      await this.emailService.sendTicketsEmail(email, tickets, bookingInfo);
    } catch (emailError) {
      console.error("Failed to send ticket email:", emailError);
    }
  }

  private _validateCreateTicketsFromRowsData(
    data: CreateTicketFromRowsDto
  ): void {
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

  private _validateCreateTicketsFromBookingData(
    data: CreateTicketFromBookingDto
  ): void {
    if (!data.bookingId || !data.bookingData) {
      throw new Error("Missing required fields for ticket creation");
    }

    if (!this._isValidObjectId(data.bookingId)) {
      throw new Error("Invalid booking ID format");
    }

    if (
      !data.bookingData.selectedSeats ||
      !data.bookingData.selectedSeats.length
    ) {
      throw new Error("No seats selected for ticket creation");
    }
  }

  private _validateCancelTicketData(data: CancelTicketDto): void {
    if (!data.bookingId || !data.userId || data.amount <= 0) {
      throw new Error("Missing required fields for ticket cancellation");
    }

    if (
      !this._isValidObjectId(data.bookingId) ||
      !this._isValidObjectId(data.userId)
    ) {
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
    if (
      !ticketId ||
      typeof ticketId !== "string" ||
      ticketId.trim().length === 0
    ) {
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

  private _handleServiceError(
    error: unknown,
    defaultMessage: string
  ): ApiResponse<any> {
    const errorMessage =
      error instanceof Error ? error.message : defaultMessage;

    return createResponse({
      success: false,
      message: errorMessage,
    });
  }
}

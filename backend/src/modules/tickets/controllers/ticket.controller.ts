import { getErrorMessage } from "../../../utils/errorUtil";
import { Request, Response } from "express";
import { ITicketService } from "../interfaces/ticket.service.interface";
import {
  CancelTicketDto,
  GetUserTicketsDto,
  ValidateTicketDto,
} from "../dtos/dto";
import { PaginatedTicketsResponseDto } from "../dtos/dto";
import { createResponse, ApiResponse } from "../../../utils/createResponse";
import { IBookingService } from "../../bookings/interfaces/bookings.service.interface";
import { StatusCodes } from "../../../utils/statuscodes";
import { TICKET_MESSAGES } from "../../../utils/messages.constants";
import { ITicketCancellationOrchestrator } from "../interfaces/ticket-cancellation.orchestrator.interface";

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

export class TicketController {
  constructor(
    private readonly ticketService: ITicketService,
    private readonly bookingService: IBookingService,
    private readonly cancellationOrchestrator: ITicketCancellationOrchestrator
  ) {}

  async getTicketById(req: Request, res: Response) {
    try {
      const { ticketId } = req.params;

      if (!ticketId) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({ success: false, message: "Ticket ID is required" })
        );
        return;
      }

      const result = await this.ticketService.getTicketById(ticketId);
      res.status(result.success ? StatusCodes.OK : StatusCodes.NOT_FOUND).json(result);
    } catch (error: unknown) {
      this._handleControllerError(res, error, TICKET_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async cancelSingleTicket(req: AuthenticatedRequest, res: Response) {
    try {
      const { ticketIds } = req.body;
      const tickets = await this.ticketService.getTicketByIds(ticketIds);

      if (!tickets || tickets.length === 0) {
        throw new Error("No tickets found for the given IDs");
      }

      const totalAmount = Number(
        tickets
          .reduce((total, ticket) => {
            let basePrice = ticket.price;
            if (
              ticket.couponId &&
              typeof ticket.couponId === "object" &&
              "discountPercentage" in ticket.couponId
            ) {
              const discount =
                (basePrice * (ticket.couponId as { discountPercentage: number }).discountPercentage) /
                100;
              basePrice -= discount;
            }
            const tax = ticket.price * 0.18;
            const convenience = ticket.price * 0.05;
            return total + basePrice + tax + convenience;
          }, 0)
          .toFixed(2)
      );

      const userId = req.user?.id;
      if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({ success: false, message: TICKET_MESSAGES.AUTH_REQUIRED })
        );
        return;
      }

      const validationError = this._validateCancelSingleTicketParams(ticketIds, totalAmount);
      if (validationError) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({ success: false, message: validationError })
        );
        return;
      }

      const result = await this.ticketService.cancelSingleTicket({
        ticketIds,
        userId,
        totalAmount,
      });

      if (!result.success) {
        res.status(StatusCodes.BAD_REQUEST).json(result);
        return;
      }

      const response = await this.cancellationOrchestrator.processSingleTicketCancellation({
        userId,
        cancelledTickets: result.data.cancelledTickets,
        cancellationData: result.data,
        totalAmount,
      });

      res
        .status(response.success ? StatusCodes.OK : StatusCodes.BAD_REQUEST)
        .json(response);
    } catch (error: unknown) {
      console.error("Cancel single ticket error:", error);
      this._handleControllerError(res, error, TICKET_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async cancelTicket(req: AuthenticatedRequest, res: Response) {
    try {
      const { bookingId } = req.query;
      const userId = req.user?.id;
      const booking = await this.bookingService.getBookingById(String(bookingId));
      const amount = booking.data.priceDetails.total;

      if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({ success: false, message: TICKET_MESSAGES.AUTH_REQUIRED })
        );
        return;
      }

      const validationError = this._validateCancelTicketParams(bookingId as string, amount);
      if (validationError) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({ success: false, message: validationError })
        );
        return;
      }

      const amountNumber = this._parseAmount(amount);
      const result = await this.ticketService.cancelTicket({
        bookingId: bookingId as string,
        userId,
        amount: amountNumber,
      } as CancelTicketDto);

      if (!result.success) {
        res.status(StatusCodes.BAD_REQUEST).json(result);
        return;
      }

      const response = await this.cancellationOrchestrator.processBookingCancellation({
        userId,
        bookingId: bookingId as string,
        amount: amountNumber,
        cancellationData: result.data,
      });

      res
        .status(response.success ? StatusCodes.OK : StatusCodes.BAD_REQUEST)
        .json(response);
    } catch (error: unknown) {
      console.error("Cancel ticket error:", error);
      this._handleControllerError(res, error, TICKET_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserTickets(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { page = "1", limit = "10", type = "all" } = req.query;

      if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({ success: false, message: TICKET_MESSAGES.AUTH_REQUIRED })
        );
        return;
      }

      const types = (type as string).split(",") as (
        | "upcoming"
        | "history"
        | "cancelled"
        | "all"
      )[];

      const getUserTicketsDto: GetUserTicketsDto = {
        userId,
        page: parseInt(page as string) || 1,
        limit: parseInt(limit as string) || 10,
        types,
      };

      const result = await this.ticketService.getUserTickets(getUserTicketsDto);
      if (!result.success) {
        res.status(StatusCodes.BAD_REQUEST).json(result);
        return;
      }

      res.status(StatusCodes.OK).json(
        this._formatPaginatedTicketsResponse(
          result,
          getUserTicketsDto.page!,
          getUserTicketsDto.limit!
        )
      );
    } catch (error: unknown) {
      this._handleControllerError(res, error, TICKET_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async markTicketAsUsed(req: Request, res: Response) {
    try {
      const { ticketId } = req.params;
      if (!ticketId) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({ success: false, message: "Ticket ID is required" })
        );
        return;
      }

      const result = await this.ticketService.markTicketAsUsed(ticketId);
      res
        .status(result.success ? StatusCodes.OK : StatusCodes.BAD_REQUEST)
        .json(result);
    } catch (error: unknown) {
      this._handleControllerError(res, error, TICKET_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async validateTicket(req: Request, res: Response) {
    try {
      const { ticketId, qrCode } = req.body;
      const validationError = this._validateTicketParams(ticketId, qrCode);
      if (validationError) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({ success: false, message: validationError })
        );
        return;
      }

      const result = await this.ticketService.validateTicket({ ticketId, qrCode } as ValidateTicketDto);
      res
        .status(result.success ? StatusCodes.OK : StatusCodes.BAD_REQUEST)
        .json(result);
    } catch (error: unknown) {
      this._handleControllerError(res, error, TICKET_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async verifyTicketFromQrCode(req: Request, res: Response) {
    try {
      const { data } = req.body;
      const staffId = req.staff.staffId;

      if (!data) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({ success: false, message: "QR code data is required" })
        );
        return;
      }

      const result = await this.ticketService.verifyTicket(data, staffId);
      res
        .status(result.success ? StatusCodes.OK : StatusCodes.BAD_REQUEST)
        .json(result);
    } catch (error: unknown) {
      this._handleControllerError(res, error, TICKET_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  private _validateCancelTicketParams(bookingId: string, amount: number): string | null {
    if (!bookingId) return "Booking ID is required";
    if (!amount) return "Amount is required";
    if (this._parseAmount(amount) <= 0) return "Amount must be greater than 0";
    return null;
  }

  private _validateCancelSingleTicketParams(
    ticketIds: string[],
    totalAmount: number
  ): string | null {
    if (!ticketIds || !Array.isArray(ticketIds) || ticketIds.length === 0) {
      return "At least one ticket ID is required";
    }

    for (const ticketId of ticketIds) {
      if (!ticketId || typeof ticketId !== "string" || ticketId.trim().length === 0) {
        return "All ticket IDs must be valid strings";
      }
    }

    if (!totalAmount) return "Total amount is required";
    const amountNumber = Number(totalAmount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      return "Amount must be a valid number greater than 0";
    }

    return null;
  }

  private _validateTicketParams(ticketId: string, qrCode: string): string | null {
    if (!ticketId || !qrCode) return "Ticket ID and QR code are required";
    return null;
  }

  private _parseAmount(amount: number): number {
    return Array.isArray(amount) ? Number(amount[0]) : Number(amount);
  }

  private _formatPaginatedTicketsResponse(
    result: ApiResponse<PaginatedTicketsResponseDto>,
    page: number,
    limit: number
  ): ApiResponse<unknown> {
    return createResponse({
      success: true,
      message: result.message || "User tickets retrieved successfully",
      data: result.data?.tickets || result.data,
      meta: {
        pagination: {
          currentPage: page,
          totalPages:
            result.data?.totalPages ||
            Math.ceil((result.data?.total || 0) / limit),
          total: result.data?.total || 0,
          limit,
          hasNextPage: page < (result.data?.totalPages || 0),
          hasPrevPage: page > 1,
        },
      },
    });
  }

  private _handleControllerError(
    res: Response,
    error: unknown,
    defaultMessage: string
  ): void {
    const errorMessage =
      error instanceof Error ? getErrorMessage(error) : defaultMessage;

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      createResponse({ success: false, message: errorMessage })
    );
  }
}

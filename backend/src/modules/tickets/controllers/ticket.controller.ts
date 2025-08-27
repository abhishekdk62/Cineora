import { Request, Response } from "express";
import { TicketService } from "../services/ticket.service";
import { ITicketService } from "../interfaces/ticket.service.interface";
import { createResponse } from "../../../utils/createResponse";

export class TicketController {
  constructor(private readonly ticketService: ITicketService) {}

  async getTicketById(req: Request, res: Response): Promise<any> {
    try {
      const { ticketId } = req.params;
      const result = await this.ticketService.getTicketById(ticketId);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  async getUserTickets(req: Request, res: Response): Promise<any> {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10 } = req.query;

      const result = await this.ticketService.getUserTickets(
        userId,
        Number(page),
        Number(limit)
      );

      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  async getUpcomingTickets(req: Request, res: Response): Promise<any> {
    try {
      const { userId } = req.params;
      const result = await this.ticketService.getUpcomingTickets(userId);

      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  async markTicketAsUsed(req: Request, res: Response): Promise<any> {
    try {
      const { ticketId } = req.params;
      const result = await this.ticketService.markTicketAsUsed(ticketId);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  async validateTicket(req: Request, res: Response): Promise<any> {
    try {
      const { ticketId, qrCode } = req.body;
      const result = await this.ticketService.validateTicket(ticketId, qrCode);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }
  async verifyTicketFromQrCode(req: Request, res: Response): Promise<any> {
    try {
      const data = decodeURIComponent(req.params.data);
      const result = await this.ticketService.verifyTicket(data);
      if (!result.success) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }
      if (result.success) {
        res.status(200).json(
          createResponse({
            success: true,
            message: result.message,
          })
        );
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }
}

import { Request, Response } from "express";
import { TicketService } from "../services/ticket.service";
import { ITicketService } from "../interfaces/ticket.service.interface";
import { createResponse } from "../../../utils/createResponse";
import { IWalletService } from "../../wallet/interfaces/walletTransaction.service.interface";
import { IWalletTransactionService } from "../../walletTransaction/interfaces/walletTransaction.service.interface";

export class TicketController {
  constructor(
    private readonly ticketService: ITicketService,
    private readonly walletService: IWalletService,
    private readonly walletTransactionService: IWalletTransactionService
  ) {}

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
async cancelTicket(req: Request, res: Response): Promise<any> {
  try {
    const { bookingId, amount } = req.query;
    const userId = req.user?.id; 
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }
    
    const amountNumber = Array.isArray(amount) 
      ? Number(amount[0]) 
      : Number(amount);

    const result = await this.ticketService.cancelTicket(bookingId as string, userId, amountNumber);

    if (!result.success) {
      return res.status(400).json(result);
    }

    const { refundAmount, refundPercentage } = result.data;

    const wallet = await this.walletService.getWalletDetails(userId, 'User');
    
    if (!wallet.success) {
      return res.status(400).json({
        success: false,
        message: "Wallet not found",
      });
    }

    try {
      const creditResult = await this.walletService.creditWallet(
        userId, 
        'User', 
        refundAmount, 
        `Booking cancelled - ${refundPercentage}% refund (₹${refundAmount})`
      );

      if (!creditResult.success) {
        console.error('Failed to credit wallet:', creditResult.message);
      }

      const walletTransactionResult = await this.walletTransactionService.createWalletTransaction({
        userId,
        userModel: 'User',
        walletId: wallet.data._id,
        type: 'credit',
        amount: refundAmount,  
        category: 'refund',
        description: `Movie ticket refund - ${refundPercentage}% refund for booking ${bookingId}`,
        referenceId: bookingId as string,  
        movieId: result.data.movieId,
        theaterId: result.data.theaterId,
      });

      if (!walletTransactionResult.success) {
        console.error('Wallet transaction failed:', walletTransactionResult.message);
      }

    } catch (walletError) {
      console.error('Wallet operations failed:', walletError);
    }

    res.status(200).json({
      success: true,
      message: `Booking cancelled successfully. ₹${refundAmount} has been credited to your wallet (${refundPercentage}% refund)`,
      data: {
        bookingId,
        cancelledTickets: result.data.cancelledTickets,
        refundDetails: {
          originalAmount: amountNumber,
          refundAmount: refundAmount,
          refundPercentage: refundPercentage,
          cancellationFee: amountNumber - refundAmount
        },
        showDetails: {
          showDate: result.data.showDate,
          showTime: result.data.showTime
        },
        walletCredited: true
      }
    });

  } catch (error: any) {
    console.error('Cancel ticket error:', error);
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

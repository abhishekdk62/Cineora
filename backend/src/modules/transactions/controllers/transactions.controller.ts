import { Request, Response } from "express";
import { ITransactionService } from "../interfaces/transactions.service.interface";

export class TransactionController {
  constructor(private readonly transactionService: ITransactionService) {}

  async createTransaction(req: Request, res: Response): Promise<any> {
    try {
      const userId = req.user.id;
      const { walletId, type, amount, category, subCategory, description, metadata, paymentMethod, referenceId } = req.body;

      const result = await this.transactionService.createTransaction({
        userId,
        walletId,
        type,
        amount,
        category,
        subCategory,
        description,
        metadata,
        paymentMethod,
        referenceId
      });

      if (result.success) {
        res.status(201).json(result);
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

  async getUserTransactions(req: Request, res: Response): Promise<any> {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10, category, status, type } = req.query;

      const result = await this.transactionService.getUserTransactions(
        userId,
        Number(page),
        Number(limit),
        { category, status, type }
      );

      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  async getTransactionById(req: Request, res: Response): Promise<any> {
    try {
      const { transactionId } = req.params;

      const result = await this.transactionService.getTransactionById(transactionId);

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

  async processBookingPayment(req: Request, res: Response): Promise<any> {
    try {
      const bookingData = req.body;

      const result = await this.transactionService.processBookingPayment(bookingData);

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

  async requestPayout(req: Request, res: Response): Promise<any> {
    try {
      const ownerId = req.user.id;
      const { amount, bankDetails } = req.body;

      const result = await this.transactionService.requestPayout({
        ownerId,
        amount,
        bankDetails
      });

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

  async getUserStats(req: Request, res: Response): Promise<any> {
    try {
      const userId = req.user.id;

      const result = await this.transactionService.getUserStats(userId);

      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  async getOwnerRevenue(req: Request, res: Response): Promise<any> {
    try {
      const ownerId = req.user.id;
      const { startDate, endDate } = req.query;

      const result = await this.transactionService.getOwnerRevenue(
        ownerId,
        new Date(startDate as string),
        new Date(endDate as string)
      );

      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  async processRefund(req: Request, res: Response): Promise<any> {
    try {
      const { bookingId, refundAmount, reason } = req.body;

      const result = await this.transactionService.processRefund(bookingId, refundAmount, reason);

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
}

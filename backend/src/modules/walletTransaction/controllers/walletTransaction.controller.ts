// controllers/walletTransaction.controller.ts
import { Request, Response } from 'express';
import { IWalletTransactionService } from '../interfaces/walletTransaction.service.interface';

export class WalletTransactionController {
  constructor(
    private readonly walletTransactionService: IWalletTransactionService
  ) {}

  async getTransactionById(req: Request, res: Response): Promise<any> {
    try {
      const { transactionId } = req.params;

      if (!transactionId) {
        return res.status(400).json({
          success: false,
          message: "Transaction ID required"
        });
      }

      const result = await this.walletTransactionService.getTransactionById(transactionId);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
        data: null
      });
    }
  }

  async getUserTransactions(req: Request, res: Response): Promise<any> {
    try {
      const userId = req.user?.id || req.owner?.ownerId;
      const { page = 1, limit = 10 } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User authentication required"
        });
      }

      const result = await this.walletTransactionService.getUserTransactions(
        userId,
        parseInt(page as string),
        parseInt(limit as string)
      );

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
        data: null
      });
    }
  }

  async getWalletTransactions(req: Request, res: Response): Promise<any> {
    try {
      const { walletId } = req.params;

      if (!walletId) {
        return res.status(400).json({
          success: false,
          message: "Wallet ID required"
        });
      }

      const result = await this.walletTransactionService.getWalletTransactions(walletId);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
        data: null
      });
    }
  }
}

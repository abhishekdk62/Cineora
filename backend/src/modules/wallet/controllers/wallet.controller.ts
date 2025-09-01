import { Request, Response } from "express";
import { IWalletService } from "../interfaces/walletTransaction.service.interface";
import { IWalletTransactionService } from "../../walletTransaction/interfaces/walletTransaction.service.interface";

export class WalletController {
  constructor(
    private readonly walletService: IWalletService,
    private readonly walletTransactionService: IWalletTransactionService
  ) {}

  async createWallet(req: Request, res: Response): Promise<any> {
    try {
      const userId = req.user.id;
      const { userModel } = req.body;

      const result = await this.walletService.createWallet(userId, userModel);

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

  async getBalance(req: Request, res: Response): Promise<any> {
    try {
      const userId = req.user.id || req.owner.ownerId;
      const userModel = req.user.role || req.owner.role;
      let person = userModel[0].toUpperCase() + userModel.slice(1);

      const result = await this.walletService.getBalance(userId, person);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  async creditWallet(req: Request, res: Response): Promise<any> {
    try {
      const userId = req.user.id;
      const { amount, userModel } = req.body;

      const result = await this.walletService.creditWallet(
        userId,
        userModel,
        amount
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
      });
    }
  }

  async debitWallet(req: Request, res: Response): Promise<any> {
    try {
      const userId = req.user.id;
      const { amount, userModel } = req.body;

      const result = await this.walletService.debitWallet(
        userId,
        userModel,
        amount
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
      });
    }
  }
  async handleWalletTransaction(req: Request, res: Response): Promise<any> {
    try {
      let userId: string;
      let userModel: "User" | "Owner";

      if (req.user?.id) {
        userId = req.user.id;
        userModel = "User";
      } else if (req.owner?.ownerId) {
        userId = req.owner.ownerId;
        userModel = "Owner";
      } else {
        return res.status(400).json({
          success: false,
          message: "User authentication required",
        });
      }

      const { amount, type, description } = req.body;

      if (!amount || !type) {
        return res.status(400).json({
          success: false,
          message: "Amount and type are required",
        });
      }

      if (!["credit", "debit"].includes(type)) {
        return res.status(400).json({
          success: false,
          message: "Invalid transaction type. Must be 'credit' or 'debit'",
        });
      }

      if (amount <= 0) {
        return res.status(400).json({
          success: false,
          message: "Amount must be greater than 0",
        });
      }

      let result;

      if (type === "credit") {
        result = await this.walletService.creditWallet(
          userId,
          userModel,
          parseFloat(amount),
          description
        );
      } else if (type === "debit") {
        result = await this.walletService.debitWallet(
          userId,
          userModel,
          parseFloat(amount),
          description
        );
      }

      if (result.success) {
        res.status(200).json({
          success: true,
          message: result.message,
          data: {
            wallet: result.data,
            userModel: userModel,
            transactionType: type,
            amount: parseFloat(amount),
          },
        });

        const wallet = await this.walletService.getWalletDetails(
          userId,
          "User"
        );

        if (!wallet.success) {
          return res.status(400).json({
            success: false,
            message: "Wallet not found",
          });
        }

        const transactionResult =
          await this.walletTransactionService.createWalletTransaction({
            userId: userId,
            userModel: userModel,
            walletId: wallet.data._id,
            type: type,
            amount: parseFloat(amount),
            category: type === "credit" ? "topup" : "withdrawal",
            description: description || `Wallet ${type} transaction`,
          });
        if (!transactionResult.success) {
          console.error(
            "Failed to create transaction record:",
            transactionResult.message
          );
        }
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      console.error("Wallet transaction error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
        data: null,
      });
    }
  }
}

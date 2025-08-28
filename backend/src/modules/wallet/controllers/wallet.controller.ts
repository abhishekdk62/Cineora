import { Request, Response } from "express";
import { WalletService } from "../services/wallet.service";
import { IWalletService } from "../interfaces/wallet.service.interface";

export class WalletController {
  constructor(private readonly walletService: IWalletService) {}

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
      const userModel =
        req.user.role || req.owner.role 
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
}

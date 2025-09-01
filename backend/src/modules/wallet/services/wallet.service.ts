import { IWalletService } from "../interfaces/walletTransaction.service.interface";
import { IWalletRepository } from "../interfaces/wallet.repository.interface";
import { ServiceResponse } from "../../../interfaces/interface";
import mongoose from "mongoose";

export class WalletService implements IWalletService {
  constructor(private readonly walletRepo: IWalletRepository) {}

  async createWallet(
    userId: string,
    userModel: "User" | "Owner"
  ): Promise<ServiceResponse> {
    try {
      const existingWallet = await this.walletRepo.findByUser(
        userId,
        userModel
      );
      if (existingWallet) {
        return {
          success: false,
          message: "Wallet already exists for this user",
          data: null,
        };
      }

      const wallet = await this.walletRepo.create({
        userId: new mongoose.Types.ObjectId(userId),
        userModel,
        balance: 0,
        currency: "INR",
        status: "active",
      });

      return {
        success: true,
        message: "Wallet created successfully",
        data: wallet,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to create wallet",
        data: null,
      };
    }
  }

  async creditWallet(
    userId: string,
    userModel: "User" | "Owner",
    amount: number,
    description?: string
  ): Promise<ServiceResponse> {
    try {
      if (amount <= 0) {
        return {
          success: false,
          message: "Amount must be greater than 0",
          data: null,
        };
      }

      const wallet = await this.walletRepo.updateBalance(
        userId,
        userModel,
        amount
      );
      if (!wallet) {
        return {
          success: false,
          message: "Wallet not found",
          data: null,
        };
      }

      return {
        success: true,
        message: "Wallet credited successfully",
        data: wallet,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to credit wallet",
        data: null,
      };
    }
  }

  async debitWallet(
    userId: string,
    userModel: "User" | "Owner",
    amount: number,
    description?: string
  ): Promise<ServiceResponse> {
    try {
      if (amount <= 0) {
        return {
          success: false,
          message: "Amount must be greater than 0",
          data: null,
        };
      }

      const currentBalance = await this.walletRepo.getBalance(
        userId,
        userModel
      );
      if (currentBalance < amount) {
        return {
          success: false,
          message: "Insufficient balance",
          data: null,
        };
      }

      const wallet = await this.walletRepo.updateBalance(
        userId,
        userModel,
        -amount
      );
      if (!wallet) {
        return {
          success: false,
          message: "Wallet not found",
          data: null,
        };
      }

      return {
        success: true,
        message: "Wallet debited successfully",
        data: wallet,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to debit wallet",
        data: null,
      };
    }
  }

  async getBalance(
    userId: string,
    userModel: "User" | "Owner"
  ): Promise<ServiceResponse> {
    try {
      const balance = await this.walletRepo.getBalance(userId, userModel);

      return {
        success: true,
        message: "Balance retrieved successfully",
        data: { balance },
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to get balance",
        data: null,
      };
    }
  }

  async getWalletDetails(
    userId: string,
    userModel: "User" | "Owner"
  ): Promise<ServiceResponse> {
    try {
      const wallet = await this.walletRepo.findByUser(userId, userModel);

      if (!wallet) {
        return {
          success: false,
          message: "Wallet not found",
          data: null,
        };
      }

      return {
        success: true,
        message: "Wallet details retrieved successfully",
        data: wallet,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to get wallet details",
        data: null,
      };
    }
  }

  async freezeWallet(
    userId: string,
    userModel: "User" | "Owner"
  ): Promise<ServiceResponse> {
    try {
      const wallet = await this.walletRepo.freezeWallet(userId, userModel);

      if (!wallet) {
        return {
          success: false,
          message: "Wallet not found",
          data: null,
        };
      }

      return {
        success: true,
        message: "Wallet frozen successfully",
        data: wallet,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to freeze wallet",
        data: null,
      };
    }
  }

  async unfreezeWallet(
    userId: string,
    userModel: "User" | "Owner"
  ): Promise<ServiceResponse> {
    try {
      const wallet = await this.walletRepo.unfreezeWallet(userId, userModel);

      if (!wallet) {
        return {
          success: false,
          message: "Wallet not found",
          data: null,
        };
      }

      return {
        success: true,
        message: "Wallet unfrozen successfully",
        data: wallet,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to unfreeze wallet",
        data: null,
      };
    }
  }

  async transferMoney(
    fromUserId: string,
    toUserId: string,
    amount: number
  ): Promise<ServiceResponse> {
    try {
      const debitResult = await this.debitWallet(
        fromUserId,
        "User",
        amount,
        "Transfer to user"
      );
      if (!debitResult.success) {
        return debitResult;
      }

      const creditResult = await this.creditWallet(
        toUserId,
        "Owner",
        amount,
        "Transfer from user"
      );
      if (!creditResult.success) {
        await this.creditWallet(
          fromUserId,
          "User",
          amount,
          "Rollback failed transfer"
        );
        return creditResult;
      }

      return {
        success: true,
        message: "Money transferred successfully",
        data: { amount, from: fromUserId, to: toUserId },
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to transfer money",
        data: null,
      };
    }
  }
}

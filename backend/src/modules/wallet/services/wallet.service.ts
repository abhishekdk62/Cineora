import { IWalletService } from "../interfaces/wallet.service.interface";
import { IWalletRepository } from "../interfaces/wallet.repository.interface";
import { CreateWalletDto, CreditWalletDto, DebitWalletDto } from "../dtos/dto";
import { ApiResponse, createResponse } from "../../../utils/createResponse";
import { IWallet } from "../interfaces/wallet.model.interface";
import mongoose from "mongoose";

export class WalletService implements IWalletService {
  constructor(
    private readonly walletRepository: IWalletRepository
  ) {}

  async createWallet(data: CreateWalletDto): Promise<ApiResponse<IWallet>> {
    try {
      this._validateCreateWalletData(data);

      const existingWallet = await this.walletRepository.findWalletByUser(
        data.userId,
        data.userModel
      );

      if (existingWallet) {
        return createResponse({
          success: false,
          message: "Wallet already exists for this user"
        });
      }

      const walletData = this._prepareWalletData(data);
      const wallet = await this.walletRepository.createWallet(walletData);

      return createResponse({
        success: true,
        message: "Wallet created successfully",
        data: wallet
      });
    } catch (error: unknown) {
      return this._handleServiceError(error, "Failed to create wallet");
    }
  }

  async creditWallet(data: CreditWalletDto): Promise<ApiResponse<IWallet>> {
    try {
      // Business logic validation
      this._validateCreditWalletData(data);

      const wallet = await this.walletRepository.updateWalletBalance(
        data.userId,
        data.userModel,
        data.amount
      );

      if (!wallet) {
        return createResponse({
          success: false,
          message: "Wallet not found"
        });
      }

      return createResponse({
        success: true,
        message: "Wallet credited successfully",
        data: wallet
      });
    } catch (error: unknown) {
      return this._handleServiceError(error, "Failed to credit wallet");
    }
  }

  async debitWallet(data: DebitWalletDto): Promise<ApiResponse<IWallet>> {
    try {
      this._validateDebitWalletData(data);

      const currentBalance = await this.walletRepository.getWalletBalance(
        data.userId,
        data.userModel
      );

      if (currentBalance < data.amount) {
        return createResponse({
          success: false,
          message: "Insufficient balance"
        });
      }

      const wallet = await this.walletRepository.updateWalletBalance(
        data.userId,
        data.userModel,
        -data.amount
      );

      if (!wallet) {
        return createResponse({
          success: false,
          message: "Wallet not found"
        });
      }

      return createResponse({
        success: true,
        message: "Wallet debited successfully",
        data: wallet
      });
    } catch (error: unknown) {
      return this._handleServiceError(error, "Failed to debit wallet");
    }
  }

  async getWalletBalance(
    userId: string,
    userModel: "User" | "Owner"
  ): Promise<ApiResponse<{ balance: number }>> {
    try {
      // Business logic validation
      this._validateUserParams(userId, userModel);

      const balance = await this.walletRepository.getWalletBalance(userId, userModel);

      return createResponse({
        success: true,
        message: "Balance retrieved successfully",
        data: { balance }
      });
    } catch (error: unknown) {
      return this._handleServiceError(error, "Failed to get balance");
    }
  }

  async getWalletDetails(
    userId: string,
    userModel: "User" | "Owner"
  ): Promise<ApiResponse<IWallet>> {
    try {
      // Business logic validation
      this._validateUserParams(userId, userModel);

      const wallet = await this.walletRepository.findWalletByUser(userId, userModel);

      if (!wallet) {
        return createResponse({
          success: false,
          message: "Wallet not found"
        });
      }

      return createResponse({
        success: true,
        message: "Wallet details retrieved successfully",
        data: wallet
      });
    } catch (error: unknown) {
      return this._handleServiceError(error, "Failed to get wallet details");
    }
  }

  private _validateCreateWalletData(data: CreateWalletDto): void {
    if (!data.userId || !data.userModel) {
      throw new Error("Required fields are missing: userId, userModel");
    }

    if (!this._isValidObjectId(data.userId)) {
      throw new Error("Invalid userId format");
    }

    const validUserModels = ['User', 'Owner'];
    if (!validUserModels.includes(data.userModel)) {
      throw new Error(`User model must be one of: ${validUserModels.join(', ')}`);
    }

    if (data.balance !== undefined && data.balance < 0) {
      throw new Error("Balance cannot be negative");
    }

    if (data.status) {
      const validStatuses = ['active', 'frozen', 'closed'];
      if (!validStatuses.includes(data.status)) {
        throw new Error(`Status must be one of: ${validStatuses.join(', ')}`);
      }
    }
  }

  private _validateCreditWalletData(data: CreditWalletDto): void {
    this._validateUserParams(data.userId, data.userModel);

    if (data.amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    if (typeof data.amount !== 'number' || isNaN(data.amount)) {
      throw new Error("Amount must be a valid number");
    }
  }

  private _validateDebitWalletData(data: DebitWalletDto): void {
    this._validateUserParams(data.userId, data.userModel);

    if (data.amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    if (typeof data.amount !== 'number' || isNaN(data.amount)) {
      throw new Error("Amount must be a valid number");
    }
  }

  private _validateUserParams(userId: string, userModel: "User" | "Owner"): void {
    if (!userId || !userModel) {
      throw new Error("UserId and userModel are required");
    }

    if (!this._isValidObjectId(userId)) {
      throw new Error("Invalid userId format");
    }

    const validUserModels = ['User', 'Owner'];
    if (!validUserModels.includes(userModel)) {
      throw new Error(`User model must be one of: ${validUserModels.join(', ')}`);
    }
  }

  private _prepareWalletData(data: CreateWalletDto): Partial<IWallet> {
    return {
      userId: new mongoose.Types.ObjectId(data.userId),
      userModel: data.userModel,
      balance: data.balance || 0,
      currency: data.currency || "INR",
      status: data.status || "active"
    };
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

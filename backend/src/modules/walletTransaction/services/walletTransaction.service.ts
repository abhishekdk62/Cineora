import { IWalletTransactionRepository } from '../interfaces/walletTransaction.repository.interface';
import { CreateWalletTransactionDto } from '../dto/dto';
import { IWalletTransaction } from '../interfaces/walletTransaction.model.interface';
import mongoose from 'mongoose';
import { IWalletTransactionService } from '../interfaces/walletTransaction.service.interface';
import { ApiResponse, createResponse } from '../../../utils/createResponse';

export class WalletTransactionService implements IWalletTransactionService {
  constructor(
    private readonly walletTransactionRepository: IWalletTransactionRepository
  ) {}

  async createWalletTransaction(
    data: CreateWalletTransactionDto
  ): Promise<ApiResponse<IWalletTransaction>> {
    try {
      this._validateCreateWalletTransactionData(data);

      const transactionData = this._prepareWalletTransactionData(data);
      const transaction = await this.walletTransactionRepository.createWalletTransaction(transactionData);

      return createResponse({
        success: true,
        message: "Wallet transaction created successfully",
        data: transaction
      });
    } catch (error: unknown) {
      return this._handleServiceError(error, "Failed to create wallet transaction");
    }
  }

  async getUserWalletTransactions(
    userId: string, 
    page: number = 1, 
    limit: number = 10
  ): Promise<ApiResponse<{ 
    transactions: IWalletTransaction[]; 
    pagination: { page: number; limit: number; total: number; totalPages: number }
  }>> {
    try {
      this._validateGetUserWalletTransactionsParams(userId, page, limit);
      const result = await this.walletTransactionRepository.findWalletTransactionsByUserId(userId, page, limit);
      const paginationData = this._calculatePaginationData(page, limit, result.total);
      return createResponse({
        success: true,
        message: "User wallet transactions retrieved successfully",
        data: {
          transactions: result.transactions,
          pagination: paginationData
        }
      });
    } catch (error: unknown) {
      return this._handleServiceError(error, "Failed to get user wallet transactions");
    }
  }

  // Private helper methods for business logic (SRP - Single Responsibility)
  private _validateCreateWalletTransactionData(data: CreateWalletTransactionDto): void {
    if (!data.userId || !data.walletId || !data.type || !data.category || !data.description) {
      throw new Error("Required fields are missing: userId, walletId, type, category, description");
    }

    if (data.amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    if (!this._isValidObjectId(data.userId)) {
      throw new Error("Invalid userId format");
    }

    if (!this._isValidObjectId(data.walletId)) {
      throw new Error("Invalid walletId format");
    }

    if (data.movieId && !this._isValidObjectId(data.movieId)) {
      throw new Error("Invalid movieId format");
    }

    if (data.theaterId && !this._isValidObjectId(data.theaterId)) {
      throw new Error("Invalid theaterId format");
    }

    const validTypes = ['credit', 'debit'];
    if (!validTypes.includes(data.type)) {
      throw new Error(`Type must be one of: ${validTypes.join(', ')}`);
    }

    const validCategories = ['booking', 'refund', 'topup', 'withdrawal', 'revenue'];
    if (!validCategories.includes(data.category)) {
      throw new Error(`Category must be one of: ${validCategories.join(', ')}`);
    }

    const validUserModels = ['User', 'Owner','Admin'];
    if (!validUserModels.includes(data.userModel)) {
      throw new Error(`User model must be one of: ${validUserModels.join(', ')}`);
    }
  }

  private _validateGetUserWalletTransactionsParams(userId: string, page: number, limit: number): void {
    if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
      throw new Error('Valid userId is required');
    }

    if (!this._isValidObjectId(userId)) {
      throw new Error("Invalid userId format");
    }

    if (!Number.isInteger(page) || page < 1) {
      throw new Error('Page must be a positive integer');
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new Error('Limit must be a positive integer between 1 and 100');
    }
  }

  private _prepareWalletTransactionData(data: CreateWalletTransactionDto): Partial<IWalletTransaction> {
    return {
      userId: new mongoose.Types.ObjectId(data.userId),
      userModel: data.userModel,
      walletId: new mongoose.Types.ObjectId(data.walletId),
      type: data.type,
      amount: data.amount,
      category: data.category,
      description: data.description,
      referenceId: data.referenceId,
      movieId: data.movieId ? new mongoose.Types.ObjectId(data.movieId) : undefined,
      theaterId: data.theaterId ? new mongoose.Types.ObjectId(data.theaterId) : undefined,
      status: 'completed'
    };
  }

  private _calculatePaginationData(page: number, limit: number, total: number): {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } {
    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
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

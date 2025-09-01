// services/walletTransaction.service.ts
import { IWalletTransactionService } from '../interfaces/walletTransaction.service.interface';
import { IWalletTransactionRepository } from '../interfaces/walletTransaction.repository.interface';
import { ServiceResponse } from '../../../interfaces/interface';
import mongoose from 'mongoose';

export class WalletTransactionService implements IWalletTransactionService {
  constructor(
    private readonly walletTransactionRepo: IWalletTransactionRepository
  ) {}

  async createWalletTransaction(data: {
    userId: string;
    userModel: 'User' | 'Owner';
    walletId: string;
    type: 'credit' | 'debit';
    amount: number;
    category: 'booking' | 'refund' | 'topup' | 'withdrawal' | 'revenue';
    description: string;
    referenceId?: string;
    movieId?: string;
    theaterId?: string;
  }): Promise<ServiceResponse> {
    try {
      if (data.amount <= 0) {
        return {
          success: false,
          message: "Amount must be greater than 0",
          data: null
        };
      }

      const transactionData = {
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
        status: 'completed' as const
      };

      const transaction = await this.walletTransactionRepo.create(transactionData);

      return {
        success: true,
        message: "Wallet transaction created successfully",
        data: transaction
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to create wallet transaction",
        data: null
      };
    }
  }

  async getTransactionById(transactionId: string): Promise<ServiceResponse> {
    try {
      const transaction = await this.walletTransactionRepo.findByTransactionId(transactionId);
      
      if (!transaction) {
        return {
          success: false,
          message: "Transaction not found",
          data: null
        };
      }

      return {
        success: true,
        message: "Transaction retrieved successfully",
        data: transaction
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to get transaction",
        data: null
      };
    }
  }

  async getUserTransactions(
    userId: string, 
    page: number = 1, 
    limit: number = 10
  ): Promise<ServiceResponse> {
    try {
      const result = await this.walletTransactionRepo.findByUserId(userId, page, limit);
      
      return {
        success: true,
        message: "User transactions retrieved successfully",
        data: {
          transactions: result.transactions,
          pagination: {
            page,
            limit,
            total: result.total,
            totalPages: Math.ceil(result.total / limit)
          }
        }
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to get user transactions",
        data: null
      };
    }
  }

  async getWalletTransactions(walletId: string): Promise<ServiceResponse> {
    try {
      const transactions = await this.walletTransactionRepo.findByWalletId(walletId);
      
      return {
        success: true,
        message: "Wallet transactions retrieved successfully",
        data: transactions
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to get wallet transactions",
        data: null
      };
    }
  }
}

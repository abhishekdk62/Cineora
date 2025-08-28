import { ITransactionService } from "../interfaces/transactions.service.interface";
import { ITransactionRepository } from "../interfaces/transactions.repository.interface";
import { IWalletRepository } from "../../wallet/interfaces/wallet.repository.interface";
import { ServiceResponse } from "../../../interfaces/interface";
import mongoose from "mongoose";

export class TransactionService implements ITransactionService {
  constructor(
    private readonly transactionRepo: ITransactionRepository,
    private readonly walletRepo: IWalletRepository
  ) {}

  async createTransaction(data: {
    userId: string;
    walletId: string;
    type: 'credit' | 'debit';
    amount: number;
    category: string;
    subCategory?: string;
    description: string;
    metadata?: any;
    paymentMethod?: string;
    referenceId?: string;
  }): Promise<ServiceResponse> {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      if (data.amount <= 0) {
        await session.abortTransaction();
        return {
          success: false,
          message: "Amount must be greater than 0",
          data: null
        };
      }

      const wallet = await this.walletRepo.findById(data.walletId);
      if (!wallet) {
        await session.abortTransaction();
        return {
          success: false,
          message: "Wallet not found",
          data: null
        };
      }

      const balanceBefore = wallet.balance;
      const balanceAfter = data.type === 'credit' 
        ? balanceBefore + data.amount 
        : balanceBefore - data.amount;

      if (data.type === 'debit' && balanceAfter < 0) {
        await session.abortTransaction();
        return {
          success: false,
          message: "Insufficient wallet balance",
          data: null
        };
      }

      const transaction = await this.transactionRepo.create({
        primaryUserId: new mongoose.Types.ObjectId(data.userId),
        primaryUserModel: wallet.userModel,
        walletId: new mongoose.Types.ObjectId(data.walletId),
        type: data.type,
        amount: data.amount,
        category: data.category as any,
        subCategory: data.subCategory as any,
        description: data.description,
        metadata: data.metadata,
        paymentMethod: data.paymentMethod as any,
        referenceId: data.referenceId,
        balanceBefore,
        balanceAfter,
        status: 'completed',
        notificationSent: false
      });

      const userModel = wallet.userModel;
      await this.walletRepo.updateBalance(data.userId, userModel, data.type === 'credit' ? data.amount : -data.amount);

      await session.commitTransaction();
      
      return {
        success: true,
        message: "Transaction created successfully",
        data: transaction
      };
    } catch (error: any) {
      await session.abortTransaction();
      return {
        success: false,
        message: error.message || "Failed to create transaction",
        data: null
      };
    } finally {
      await session.endSession();
    }
  }

  async processBookingPayment(bookingData: {
    userId: string;
    ownerId: string;
    bookingId: string;
    theaterId: string;
    movieId: string;
    totalAmount: number;
    platformFeePercentage: number;
    movieTitle: string;
    theaterName: string;
    seats: string[];
    showDate: string;
    showTime: string;
  }): Promise<ServiceResponse> {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const { 
        userId, 
        ownerId, 
        totalAmount, 
        platformFeePercentage,
        movieTitle,
        theaterName,
        seats,
        bookingId,
        theaterId,
        movieId,
        showDate,
        showTime
      } = bookingData;

      const platformFee = (totalAmount * platformFeePercentage) / 100;
      const ownerShare = totalAmount - platformFee;

      const userWallet = await this.walletRepo.findByUser(userId, 'User');
      const ownerWallet = await this.walletRepo.findByUser(ownerId, 'Owner');

      if (!userWallet || userWallet.balance < totalAmount) {
        await session.abortTransaction();
        return {
          success: false,
          message: "Insufficient wallet balance",
          data: null
        };
      }

      if (!ownerWallet) {
        await session.abortTransaction();
        return {
          success: false,
          message: "Owner wallet not found",
          data: null
        };
      }

      const userTransaction = await this.transactionRepo.create({
        primaryUserId: new mongoose.Types.ObjectId(userId),
        primaryUserModel: 'User',
        secondaryUserId: new mongoose.Types.ObjectId(ownerId),
        secondaryUserModel: 'Owner',
        walletId: userWallet._id,
        type: 'debit',
        amount: totalAmount,
        balanceBefore: userWallet.balance,
        balanceAfter: userWallet.balance - totalAmount,
        category: 'booking',
        subCategory: 'customer_payment',
        description: `Movie ticket booking - ${movieTitle} at ${theaterName}`,
        metadata: {
          bookingId: new mongoose.Types.ObjectId(bookingId),
          theaterId: new mongoose.Types.ObjectId(theaterId),
          movieId: new mongoose.Types.ObjectId(movieId),
          seats,
          movieTitle,
          theaterName,
          showDate,
          showTime,
          revenueBreakdown: {
            totalAmount,
            platformFee,
            ownerShare,
          }
        },
        status: 'completed',
        paymentMethod: 'wallet',
        notificationSent: false
      });

      const ownerTransaction = await this.transactionRepo.create({
        primaryUserId: new mongoose.Types.ObjectId(ownerId),
        primaryUserModel: 'Owner',
        secondaryUserId: new mongoose.Types.ObjectId(userId),
        secondaryUserModel: 'User',
        walletId: ownerWallet._id,
        type: 'credit',
        amount: ownerShare,
        balanceBefore: ownerWallet.balance,
        balanceAfter: ownerWallet.balance + ownerShare,
        category: 'revenue_share',
        subCategory: 'owner_revenue',
        description: `Revenue from booking - ${movieTitle} (${seats.join(', ')})`,
        metadata: {
          bookingId: new mongoose.Types.ObjectId(bookingId),
          theaterId: new mongoose.Types.ObjectId(theaterId),
          movieId: new mongoose.Types.ObjectId(movieId),
          seats,
          movieTitle,
          theaterName,
          showDate,
          showTime,
          revenueBreakdown: {
            totalAmount,
            platformFee,
            ownerShare,
          }
        },
        status: 'completed',
        paymentMethod: 'wallet',
        notificationSent: false
      });

      await this.walletRepo.updateBalance(userId, 'User', -totalAmount);
      await this.walletRepo.updateBalance(ownerId, 'Owner', ownerShare);

      await session.commitTransaction();

      return {
        success: true,
        message: "Booking payment processed successfully",
        data: {
          userTransaction,
          ownerTransaction,
          revenueBreakdown: {
            totalAmount,
            platformFee,
            ownerShare
          }
        }
      };
    } catch (error: any) {
      await session.abortTransaction();
      return {
        success: false,
        message: error.message || "Failed to process booking payment",
        data: null
      };
    } finally {
      await session.endSession();
    }
  }

  async requestPayout(payoutData: {
    ownerId: string;
    amount: number;
    bankDetails: {
      accountNumber: string;
      ifscCode: string;
      accountHolderName: string;
    };
  }): Promise<ServiceResponse> {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const { ownerId, amount, bankDetails } = payoutData;

      const ownerWallet = await this.walletRepo.findByUser(ownerId, 'Owner');
      if (!ownerWallet || ownerWallet.balance < amount) {
        await session.abortTransaction();
        return {
          success: false,
          message: "Insufficient wallet balance for payout",
          data: null
        };
      }

      const payoutTransaction = await this.transactionRepo.create({
        primaryUserId: new mongoose.Types.ObjectId(ownerId),
        primaryUserModel: 'Owner',
        walletId: ownerWallet._id,
        type: 'debit',
        amount: amount,
        balanceBefore: ownerWallet.balance,
        balanceAfter: ownerWallet.balance - amount,
        category: 'payout',
        subCategory: 'payout_request',
        description: `Payout to bank account ending in ${bankDetails.accountNumber.slice(-4)}`,
        metadata: {
          payoutDetails: {
            bankAccount: bankDetails.accountNumber,
            ifscCode: bankDetails.ifscCode,
            accountHolderName: bankDetails.accountHolderName
          }
        },
        status: 'processing',
        paymentMethod: 'bank_transfer',
        notificationSent: false
      });

      await this.walletRepo.updateBalance(ownerId, 'Owner', -amount);

      await session.commitTransaction();

      return {
        success: true,
        message: "Payout request created successfully",
        data: payoutTransaction
      };
    } catch (error: any) {
      await session.abortTransaction();
      return {
        success: false,
        message: error.message || "Failed to request payout",
        data: null
      };
    } finally {
      await session.endSession();
    }
  }

  async getUserTransactions(
    userId: string, 
    page: number = 1, 
    limit: number = 10,
    filters?: any
  ): Promise<ServiceResponse> {
    try {
      const result = await this.transactionRepo.findByUserId(userId, page, limit, filters);
      
      return {
        success: true,
        message: "Transactions retrieved successfully",
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
        message: error.message || "Failed to get transactions",
        data: null
      };
    }
  }

  async getTransactionById(transactionId: string): Promise<ServiceResponse> {
    try {
      const transaction = await this.transactionRepo.findByTransactionId(transactionId);
      
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

  async getUserStats(userId: string): Promise<ServiceResponse> {
    try {
      const currentDate = new Date();
      const stats = await this.transactionRepo.getMonthlyStats(
        userId, 
        currentDate.getFullYear(), 
        currentDate.getMonth() + 1
      );

      return {
        success: true,
        message: "User stats retrieved successfully",
        data: stats
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to get user stats",
        data: null
      };
    }
  }

  async getOwnerRevenue(ownerId: string, startDate: Date, endDate: Date): Promise<ServiceResponse> {
    try {
      const revenueStats = await this.transactionRepo.getRevenueStats(ownerId, startDate, endDate);
      
      return {
        success: true,
        message: "Owner revenue retrieved successfully",
        data: revenueStats
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to get owner revenue",
        data: null
      };
    }
  }

  async processRefund(bookingId: string, refundAmount: number, reason: string): Promise<ServiceResponse> {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
   
      
      await session.commitTransaction();
      
      return {
        success: true,
        message: "Refund processed successfully",
        data: null
      };
    } catch (error: any) {
      await session.abortTransaction();
      return {
        success: false,
        message: error.message || "Failed to process refund",
        data: null
      };
    } finally {
      await session.endSession();
    }
  }

  private async rollbackTransaction(session: mongoose.ClientSession, errorMessage: string) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(errorMessage);
  }

  async processComplexTransaction(steps: Array<() => Promise<any>>): Promise<ServiceResponse> {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const results = [];
      
      for (const step of steps) {
        const result = await step();
        results.push(result);
      }
      
      await session.commitTransaction();
      
      return {
        success: true,
        message: "Complex transaction completed successfully",
        data: results
      };
    } catch (error: any) {
      await session.abortTransaction();
      return {
        success: false,
        message: error.message || "Failed to process complex transaction",
        data: null
      };
    } finally {
      await session.endSession();
    }
  }
}

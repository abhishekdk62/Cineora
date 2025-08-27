// repositories/transactions.repository.ts
import Transaction from "../models/transactions.model";
import { ITransactionRepository } from "../interfaces/transactions.repository.interface";
import { ITransaction } from "../interfaces/transactions.model.interface";
import mongoose, { Types } from "mongoose";

export class TransactionRepository implements ITransactionRepository {
  async create(transactionData: Partial<ITransaction>): Promise<ITransaction | null> {
    const transaction = new Transaction(transactionData);
    return await transaction.save();
  }

  async findById(id: string): Promise<ITransaction | null> {
    return await Transaction.findById(id);
  }

  async findByTransactionId(transactionId: string): Promise<ITransaction | null> {
    return await Transaction.findOne({ transactionId });
  }

  async findByUserId(
    userId: string, 
    page: number = 1, 
    limit: number = 10,
    filters?: { category?: string; status?: string; type?: string }
  ): Promise<{ transactions: ITransaction[]; total: number }> {
    const query: any = { primaryUserId: new Types.ObjectId(userId) };
    
    if (filters?.category) query.category = filters.category;
    if (filters?.status) query.status = filters.status;
    if (filters?.type) query.type = filters.type;

    const transactions = await Transaction
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('metadata.bookingId')
      .populate('metadata.theaterId')
      .populate('metadata.movieId');

    const total = await Transaction.countDocuments(query);

    return { transactions, total };
  }

  async findByWalletId(walletId: string): Promise<ITransaction[]> {
    return await Transaction
      .find({ walletId: new Types.ObjectId(walletId) })
      .sort({ createdAt: -1 });
  }

  async updateStatus(
    transactionId: string, 
    status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'processing'
  ): Promise<ITransaction | null> {
    return await Transaction.findOneAndUpdate(
      { transactionId },
      { status, updatedAt: new Date() },
      { new: true }
    );
  }

  async updateTransaction(transactionId: string, updateData: any): Promise<ITransaction | null> {
    return await Transaction.findOneAndUpdate(
      { transactionId },
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );
  }

  async updateNotification(transactionId: string, notificationData: any): Promise<ITransaction | null> {
    return await Transaction.findOneAndUpdate(
      { transactionId },
      { 
        notificationData,
        notificationSent: true,
        'notificationData.sentAt': new Date()
      },
      { new: true }
    );
  }

  async getMonthlyStats(userId: string, year: number, month: number): Promise<any[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    return await Transaction.aggregate([
      {
        $match: {
          primaryUserId: new Types.ObjectId(userId),
          createdAt: { $gte: startDate, $lte: endDate },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);
  }

  async getRevenueStats(ownerId: string, startDate: Date, endDate: Date): Promise<any[]> {
    return await Transaction.aggregate([
      {
        $match: {
          primaryUserId: new Types.ObjectId(ownerId),
          category: 'revenue_share',
          status: 'completed',
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          totalRevenue: { $sum: '$amount' },
          transactionCount: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': -1, '_id.month': -1 }
      }
    ]);
  }
}

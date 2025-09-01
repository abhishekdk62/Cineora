// repositories/walletTransaction.repository.ts
import WalletTransaction from '../models/walletTransaction.model';
import { IWalletTransactionRepository } from '../interfaces/walletTransaction.repository.interface';
import { IWalletTransaction } from '../interfaces/walletTransaction.model.interface';

export class WalletTransactionRepository implements IWalletTransactionRepository {
  async create(data: Partial<IWalletTransaction>): Promise<IWalletTransaction> {
    const transaction = new WalletTransaction(data);
    return transaction.save();
  }

  async findById(id: string): Promise<IWalletTransaction | null> {
    return WalletTransaction.findById(id)
      .populate('movieId', 'title')
      .populate('theaterId', 'name');
  }

  async findByTransactionId(transactionId: string): Promise<IWalletTransaction | null> {
    return WalletTransaction.findOne({ transactionId })
      .populate('movieId', 'title')
      .populate('theaterId', 'name');
  }

  async findByUserId(
    userId: string, 
    page: number = 1, 
    limit: number = 10
  ): Promise<{ transactions: IWalletTransaction[]; total: number }> {
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      WalletTransaction.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('movieId', 'title')
        .populate('theaterId', 'name'),
      WalletTransaction.countDocuments({ userId })
    ]);

    return { transactions, total };
  }

  async findByWalletId(walletId: string): Promise<IWalletTransaction[]> {
    return WalletTransaction.find({ walletId })
      .sort({ createdAt: -1 })
      .populate('movieId', 'title')
      .populate('theaterId', 'name');
  }

  async findByReferenceId(referenceId: string): Promise<IWalletTransaction[]> {
    return WalletTransaction.find({ referenceId })
      .sort({ createdAt: -1 })
      .populate('movieId', 'title')
      .populate('theaterId', 'name');
  }

  async updateStatus(transactionId: string, status: string): Promise<IWalletTransaction | null> {
    return WalletTransaction.findOneAndUpdate(
      { transactionId },
      { status },
      { new: true }
    );
  }
}

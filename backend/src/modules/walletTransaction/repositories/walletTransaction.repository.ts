import WalletTransaction from "../models/walletTransaction.model";
import { IWalletTransactionRepository } from "../interfaces/walletTransaction.repository.interface";
import { IWalletTransaction } from "../interfaces/walletTransaction.model.interface";

export class WalletTransactionRepository
  implements IWalletTransactionRepository
{
  async createWalletTransaction(
    data: Partial<IWalletTransaction>
  ): Promise<IWalletTransaction> {
    const transaction = new WalletTransaction(data);
    return transaction.save();
  }

  async updateWalletTransactionStatus(
    transactionId: string,
    status: string
  ): Promise<IWalletTransaction | null> {
    return WalletTransaction.findOneAndUpdate(
      { transactionId },
      { status },
      { new: true }
    )
      .populate("movieId", "title")
      .populate("theaterId", "name");
  }

  async findWalletTransactionById(
    transactionId: string
  ): Promise<IWalletTransaction | null> {
    return WalletTransaction.findById(transactionId)
      .populate("movieId", "title")
      .populate("theaterId", "name");
  }

  async findWalletTransactionByTransactionId(
    transactionId: string
  ): Promise<IWalletTransaction | null> {
    return WalletTransaction.findOne({ transactionId })
      .populate("movieId", "title")
      .populate("theaterId", "name");
  }

  async findRecentWalletTransaction(userId: string) {
    return await WalletTransaction.findOne({ userId }).sort({ createdAt: -1 });
  }

  async findWalletTransactionsByUserId(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ transactions: IWalletTransaction[]; total: number }> {
    const skipCount = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      WalletTransaction.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skipCount)
        .limit(limit)
        .populate("movieId", "title")
        .populate("theaterId", "name"),
      WalletTransaction.countDocuments({ userId }),
    ]);

    return { transactions, total };
  }

  async findWalletTransactionsByWalletId(
    walletId: string
  ): Promise<IWalletTransaction[]> {
    return WalletTransaction.find({ walletId })
      .sort({ createdAt: -1 })
      .populate("movieId", "title")
      .populate("theaterId", "name");
  }

  async findWalletTransactionsByReferenceId(
    referenceId: string
  ): Promise<IWalletTransaction[]> {
    return WalletTransaction.find({ referenceId })
      .sort({ createdAt: -1 })
      .populate("movieId", "title")
      .populate("theaterId", "name");
  }
}

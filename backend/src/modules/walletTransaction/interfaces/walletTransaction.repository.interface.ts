// interfaces/walletTransaction.repository.interface.ts
import { IWalletTransaction } from "./walletTransaction.model.interface";

export interface IWalletTransactionRepository {
  create(data: Partial<IWalletTransaction>): Promise<IWalletTransaction>;
  findById(id: string): Promise<IWalletTransaction | null>;
  findByTransactionId(transactionId: string): Promise<IWalletTransaction | null>;
  findByUserId(userId: string, page: number, limit: number): Promise<{
    transactions: IWalletTransaction[];
    total: number;
  }>;
  findByWalletId(walletId: string): Promise<IWalletTransaction[]>;
  findByReferenceId(referenceId: string): Promise<IWalletTransaction[]>;
  updateStatus(transactionId: string, status: string): Promise<IWalletTransaction | null>;
}

import { IWalletTransaction } from './walletTransaction.model.interface';

export interface IReadWalletTransactionRepository {
  findWalletTransactionById(transactionId: string): Promise<IWalletTransaction | null>;
   findRecentWalletTransaction(userId: string);
  findWalletTransactionByTransactionId(transactionId: string): Promise<IWalletTransaction | null>;
  findWalletTransactionsByUserId(
    userId: string, 
    page: number, 
    limit: number
  ): Promise<{ transactions: IWalletTransaction[]; total: number }>;
  findWalletTransactionsByWalletId(walletId: string): Promise<IWalletTransaction[]>;
  findWalletTransactionsByReferenceId(referenceId: string): Promise<IWalletTransaction[]>;
}

export interface IWriteWalletTransactionRepository {
  createWalletTransaction(data: Partial<IWalletTransaction>): Promise<IWalletTransaction>;
  updateWalletTransactionStatus(transactionId: string, status: string): Promise<IWalletTransaction | null>;
}

export interface IWalletTransactionRepository 
  extends IReadWalletTransactionRepository, IWriteWalletTransactionRepository {}

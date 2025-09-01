// interfaces/walletTransaction.service.interface.ts
import { ServiceResponse } from '../../../interfaces/interface';

export interface IWalletTransactionService {
  createWalletTransaction(data: {
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
  }): Promise<ServiceResponse>;

  getTransactionById(transactionId: string): Promise<ServiceResponse>;
  getUserTransactions(userId: string, page: number, limit: number): Promise<ServiceResponse>;
  getWalletTransactions(walletId: string): Promise<ServiceResponse>;
}

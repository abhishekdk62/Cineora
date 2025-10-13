import { IWalletTransaction } from './walletTransaction.model.interface';
import { CreateWalletTransactionDto } from '../dto/dto';
import { ApiResponse } from '../../../utils/createResponse';

export interface IWalletTransactionService {
  createWalletTransaction(data: CreateWalletTransactionDto): Promise<ApiResponse<IWalletTransaction>>;
  getRecentTransaction(userId:string);
  getUserWalletTransactions(
    userId: string,
    page: number,
    limit: number
  ): Promise<ApiResponse<{
    transactions: IWalletTransaction[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }>>;
}

import { ITransaction } from "./transactions.model.interface";

export interface ITransactionRepository {
  create(transactionData: Partial<ITransaction>): Promise<ITransaction | null>;
  
  findById(id: string): Promise<ITransaction | null>;
  
  findByTransactionId(transactionId: string): Promise<ITransaction | null>;
  
  findByUserId(
    userId: string, 
    page: number, 
    limit: number,
    filters?: { category?: string; status?: string; type?: string }
  ): Promise<{ transactions: ITransaction[]; total: number }>;
  
  findByWalletId(walletId: string): Promise<ITransaction[]>;
  
  updateStatus(
    transactionId: string, 
    status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'processing'
  ): Promise<ITransaction | null>;
  
  updateTransaction(transactionId: string, updateData: any): Promise<ITransaction | null>;
  
  updateNotification(transactionId: string, notificationData: any): Promise<ITransaction | null>;
  
  getMonthlyStats(userId: string, year: number, month: number): Promise<any[]>;
  
  getRevenueStats(ownerId: string, startDate: Date, endDate: Date): Promise<any[]>;
}

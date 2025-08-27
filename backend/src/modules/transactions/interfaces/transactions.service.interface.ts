// interfaces/transactions.service.interface.ts (add to existing file)
import { ServiceResponse } from "../../../interfaces/interface";

export interface ITransactionService {
  createTransaction(data: {
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
  }): Promise<ServiceResponse>;
  
  processBookingPayment(bookingData: {
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
  }): Promise<ServiceResponse>;
  
  requestPayout(payoutData: {
    ownerId: string;
    amount: number;
    bankDetails: {
      accountNumber: string;
      ifscCode: string;
      accountHolderName: string;
    };
  }): Promise<ServiceResponse>;
  
  getUserTransactions(
    userId: string, 
    page: number, 
    limit: number,
    filters?: any
  ): Promise<ServiceResponse>;
  
  getTransactionById(transactionId: string): Promise<ServiceResponse>;
  
  getUserStats(userId: string): Promise<ServiceResponse>;
  
  getOwnerRevenue(ownerId: string, startDate: Date, endDate: Date): Promise<ServiceResponse>;
  
  processRefund(bookingId: string, refundAmount: number, reason: string): Promise<ServiceResponse>;
}

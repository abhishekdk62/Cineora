export interface CreateTransactionDto {
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
}

export interface BookingPaymentDto {
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
}

export interface PayoutRequestDto {
  ownerId: string;
  amount: number;
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
  };
}

export interface TransactionFiltersDto {
  category?: string;
  status?: string;
  type?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface TransactionQueryDto {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
}

export interface RefundRequestDto {
  bookingId: string;
  refundAmount: number;
  reason: string;
}

export interface TransactionStatsDto {
  userId: string;
  year?: number;
  month?: number;
}

export interface RevenueStatsDto {
  ownerId: string;
  startDate: Date;
  endDate: Date;
}

// Response DTOs
export interface TransactionResponseDto {
  transactionId: string;
  type: 'credit' | 'debit';
  amount: number;
  category: string;
  subCategory?: string;
  description: string;
  status: string;
  createdAt: Date;
  metadata?: any;
}

export interface TransactionListResponseDto {
  transactions: TransactionResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TransactionStatsResponseDto {
  totalCredits: number;
  totalDebits: number;
  transactionCount: number;
  monthlyBreakdown: {
    month: string;
    credits: number;
    debits: number;
    count: number;
  }[];
}

export interface PayoutResponseDto {
  payoutId: string;
  amount: number;
  status: string;
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
  };
  utrNumber?: string;
  createdAt: Date;
}
export interface PayoutRequestDto {
  ownerId: string;
  amount: number;
  bankDetails: {
    accountNumber: string; 
    ifscCode: string;
    accountHolderName: string;
  };
}


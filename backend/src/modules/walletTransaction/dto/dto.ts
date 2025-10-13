
export interface CreateWalletTransactionDto {
  userId: string;
  userModel: 'User' | 'Owner'|'Admin';
  walletId: string;
  type: 'credit' | 'debit';
  amount: number;
  category: 'booking' | 'refund' | 'topup' | 'withdrawal' | 'revenue';
  description: string;
  referenceId?: string;
  movieId?: string;
  theaterId?: string;
  idempotencyKey?:string
}

export interface UpdateWalletTransactionStatusDto {
  transactionId: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface GetUserWalletTransactionsDto {
  userId: string;
  page?: number;
  limit?: number;
}

export interface WalletTransactionPaginationDto {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface WalletTransactionFilterDto {
  userId?: string;
  walletId?: string;
  type?: 'credit' | 'debit';
  category?: 'booking' | 'refund' | 'topup' | 'withdrawal' | 'revenue';
  status?: 'pending' | 'completed' | 'failed';
  referenceId?: string;
  movieId?: string;
  theaterId?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

export interface WalletTransactionResponseDto {
  id: string;
  userId: string;
  userModel: string;
  walletId: string;
  transactionId: string;
  type: string;
  amount: number;
  category: string;
  description: string;
  status: string;
  referenceId?: string;
  movieId?: string;
  theaterId?: string;
  createdAt: Date;
  updatedAt: Date;
}

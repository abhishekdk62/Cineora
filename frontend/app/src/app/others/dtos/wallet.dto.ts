import { ApiResponse, PaginationQuery } from './common.dto';

export interface CreateWalletRequestDto {
  userId: string;
  userModel: 'User' | 'Owner';
  currency?: string;
}

export interface UpdateWalletRequestDto {
  status?: 'active' | 'frozen' | 'closed';
}

export interface CreateWalletTransactionRequestDto {
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
}

export interface GetWalletsQueryDto extends PaginationQuery {
  userId?: string;
  userModel?: 'User' | 'Owner';
  status?: 'active' | 'frozen' | 'closed';
}

export interface GetWalletTransactionsQueryDto extends PaginationQuery {
  userId?: string;
  userModel?: 'User' | 'Owner';
  walletId?: string;
  type?: 'credit' | 'debit';
  category?: 'booking' | 'refund' | 'topup' | 'withdrawal' | 'revenue';
  status?: 'pending' | 'completed' | 'failed';
  dateFrom?: Date;
  dateTo?: Date;
}

export interface CreditWalletRequestDto {
  amount: number;
  type: string;
  description: string;
}

export interface WalletResponseDto {
  _id: string;
  userId: string;
  userModel: 'User' | 'Owner';
  balance: number;
  currency: string;
  status: 'active' | 'frozen' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

export interface WalletTransactionResponseDto {
  _id: string;
  userId: string;
  userModel: 'User' | 'Owner';
  walletId: string;
  transactionId: string;
  type: 'credit' | 'debit';
  amount: number;
  category: 'booking' | 'refund' | 'topup' | 'withdrawal' | 'revenue';
  description: string;
  status: 'pending' | 'completed' | 'failed';
  referenceId?: string;
  movieId?: string;
  theaterId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWalletResponseDto extends ApiResponse<WalletResponseDto> {}
export interface GetWalletResponseDto extends ApiResponse<WalletResponseDto> {}
export interface GetWalletsResponseDto extends ApiResponse<WalletResponseDto[]> {}
export interface UpdateWalletResponseDto extends ApiResponse<WalletResponseDto> {}
export interface CreateWalletTransactionResponseDto extends ApiResponse<WalletTransactionResponseDto> {}
export interface GetWalletTransactionResponseDto extends ApiResponse<WalletTransactionResponseDto> {}
export interface GetWalletTransactionsResponseDto extends ApiResponse<WalletTransactionResponseDto[]> {}
export interface GetWalletUserResponseDto extends ApiResponse<WalletResponseDto> {}
export interface GetTransactionDetailsResponseDto extends ApiResponse<WalletTransactionResponseDto[]> {}
export interface CreditWalletResponseDto extends ApiResponse<WalletTransactionResponseDto> {}

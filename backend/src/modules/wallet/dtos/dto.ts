
export interface CreateWalletDto {
  userId: string;
  userModel: 'User' | 'Owner'|'Admin';
  balance?: number;
  currency?: string;
  status?: 'active' | 'frozen' | 'closed';
}

export interface CreditWalletDto {
  userId: string;
  userModel: 'User' | 'Owner'|'Admin';
  amount: number;
  description?: string;
}

export interface DebitWalletDto {
  userId: string;
  userModel: 'User' | 'Owner'|'Admin';
  amount: number;
  description?: string;
}

export interface UpdateWalletBalanceDto {
  userId: string;
  userModel: 'User' | 'Owner';
  amount: number;
}

export interface GetWalletByUserDto {
  userId: string;
  userModel: 'User' | 'Owner';
}

export interface WalletResponseDto {
  id: string;
  userId: string;
  userModel: string;
  balance: number;
  currency: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WalletBalanceResponseDto {
  balance: number;
}

import { IWallet } from './wallet.model.interface';

export interface IReadWalletRepository {
  findWalletById(walletId: string): Promise<IWallet | null>;
  findWalletByUser(userId: string, userModel: "User" | "Owner"|"Admin"): Promise<IWallet | null>;
  getWalletBalance(userId: string, userModel: "User" | "Owner"|"Admin"): Promise<number>;
}

export interface IWriteWalletRepository {
  createWallet(walletData: Partial<IWallet>): Promise<IWallet | null>;
  updateWalletBalance(userId: string, userModel: "User" | "Owner"|"Admin", amount: number): Promise<IWallet | null>;
  updateWalletBalanceAllowNegative(
    userId: string, 
    userModel: string, 
    amount: number
  ): Promise<IWallet | null>
}

export interface IWalletRepository 
  extends IReadWalletRepository, IWriteWalletRepository {}

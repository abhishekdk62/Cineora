import { IWallet } from './wallet.model.interface';

// Interface Segregation Principle - separate read and write operations
export interface IReadWalletRepository {
  findWalletById(walletId: string): Promise<IWallet | null>;
  findWalletByUser(userId: string, userModel: "User" | "Owner"): Promise<IWallet | null>;
  getWalletBalance(userId: string, userModel: "User" | "Owner"): Promise<number>;
}

export interface IWriteWalletRepository {
  createWallet(walletData: Partial<IWallet>): Promise<IWallet | null>;
  updateWalletBalance(userId: string, userModel: "User" | "Owner", amount: number): Promise<IWallet | null>;
}

export interface IWalletRepository 
  extends IReadWalletRepository, IWriteWalletRepository {}

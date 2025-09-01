import { IWallet } from "./wallet.model.interface";

export interface IWalletRepository {
  create(walletData: Partial<IWallet>): Promise<IWallet | null>;
  
  findByUser(userId: string, userModel: 'User' | 'Owner'): Promise<IWallet | null>;
  
  findById(id: string): Promise<IWallet | null>;
  
  updateBalance(
    userId: string, 
    userModel: 'User' | 'Owner', 
    amount: number
  ): Promise<IWallet | null>;
  
  getBalance(userId: string, userModel: 'User' | 'Owner'): Promise<number>;
  
  freezeWallet(userId: string, userModel: 'User' | 'Owner'): Promise<IWallet | null>;
  
  unfreezeWallet(userId: string, userModel: 'User' | 'Owner'): Promise<IWallet | null>;
}

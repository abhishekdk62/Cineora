import Wallet from "../models/wallet.model";
import { IWalletRepository } from "../interfaces/wallet.repository.interface";
import { IWallet } from "../interfaces/wallet.model.interface";

export class WalletRepository implements IWalletRepository {
  async create(walletData: Partial<IWallet>): Promise<IWallet | null> {
    const wallet = new Wallet(walletData);
    return wallet.save();
  }
  
  async findByUser(userId: string, userModel: 'User' | 'Owner'): Promise<IWallet | null> {
    return Wallet.findOne({ userId, userModel });
  }
  
  async findById(id: string): Promise<IWallet | null> {
    return Wallet.findById(id);
  }
  
  async updateBalance(
    userId: string, 
    userModel: 'User' | 'Owner', 
    amount: number
  ): Promise<IWallet | null> {
    return Wallet.findOneAndUpdate(
      { userId, userModel },
      { $inc: { balance: amount } },
      { new: true }
    );
  }
  
  async getBalance(userId: string, userModel: 'User' | 'Owner'): Promise<number> {
    const wallet = await Wallet.findOne({ userId, userModel });
    return wallet ? wallet.balance : 0;
  }
  
  async freezeWallet(userId: string, userModel: 'User' | 'Owner'): Promise<IWallet | null> {
    return Wallet.findOneAndUpdate(
      { userId, userModel },
      { status: 'frozen' },
      { new: true }
    );
  }
  
  async unfreezeWallet(userId: string, userModel: 'User' | 'Owner'): Promise<IWallet | null> {
    return Wallet.findOneAndUpdate(
      { userId, userModel },
      { status: 'active' },
      { new: true }
    );
  }
}

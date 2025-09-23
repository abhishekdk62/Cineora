import Wallet from "../models/wallet.model";
import { IWalletRepository } from "../interfaces/wallet.repository.interface";
import { IWallet } from "../interfaces/wallet.model.interface";

export class WalletRepository implements IWalletRepository {
  
  async createWallet(walletData: Partial<IWallet>): Promise<IWallet | null> {
    try {
      const wallet = new Wallet(walletData);
      return await wallet.save();
    } catch (error) {
      throw new Error(`Failed to create wallet: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateWalletBalance(
    userId: string,
    userModel: "User" | "Owner"|"Admin",
    amount: number
  ): Promise<IWallet | null> {
    try {
      return await Wallet.findOneAndUpdate(
        { userId, userModel },
        { $inc: { balance: amount } },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Failed to update wallet balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findWalletByUser(
    userId: string,
    userModel: "User" | "Owner"|'Admin'
  ): Promise<IWallet | null> {
    try {
      return await Wallet.findOne({ userId, userModel });
    } catch (error) {
      throw new Error(`Failed to find wallet by user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  async updateWalletBalanceAllowNegative(
  userId: string, 
  userModel: string, 
  amount: number
): Promise<IWallet | null> {
  try {
    return await Wallet.findOneAndUpdate(
      { userId, userModel },
      { 
        $inc: { balance: amount },  // Can go negative
        $set: { updatedAt: new Date() }
      },
      { new: true }
    );
  } catch (error) {
    throw new Error(`Error updating wallet balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}


  async findWalletById(walletId: string): Promise<IWallet | null> {
    try {
      return await Wallet.findById(walletId);
    } catch (error) {
      throw new Error(`Failed to find wallet by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getWalletBalance(
    userId: string,
    userModel: "User" | "Owner"|"Admin"
  ): Promise<number> {
    try {
      const wallet = await Wallet.findOne({ userId, userModel });
      
      return wallet ? wallet.balance : 0;
    } catch (error) {
      throw new Error(`Failed to get wallet balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

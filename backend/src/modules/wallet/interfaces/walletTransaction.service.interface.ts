import { ServiceResponse } from "../../../interfaces/interface";

export interface IWalletService {
  createWallet(userId: string, userModel: 'User' | 'Owner'): Promise<ServiceResponse>;
  
  creditWallet(userId: string, userModel: 'User' | 'Owner', amount: number, description?: string): Promise<ServiceResponse>;
  
  debitWallet(userId: string, userModel: 'User' | 'Owner', amount: number, description?: string): Promise<ServiceResponse>;
  
  getBalance(userId: string, userModel: 'User' | 'Owner'): Promise<ServiceResponse>;
  
  getWalletDetails(userId: string, userModel: 'User' | 'Owner'): Promise<ServiceResponse>;
  
  freezeWallet(userId: string, userModel: 'User' | 'Owner'): Promise<ServiceResponse>;
  
  unfreezeWallet(userId: string, userModel: 'User' | 'Owner'): Promise<ServiceResponse>;
  
  transferMoney(fromUserId: string, toUserId: string, amount: number): Promise<ServiceResponse>;
}

// interfaces/walletTransaction.model.interface.ts
import { Document, Types } from 'mongoose';

export interface IWalletTransaction extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  userModel: 'User' | 'Owner';
  walletId: Types.ObjectId;
  transactionId: string;
  type: 'credit' | 'debit';
  amount: number;
  category: 'booking' | 'refund' | 'topup' | 'withdrawal' | 'revenue';
  description: string;
  status: 'pending' | 'completed' | 'failed';
  referenceId?: string; 
  movieId?: Types.ObjectId;
  theaterId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

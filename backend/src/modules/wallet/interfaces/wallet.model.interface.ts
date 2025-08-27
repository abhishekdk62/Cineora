import mongoose from "mongoose";

export interface IWallet extends Document {
  userId: mongoose.Types.ObjectId;
  userModel: 'User' | 'Owner';
  balance: number;
  currency: string;
  status: 'active' | 'frozen' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

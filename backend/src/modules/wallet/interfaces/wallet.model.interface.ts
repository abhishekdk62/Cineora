import mongoose, { Document } from "mongoose";

export interface IWallet extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  userModel: 'User' | 'Owner'|'Admin';
  isVerified:boolean,
  balance: number;
  currency: string;
  status: 'active' | 'frozen' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

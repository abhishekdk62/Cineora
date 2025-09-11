import mongoose, { Schema } from "mongoose";
import { IWallet } from "../interfaces/wallet.model.interface";

const WalletSchema = new Schema<IWallet>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'userModel',
  },
  userModel: {
    type: String,
    required: true,
    enum: ['User', 'Owner','Admin'],
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  currency: {
    type: String,
    required: true,
    default: 'INR',
  },
  status: {
    type: String,
    enum: ['active', 'frozen', 'closed'],
    default: 'active',
  },
}, {
  timestamps: true,
});

WalletSchema.index({ userId: 1, userModel: 1 }, { unique: true });

export default mongoose.model<IWallet>("Wallet", WalletSchema);

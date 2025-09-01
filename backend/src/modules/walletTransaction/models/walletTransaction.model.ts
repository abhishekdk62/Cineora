// models/walletTransaction.model.ts
import { Schema, model } from "mongoose";
import { IWalletTransaction } from "../interfaces/walletTransaction.model.interface";

const walletTransactionSchema = new Schema<IWalletTransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "userModel",
    },
    userModel: {
      type: String,
      required: true,
      enum: ["User", "Owner"],
    },
    walletId: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },
    transactionId: {
      type: String,
      unique: true,
      required: true,
      default: function () {
        return `WTX_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      },
    },
    type: {
      type: String,
      enum: ["credit", "debit"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      enum: ["booking", "refund", "topup", "withdrawal", "revenue"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "completed",
    },
    referenceId: {
      type: String,
    },
    movieId: {
      type: Schema.Types.ObjectId,
      ref: "Movie",
    },
    theaterId: {
      type: Schema.Types.ObjectId,
      ref: "Theater",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
walletTransactionSchema.index({ userId: 1, createdAt: -1 });
walletTransactionSchema.index({ walletId: 1, createdAt: -1 });
walletTransactionSchema.index({ transactionId: 1 });
walletTransactionSchema.index({ referenceId: 1 });
walletTransactionSchema.index({ status: 1 });

export default model<IWalletTransaction>(
  "WalletTransaction",
  walletTransactionSchema
);

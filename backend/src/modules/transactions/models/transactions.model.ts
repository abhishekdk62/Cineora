import mongoose, { Schema } from "mongoose";
import { ITransaction } from "../interfaces/transactions.model.interface";

const TransactionSchema = new Schema<ITransaction>({
  transactionId: {
    type: String,
    required: true,
    unique: true,
    default: () => `TXN${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`
  },
  primaryUserId: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'primaryUserModel'
  },
  primaryUserModel: {
    type: String,
    required: true,
    enum: ['User', 'Owner']
  },
  secondaryUserId: {
    type: Schema.Types.ObjectId,
    refPath: 'secondaryUserModel'
  },
  secondaryUserModel: {
    type: String,
    enum: ['User', 'Owner']
  },
  walletId: {
    type: Schema.Types.ObjectId,
    ref: 'Wallet',
    required: true
  },
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  balanceBefore: {
    type: Number,
    required: true
  },
  balanceAfter: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['booking', 'refund', 'wallet_topup', 'withdrawal', 'cashback', 'penalty', 'payout', 'revenue_share', 'commission'],
    required: true
  },
  subCategory: {
    type: String,
    enum: ['customer_payment', 'owner_revenue', 'platform_fee', 'payout_request', 'bank_transfer']
  },
  description: {
    type: String,
    required: true
  },
  metadata: {
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking' },
    theaterId: { type: Schema.Types.ObjectId, ref: 'Theater' },
    movieId: { type: Schema.Types.ObjectId, ref: 'Movie' },
    paymentGatewayResponse: Schema.Types.Mixed,
    refundReason: String,
    payoutDetails: {
      bankAccount: String,
      ifscCode: String,
      accountHolderName: String,
      utrNumber: String
    },
    revenueBreakdown: {
      totalAmount: Number,
      platformFee: Number,
      ownerShare: Number,
      taxDeducted: Number
    },
    seats: [String],
    movieTitle: String,
    theaterName: String,
    showDate: String,
    showTime: String
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled', 'processing'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['wallet', 'upi', 'card', 'netbanking', 'bank_transfer']
  },
  referenceId: {
    type: String
  },
  notificationSent: {
    type: Boolean,
    default: false
  },
  notificationData: {
    title: String,
    message: String,
    sentAt: Date
  }
}, {
  timestamps: true
});

TransactionSchema.index({ primaryUserId: 1, createdAt: -1 });
TransactionSchema.index({ walletId: 1, status: 1 });
TransactionSchema.index({ category: 1, createdAt: -1 });
TransactionSchema.index({ transactionId: 1 }, { unique: true });
TransactionSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model<ITransaction>("Transaction", TransactionSchema);

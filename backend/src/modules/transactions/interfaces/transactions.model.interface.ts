import mongoose, { Document, Types } from "mongoose";
import { IWallet } from "../../wallet/interfaces/wallet.model.interface";

export interface ITransaction extends Document {
  transactionId: string;
  primaryUserId: mongoose.Types.ObjectId;
  primaryUserModel: 'User' | 'Owner';
  secondaryUserId?: mongoose.Types.ObjectId;
  secondaryUserModel?: 'User' | 'Owner';
  walletId: mongoose.Types.ObjectId;
  type: 'credit' | 'debit';
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  category: 'booking' | 'refund' | 'wallet_topup' | 'withdrawal' | 'cashback' | 'penalty' | 'payout' | 'revenue_share' | 'commission';
  subCategory?: 'customer_payment' | 'owner_revenue' | 'platform_fee' | 'payout_request' | 'bank_transfer';
  description: string;
  metadata?: {
    bookingId?: mongoose.Types.ObjectId;
    theaterId?: mongoose.Types.ObjectId;
    movieId?: mongoose.Types.ObjectId;
    paymentGatewayResponse?: any;
    refundReason?: string;
    payoutDetails?: {
      bankAccount: string;
      ifscCode: string;
      accountHolderName: string;
      utrNumber?: string;
    };
    revenueBreakdown?: {
      totalAmount: number;
      platformFee: number;
      ownerShare: number;
      taxDeducted?: number;
    };
    seats?: string[];
    movieTitle?: string;
    theaterName?: string;
    showDate?: string;
    showTime?: string;
  };
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'processing';
  paymentMethod?: 'wallet' | 'upi' | 'card' | 'netbanking' | 'bank_transfer';
  referenceId?: string;
  notificationSent: boolean;
  notificationData?: {
    title: string;
    message: string;
    sentAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}
export interface IWalletForTransaction extends IWallet {
  _id: Types.ObjectId; // Explicitly add _id for transaction operations
}


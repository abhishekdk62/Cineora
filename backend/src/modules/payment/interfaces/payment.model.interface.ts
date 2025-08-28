import mongoose, { Document, Types } from "mongoose";

export interface ITransactionDetails {
  gatewayTransactionId?: string;
  gatewayResponse?: any;
  failureReason?: string;
  processingTime?: number;
}

export interface IPayment extends Document {
  paymentId: string;
  bookingId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  
  amount: number;
  currency: string;
  paymentMethod: "upi" | "card" | "netbanking" | "wallet";
  paymentGateway: "razorpay" | "stripe" | "paytm" | "phonepe";
  
  status: "pending" | "processing" | "completed" | "failed" | "cancelled" | "refunded";
  transactionDetails?: ITransactionDetails;
  
  refundAmount?: number;
  refundDate?: Date;
  refundReason?: string;
  refundTransactionId?: string;
  
  initiatedAt: Date;
  completedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

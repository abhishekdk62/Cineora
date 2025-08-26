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
  
  // Payment Details
  amount: number;
  currency: string;
  paymentMethod: "upi" | "card" | "netbanking" | "wallet";
  paymentGateway: "razorpay" | "stripe" | "paytm" | "phonepe";
  
  // Status & Processing
  status: "pending" | "processing" | "completed" | "failed" | "cancelled" | "refunded";
  transactionDetails?: ITransactionDetails;
  
  // Refund Information
  refundAmount?: number;
  refundDate?: Date;
  refundReason?: string;
  refundTransactionId?: string;
  
  // Audit
  initiatedAt: Date;
  completedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

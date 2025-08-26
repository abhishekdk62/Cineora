import mongoose, { Schema } from "mongoose";
import { IPayment, ITransactionDetails } from "../interfaces/payment.model.interface";

const TransactionDetailsSchema = new Schema<ITransactionDetails>({
  gatewayTransactionId: {
    type: String,
  },
  gatewayResponse: {
    type: Schema.Types.Mixed,
  },
  failureReason: {
    type: String,
  },
  processingTime: {
    type: Number, // in milliseconds
  },
});

const PaymentSchema = new Schema<IPayment>({
  paymentId: {
    type: String,
    required: true,
    unique: true,
  },
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
    index: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  
  // Payment Details
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    required: true,
    default: "INR",
  },
  paymentMethod: {
    type: String,
    enum: ["upi", "card", "netbanking", "wallet"],
    required: true,
  },
  paymentGateway: {
    type: String,
    enum: ["razorpay", "stripe", "paytm", "phonepe"],
    required: true,
  },
  
  // Status & Processing
  status: {
    type: String,
    enum: ["pending", "processing", "completed", "failed", "cancelled", "refunded"],
    default: "pending",
    index: true,
  },
  transactionDetails: {
    type: TransactionDetailsSchema,
  },
  
  // Refund Information
  refundAmount: {
    type: Number,
    min: 0,
  },
  refundDate: {
    type: Date,
  },
  refundReason: {
    type: String,
  },
  refundTransactionId: {
    type: String,
  },
  
  // Audit
  initiatedAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  completedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Indexes for performance
PaymentSchema.index({ paymentId: 1 });
PaymentSchema.index({ userId: 1, status: 1 });
PaymentSchema.index({ bookingId: 1 });
PaymentSchema.index({ status: 1, initiatedAt: -1 });

export default mongoose.model<IPayment>("Payment", PaymentSchema);

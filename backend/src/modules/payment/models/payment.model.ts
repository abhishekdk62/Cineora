// models/payment.model.ts
import { Schema, model, Document, Types } from 'mongoose';

// Interface for TypeScript
export interface IPayment extends Document {
  _id: Types.ObjectId;
  paymentId: string;
  userId: Types.ObjectId;
  bookingId?: Types.ObjectId | null;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  
  // Razorpay details
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

// Schema
const paymentSchema = new Schema<IPayment>(
  {
    paymentId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      default: null,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    
    // ✅ Simple Razorpay fields
    razorpayOrderId: {
      type: String,
      required: true,
    },
    razorpayPaymentId: {
      type: String,
      default: null,
    },
    razorpaySignature: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // Auto creates createdAt and updatedAt
  }
);

// Create index for faster queries
paymentSchema.index({ razorpayOrderId: 1 });
paymentSchema.index({ userId: 1, status: 1 });
paymentSchema.index({ razorpayPaymentId: 1 });

export default model<IPayment>('Payment', paymentSchema);

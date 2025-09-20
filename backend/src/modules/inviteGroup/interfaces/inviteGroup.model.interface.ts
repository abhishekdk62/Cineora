// interfaces/inviteGroup.model.interface.ts
import { Document, Types } from 'mongoose';

export interface IInviteGroup extends Document {
  inviteId: string;
  hostUserId: Types.ObjectId;
  showtimeId: Types.ObjectId;
  movieId: Types.ObjectId;
  theaterId: Types.ObjectId;
  screenId: Types.ObjectId;
  minRequiredRating?: number;
  
  requestedSeats: Array<{
    seatNumber: string;
    seatRow: string;
    seatType: 'VIP' | 'Premium' | 'Normal';
    price: number;
    isOccupied: boolean;
  }>;
  
  totalSlotsRequested: number;
  availableSlots: number;
  
  participants: Array<{
    userId: Types.ObjectId;
    joinedAt: Date;
    seatAssigned: string;
    seatIndex: number;
    paymentStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
    razorpayPaymentId?: string;
    razorpayOrderId?: string;
    amount: number;
    paidAt?: Date;
    ticketId?: Types.ObjectId;
    bookingId?: Types.ObjectId;
    role: 'host' | 'member';
  }>;

  // ✅ Coupon Usage Details
  couponUsed?: {
    couponId?: Types.ObjectId;
    couponCode?: string;
    couponName?: string;
    discountPercentage?: number;
    discountAmount?: number;
    appliedAt?: Date;
    _id?: Types.ObjectId;
  };

  // ✅ Price Breakdown Details
  priceBreakdown: {
    originalAmount: number;
    discountedSubtotal: number;
    convenienceFee: number;
    taxes: number;
    totalDiscount: number;
    finalAmount: number;
  };
  
  status: 'pending' | 'active' | 'payment_pending' | 'completed' | 'cancelled' | 'expired';
  totalAmount: number;
  paidAmount: number;
  currency: string;
  showDate: Date;
  showTime: string;
  expiresAt: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

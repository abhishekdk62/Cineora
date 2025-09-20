// dtos/inviteGroup.dto.ts
import { Types } from "mongoose";

export interface CreateInviteGroupDTO {
  hostUserId: Types.ObjectId;
  showtimeId: Types.ObjectId;
  movieId: Types.ObjectId;
  theaterId: Types.ObjectId;
  screenId: Types.ObjectId;
  requestedSeats: {
    seatNumber: string;
    seatRow: string;
    seatType: "VIP" | "Premium" | "Normal";
    price: number;
    isOccupied?: boolean;
  }[];
  totalSlotsRequested: number;
  showDate: Date;
  showTime: string;
  minRequiredRating?: number;
}

export interface AddParticipantDTO {
  userId: Types.ObjectId;
  seatAssigned: string;
  seatIndex: number;
  amount: number;
}

export interface UpdatePaymentStatusDTO {
  paymentStatus: "pending" | "processing" | "completed" | "failed" | "refunded";
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  paidAt?: Date;
}

export interface UpdateInviteStatusDTO {
  status:
    | "pending"
    | "active"
    | "payment_pending"
    | "completed"
    | "cancelled"
    | "expired";
  completedAt?: Date;
  cancelledAt?: Date;
}

export interface InviteGroupFilterDTO {
  status?: (
    | "pending"
    | "active"
    | "payment_pending"
    | "completed"
    | "cancelled"
    | "expired"
  )[];
  minRating?: number;
  showtimeId?: string;
  limit?: number;
  skip?: number;
}

export interface JoinInviteRequestDTO {
  inviteId: string;
  userId: string;
  userRating?: number;
}

// dtos/inviteGroup.dto.ts
export interface CreateInviteRequestDTO {
  inviteId?: string;
  showtimeId: string;
  movieId: string;
  theaterId: string;
  screenId: string;
  requestedSeats: Array<{
    seatNumber: string;
    seatRow: string;
    seatType: 'VIP' | 'Premium' | 'Normal';
    price: number;
    isOccupied: boolean;
  }>;
  totalSlotsRequested: number;
  availableSlots: number;
  showDate: string | Date;
  showTime: string;
  totalAmount: number;
  paidAmount?: number;
  currency?: string;
  
  // ✅ Add missing fields
  priceBreakdown: {
    originalAmount: number;
    discountedSubtotal: number;
    convenienceFee: number;
    taxes: number;
    totalDiscount: number;
    finalAmount: number;
  };
  
  couponUsed?: {
    couponId: string;
    couponCode: string;
    couponName: string;
    discountPercentage: number;
    discountAmount: number;
    appliedAt: Date;
  };
  
  participants: Array<{
    userId: string;
    joinedAt: Date;
    seatAssigned: string;
    seatIndex: number;
    paymentStatus: string;
    amount: number;
    role: string;
  }>;
  
  minRequiredRating?: number;
  status?: string;
}


export interface PaymentInitiationDTO {
  inviteId: string;
  userId: string;
  amount: number;
}

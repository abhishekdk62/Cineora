import mongoose, { Schema } from "mongoose";
import { IInviteGroup } from "../interfaces/inviteGroup.model.interface";

const inviteGroupSchema = new Schema<IInviteGroup>(
  {
    inviteId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    hostUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    showtimeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MovieShowtime",
      required: true,
    },
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    theaterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theater",
      required: true,
    },
    screenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Screen",
      required: true,
    },

    requestedSeats: [
      {
        seatNumber: { type: String, required: true },
        seatRow: { type: String, required: true },
        seatType: {
          type: String,
          enum: ["VIP", "Premium", "Normal"],
          required: true,
        },
        price: { type: Number, required: true, min: 0 },
        isOccupied: { type: Boolean, default: false },
      },
    ],

    totalSlotsRequested: { type: Number, required: true, min: 2, max: 10 },
    availableSlots: { type: Number, required: true },

    participants: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        joinedAt: { type: Date, default: Date.now },
        seatAssigned: String,
        seatIndex: Number,

        paymentStatus: {
          type: String,
          enum: ["pending", "processing", "completed", "failed", "refunded"],
          default: "pending",
        },
        razorpayPaymentId: String,
        razorpayOrderId: String,
        amount: Number,
        paidAt: Date,

        ticketId: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket" },
        bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },

        role: {
          type: String,
          enum: ["host", "member"],
          default: "member",
        },
      },
    ],

    minRequiredRating: {
      type: Number,
    },

    couponUsed: {
      type: {
        couponId: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: "Coupon" 
        },
        couponCode: String,
        couponName: String,
        discountPercentage: Number,
        discountAmount: { type: Number, min: 0 },
        appliedAt: { type: Date, default: Date.now },
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true }
      },
      required: false
    },

    priceBreakdown: {
      type: {
        originalAmount: { 
          type: Number, 
          required: [true, 'Original amount is required'],
          min: [0, 'Original amount must be non-negative']
        },
        discountedSubtotal: { 
          type: Number, 
          required: [true, 'Discounted subtotal is required'],
          min: [0, 'Discounted subtotal must be non-negative']
        },
        convenienceFee: { 
          type: Number, 
          required: [true, 'Convenience fee is required'],
          min: [0, 'Convenience fee must be non-negative']
        },
        taxes: { 
          type: Number, 
          required: [true, 'Taxes amount is required'],
          min: [0, 'Taxes must be non-negative']
        },
        totalDiscount: { 
          type: Number, 
          default: 0, 
          min: [0, 'Total discount must be non-negative']
        },
        finalAmount: { 
          type: Number, 
          required: [true, 'Final amount is required'],
          min: [0, 'Final amount must be non-negative']
        }
      },
      required: true
    },

    status: {
      type: String,
      enum: [
        "pending",
        "active",
        "payment_pending",
        "completed",
        "cancelled",
        "expired",
      ],
      default: "active",
    },

    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    currency: { type: String, default: "INR" },

    showDate: { type: Date, required: true },
    showTime: { type: String, required: true },

    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 3*60 * 60 * 1000),
      index: { expires: 0 },
    },
    completedAt: Date,
    cancelledAt: Date,
  },
  {
    timestamps: true,
  }
);

inviteGroupSchema.index({ hostUserId: 1, status: 1 });
inviteGroupSchema.index({ showtimeId: 1, status: 1 });
inviteGroupSchema.index({ "participants.userId": 1 });

export default mongoose.model<IInviteGroup>("InviteGroup", inviteGroupSchema);

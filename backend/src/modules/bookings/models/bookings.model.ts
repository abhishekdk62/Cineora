import mongoose, { Schema } from "mongoose";
import { IBooking, IContactInfo, IPriceDetails, ISeatPricing, ICouponUsage } from "../interfaces/bookings.model.interface";

const SeatPricingSchema = new Schema<ISeatPricing>({
  rowId: {
    type: String,
    required: true,
  },
  seatType: {
    type: String,
    enum: ["VIP", "Premium", "Normal"],
    required: true,
  },
  basePrice: {
    type: Number,
    required: true,
    min: 0,
  },
  finalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  rowLabel: {
    type: String,
    required: true,
  },
});

const PriceDetailsSchema = new Schema<IPriceDetails>({
  subtotal: {
    type: Number,
    required: true,
    min: 0,
  },
  convenienceFee: {
    type: Number,
    required: true,
    min: 0,
  },
  taxes: {
    type: Number,
    required: true,
    min: 0,
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
  },
  total: {
    type: Number,
    required: true,
    min: 0,
  },
});

const ContactInfoSchema = new Schema<IContactInfo>({
  email: {
    type: String,
    required: true,
  },
});

const CouponUsageSchema = new Schema<ICouponUsage>({
  couponId: {
    type: Schema.Types.ObjectId,
    ref: "Coupon",
    required: false, // Optional
  },
  couponCode: {
    type: String,
    required: false, // Optional
    uppercase: true,
  },
  couponName: {
    type: String,
    required: false, // Optional
  },
  discountPercentage: {
    type: Number,
    required: false, // Optional
    min: 0,
    max: 100,
  },
  discountAmount: {
    type: Number,
    required: false, // Optional
    min: 0,
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
});

const BookingSchema = new Schema<IBooking>({
  bookingId: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  movieId: {
    type: Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  theaterId: {
    type: Schema.Types.ObjectId,
    ref: "Theater",
    required: true,
  },
  screenId: {
    type: Schema.Types.ObjectId,
    ref: "Screen",
    required: true,
  },
  showtimeId: {
    type: Schema.Types.ObjectId,
    ref: "MovieShowtime",
    required: true,
  },
  
  selectedSeats: {
    type: [String],
    required: true,
  },
  selectedSeatIds: {
    type: [String],
    required: true,
  },
  seatPricing: {
    type: [SeatPricingSchema],
    required: true,
  },
  
  priceDetails: {
    type: PriceDetailsSchema,
    required: true,
  },
  
  // OPTIONAL coupon field - only present if coupon was used
  couponUsed: {
    type: CouponUsageSchema,
    required: false, // Completely optional
    default: undefined, // No default value
  },
  
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending",
  },
  paymentId: {
    type: String,
  },
  paymentMethod: {
    type: String,
  },
  
  bookingStatus: {
    type: String,
    enum: ["confirmed", "cancelled", "expired"],
    default: "confirmed",
  },
  
  bookedAt: {
    type: Date,
    default: Date.now,
  },
  cancelledAt: {
    type: Date,
  },
  showDate: {
    type: Date,
    required: true,
  },
  showTime: {
    type: String,
    required: true,
  },
  
  contactInfo: {
    type: ContactInfoSchema,
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model<IBooking>("Booking", BookingSchema);

import mongoose, { Schema } from "mongoose";
import { IBooking, IContactInfo, IPriceDetails, ISeatPricing } from "../interfaces/bookings.model.interface";

const SeatPricingSchema = new Schema<ISeatPricing>({
  seatId: {
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
  phone: {
    type: String,
    required: true,
  },
});

const BookingSchema = new Schema<IBooking>({
  bookingId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  movieId: {
    type: Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
    index: true,
  },
  theaterId: {
    type: Schema.Types.ObjectId,
    ref: "Theater",
    required: true,
    index: true,
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
    index: true,
  },
  
  // Seat Details
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
  
  // Financial Details
  priceDetails: {
    type: PriceDetailsSchema,
    required: true,
  },
  
  // Payment Info
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
  
  // Booking Status
  bookingStatus: {
    type: String,
    enum: ["confirmed", "cancelled", "expired"],
    default: "confirmed",
  },
  
  // Timestamps
  bookedAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  cancelledAt: {
    type: Date,
  },
  showDate: {
    type: Date,
    required: true,
    index: true,
  },
  showTime: {
    type: String,
    required: true,
  },
  
  // Contact Info
  contactInfo: {
    type: ContactInfoSchema,
    required: true,
  },
}, {
  timestamps: true,
});

// Indexes for performance
BookingSchema.index({ userId: 1, bookedAt: -1 });
BookingSchema.index({ bookingId: 1 });
BookingSchema.index({ showtimeId: 1 });
BookingSchema.index({ paymentStatus: 1 });
BookingSchema.index({ bookingStatus: 1 });

export default mongoose.model<IBooking>("Booking", BookingSchema);

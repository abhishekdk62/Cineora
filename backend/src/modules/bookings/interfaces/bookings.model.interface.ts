import mongoose, { Document, Types } from "mongoose";

export interface IPriceDetails {
  subtotal: number;
  convenienceFee: number;
  taxes: number;
  discount: number;
  total: number;
}

export interface IContactInfo {
  email: string;
  phone: string;
}

export interface ISeatPricing {
  seatId: string;
  seatType: "VIP" | "Premium" | "Normal";
  basePrice: number;
  finalPrice: number;
  rowLabel: string;
}

export interface IBooking extends Document {
  bookingId: string;
  userId: mongoose.Types.ObjectId;
  movieId: mongoose.Types.ObjectId;
  theaterId: mongoose.Types.ObjectId;
  screenId: mongoose.Types.ObjectId;
  showtimeId: mongoose.Types.ObjectId;
  
  // Seat Details
  selectedSeats: string[];
  selectedSeatIds: string[];
  seatPricing: ISeatPricing[];
  
  // Financial Details
  priceDetails: IPriceDetails;
  
  // Payment Info
  paymentStatus: "pending" | "completed" | "failed" | "refunded";
  paymentId?: string;
  paymentMethod?: string;
  
  // Booking Status
  bookingStatus: "confirmed" | "cancelled" | "expired";
  
  // Timestamps
  bookedAt: Date;
  cancelledAt?: Date;
  showDate: Date;
  showTime: string;
  
  // Contact Info
  contactInfo: IContactInfo;
  
  createdAt: Date;
  updatedAt: Date;
}

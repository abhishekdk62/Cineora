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
  rowId: string;
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
  
  selectedSeats: string[];
  selectedSeatIds: string[];
  seatPricing: ISeatPricing[];
  
  priceDetails: IPriceDetails;
  
  paymentStatus: "pending" | "completed" | "failed" | "refunded";
  paymentId?: string;
  paymentMethod?: string;
  
  bookingStatus: "confirmed" | "cancelled" | "expired";
  
  bookedAt: Date;
  cancelledAt?: Date;
  showDate: Date;
  showTime: string;
  
  contactInfo: IContactInfo;
  
  createdAt: Date;
  updatedAt: Date;
}

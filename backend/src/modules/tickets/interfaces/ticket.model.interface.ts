import mongoose, { Document } from "mongoose";

export interface ITicket extends Document {
  ticketId: string;
  bookingId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  
  // Seat Details
  seatNumber: string;
  seatType: "VIP" | "Premium" | "Normal";
  price: number;
  
  // Show Details  
  movieTitle: string;
  theaterName: string;
  screenName: string;
  showDate: Date;
  showTime: string;
  
  // Ticket Status
  qrCode?: string;
  isUsed: boolean;
  usedAt?: Date;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

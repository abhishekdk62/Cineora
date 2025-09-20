import mongoose from "mongoose";

export interface ITicket extends Document {
  _id?:string;
  ticketId: string;
  isInvited:boolean,
  bookingId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  movieId: mongoose.Types.ObjectId;
  theaterId: mongoose.Types.ObjectId;
  screenId: mongoose.Types.ObjectId;
  showtimeId: mongoose.Types.ObjectId;
  seatNumber: string;
  seatRow: string;
  seatType: "VIP" | "Premium" | "Normal";
  price: number;
  inviteGroupId:mongoose.Types.ObjectId;
  showDate: Date;
  showTime: string;
  status: "confirmed" | "cancelled" | "used" | "expired";
  qrCode?: string;
  isUsed: boolean;
  usedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  couponId:mongoose.Types.ObjectId;
}

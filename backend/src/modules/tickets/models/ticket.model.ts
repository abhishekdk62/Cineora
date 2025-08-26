import mongoose, { Schema, Document } from "mongoose";
import { ITicket } from "../interfaces/ticket.model.interface";

const TicketSchema = new Schema<ITicket>({
  ticketId: {
    type: String,
    required: true,
    unique: true,
  },
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
    index: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User", 
    required: true,
    index: true,
  },
  seatNumber: {
    type: String,
    required: true,
  },
  seatType: {
    type: String,
    enum: ["VIP", "Premium", "Normal"],
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  
  movieTitle: {
    type: String,
    required: true,
  },
  theaterName: {
    type: String,
    required: true,
  },
  screenName: {
    type: String,
    required: true,
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
  
  qrCode: {
    type: String,
  },
  isUsed: {
    type: Boolean,
    default: false,
  },
  usedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

TicketSchema.index({ bookingId: 1 });
TicketSchema.index({ userId: 1, showDate: 1 });
TicketSchema.index({ ticketId: 1 });

export default mongoose.model<ITicket>("Ticket", TicketSchema);

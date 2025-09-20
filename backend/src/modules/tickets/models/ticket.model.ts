import mongoose, { Schema } from "mongoose";
import { ITicket } from "../interfaces/ticket.model.interface";

const TicketSchema = new Schema<ITicket>(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
    },
    isInvited: {
      type: Boolean,
      default: false,
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
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

    seatNumber: {
      type: String,
      required: true,
    },
    seatRow: {
      type: String,
      required: true,
    },
    seatType: {
      type: String,
      enum: ["VIP", "Premium", "Normal"],
      required: true,
    },

    inviteGroupId: {
      type: Schema.Types.ObjectId,
      ref: "InviteGroup",
      default: null,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    showDate: {
      type: Date,
      required: true,
    },
    showTime: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["confirmed", "cancelled", "used", "expired"],
      default: "confirmed",
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
    couponId: {
      type: Schema.Types.ObjectId,
      ref: "Coupon",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITicket>("Ticket", TicketSchema);

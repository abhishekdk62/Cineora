import mongoose, { Schema, Document } from "mongoose";
import {
  IMovieShowtime,
  IRowPricing,
  ISeatBlock,
} from "../interfaces/showtimes.model.interfaces";

const SeatBlockSchema = new Schema<ISeatBlock>({
  seatId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  sessionId: {
    type: String,
    required: true,
  },
  blockedAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 },
  },
});

const RowPricingSchema = new Schema<IRowPricing>({
  rowLabel: {
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
  showtimePrice: {
    type: Number,
    required: true,
    min: 0,
  },
  totalSeats: {
    type: Number,
    required: true,
    min: 0,
  },
 
  availableSeats: {
    type: Number,
    required: true,
    min: 0,
  },
  
  bookedSeats: {
    type: [String],
    default: [],
  },
});

const MovieShowtimeSchema = new Schema<IMovieShowtime>(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
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
      ref: "Screen", // Reference to your existing Screen model
      required: true,
      index: true,
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
    endTime: {
      type: String,
      required: true,
    },
    format: {
      type: String,
      enum: ["2D", "3D", "IMAX", "4DX", "Dolby Atmos"],
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    rowPricing: {
      type: [RowPricingSchema],
      required: true,
    },
    totalSeats: {
      type: Number,
      required: true,
      min: 0,
    },
    availableSeats: {
      type: Number,
      required: true,
      min: 0,
    },
    bookedSeats: {
      type: [String],
      default: [],
    },
    blockedSeats: {
      type: [SeatBlockSchema],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    ageRestriction:{
      type:Number,
      default:null
    }
  },
  {
    timestamps: true,
  }
);

MovieShowtimeSchema.index({ movieId: 1, theaterId: 1, showDate: 1 });
MovieShowtimeSchema.index({ theaterId: 1, screenId: 1, showDate: 1 });
MovieShowtimeSchema.index({ showDate: 1, isActive: 1 });

export default mongoose.model<IMovieShowtime>(
  "MovieShowtime",
  MovieShowtimeSchema
);

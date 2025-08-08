import mongoose, { Schema } from "mongoose";
import { ITheater } from "../interfaces/theater.interface";

const TheaterSchema: Schema = new Schema<ITheater>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "Owner", required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    phone: { type: String, required: true },
    facilities: {
      type: [String],
      default: [],
    },
    screens: { type: Number,default:0 },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
  },

  {
    timestamps: true,
  }
);
TheaterSchema.index({ location: "2dsphere" });
TheaterSchema.index({ name: 1, city: 1, state: 1 }, { unique: true });

export const Theater= mongoose.model<ITheater>("Theater", TheaterSchema);

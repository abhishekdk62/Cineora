import Mongoose from "mongoose";
import mongoose from "mongoose";  
import { IScreen } from "../interfaces/screens.model.interface";

const screenSchema = new Mongoose.Schema<IScreen>(
  {
    theaterId: { 
      type: Mongoose.Schema.Types.ObjectId, 
      ref: 'Theater', 
      required: true 
    },
    name: { type: String, required: true },
    totalSeats: { type: Number, required: true },
    layout: {
      rows: { type: Number, required: true },
      seatsPerRow: { type: Number, required: true },
      advancedLayout: { type: Object, required: true }, 
      seatMap: { type: Object } 
    },
    screenType: { type: String },
    features: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const Screen = mongoose.model<IScreen>("Screen", screenSchema);


import Mongoose from "mongoose";
import { IScreen } from "../interfaces/screens.interface";

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
    isActive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default Mongoose.model<IScreen>("Screen", screenSchema);

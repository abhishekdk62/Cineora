import Mongoose from "mongoose";
import mongoose from "mongoose";  
import { IScreen } from "../interfaces/screens.model.interface";

const verticalAisleSchema = new Mongoose.Schema({
  id: { type: String, required: true },
  position: { type: Number, required: true, min: 1 },
  width: { type: Number, required: true, min: 1, max: 2 }
}, { _id: false });

const horizontalAisleSchema = new Mongoose.Schema({
  id: { type: String, required: true },
  afterRow: { type: Number, required: true, min: 0 },
  width: { type: Number, required: true, min: 1, max: 2 }
}, { _id: false });

const seatSchema = new Mongoose.Schema({
  col: { type: Number, required: true },
  id: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true, min: 0 }
}, { _id: false });

const rowSchema = new Mongoose.Schema({
  rowLabel: { type: String, required: true },
  offset: { type: Number, required: true, min: 0 },
  seats: [seatSchema]
}, { _id: false });

const screenSchema = new Mongoose.Schema<IScreen>(
  {
    theaterId: { 
      type: Mongoose.Schema.Types.ObjectId, 
      ref: 'Theater', 
      required: true 
    },
    name: { type: String, required: true },
    totalSeats: { type: Number, required: true, min: 1 },
    layout: {
      rows: { type: Number, required: true, min: 1 },
      seatsPerRow: { type: Number, required: true, min: 1 },
      advancedLayout: {
        rows: {
          type: [rowSchema],
          required: true,
          validate: {
            validator: function(rows: any[]) {
              return rows && rows.length > 0;
            },
            message: 'At least one row is required'
          }
        },
        aisles: {
          type: {
            vertical: [verticalAisleSchema],
            horizontal: [horizontalAisleSchema]
          },
          default: {
            vertical: [],
            horizontal: []
          }
        }
      },
      seatMap: { type: Object } 
    },
    screenType: { type: String, default: 'Standard' },
    features: {
      type: [String],
      default: []
    },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

screenSchema.index({ theaterId: 1, name: 1 });

export const Screen = mongoose.model<IScreen>("Screen", screenSchema);

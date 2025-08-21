import mongoose,{ Document, Types } from "mongoose";

export interface IScreen extends Document {
  theaterId: Types.ObjectId;
  name: string;
  totalSeats: number;
  layout: {
    rows: number;
    seatsPerRow: number;
    advancedLayout: {
      rows: {
        rowLabel: string;
        offset: number;
        seats: {
          col: number;
          id: string;
          type: string;
          price: number;
        }[];
      }[];
    };
    seatMap?: any; // Keep for backward compatibility
  };
  screenType?: string; // Made optional since it's not in frontend
  features?: string[]; // Made optional since it's not in frontend
  isActive: boolean;
  createdAt?: Date; // Added from frontend interface
  updatedAt?: Date; // Added from frontend interface
}
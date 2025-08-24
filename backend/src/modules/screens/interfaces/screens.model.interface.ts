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
    seatMap?: any; 
  };
  screenType?: string; 
  features?: string[]; 
  isActive: boolean;
  createdAt?: Date; 
  updatedAt?: Date; 
}
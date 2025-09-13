import mongoose, { Document, Types } from "mongoose";

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
      // ADD THIS: Aisle configuration (optional for backwards compatibility)
      aisles?: {
        vertical: {
          id: string;
          position: number;
          width: number;
        }[];
        horizontal: {
          id: string;
          afterRow: number;
          width: number;
        }[];
      };
    };
    seatMap?: any; 
  };
  screenType?: string; 
  features?: string[]; 
  isActive: boolean;
  createdAt?: Date; 
  updatedAt?: Date; 
}

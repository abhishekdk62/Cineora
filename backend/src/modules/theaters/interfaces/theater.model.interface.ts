import mongoose, { Document,Types } from "mongoose";

export interface ITheater extends Document {
  ownerId: Types.ObjectId;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  phone: string;
  facilities: string[];
  screens: number;
  isActive: boolean;
  isRejected: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}


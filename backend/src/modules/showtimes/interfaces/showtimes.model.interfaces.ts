import mongoose, { Document, Types } from "mongoose";

export interface ISeatBlock {
  seatId: string;
  userId: string;
  sessionId: string;
  blockedAt: Date;
  expiresAt: Date;
}

export interface IRowPricing {
  rowLabel: string;
  seatType: "VIP" | "Premium" | "Normal";
  basePrice: number;
  showtimePrice: number;
  totalSeats: number;
  availableSeats: number;
  bookedSeats?: string[];
}

export interface IMovieShowtime extends Document {
  ownerId: mongoose.Types.ObjectId;
  movieId: mongoose.Types.ObjectId;
  theaterId: mongoose.Types.ObjectId;
  screenId: mongoose.Types.ObjectId;
  showDate: Date;
  showTime: string;
  endTime: string;
  format: "2D" | "3D" | "IMAX" | "4DX" | "Dolby Atmos";
  language: string;
  rowPricing: IRowPricing[];
  totalSeats: number;
  ageRestriction: number | null;
  availableSeats: number;
  bookedSeats: string[];
  blockedSeats: ISeatBlock[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

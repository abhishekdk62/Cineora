import { IScreen } from "../Screens/inedx";

export interface ISeatBlock {
  seatId: string;
  userId: string;
  sessionId: string;
  blockedAt: Date;
  expiresAt: Date;
}

export interface IRowPricing {
  _id?: string;
  rowLabel: string;
  seatType: "VIP" | "Premium" | "Normal";
  basePrice: number;
  showtimePrice: number;
  totalSeats: number;
  availableSeats: number;
  bookedSeats: string[];
}

export interface IShowtime {
  _id: string;
  ownerId: string;
  movieId: string | IMovie; // Can be populated
  theaterId: string | ITheater; // Can be populated
  screenId: string | IScreen; // Can be populated
  showDate: string; // ISO date string
  showTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  format: "2D" | "3D" | "IMAX" | "4DX" | "Dolby Atmos";
  language: string;
  rowPricing: IRowPricing[];
  totalSeats: number;
  availableSeats: number;
  bookedSeats: string[];
  blockedSeats: ISeatBlock[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface IMovie {
  _id: string;
  title: string;
  duration: number; // in minutes
  language: string;
  // Add other movie fields as needed
  createdAt: string;
  updatedAt: string;
}

export interface ITheater {
  _id: string;
  name: string;
  location: string;
  // Add other theater fields as needed
  createdAt: string;
  updatedAt: string;
}


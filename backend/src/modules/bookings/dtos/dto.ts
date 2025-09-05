import { Request } from "express";
import { IBooking } from "../interfaces/bookings.model.interface";

// Authentication interface
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

// Request DTOs
export interface CreateBookingDto {
  userId?: string;
  bookingId?:string;
  movieId: string;
  paymentStatus?:any;
  bookingStatus?:any;
  theaterId: string;
  screenId: string;
  showtimeId: string;
  selectedSeats?: string[];
  // FIX: Update selectedRows to match ticket service expectations
  selectedRows?: Array<{
    rowLabel: string;
    seatsSelected: number[]; // Changed from string[] to number[]
    seatType: "VIP" | "Premium" | "Normal"; // Added required property
    pricePerSeat: number; // Added required property
  }>;
  selectedSeatIds: string[];
  seatPricing: Array<{
    rowId: string;
    seatType: "VIP" | "Premium" | "Normal";
    basePrice: number;
    finalPrice: number;
    rowLabel: string;
  }>;
  priceDetails: {
    subtotal: number;
    convenienceFee: number;
    taxes: number;
    discount?: number;
    total: number;
  };
  showDate: string;
  showTime: string;
  contactInfo: {
    email: string;
  };
  paymentMethod?: string;
  movieTitle?: string;
  theaterName?: string;
}


export interface UpdateBookingDto {
  bookingStatus?: "confirmed" | "cancelled" | "expired";
  paymentStatus?: "pending" | "completed" | "failed" | "refunded";
  paymentId?: string;
  paymentMethod?: string;
  cancelledAt?: Date;
}

export interface UpdatePaymentStatusDto {
  paymentStatus: string;
  paymentId?: string;
}

export interface BookingParamsDto {
  bookingId?: string;
  userId?: string;
  showtimeId?: string;
}

// Response DTOs
export interface BookingResponseDto extends IBooking {}

// Repository Result DTOs
export interface BookingRepositoryFindResult {
  bookings: IBooking[];
  total: number;
  page: number;
  totalPages: number;
}

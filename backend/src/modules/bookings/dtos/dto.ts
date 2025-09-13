import { Request } from "express";
import { IBooking } from "../interfaces/bookings.model.interface";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export interface CreateBookingDto {
  userId?: string;
  bookingId?: string;
  movieId: string;
  appliedCoupon?: {
    _id:string;
    discountPercentage?: number;
    name?: string;
    uniqueId?: string;
  };
  paymentStatus?: any;
  bookingStatus?: any;
  theaterId: string;
  screenId: string;
  showtimeId: string;
  selectedSeats?: string[];
  selectedRows?: Array<{
    rowLabel: string;
    seatsSelected: number[];
    seatType: "VIP" | "Premium" | "Normal";
    pricePerSeat: number;
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
  amount: number;
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

export interface BookingResponseDto extends IBooking {}

export interface BookingRepositoryFindResult {
  bookings: IBooking[];
  total: number;
  page: number;
  totalPages: number;
}

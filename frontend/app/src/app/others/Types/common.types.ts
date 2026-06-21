import type { CSSProperties } from "react";
import type { CouponData, SeatBreakdownItem } from "./index";
import type { ShowtimeResponseDto } from "../dtos/showtime.dto";

/** Inline Lexend style object used by Owner analytics sections */
export type LexendFontStyle = Pick<CSSProperties, "fontFamily" | "fontWeight">;

/** Next.js google font instance (className + style) */
export interface NextFontInstance {
  className: string;
  style: { fontFamily: string; fontWeight?: number | string };
}

export type LexendFont = LexendFontStyle | NextFontInstance;

export interface GroupInviteSeatData {
  seatNumber: string;
  seatType: "VIP" | "Premium" | "Normal";
  price: number;
}

export interface GroupInviteData {
  movieTitle: string;
  moviePoster?: string;
  movieRating: string;
  theaterName: string;
  screenName: string;
  showDate: string;
  showTime: string;
  format?: string;
  language?: string;
  hostSeat: GroupInviteSeatData;
  availableSeats: GroupInviteSeatData[];
  totalSeats: number;
  totalAmount: number;
  totalSeatPrice?: number;
  subtotal: number;
  convenienceFee: number;
  taxes: number;
  discount: number;
  finalTotal: number;
  hostAmount: number;
  finalHostAmount: number;
  availableAmount: number;
  finalAvailableAmount: number;
  minRating?: number;
  selectedSeats: GroupInviteSeatData[];
  showtimeId?: string;
  movieId?: string;
  theaterId?: string;
  screenId?: string;
}

export interface PaymentSummaryData {
  movieTitle: string;
  moviePoster?: string;
  movieRating: string | number;
  theaterName: string;
  screenName: string;
  showDate: string;
  showTime: string;
  format?: string;
  language?: string;
  selectedSeats: string[];
  seatBreakdown: SeatBreakdownItem[];
  subtotal: number;
  convenienceFee: number;
  taxes: number;
  discount?: number;
  total: number;
  savings?: number;
  selectedCoupon?: CouponData | null;
  availableCoupons?: CouponData[];
}

export type OwnerShowtimeBooking = ShowtimeResponseDto;

export interface OwnerBookingRecord {
  _id?: string;
  bookingId?: string;
  userId?: { _id?: string; email?: string } | string;
  contactInfo?: { email?: string; phone?: string };
  selectedSeats?: string[];
  priceDetails?: {
    subtotal?: number;
    taxes?: number;
    convenienceFee?: number;
    total?: number;
    discount?: number;
  };
  paymentStatus?: string;
  paymentMethod?: string;
  bookingStatus?: string;
  bookedAt?: string | Date;
  showDate?: string | Date;
  showTime?: string;
  cancelledAt?: string | Date;
  isGroupBooking?: boolean;
  groupMembers?: Array<{ email?: string; seats?: string[] }>;
  couponUsed?: {
    name?: string;
    uniqueId?: string;
    discountPercentage?: number;
    discountAmount?: number;
  };
}

export interface TheaterSearchResult {
  id?: number;
  _id?: string;
  name: string;
  location?: string;
  screens?: number;
  amenities?: string[];
  distance?: string;
  image?: string;
  poster?: string;
  title?: string;
}

/** Extract _id from a populated ref or return the string id */
export function getRefId<T extends { _id: string }>(value: string | T): string {
  return typeof value === "object" && value !== null ? value._id : value;
}

/** Type guard for populated document refs (movieId, theaterId, screenId, userId, etc.) */
export function isPopulatedRef<T extends object>(
  value: string | T | null | undefined
): value is T {
  return typeof value === "object" && value !== null;
}

export interface BookingFilters {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
  ownerId?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface ApiError {
  response?: { data?: { message?: string } };
  message?: string;
}

export function getApiErrorMessage(error: unknown, fallback = "An error occurred"): string {
  if (error && typeof error === "object") {
    const apiError = error as ApiError;
    if (apiError.response?.data?.message) {
      return apiError.response.data.message;
    }
    if ("message" in error && typeof (error as { message: unknown }).message === "string") {
      return (error as { message: string }).message;
    }
  }
  return fallback;
}

export interface AnalyticsBookingRecord {
  userId?: string;
  bookedAt?: string | Date;
  priceDetails?: {
    subtotal?: number;
    convenienceFee?: number;
    taxes?: number;
    discount?: number;
    total?: number;
  };
  bookingStatus?: string;
  movieId?:
    | string
    | {
        _id?: string;
        title?: string;
        language?: string;
        genre?: string[];
      };
  theaterId?:
    | string
    | {
        _id?: string;
        name?: string;
        city?: string;
        state?: string;
        phone?: string;
      };
  screenId?: string | { name?: string };
  showDate?: string | Date;
  showTime?: string;
  selectedSeats?: string[];
  paymentStatus?: string;
  paymentMethod?: string;
  contactInfo?: { email?: string; phone?: string };
  showtimeId?: string | { ownerId?: string };
  bookingId?: string;
}

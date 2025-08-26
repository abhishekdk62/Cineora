export interface CreateBookingDto {
  userId: string;
  movieId: string;
  theaterId: string;
  screenId: string;
  showtimeId: string;
  selectedSeats: string[];
  selectedSeatIds: string[];
  seatPricing: Array<{
    seatId: string;
    seatType: "VIP" | "Premium" | "Normal";
    basePrice: number;
    finalPrice: number;
    rowLabel: string;
  }>;
  priceDetails: {
    subtotal: number;
    convenienceFee: number;
    taxes: number;
    discount: number;
    total: number;
  };
  paymentMethod: string;
  showDate: Date;
  showTime: string;
  contactInfo: {
    email: string;
    phone: string;
  };
}

export interface BookingResponseDto {
  bookingId: string;
  userId: string;
  movieTitle: string;
  theaterName: string;
  screenName: string;
  selectedSeats: string[];
  showDate: string;
  showTime: string;
  totalAmount: number;
  paymentStatus: string;
  bookingStatus: string;
  bookedAt: string;
}

export interface CancelBookingDto {
  bookingId: string;
  userId: string;
  reason?: string;
}

export interface UpdatePaymentStatusDto {
  bookingId: string;
  paymentStatus: "pending" | "completed" | "failed" | "refunded";
  paymentId?: string;
}

export interface UserBookingsQueryDto {
  page?: number;
  limit?: number;
  status?: "confirmed" | "cancelled" | "expired";
}

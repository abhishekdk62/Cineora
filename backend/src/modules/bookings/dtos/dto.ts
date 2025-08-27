// Selected row interface for row-based seat selection
export interface SelectedRow {
  rowId: string;
  rowLabel: string;
  seatsSelected: string[];
  seatCount: number;
  seatType: "VIP" | "Premium" | "Normal";
  pricePerSeat: number;
  totalPrice: number;
}

// Create booking DTO
export interface CreateBookingDto {
  userId: string;
  movieId: string;
  theaterId: string;
  screenId: string;
  showtimeId: string;
  
  // Row-based selection (NEW)
  selectedRows?: SelectedRow[];
  
  // Legacy support
  selectedSeats?: string[];
  selectedSeatIds?: string[];
  seatPricing?: any[];
  
  priceDetails: {
    subtotal: number;
    convenienceFee: number;
    taxes: number;
    discount: number;
    total: number;
  };
  
  showDate: Date;
  showTime: string;
  paymentMethod?: string;
  paymentGateway?: string;
  contactInfo?: {
    email: string;
    phone: string;
  };
}

// Update payment status DTO
export interface UpdatePaymentStatusDto {
  paymentStatus: "pending" | "completed" | "failed" | "refunded";
  paymentId?: string;
  transactionId?: string;
  gatewayResponse?: any;
  failureReason?: string;
  refundAmount?: number;
  refundReason?: string;
}

// Cancel booking DTO
export interface CancelBookingDto {
  bookingId: string;
  userId: string;
  reason?: string;
}

// Booking response DTO
export interface BookingResponseDto {
  bookingId: string;
  userId: string;
  movieTitle: string;
  theaterName: string;
  selectedSeats: string[];
  showDate: string;
  showTime: string;
  totalAmount: number;
  paymentStatus: string;
  bookingStatus: string;
  bookedAt: string;
}

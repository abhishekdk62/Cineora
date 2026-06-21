import { ITicket } from "../interfaces/ticket.model.interface";

export interface CreateTicketDto {
  ticketId: string;
  bookingId: string;
  userId: string;
  movieId: string;
  theaterId: string;
  screenId: string;
  showtimeId: string;
  seatNumber: string;
  seatRow: string;
  seatType: "VIP" | "Premium" | "Normal";
  price: number;
  showDate: Date;
  showTime: string;
  status?: "confirmed" | "cancelled" | "used" | "expired";
  qrCode?: string;
}
export interface CancelSingleTicketDto {
  ticketIds: string[];
  userId: string;
  totalAmount: number;
}

export interface CancelSingleTicketDto {
  ticketIds: string[];
  userId: string;
  totalAmount: number;
}

export interface CancelSingleTicketRequestDto {
  ticketIds: string[];
  totalAmount: number;
  reason?: string; 
  cancelledSeats?: string[];
}

export interface SingleTicketCancellationResponseDto {
  cancelledTickets: TicketResponseDto[];
  ticketCount: number;
  refundDetails: {
    originalAmount: number;
    refundAmount: number;
    refundPercentage: number;
    cancellationFee: number;
  };
  showDetails: {
    showDate: Date;
    showTime: string;
  };
  walletCredited: boolean;
}

export interface RefundCalculationDto {
  cancelledTickets: ITicket[];
  refundPercentage: number;
  originalAmount: number;
  refundAmount: number;
  showDate: Date;
  showTime: string;
  movieId?: string;
  theaterId?: string;
  totalAmount?: number;
}

export interface UpdateTicketDto {
  seatNumber?: string;
  seatRow?: string;
  seatType?: "VIP" | "Premium" | "Normal";
  price?: number;
  showDate?: Date;
  showTime?: string;
  status?: "confirmed" | "cancelled" | "used" | "expired";
  qrCode?: string;
}

export interface CreateBulkTicketsDto {
  tickets: CreateTicketDto[];
}

export interface ValidateTicketDto {
  ticketId: string;
  qrCode: string;
}

export interface GetTicketsByUserDto {
  userId: string;
  page?: number;
  limit?: number;
}

export interface TicketFilterDto {
  userId?: string;
  bookingId?: string;
  movieId?: string;
  theaterId?: string;
  screenId?: string;
  status?: "confirmed" | "cancelled" | "used" | "expired";
  isUsed?: boolean;
  startDate?: Date;
  endDate?: Date;
  seatType?: "VIP" | "Premium" | "Normal";
  page?: number;
  limit?: number;
}

export interface TicketResponseDto {
  id?: string;
  ticketId: string;
  bookingId: string | { _id?: string; toString?: () => string };
  userId: string;
  movieId: string;
  theaterId: string;
  screenId: string;
  showtimeId: string;
  seatNumber: string;
  seatRow: string;
  seatType: string;
  price: number;
  showDate: Date;
  showTime: string;
  status: string;
  qrCode?: string;
  isUsed: boolean;
  usedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  movieTitle?: string;
  refundAmount?: number;
  refundPercentage?: number;
  cancelledTickets?: ITicket[] | TicketResponseDto[];
  message?: string;
  data?: unknown;
}

export interface PaginatedTicketsResponseDto {
  tickets: TicketResponseDto[];
  total: number;
  page: number;
  totalPages: number;
}

export interface TicketValidationResponseDto {
  isValid: boolean;
  ticket?: TicketResponseDto;
  message: string;
}

export interface CreateTicketFromRowsDto {
  bookingId: string;
  isInvited:boolean;
  selectedRows: {
    rowLabel: string;
    seatsSelected: number[];
    seatType: "VIP" | "Premium" | "Normal";
    pricePerSeat: number;
  }[];
  bookingInfo: {
    userId: string;
    movieId: string;
    theaterId: string;
    screenId: string;
    showtimeId: string;
    showDate: Date;
    showTime: string;
    email: string;
    couponId?:string
  };
}
export interface DecryptedQRData {
  tid: string;
  dt?: string;
  tm?: string;
}

export interface TicketVerificationData {
  ticketData: DecryptedQRData;
  databaseTicket: ITicket;
}

export interface UserTicketsResult {
  tickets: ITicket[];
  total: number;
  page: number;
  totalPages: number;
}

export interface bookingInfo {
  userId: string;
  movieId: string;
  theaterId: string;
  screenId: string;
  showtimeId: string;
  showDate: Date;
  showTime: string;
  email: string;
  _id?: string;
  bookingId?: string;
  selectedSeats?: string[];
  selectedSeatIds?: string[];
  seatPricing?: number[] | Array<{
    rowId: string;
    seatType: "VIP" | "Premium" | "Normal";
    basePrice: number;
    finalPrice: number;
    rowLabel: string;
  }>;
  priceDetails?: {
    subtotal: number;
    convenienceFee: number;
    taxes: number;
    discount?: number;
    total: number;
  } | number;
  paymentStatus?: string;
  paymentMethod?: string;
  bookingStatus?: "confirmed" | "cancelled" | "expired";
  contactInfo?: { email: string };
  appliedCoupon?: {
    _id: string;
    discountPercentage?: number;
    name?: string;
    uniqueId?: string;
  };
  couponUsed?: boolean;
  discountApplied?: number;
  cancelledAt?: Date;
}

export interface CreateTicketFromBookingDto {
  bookingId: string;
  bookingData: {
    userId: string;
    movieId: string;
    theaterId: string;
    screenId: string;
    showtimeId: string;
    selectedSeats: string[];
    seatBreakdown: {
      type: "VIP" | "Premium" | "Normal";
      price: number;
    }[];
    showDate: Date;
    showTime: string;
    couponId:string;
  };
}

export interface CancelTicketDto {
  bookingId: string;
  userId: string;
  amount: number;
}

export interface GetUserTicketsDto {
  userId: string;
  page?: number;
  limit?: number;
  types?: ("upcoming" | "history" | "cancelled" | "all")[];
}

export interface GetUserTicketsFilterDto {
  userId: string;
  page?: number;
  limit?: number;
  status?: "confirmed" | "cancelled" | "used" | "expired";
  isUsed?: boolean;
  startDate?: Date;
  endDate?: Date;
  movieId?: string;
  theaterId?: string;
}

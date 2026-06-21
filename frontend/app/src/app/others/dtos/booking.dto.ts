import { ApiResponse } from './common.dto';

export interface InviteSeatDetail {
  seatNumber: string;
  seatType: 'VIP' | 'Premium' | 'Normal';
  price: number;
}

export interface CreateInviteGroupRequestDto {
  showtimeId?: string;
  movieId?: string;
  theaterId?: string;
  screenId?: string;
  selectedSeats?: InviteSeatDetail[];
  totalSlotsRequested?: number;
  minRequiredRating?: number;
  inviteId?: string;
  hostUserId?: string;
  requestedSeats?: Array<{
    seatNumber: string;
    seatRow: string;
    seatType: string;
    price: number;
    isOccupied: boolean;
  }>;
  availableSlots?: number;
  showDate?: Date | string;
  showTime?: string;
  totalAmount?: number;
  paidAmount?: number;
  currency?: string;
  couponUsed?: Record<string, unknown>;
  priceBreakdown?: Record<string, number>;
  participants?: Array<Record<string, unknown>>;
  status?: string;
  [key: string]: unknown;
}

export interface InviteGroupData {
  inviteId?: string;
  _id?: string;
  inviteGroupId?: string;
  participants?: Array<{ userId: string; [key: string]: unknown }>;
  [key: string]: unknown;
}

export interface InviteGroupResponseDto {
  success?: boolean;
  message?: string;
  data?: InviteGroupData;
}

/** Payload sent to the booking API (redux booking state + optional flags). */
export type BookTicketRequestDto = object & {
  isInvited?: boolean;
};

export interface AdminBookingResponseDto {
  _id: string;
  userId: string;
  movieTitle: string;
  screenName: string;
  showtime: string;
  seatNumbers: string[];
  totalAmount: number;
  paymentStatus: string;
  bookingStatus: string;
  createdAt: string;
}

export interface AdminBookingsPaginatedData {
  bookings: AdminBookingResponseDto[];
  totalCount?: number;
  totalPages?: number;
  currentPage?: number;
}

export interface GetBookingsForAdminResponseDto extends ApiResponse<AdminBookingsPaginatedData> {}

export interface WalletBookRequestDto {
  amount: number;
  userModel: string;
  idempotencyKey: string;
}

export interface WalletBookResponseDto {
  walletTransactionDetails: {
    data: {
      transactionId: string;
    };
  };
  success?: boolean;
}

export interface BookTicketResponseDto {
  success: boolean;
  data: {
    tickets: Array<{ _id: string }>;
  };
}

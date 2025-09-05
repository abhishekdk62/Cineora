import { ApiResponse, PaginationQuery } from './common.dto';

export interface CreateTicketRequestDto {
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
}

export interface UpdateTicketRequestDto {
  status?: "confirmed" | "cancelled" | "used" | "expired";
  isUsed?: boolean;
  usedAt?: Date;
}

export interface GetTicketsQueryDto extends PaginationQuery {
  userId?: string;
  bookingId?: string;
  movieId?: string;
  theaterId?: string;
  status?: "confirmed" | "cancelled" | "used" | "expired";
  showDate?: Date;
  isUsed?: boolean;
}

export interface CancelTicketRequestDto {
  bookingId: string;
  amount: number;
}

export interface TicketResponseDto {
  _id: string;
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
  status: "confirmed" | "cancelled" | "used" | "expired";
  qrCode?: string;
  isUsed: boolean;
  usedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTicketResponseDto extends ApiResponse<TicketResponseDto> {}
export interface GetTicketResponseDto extends ApiResponse<TicketResponseDto> {}
export interface GetTicketsResponseDto extends ApiResponse<TicketResponseDto[]> {}
export interface UpdateTicketResponseDto extends ApiResponse<TicketResponseDto> {}
export interface DeleteTicketResponseDto extends ApiResponse<null> {}
export interface GetTicketsApiResponseDto extends ApiResponse<TicketResponseDto[]> {}
export interface CancelTicketResponseDto extends ApiResponse<{ message: string; refundAmount: number }> {}

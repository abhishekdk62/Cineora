export interface CreateTicketDto {
  bookingId: string;
  userId: string;
  seatNumber: string;
  seatType: "VIP" | "Premium" | "Normal";
  price: number;
  movieTitle: string;
  theaterName: string;
  screenName: string;
  showDate: Date;
  showTime: string;
}

export interface CreateBulkTicketsDto {
  bookingId: string;
  userId: string;
  tickets: {
    seatNumber: string;
    seatType: "VIP" | "Premium" | "Normal";
    price: number;
  }[];
  movieTitle: string;
  theaterName: string;
  screenName: string;
  showDate: Date;
  showTime: string;
}

export interface TicketResponseDto {
  ticketId: string;
  bookingId: string;
  seatNumber: string;
  seatType: string;
  price: number;
  movieTitle: string;
  theaterName: string;
  screenName: string;
  showDate: string;
  showTime: string;
  qrCode?: string;
  isUsed: boolean;
  usedAt?: string;
}

export interface ValidateTicketDto {
  ticketId: string;
  qrCode: string;
}

export interface UserTicketsQueryDto {
  page?: number;
  limit?: number;
  status?: "upcoming" | "used" | "all";
}

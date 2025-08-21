import { IMovieShowtime } from "../interfaces/showtimes.model.interfaces";

// ================ INPUT DTOs (for Controllers) ================

// Create Showtime DTO
export interface CreateShowtimeDto {
  movieId: string;
  theaterId: string;
  screenId: string;
  showDate: Date;
  showTime: string;
  endTime: string;
  format: "2D" | "3D" | "IMAX" | "4DX" | "Dolby Atmos";
  language: string;
  rowPricing: RowPricingDto[];
  totalSeats: number;
  ageRestriction?: number;
}

// Bulk Create DTO
export interface CreateBulkShowtimesDto {
  showtimeList: CreateShowtimeDto[];
}

// Update Showtime DTO  
export interface UpdateShowtimeDto {
  showDate?: Date;
  showTime?: string;
  endTime?: string;
  format?: "2D" | "3D" | "IMAX" | "4DX" | "Dolby Atmos";
  language?: string;
  rowPricing?: RowPricingDto[];
  totalSeats?: number;
  availableSeats?: number;
  bookedSeats?: string[];
  blockedSeats?: SeatBlockDto[];
  isActive?: boolean;
  ageRestriction?: number;
}

// Row Pricing DTO
export interface RowPricingDto {
  rowLabel: string;
  seatType: "VIP" | "Premium" | "Normal";
  basePrice: number;
  showtimePrice: number;
  totalSeats: number;
  availableSeats: number;
  bookedSeats?: string[];
}

// Seat Block DTO
export interface SeatBlockDto {
  seatId: string;
  userId: string;
  sessionId: string;
  blockedAt?: Date;
  expiresAt?: Date;
}

// Seat Operations DTOs
export interface BlockSeatsDto {
  seatIds: string[];
  userId: string;
  sessionId: string;
}

export interface ReleaseSeatsDto {
  seatIds: string[];
  userId: string;
  sessionId: string;
}

export interface BookSeatsDto {
  seatIds: string[];
}

// Query DTOs
export interface ShowtimeQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  showDate?: Date;
  date?: Date;
  isActive?: boolean;
  format?: string;
  language?: string;
  theaterId?: string;
  screenId?: string;
  movieId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface UpdateStatusDto {
  isActive: boolean;
}

// ================ OUTPUT DTOs (for Services) ================

// Response DTOs
export interface ShowtimeResponseDto {
  id: string;
  ownerId: string;
  movieId: any; // populated
  theaterId: any; // populated
  screenId: any; // populated
  showDate: Date;
  showTime: string;
  endTime: string;
  format: string;
  language: string;
  rowPricing: RowPricingResponseDto[];
  totalSeats: number;
  availableSeats: number;
  bookedSeats: string[];
  blockedSeats: SeatBlockResponseDto[];
  isActive: boolean;
  ageRestriction?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface RowPricingResponseDto {
  rowLabel: string;
  seatType: string;
  basePrice: number;
  showtimePrice: number;
  totalSeats: number;
  availableSeats: number;
  bookedSeats: string[];
}

export interface SeatBlockResponseDto {
  seatId: string;
  userId: string;
  sessionId: string;
  blockedAt: Date;
  expiresAt: Date;
}

export interface PaginatedShowtimeResponseDto {
  showtimes: ShowtimeResponseDto[];
  total: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export interface BulkCreateResponseDto {
  created: number;
  skipped: number;
  showtimes: ShowtimeResponseDto[];
  errors?: string[];
}

export interface TheaterWithShowtimesResponseDto {
  _id: string;
  theaterName: string;
  theaterLocation: any;
  showtimes: ShowtimeDetailsResponseDto[];
}

export interface ShowtimeDetailsResponseDto {
  showtimeId: string;
  showTime: string;
  endTime: string;
  format: string;
  language: string;
  screenName: string;
  availableSeats: number;
  totalSeats: number;
  rowPricing: RowPricingResponseDto[];
}

// ================ FILTER & UTILITY INTERFACES ================

export interface ShowtimeFilters {
  search?: string;
  showDate?: Date | string;
  date?: Date | string;
  isActive?: boolean;
  format?: "2D" | "3D" | "IMAX" | "4DX" | "Dolby Atmos";
  language?: string;
  theaterId?: string;
  screenId?: string;
  movieId?: string;
  sortBy?: "showDate" | "showTime" | "format" | "language" | "availableSeats" | "totalSeats" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface PaginatedShowtimeResult {
  showtimes: IMovieShowtime[];
  total: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

// For editShowtime method
export interface EditShowtimeDto extends UpdateShowtimeDto {
  _id: string;
}

// For admin filter queries
export interface AdminFiltersDto {
  search?: string;
  showDate?: string;
  isActive?: boolean;
  format?: string;
  language?: string;
  theaterId?: string;
  screenId?: string;
  movieId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// For getAllShowtimes method
export interface GetAllShowtimesFiltersDto {
  theaterId?: string;
  movieId?: string;
  date?: Date;
}

// For date query validation
export interface DateQueryDto {
  date: string;
}

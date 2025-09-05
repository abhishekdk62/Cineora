import { ApiResponse, PaginationQuery } from './common.dto';

export interface SeatBlockDto {
  seatId: string;
  userId: string;
  sessionId: string;
  blockedAt: Date;
  expiresAt: Date;
}

export interface RowPricingDto {
  rowLabel: string;
  seatType: "VIP" | "Premium" | "Normal";
  basePrice: number;
  showtimePrice: number;
  totalSeats: number;
  availableSeats: number;
  bookedSeats?: string[];
}

export interface ShowtimeFilters extends PaginationQuery {
  search?: string;
  movieId?: string;
  theaterId?: string;
  ownerId?: string;
  showDate?: string;
  format?: "2D" | "3D" | "IMAX" | "4DX" | "Dolby Atmos";
  language?: string;
  isActive?: boolean;
  dateFrom?: string;
  dateTo?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface CreateShowtimeRequestDto {
  ownerId: string;
  movieId: string;
  theaterId: string;
  screenId: string;
  showDate: Date;
  showTime: string;
  endTime: string;
  format: "2D" | "3D" | "IMAX" | "4DX" | "Dolby Atmos";
  language: string;
  rowPricing: RowPricingDto[];
  ageRestriction?: number | null;
}

export interface UpdateShowtimeRequestDto {
  showDate?: Date;
  showTime?: string;
  endTime?: string;
  format?: "2D" | "3D" | "IMAX" | "4DX" | "Dolby Atmos";
  language?: string;
  rowPricing?: RowPricingDto[];
  ageRestriction?: number | null;
  isActive?: boolean;
}

export interface ToggleShowtimeRequestDto {
  isActive: boolean;
}

export interface GetShowTimesOwnerParamsDto {
  page?: number;
  limit?: number;
}

export interface ShowtimeResponseDto {
  _id: string;
  ownerId: string;
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
  ageRestriction: number | null;
  availableSeats: number;
  bookedSeats: string[];
  blockedSeats: SeatBlockDto[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetShowtimesByScreenIdResponseDto extends ApiResponse<ShowtimeResponseDto[]> {}
export interface GetShowtimeResponseDto extends ApiResponse<ShowtimeResponseDto> {}
export interface CreateShowtimeResponseDto extends ApiResponse<ShowtimeResponseDto> {}
export interface GetShowtimesResponseDto extends ApiResponse<ShowtimeResponseDto[]> {}
export interface UpdateShowtimeResponseDto extends ApiResponse<ShowtimeResponseDto> {}
export interface DeleteShowtimeResponseDto extends ApiResponse<null> {}
export interface ToggleShowtimeResponseDto extends ApiResponse<ShowtimeResponseDto> {}
export interface GetShowTimesOwnerResponseDto extends ApiResponse<ShowtimeResponseDto[]> {}
export interface CreateShowtimeOwnerResponseDto extends ApiResponse<ShowtimeResponseDto> {}
export interface EditShowtimeOwnerResponseDto extends ApiResponse<ShowtimeResponseDto> {}
export interface ToggleShowtimeStatusOwnerResponseDto extends ApiResponse<ShowtimeResponseDto> {}
export interface GetShowTimeUserResponseDto extends ApiResponse<ShowtimeResponseDto> {}

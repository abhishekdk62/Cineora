import { ApiResponse, PaginationQuery } from "./common.dto";

export interface SeatBlockDto {
  seatId: string;
  userId: string;
  sessionId: string;
  blockedAt: Date;
  expiresAt: Date;
}

export interface RowPricingDto {
  _id?: string;
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
interface Seat {
  id: string;
  type: string;
  col: number;
  price?: number;
}

export interface ShowtimeResponseDto {
  _id: string;
  ownerId: string;
  movieId:
    | string
    | {
        title: string;
        poster: string;
        rating: string;

        name: string;
        _id: string;
        trailer: string;
        tmdbId: string;
        releaseDate: string;
        description: string;
        language: string;
        duration: string;
        genre: string;
        cast: string;
        director: string;
      };

  theaterId:
    | string
    | {
        name: string;
        _id: string;
        address:string;
        city:string;
        state:string;
        pincode:string;
        phone:string;
        screens:number;
        facilities:string[];
        location:object;
        isVerified:boolean;
        totalSeats:number;
        features:string[];
        theaterId:string;
    
      };
  screenId:
    | string
    | {
        _id: string;
        name: string;
        layout: { advancedLayout: { rows: Row[] } };
                totalSeats: number;
        features: string[];
        theaterId: string;

      };

  showDate: Date|string;
  showTime: string;
  endTime: string;
  format: "2D" | "3D" | "IMAX" | "4DX" | "Dolby Atmos";
  language: string;
  rowPricing: RowPricingDto[];
  totalSeats: number;
  ageRestriction: number | null;
  availableSeats: number;
  bookedSeats?: string[];
  blockedSeats: SeatBlockDto[] | string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
interface Row {
  rowLabel: string;
  seats: Seat[];
  offset?: number;
}

export interface BulkCreateShowtimeResponseDto
  extends ApiResponse<{
    created: number;
    skipped: number;
    errors?: string[];
    showtimes: ShowtimeResponseDto[];
  }> {}

export interface GetShowtimesByScreenIdResponseDto
  extends ApiResponse<ShowtimeResponseDto[]> {}
export interface GetShowtimeResponseDto
  extends ApiResponse<ShowtimeResponseDto> {}
export interface CreateShowtimeResponseDto
  extends ApiResponse<ShowtimeResponseDto> {}
export interface GetShowtimesResponseDto
  extends ApiResponse<ShowtimeResponseDto[]> {}
export interface UpdateShowtimeResponseDto
  extends ApiResponse<ShowtimeResponseDto> {}
export interface DeleteShowtimeResponseDto extends ApiResponse<null> {}
export interface ToggleShowtimeResponseDto
  extends ApiResponse<ShowtimeResponseDto> {}
export interface GetShowTimesOwnerResponseDto
  extends ApiResponse<ShowtimeResponseDto[]> {}
export interface CreateShowtimeOwnerResponseDto
  extends ApiResponse<ShowtimeResponseDto> {}
export interface EditShowtimeOwnerResponseDto
  extends ApiResponse<ShowtimeResponseDto> {}
export interface ToggleShowtimeStatusOwnerResponseDto
  extends ApiResponse<ShowtimeResponseDto> {}
export interface GetShowTimeUserResponseDto
  extends ApiResponse<ShowtimeResponseDto> {}

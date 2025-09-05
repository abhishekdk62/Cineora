

export interface UpdateShowtimeDTO {
  movieId?: string;
  theaterId?: string;
  screenId?: string;
  showDate?: Date;
  showTime?: string;
  endTime?: string;
  format?: "2D" | "3D" | "IMAX" | "4DX" | "Dolby Atmos";
  language?: string;
  rowPricing?: IRowPricingDTO[];
  totalSeats?: number;
  availableSeats?: number;
  isActive?: boolean;
  ageRestriction?: number;
}

export interface IRowPricingDTO {
  rowLabel: string;
  seatType: "VIP" | "Premium" | "Normal";
  basePrice: number;
  showtimePrice: number;
  totalSeats: number;
  availableSeats: number;
  bookedSeats?: string[];
}

export interface ShowtimeFilters {
  search?: string;
  showDate?: Date | string;
  isActive?: boolean;
  format?: string;
  language?: string;
  theaterId?: string;
  screenId?: string;
  movieId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  date?: Date | string;
}

export interface PaginatedShowtimeResult {
  showtimes: any[];
  total: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export interface SeatBookingDTO {
  seatIds: string[];
  userId: string;
  sessionId: string;
}

export interface SeatReleaseDTO {
  seatIds: string[];
  userId: string;
  reason: string;
}

export interface ShowtimePaginationDTO {
  current: number;
  pages: number;
  total: number;
  limit: number;
}

export interface ShowtimeListResponseDTO {
  showtimes: any[];
  pagination: ShowtimePaginationDTO;
}

export interface TimeSlotCheckDTO {
  screenId: string;
  showDate: Date;
  startTime: string;
  endTime: string;
  excludeId?: string;
}

export interface CreateShowtimeDTO {
  movieId: string;
  theaterId: string;
  screenId: string;
  showDate: Date;
  showTime: string;
  endTime: string;
  format: "2D" | "3D" | "IMAX" | "4DX" | "Dolby Atmos";
  language: string;
  rowPricing: IRowPricingDTO[];
  totalSeats: number;
  availableSeats?: number;
  isActive?: boolean;
  ageRestriction?: number;
}


export interface IRowPricingDTO {
  rowLabel: string;
  seatType: "VIP" | "Premium" | "Normal";
  basePrice: number;
  showtimePrice: number;
  totalSeats: number;
  availableSeats: number;
  bookedSeats?: string[];
}

export interface ShowtimeFilters {
  search?: string;
  showDate?: Date | string;
  isActive?: boolean;
  format?: string;
  language?: string;
  theaterId?: string;
  screenId?: string;
  movieId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  date?: Date | string;
}

export interface PaginatedShowtimeResult {
  showtimes: any[];
  total: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}



export interface SeatReleaseDTO {
  seatIds: string[];
  userId: string;
  reason: string;
}

export interface ShowtimePaginationDTO {
  current: number;
  pages: number;
  total: number;
  limit: number;
}

export interface ShowtimeListResponseDTO {
  showtimes: any[];
  pagination: ShowtimePaginationDTO;
}

export interface TimeSlotCheckDTO {
  screenId: string;
  showDate: Date;
  startTime: string;
  endTime: string;
  excludeId?: string;
}

export interface BulkShowtimeCreateDTO {
  created: number;
  skipped: number;
  showtimes: any[];
  errors?: string[];
}

export interface ShowtimeValidationResult {
  isValid: boolean;
  message: string;
}

export interface OverlapCheckResult {
  hasOverlap: boolean;
  message: string;
}
export interface EditShowtimeDto extends UpdateShowtimeDTO {
  _id: string;
}

export interface UpdateStatusDto {
  isActive: boolean;
}

export interface PaginationQueryDto {
  page: number;
  limit: number;
}

export interface DateQueryDto {
  date: string;
}
export interface EditShowtimeDto extends UpdateShowtimeDTO {
  _id: string;
}

export interface UpdateStatusDto {
  isActive: boolean;
}

export interface PaginationQueryDto {
  page: number;
  limit: number;
}

import mongoose, { Document, Types } from "mongoose";

export interface ISeatBlock {
  seatId: string;
  userId: string;
  sessionId: string;
  blockedAt: Date;
  expiresAt: Date;
}

export interface IRowPricing {
  rowLabel: string;
  seatType: "VIP" | "Premium" | "Normal";
  basePrice: number;
  showtimePrice: number;
  totalSeats: number;
  availableSeats: number;
  bookedSeats: string[];
}

export interface IMovieShowtime extends Document {
  ownerId: mongoose.Types.ObjectId;
  movieId: mongoose.Types.ObjectId;
  theaterId: mongoose.Types.ObjectId;
  screenId: mongoose.Types.ObjectId;
  showDate: Date;
  showTime: string;
  endTime: string;
  format: "2D" | "3D" | "IMAX" | "4DX" | "Dolby Atmos";
  language: string;
  rowPricing: IRowPricing[];
  totalSeats: number;
   ageRestriction:number|null
  availableSeats: number;
  bookedSeats: string[];
  blockedSeats: ISeatBlock[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IShowtimeInput {
  movieId: Types.ObjectId;
  theaterId: Types.ObjectId;
  screenId: Types.ObjectId;
  showDate: Date;
  showTime: string;
  endTime: string;
  format: "2D" | "3D" | "IMAX" | "4DX" | "Dolby Atmos";
  language: string;
  rowPricing: IRowPricing[];
  totalSeats: number;
  availableSeats: number;
  isActive?: boolean;
}



export interface ServiceResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface ShowtimeFilters {
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

export interface PaginatedShowtimeResult {
  showtimes: IMovieShowtime[];
  total: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}



export interface IShowtimeService {
  createBulkShowtimes(
    showtimeList: IShowtimeInput[],
    ownerId: string
  ): Promise<ServiceResponse>;

  createShowtime(
    showtimeData: IShowtimeInput,
    ownerId: string
  ): Promise<ServiceResponse>;

  updateShowtime(
    id: string,
    updateData: any,
    ownerId?: string
  ): Promise<ServiceResponse>;

  getShowtimeById(id: string): Promise<ServiceResponse>;

  getShowtimesByScreenAdmin(
    screenId: string,
    page: number,
    limit: number,
    filters?: ShowtimeFilters
  ): Promise<ServiceResponse>;

  getAllShowtimesAdmin(
    page: number,
    limit: number,
    filters?: ShowtimeFilters
  ): Promise<ServiceResponse>;

  updateShowtimeStatus(
    showtimeId: string,
    isActive: boolean
  ): Promise<ServiceResponse>;

  getShowtimesByScreen(screenId: string, date: Date): Promise<ServiceResponse>;

  getShowtimesByMovie(movieId: string, date: Date): Promise<ServiceResponse>;

  getShowtimesByTheater(theaterId: string, date: Date): Promise<ServiceResponse>;

  getShowtimesByOwnerId(ownerId: string): Promise<ServiceResponse>;

  blockSeats(
    showtimeId: string,
    seatIds: string[],
    userId: string,
    sessionId: string
  ): Promise<ServiceResponse>;

  releaseSeats(
    showtimeId: string,
    seatIds: string[],
    userId: string,
    sessionId: string
  ): Promise<ServiceResponse>;

  bookSeats(showtimeId: string, seatIds: string[]): Promise<ServiceResponse>;

  deleteShowtime(id: string): Promise<ServiceResponse>;

  getAllShowtimes(
    page?: number,
    limit?: number,
    filters?: any
  ): Promise<ServiceResponse>;

  getTheatersByMovie(movieId: string, date: Date): Promise<ServiceResponse>;

  changeShowtimeStatus(id: string, isActive: boolean): Promise<ServiceResponse>;
}

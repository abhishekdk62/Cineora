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

export interface IShowtimeRepository {
  create(
    ownerId: string,
    showtimeData: Partial<IMovieShowtime>
  ): Promise<IMovieShowtime | null>;
  findById(id: string): Promise<IMovieShowtime | null>;
  findByMovieAndDate(movieId: string, date: Date): Promise<IMovieShowtime[]>;
  findAll(page: number, limit: number, filter: any): Promise<IMovieShowtime[]>;
  findByScreenAndDate(screenId: string, date: Date): Promise<IMovieShowtime[]>;
  findByOwnerId(ownerId: string): Promise<IMovieShowtime[]>;
  findByTheaterAndDate(
    theaterId: string,
    date: Date
  ): Promise<IMovieShowtime[]>;
  updateById(
    id: string,
    updateData: Partial<IMovieShowtime>
  ): Promise<IMovieShowtime | null>;
  deleteById(id: string): Promise<boolean>;
  findTheatersByMovieWithShowtimes(movieId: string, date: Date): Promise<any>;
  checkTimeSlotOverlap(
    screenId: string,
    showDate: Date,
    startTime: string,
    endTime: string,
    excludeId?: string
  ): Promise<boolean>;
  updateStatus(
    showtimeId: string,
    isActive: boolean
  ): Promise<IMovieShowtime | null>;
  findAllPaginated(
    page: number,
    limit: number,
    filters?: ShowtimeFilters
  ): Promise<PaginatedShowtimeResult>;
  findByScreenPaginated(
    screenId: string,
    page: number,
    limit: number,
    filters?: ShowtimeFilters
  ): Promise<PaginatedShowtimeResult>;
  blockSeats(
    showtimeId: string,
    seatIds: string[],
    userId: string,
    sessionId: string
  ): Promise<boolean>;
  releaseSeats(
    showtimeId: string,
    seatIds: string[],
    userId: string,
    sessionId: string
  ): Promise<boolean>;
  bookSeats(showtimeId: string, seatIds: string[]): Promise<boolean>;
  existsByScreenAndTime(
    screenId: string,
    showDate: Date,
    showTime: string
  ): Promise<boolean>;
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

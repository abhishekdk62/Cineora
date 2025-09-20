import { IMovieShowtime } from "./showtimes.model.interfaces";
import { CreateShowtimeDTO, UpdateShowtimeDTO, ShowtimeFilters, PaginatedShowtimeResult, ShowtimeListResponseDTO } from "../dtos/dto";

export interface IShowtimeReadRepository {
  getShowtimeById(showtimeId: string): Promise<IMovieShowtime | null>;
  getShowtimesByMovieAndDate(movieId: string, date: Date): Promise<IMovieShowtime[]>;
  getShowtimesByTheaterAndDate(theaterId: string, date: Date): Promise<IMovieShowtime[]>;
  getShowtimesByOwnerIdPaginated(ownerId: string, skip: number, limit: number): Promise<IMovieShowtime[]>;
  getShowtimesByFilters(filters: {
    theaterId: string;
    screenId: string;
    startDate: Date;
    endDate: Date;
  }): Promise<IMovieShowtime[]>;
    holdSeats(
    showtimeId: string,
    seatNumbers: string[],
    userId: string,
    sessionId: string,
    inviteGroupId: string,
    expiresAt: Date
  ): Promise<{ success: boolean; heldSeats: string[]; failedSeats: string[] }>;
  
  releaseHeldSeats(
    showtimeId: string,
    filter: {
      seatNumbers?: string[];
      inviteGroupId?: string;
      userId?: string;
    }
  ): Promise<{ success: boolean; releasedSeats: string[] }>;
  
  getHeldSeats(showtimeId: string): Promise<string[]>;

  countShowtimesByOwnerId(ownerId: string): Promise<number>;
  getShowtimesByOwnerId(ownerId: string): Promise<IMovieShowtime[]>;
  getShowtimesByScreenPaginated(
    screenId: string,
    page: number,
    limit: number,
    filters?: ShowtimeFilters
  ): Promise<PaginatedShowtimeResult>;
  getAllShowtimesPaginated(
    page: number,
    limit: number,
    filters?: ShowtimeFilters
  ): Promise<PaginatedShowtimeResult>;
  showtimeExistsByScreenAndTime(screenId: string, showDate: Date, showTime: string): Promise<boolean>;
  checkShowtimeTimeSlotOverlap(
    screenId: string,
    showDate: Date,
    startTime: string,
    endTime: string,
    excludeId?: string
  ): Promise<boolean>;
  getAllShowtimes(
    page?: number,
    limit?: number,
    filters?: ShowtimeFilters
  ): Promise<{
    showtimes: IMovieShowtime[];
    pagination: {
      current: number;
      pages: number;
      total: number;
      limit: number;
    };
  }>;
  getShowtimesByScreenAndDate(screenId: string, date: Date): Promise<IMovieShowtime[]>;
  getTheatersByMovieWithShowtimes(movieId: string, date: Date): Promise<any[]>;
}

export interface IShowtimeWriteRepository {
  createShowtime(ownerId: string, showtimeData: CreateShowtimeDTO): Promise<IMovieShowtime>;
  updateShowtimeById(showtimeId: string, updateData: UpdateShowtimeDTO): Promise<IMovieShowtime | null>;
  deleteShowtimeById(showtimeId: string): Promise<boolean>;
  blockShowtimeSeats(showtimeId: string, seatIds: string[], userId: string, sessionId: string): Promise<boolean>;
  releaseShowtimeSeats(showtimeId: string, seatIds: string[], userId: string, reason: string): Promise<boolean>;
  updateShowtimeStatus(showtimeId: string, isActive: boolean): Promise<IMovieShowtime | null>;
  bookShowtimeSeats(showtimeId: string, seatIds: string[]): Promise<boolean>;
}

export interface IShowtimeRepository extends IShowtimeReadRepository, IShowtimeWriteRepository {}

import { IMovieShowtime, PaginatedShowtimeResult, ShowtimeFilters } from "./showtimes.interfaces";

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
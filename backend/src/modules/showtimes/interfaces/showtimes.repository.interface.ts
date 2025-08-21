import { IMovieShowtime } from "./showtimes.model.interfaces";
import { PaginatedShowtimeResult, ShowtimeFilters } from "../dtos/dto";

export interface IShowtimeRepository {
  create(
    ownerId: string,
    showtimeData: Partial<IMovieShowtime>
  ): Promise<IMovieShowtime | null>;
  
  findById(id: string): Promise<IMovieShowtime | null>;
  
  findByMovieAndDate(movieId: string, date: Date): Promise<IMovieShowtime[]>;
  
  findByTheaterAndDate(
    theaterId: string,
    date: Date
  ): Promise<IMovieShowtime[]>;
  
  findByOwnerId(ownerId: string): Promise<IMovieShowtime[]>;
  
  findByScreenAndDate(screenId: string, date: Date): Promise<IMovieShowtime[]>;
  
  updateById(
    id: string,
    updateData: Partial<IMovieShowtime>
  ): Promise<IMovieShowtime | null>;
  
  deleteById(id: string): Promise<boolean>;
  
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
  
  findByScreenPaginated(
    screenId: string,
    page: number,
    limit: number,
    filters?: ShowtimeFilters
  ): Promise<PaginatedShowtimeResult>;
  
  findAllPaginated(
    page: number,
    limit: number,
    filters?: ShowtimeFilters
  ): Promise<PaginatedShowtimeResult>;
  
  updateStatus(
    showtimeId: string,
    isActive: boolean
  ): Promise<IMovieShowtime | null>;
  
  bookSeats(showtimeId: string, seatIds: string[]): Promise<boolean>;
  
  existsByScreenAndTime(
    screenId: string,
    showDate: Date,
    showTime: string
  ): Promise<boolean>;
  
  checkTimeSlotOverlap(
    screenId: string,
    showDate: Date,
    startTime: string,
    endTime: string,
    excludeId?: string
  ): Promise<boolean>;
  
  findAll(
    page: number,
    limit: number,
    filters: ShowtimeFilters
  ): Promise<any>;
  
  findTheatersByMovieWithShowtimes(
    movieId: string, 
    date: Date
  ): Promise<any[]>;
}

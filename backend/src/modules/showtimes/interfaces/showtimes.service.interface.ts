import { ServiceResponse } from "../../../interfaces/interface";
import { CreateShowtimeDTO, UpdateShowtimeDTO, ShowtimeFilters, PaginatedShowtimeResult, SeatHoldDTO, SeatReleaseDTO } from "../dtos/dto";
import { IMovieShowtime } from "./showtimes.model.interfaces";

export interface IShowtimeService {
  createBulkShowtimes(
    showtimeList: CreateShowtimeDTO[],
    ownerId: string
  ): Promise<ServiceResponse<{
    created: number;
    skipped: number;
    showtimes: IMovieShowtime[];
    errors?: string[];
  }>>;

  createShowtime(
    showtimeData: CreateShowtimeDTO,
    ownerId: string
  ): Promise<ServiceResponse<IMovieShowtime>>;
  holdSeatsForGroup(
    showtimeId: string,
    holdData: SeatHoldDTO
  ): Promise<ServiceResponse<{ heldSeats: string[]; failedSeats: string[] }>>;
  
  releaseHeldSeats(
    showtimeId: string,
    releaseData: SeatReleaseDTO
  ): Promise<ServiceResponse<{ releasedSeats: string[] }>>;
  
  getHeldSeats(showtimeId: string): Promise<ServiceResponse<string[]>>;

  updateShowtime(
    id: string,
    updateData: UpdateShowtimeDTO,
    ownerId?: string
  ): Promise<ServiceResponse<IMovieShowtime>>;

  getShowtimeById(id: string): Promise<ServiceResponse<IMovieShowtime>>;

  getShowtimesByScreenAdmin(
    screenId: string,
    page: number,
    limit: number,
    filters?: ShowtimeFilters
  ): Promise<ServiceResponse<PaginatedShowtimeResult>>;

  getAllShowtimesAdmin(
    page: number,
    limit: number,
    filters?: ShowtimeFilters
  ): Promise<ServiceResponse<PaginatedShowtimeResult>>;

  updateShowtimeStatus(
    showtimeId: string,
    isActive: boolean
  ): Promise<ServiceResponse<IMovieShowtime>>;

  getShowtimesByScreen(
    screenId: string,
    date: Date
  ): Promise<ServiceResponse<IMovieShowtime[]>>;

  getShowtimesByMovie(
    movieId: string,
    date: Date
  ): Promise<ServiceResponse<IMovieShowtime[]>>;

  getShowtimesByTheater(
    theaterId: string,
    date: Date
  ): Promise<ServiceResponse<IMovieShowtime[]>>;

  getShowtimesByOwnerIdPaginated(
    ownerId: string,
    page: number,
    limit: number
  ): Promise<ServiceResponse<{ items: IMovieShowtime[]; total: number }>>;

  getShowtimesByOwnerId(ownerId: string): Promise<ServiceResponse<IMovieShowtime[]>>;

  getShowtimesByFilters(
    theaterId: string,
    screenId: string,
    startDate: Date,
    endDate: Date
  ): Promise<ServiceResponse<IMovieShowtime[]>>;

  blockShowtimeSeats(
    showtimeId: string,
    seatIds: string[],
    userId: string,
    sessionId: string
  ): Promise<ServiceResponse<void>>;

  releaseShowtimeSeats(
    showtimeId: string,
    seatIds: string[],
    userId: string,
    reason: string
  ): Promise<ServiceResponse<void>>;

  bookShowtimeSeats(
    showtimeId: string,
    seatIds: string[]
  ): Promise<ServiceResponse<void>>;

  deleteShowtime(id: string): Promise<ServiceResponse<void>>;

  getAllShowtimes(
    page?: number,
    limit?: number,
    filters?: ShowtimeFilters
  ): Promise<ServiceResponse<{
    showtimes: IMovieShowtime[];
    pagination: {
      current: number;
      pages: number;
      total: number;
      limit: number;
    };
  }>>;

  getTheatersByMovie(
    movieId: string,
    date: Date
  ): Promise<ServiceResponse<any[]>>;

  toggleShowtimeStatus(
    id: string,
    currentStatus: boolean
  ): Promise<ServiceResponse<IMovieShowtime>>;
}

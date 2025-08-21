
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

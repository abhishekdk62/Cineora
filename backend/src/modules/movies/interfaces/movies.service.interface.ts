import {
  CreateMovieDto,
  UpdateMovieDto,
  MovieFiltersDto,
  MovieResponseDto,
  PaginatedMoviesResponseDto,
} from "../dtos/dtos";

export interface IMovieService {
  getMoviesWithFilters(filters: MovieFiltersDto): Promise<PaginatedMoviesResponseDto>;
  addMovie(movieData: CreateMovieDto): Promise<MovieResponseDto | null>;
  getMovies(): Promise<MovieResponseDto[]>;
  getMoviesPaginated(page?: number, limit?: number): Promise<PaginatedMoviesResponseDto>;
  getMovieById(id: string): Promise<MovieResponseDto | null>;
  updateMovie(id: string, movieData: UpdateMovieDto): Promise<MovieResponseDto | null>;
  deleteMovie(id: string): Promise<boolean>;
  toggleMovieStatus(id: string): Promise<MovieResponseDto | null>;
}

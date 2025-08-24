import { IMovie } from "../interfaces/movies.model.interface";

export interface CreateMovieDto {
  tmdbId: string;
  title: string;
  genre: string[];
  releaseDate: Date;
  duration: number;
  rating: string;
  description: string;
  poster: string;
  trailer?: string;
  cast: string[];
  director: string;
  language: string;
}

export interface MovieRepositoryFindResult {
  movies: IMovie[];
  total: number;
  totalPages: number;
}


export interface UpdateMovieDto {
  title?: string;
  genre?: string[];
  releaseDate?: Date;
  duration?: number;
  rating?: string;
  description?: string;
  poster?: string;
  trailer?: string;
  cast?: string[];
  director?: string;
  language?: string;
  isActive?: boolean;
}

export interface MovieFiltersDto {
  search?: string;
  isActive?: boolean;
  rating?: string;
  minDuration?: number;
  maxDuration?: number;
  releaseYearStart?: number;
  releaseYearEnd?: number;
  genre?: string;
  language?: string;
  sortBy?: 'title' | 'releaseDate' | 'rating' | 'duration';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginationQueryDto {
  page?: number;
  limit?: number;
}

export interface MovieResponseDto extends IMovie {
  
}

export interface PaginatedMoviesResponseDto {
  movies: MovieResponseDto[];
  total: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface MovieByIdParamsDto {
  movieId: string;
}

export interface ToggleStatusParamsDto {
  movieId: string;
}

export interface UpdateMovieParamsDto {
  movieId: string;
}

export interface ApiSuccessResponseDto<T> {
  success: true;
  data?: T;
  message?: string;
  meta?: any;
}

export interface ApiErrorResponseDto {
  success: false;
  message: string;
}

export type ApiResponseDto<T> = ApiSuccessResponseDto<T> | ApiErrorResponseDto;

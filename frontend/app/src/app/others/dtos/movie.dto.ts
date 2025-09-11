import { ApiResponse, PaginationQuery } from './common.dto';

export interface MovieEntity {
  _id: string;
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
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMovieRequestDto {
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
  isActive?: boolean;
}

export interface UpdateMovieRequestDto {
  tmdbId?: string;
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

export interface GetMoviesWithFiltersQueryDto extends PaginationQuery {
  search?: string;
  isActive?: boolean;
  rating?: string;
  minDuration?: number;
  maxDuration?: number;
  releaseYearStart?: number;
  releaseYearEnd?: number;
  language?: string;
  genre?: string;
}

export interface MovieResponseDto {
  _id: string;
  tmdbId: string;
  title: string;
  genre: string[];
  releaseDate: Date;
  duration: number;
  rating: string;
  averageRating?:number;
  totalReviews?:number;
  description: string;
  poster: string;
  trailer?: string;
  cast: string[];
  director: string;
  language: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMovieResponseDto extends ApiResponse<MovieResponseDto> {}
export interface GetMovieResponseDto extends ApiResponse<MovieResponseDto> {}
export interface GetMoviesResponseDto extends ApiResponse<MovieResponseDto[]> {}
export interface GetMoviesWithFiltersResponseDto extends ApiResponse<MovieResponseDto[]> {}
export interface UpdateMovieResponseDto extends ApiResponse<MovieResponseDto> {}
export interface DeleteMovieResponseDto extends ApiResponse<null> {}
export interface ToggleMovieStatusResponseDto extends ApiResponse<MovieResponseDto> {}
export interface GetMoviesForShowtimeResponseDto extends ApiResponse<MovieResponseDto[]> {}
export interface GetMoviesByTheaterResponseDto extends ApiResponse<MovieResponseDto[]> {}

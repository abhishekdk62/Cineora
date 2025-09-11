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
  isActive?: boolean;
}

export interface UpdateMovieDto {
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

export interface MovieFiltersDto {
  search?: string;
  isActive?: boolean;
  rating?: string;
  genre?: string;
  language?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
}

export interface PaginationQueryDto {
  page?: number;
  limit?: number;
}

export interface MovieParamsDto {
  movieId: string;
}

export interface UpdateMovieParamsDto {
  movieId: string;
}

export interface MovieResponseDto extends IMovie {}

export interface PaginatedMoviesResponseDto {
  movies: MovieResponseDto[];
  total: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface MovieRepositoryFindResult {
  movies: IMovie[];
  total: number;
  totalPages: number;
}

export interface MovieSortConfiguration {
  title: (order: number) => Record<string, number>;
  releaseDate: (order: number) => Record<string, number>;
  rating: (order: number) => Record<string, number>;
  duration: (order: number) => Record<string, number>;
  popularity: (order: number) => Record<string, number>;
  revenue: (order: number) => Record<string, number>;
}

export interface MovieFilterConfiguration {
  search: (value: string) => Record<string, any>;
  isActive: (value: boolean) => Record<string, boolean>;
  rating: (value: string) => Record<string, string>;
  genre: (value: string) => Record<string, any>;
  language: (value: string) => Record<string, RegExp>;
}

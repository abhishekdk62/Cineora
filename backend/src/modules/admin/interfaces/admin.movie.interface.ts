import { IMovie } from "../../movies/models/movies.model";

export interface AdminMovieFilters {
  search?: string;
  isActive?: boolean;
  rating?: string;
  minDuration?: number;
  maxDuration?: number;
  releaseYearStart?: number;
  releaseYearEnd?: number;
  language?: string;
  genre?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface IAdminMovieRepository {
  findById(id: string): Promise<IMovie | null>;
  findByTmdbId(tmdbId: string): Promise<IMovie | null>;
  findAll(): Promise<IMovie[]>;
  findWithFilters(filters: AdminMovieFilters): Promise<{ 
    movies: IMovie[], 
    total: number, 
    totalPages: number 
  }>;
  findPaginated(page: number, limit: number): Promise<{ 
    movies: IMovie[], 
    total: number, 
    totalPages: number 
  }>;
  create(movieData: Partial<IMovie>): Promise<IMovie>;
  update(id: string, movieData: Partial<IMovie>): Promise<IMovie | null>;
  delete(id: string): Promise<boolean>;
  toggleStatus(id: string): Promise<IMovie | null>;
}

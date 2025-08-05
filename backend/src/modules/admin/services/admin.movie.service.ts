import { AdminMovieRepository } from "../repositories/admin.movie.repository";
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

export class AdminMovieService {
  private repo = new AdminMovieRepository();

  async addMovie(movieData: Partial<IMovie>): Promise<IMovie> {
    const existingMovie = await this.repo.findByTmdbId(movieData.tmdbId!.toString());
    if (existingMovie) {
      throw new Error(`Movie with TMDB ID ${movieData.tmdbId} already exists`);
    }
    return this.repo.create(movieData);
  }

  async getMovies(): Promise<IMovie[]> {
    return this.repo.findAll();
  }

  async getMoviesPaginated(page: number = 1, limit: number = 20): Promise<{
    movies: IMovie[], 
    total: number, 
    totalPages: number,
    currentPage: number,
    hasNextPage: boolean,
    hasPrevPage: boolean 
  }> {
    const result = await this.repo.findPaginated(page, limit);
    
    return {
      movies: result.movies,
      total: result.total,
      totalPages: result.totalPages,
      currentPage: page,
      hasNextPage: page < result.totalPages,
      hasPrevPage: page > 1
    };
  }

  async getMoviesWithFilters(filters: AdminMovieFilters): Promise<{ 
    movies: IMovie[], 
    total: number, 
    totalPages: number,
    currentPage: number,
    hasNextPage: boolean,
    hasPrevPage: boolean 
  }> {
    const result = await this.repo.findWithFilters(filters);
    const currentPage = filters.page || 1;
    
    return {
      movies: result.movies,
      total: result.total,
      totalPages: result.totalPages,
      currentPage,
      hasNextPage: currentPage < result.totalPages,
      hasPrevPage: currentPage > 1
    };
  }

  async getMovieById(id: string): Promise<IMovie | null> {
    return this.repo.findById(id);
  }

  async updateMovie(id: string, movieData: Partial<IMovie>): Promise<IMovie | null> {
    return this.repo.update(id, movieData);
  }

  async deleteMovie(id: string): Promise<boolean> {
    return this.repo.delete(id);
  }

  async toggleMovieStatus(id: string): Promise<IMovie | null> {
    if (!id) {
      throw new Error("Please provide movie id");
    }
    return this.repo.toggleStatus(id);
  }
}

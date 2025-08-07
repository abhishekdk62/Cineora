import { IMovieRepository } from "../interfaces/movies.interface";
import { IMovie } from "../models/movies.model";

export interface IMovieService {
  addMovie(movieData: Partial<IMovie>): Promise<IMovie>;
  getMovies(): Promise<IMovie[]>;
  getMoviesPaginated(page: number, limit: number): Promise<any>;
  getMoviesWithFilters(filters: any): Promise<any>;
  getMovieById(id: string): Promise<IMovie | null>;
  updateMovie(id: string, movieData: Partial<IMovie>): Promise<IMovie | null>;
  deleteMovie(id: string): Promise<boolean>;
  toggleMovieStatus(id: string): Promise<IMovie | null>;
  getMoviesForUser(filters?: any): Promise<any>; // For user access
  getMoviesForOwner(ownerId: string, filters?: any): Promise<any>; // For owner access
}

export class MovieService implements IMovieService {
  constructor(private movieRepo: IMovieRepository) {} 

  async addMovie(movieData: Partial<IMovie>): Promise<IMovie> {
    const existingMovie = await this.movieRepo.findByTmdbId(movieData.tmdbId!.toString());
    if (existingMovie) {
      throw new Error(`Movie with TMDB ID ${movieData.tmdbId} already exists`);
    }
    return this.movieRepo.create(movieData);
  }

  async getMovies(): Promise<IMovie[]> {
    return this.movieRepo.findAll();
  }

  async getMoviesPaginated(page: number = 1, limit: number = 20): Promise<{
    movies: IMovie[], 
    total: number, 
    totalPages: number,
    currentPage: number,
    hasNextPage: boolean,
    hasPrevPage: boolean 
  }> {
    const result = await this.movieRepo.findPaginated(page, limit);
    
    return {
      movies: result.movies,
      total: result.total,
      totalPages: result.totalPages,
      currentPage: page,
      hasNextPage: page < result.totalPages,
      hasPrevPage: page > 1
    };
  }

  async getMoviesWithFilters(filters: any): Promise<{ 
    movies: IMovie[], 
    total: number, 
    totalPages: number,
    currentPage: number,
    hasNextPage: boolean,
    hasPrevPage: boolean 
  }> {
    const result = await this.movieRepo.findWithFilters(filters);
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
    return this.movieRepo.findById(id);
  }

  async updateMovie(id: string, movieData: Partial<IMovie>): Promise<IMovie | null> {
    return this.movieRepo.update(id, movieData);
  }

  async deleteMovie(id: string): Promise<boolean> {
    return this.movieRepo.delete(id);
  }

  async toggleMovieStatus(id: string): Promise<IMovie | null> {
    if (!id) {
      throw new Error("Please provide movie id");
    }
    return this.movieRepo.toggleStatus(id);
  }

  // ✅ Additional methods for different user types
  async getMoviesForUser(filters: any = {}): Promise<any> {
    // Users only see active movies
    const userFilters = { ...filters, isActive: true };
    return this.getMoviesWithFilters(userFilters);
  }

  async getMoviesForOwner(ownerId: string, filters: any = {}): Promise<any> {
    // Owners see movies in their cinemas (add owner-specific logic)
    const ownerFilters = { ...filters, ownerId };
    return this.getMoviesWithFilters(ownerFilters);
  }

  async getMoviesForAdmin(filters: any = {}): Promise<any> {
    // Admins see all movies (including inactive)
    return this.getMoviesWithFilters(filters);
  }
}

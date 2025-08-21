
import { IMovie } from "./movies.model.interface";

export interface IMovieService {
  addMovie(movieData: Partial<IMovie>): Promise<IMovie>;
  getMovies(): Promise<IMovie[]>;
  getMoviesPaginated(page: number, limit: number): Promise<any>;
  getMoviesWithFilters(filters: any): Promise<any>;
  getMovieById(id: string): Promise<IMovie | null>;
  updateMovie(id: string, movieData: Partial<IMovie>): Promise<IMovie | null>;
  deleteMovie(id: string): Promise<boolean>;
  toggleMovieStatus(id: string): Promise<IMovie | null>;
  getMoviesForUser(filters?: any): Promise<any>;
  getMoviesForOwner(ownerId: string, filters?: any): Promise<any>; 
}


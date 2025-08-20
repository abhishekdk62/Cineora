import mongoose, { Schema, Document, Types } from "mongoose";



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


export interface IMovieRepository {
  findById(id: string): Promise<IMovie | null>;
  findByTmdbId(tmdbId: string): Promise<IMovie | null>;
  findAll(): Promise<IMovie[]>;
  findWithFilters(
    filters: any
  ): Promise<{ movies: IMovie[]; total: number; totalPages: number }>;
  findPaginated(
    page: number,
    limit: number
  ): Promise<{ movies: IMovie[]; total: number; totalPages: number }>;
  create(movieData: Partial<IMovie>): Promise<IMovie>;
  update(id: string, movieData: Partial<IMovie>): Promise<IMovie | null>;
  delete(id: string): Promise<boolean>;
  toggleStatus(id: string): Promise<IMovie | null>;
}
export interface IMovie extends Document {
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

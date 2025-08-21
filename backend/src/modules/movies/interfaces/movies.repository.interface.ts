

import { IMovie } from "./movies.model.interface";



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
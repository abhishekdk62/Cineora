import { 
  CreateMovieDto, 
  UpdateMovieDto, 
  MovieRepositoryFindResult 
} from "../dtos/dtos";
import { IMovie } from "./movies.model.interface";

export interface IMovieReadRepository {
  findMovieById(movieId: string): Promise<IMovie | null>;
  findMovieByTmdbId(tmdbId: string): Promise<IMovie | null>;
  findAllMovies(): Promise<IMovie[]>;
  findMoviesWithQuery(
    query: Record<string, any>, 
    sort: Record<string, any>, 
    page?: number, 
    limit?: number
  ): Promise<MovieRepositoryFindResult>;
  findMoviesPaginated(page?: number, limit?: number): Promise<MovieRepositoryFindResult>;
}

export interface IMovieWriteRepository {
  createMovie(movieData: CreateMovieDto): Promise<IMovie>;
  updateMovie(movieId: string, movieData: UpdateMovieDto): Promise<IMovie | null>;
  deleteMovie(movieId: string): Promise<boolean>;
  toggleMovieStatus(movieId: string): Promise<IMovie | null>;
}

export interface IMovieRepository extends IMovieReadRepository, IMovieWriteRepository {}

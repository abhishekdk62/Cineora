import { IMovie } from "./movies.model.interface";
import {
  CreateMovieDto,
  UpdateMovieDto,
  MovieRepositoryFindResult,
} from "../dtos/dtos";
import {
  IBaseReadRepository,
  IBaseRepository,
  IBaseWriteRepository,
} from "../../../repositories/baseRepository.interface";

export interface IMovieReadRepository extends IBaseReadRepository<IMovie> {
  findMovieByTmdbId(tmdbId: string): Promise<IMovie | null>;
  findMoviesWithQuery(
    query: Record<string, any>,
    sort: Record<string, any>,
    page?: number,
    limit?: number
  ): Promise<MovieRepositoryFindResult>;
  findMoviesPaginated(
    page?: number,
    limit?: number
  ): Promise<MovieRepositoryFindResult>;
}

export interface IMovieWriteRepository
  extends IBaseWriteRepository<
    IMovie,
    string,
    CreateMovieDto,
    UpdateMovieDto
  > {}

export interface IMovieRepository
  extends IMovieReadRepository,
    IMovieWriteRepository {}

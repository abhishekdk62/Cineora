import { getErrorMessage } from "../../../utils/errorUtil";
import {
  CreateMovieDto,
  UpdateMovieDto,
  MovieFiltersDto,
  MovieResponseDto,
  PaginatedMoviesResponseDto,
} from "../dtos/dtos";
import { IMovieService } from "../interfaces/movies.service.interface";
import { IMovieRepository } from "../interfaces/movies.repository.interface";
import { QueryFilterRegistry } from "../../../shared/query/QueryFilterRegistry";
import { SortRegistry } from "../../../shared/query/SortRegistry";

type MovieFilterKey = "search" | "isActive" | "rating" | "genre" | "language";
type MovieSortKey = "title" | "releaseDate" | "rating" | "duration" | "popularity" | "revenue";

export class MovieService implements IMovieService {
  private readonly _filterRegistry = new QueryFilterRegistry<MovieFilterKey>()
    .register("search", (value: string) => ({
      $or: [
        { title: { $regex: value, $options: "i" } },
        { director: { $regex: value, $options: "i" } },
        { cast: { $in: [new RegExp(value, "i")] } },
      ],
    }))
    .register("isActive", (value: boolean) => ({ isActive: value }))
    .register("rating", (value: string) => ({ rating: value }))
    .register("genre", (value: string) => ({ genre: { $in: [new RegExp(value, "i")] } }))
    .register("language", (value: string) => ({ language: new RegExp(`^${value}$`, "i") }));

  private readonly _sortRegistry = new SortRegistry<MovieSortKey>()
    .register("title", (order) => ({ title: order }))
    .register("releaseDate", (order) => ({ releaseDate: order }))
    .register("rating", (order) => ({ rating: order }))
    .register("duration", (order) => ({ duration: order }))
    .register("popularity", (order) => ({ popularity: order }))
    .register("revenue", (order) => ({ revenue: order }));

  constructor(private readonly movieRepository: IMovieRepository) {}

  private _buildMovieQuery(filters: MovieFiltersDto): Record<string, unknown> {
    return this._filterRegistry.buildQuery(filters);
  }

  private _buildSortCriteria(sortBy?: string, sortOrder?: string): Record<string, number> {
    return this._sortRegistry.buildSort(sortBy as MovieSortKey | undefined, sortOrder);
  }

  async getMoviesWithFilters(filters: MovieFiltersDto): Promise<PaginatedMoviesResponseDto> {
    try {
      const query = this._buildMovieQuery(filters);
      const sort = this._buildSortCriteria(filters.sortBy, filters.sortOrder);

      const result = await this.movieRepository.findMoviesWithQuery(
        query,
        sort,
        filters.page,
        filters.limit
      );
      
      const currentPage = filters.page || 1;

      return {
        movies: result.data,
        total: result.total,
        totalPages: result.totalPages,
        currentPage,
        hasNextPage: currentPage < result.totalPages,
        hasPrevPage: currentPage > 1,
      };
    } catch (error) {
      throw new Error(`Failed to get movies with filters: ${getErrorMessage(error)}`);
    }
  }

  async addMovie(movieData: CreateMovieDto): Promise<MovieResponseDto | null> {
    try {
      if (!movieData.title || !movieData.tmdbId) {
        return null;
      }

      const existingMovie = await this.movieRepository.findMovieByTmdbId(
        movieData.tmdbId!.toString()
      );
      
      if (existingMovie) {
        return null;
      }
      
      return await this.movieRepository.create(movieData);
    } catch (error) {
      throw new Error(`Failed to add movie: ${getErrorMessage(error)}`);
    }
  }

  async getMovies(): Promise<MovieResponseDto[]> {
    try {
      const result = await this.movieRepository.findAll();
      return result.data;
    } catch (error) {
      throw new Error(`Failed to get movies: ${getErrorMessage(error)}`);
    }
  }

  async getMoviesPaginated(
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedMoviesResponseDto> {
    try {
      const result = await this.movieRepository.findMoviesPaginated(page, limit);

      return {
        movies: result.data,
        total: result.total,
        totalPages: result.totalPages,
        currentPage: page,
        hasNextPage: page < result.totalPages,
        hasPrevPage: page > 1,
      };
    } catch (error) {
      throw new Error(`Failed to get movies paginated: ${getErrorMessage(error)}`);
    }
  }

  async getMovieById(id: string): Promise<MovieResponseDto | null> {
    try {
      if (!id) {
        return null;
      }

      return await this.movieRepository.findById(id);
    } catch (error) {
      throw new Error(`Failed to get movie by id: ${getErrorMessage(error)}`);
    }
  }

  async updateMovie(
    id: string,
    movieData: UpdateMovieDto
  ): Promise<MovieResponseDto | null> {
    try {
      if (!id) {
        return null;
      }

      return await this.movieRepository.update(id, movieData);
    } catch (error) {
      throw new Error(`Failed to update movie: ${getErrorMessage(error)}`);
    }
  }

  async deleteMovie(id: string): Promise<boolean> {
    try {
      if (!id) {
        return false;
      }

      const deleted = await this.movieRepository.delete(id);
      return !!deleted;
    } catch (error) {
      throw new Error(`Failed to delete movie: ${getErrorMessage(error)}`);
    }
  }

  async toggleMovieStatus(id: string): Promise<MovieResponseDto | null> {
    try {
      if (!id) {
        return null;
      }
      
      return await this.movieRepository.toggleStatus(id);
    } catch (error) {
      throw new Error(`Failed to toggle movie status: ${getErrorMessage(error)}`);
    }
  }
}

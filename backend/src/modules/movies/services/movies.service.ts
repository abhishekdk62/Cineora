import {
  CreateMovieDto,
  UpdateMovieDto,
  MovieFiltersDto,
  MovieResponseDto,
  PaginatedMoviesResponseDto,
  MovieSortConfiguration,
  MovieFilterConfiguration
} from "../dtos/dtos";
import { IMovieService } from "../interfaces/movies.service.interface";
import { IMovieRepository } from "../interfaces/movies.repository.interface";

export class MovieService implements IMovieService {
  private readonly _sortConfigurations: MovieSortConfiguration = {
    title: (order: number) => ({ title: order }),
    releaseDate: (order: number) => ({ releaseDate: order }),
    rating: (order: number) => ({ rating: order }),
    duration: (order: number) => ({ duration: order }),
    popularity: (order: number) => ({ popularity: order }),
    revenue: (order: number) => ({ revenue: order }),
  };

  private readonly _filterConfigurations: MovieFilterConfiguration = {
    search: (value: string) => ({
      $or: [
        { title: { $regex: value, $options: "i" } },
        { director: { $regex: value, $options: "i" } },
        { cast: { $in: [new RegExp(value, "i")] } },
      ]
    }),
    isActive: (value: boolean) => ({ isActive: value }),
    rating: (value: string) => ({ rating: value }),
    genre: (value: string) => ({ genre: { $in: [new RegExp(value, "i")] } }),
    language: (value: string) => ({ language: new RegExp(`^${value}$`, "i") }),
  };

  constructor(private readonly movieRepository: IMovieRepository) {}

  private _buildMovieQuery(filters: MovieFiltersDto): Record<string, any> {
    let query: Record<string, any> = {};
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '' && this._filterConfigurations[key]) {
        Object.assign(query, this._filterConfigurations[key](value));
      }
    });
    
    return query;
  }

  private _buildSortCriteria(sortBy?: string, sortOrder?: string): Record<string, any> {
    const order = sortOrder === "desc" ? -1 : 1;
    const sortFunction = this._sortConfigurations[sortBy as keyof MovieSortConfiguration];
    
    return sortFunction ? sortFunction(order) : { title: 1 };
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
        movies: result.movies,
        total: result.total,
        totalPages: result.totalPages,
        currentPage,
        hasNextPage: currentPage < result.totalPages,
        hasPrevPage: currentPage > 1,
      };
    } catch (error) {
      throw new Error(`Failed to get movies with filters: ${error.message}`);
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
      throw new Error(`Failed to add movie: ${error.message}`);
    }
  }

  async getMovies(): Promise<MovieResponseDto[]> {
    try {
      return await this.movieRepository.findAll();
    } catch (error) {
      throw new Error(`Failed to get movies: ${error.message}`);
    }
  }

  async getMoviesPaginated(
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedMoviesResponseDto> {
    try {
      const result = await this.movieRepository.findMoviesPaginated(page, limit);

      return {
        movies: result.movies,
        total: result.total,
        totalPages: result.totalPages,
        currentPage: page,
        hasNextPage: page < result.totalPages,
        hasPrevPage: page > 1,
      };
    } catch (error) {
      throw new Error(`Failed to get movies paginated: ${error.message}`);
    }
  }

  async getMovieById(id: string): Promise<MovieResponseDto | null> {
    try {
      if (!id) {
        return null;
      }

      return await this.movieRepository.findById(id);
    } catch (error) {
      throw new Error(`Failed to get movie by id: ${error.message}`);
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
      throw new Error(`Failed to update movie: ${error.message}`);
    }
  }

  async deleteMovie(id: string): Promise<boolean> {
    try {
      if (!id) {
        return false;
      }

      return await this.movieRepository.delete(id);
    } catch (error) {
      throw new Error(`Failed to delete movie: ${error.message}`);
    }
  }

  async toggleMovieStatus(id: string): Promise<MovieResponseDto | null> {
    try {
      if (!id) {
        return null;
      }
      
      return await this.movieRepository.toggleStatus(id);
    } catch (error) {
      throw new Error(`Failed to toggle movie status: ${error.message}`);
    }
  }
}

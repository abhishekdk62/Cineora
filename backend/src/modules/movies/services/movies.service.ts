import { CreateMovieDto, MovieFiltersDto, MovieResponseDto, PaginatedMoviesResponseDto, UpdateMovieDto } from "../dtos/dtos";
import { IMovie } from "../interfaces/movies.model.interface";
import { IMovieRepository } from "../interfaces/movies.repository.interface";
import { IMovieService } from "../interfaces/movies.service.interface";

export class MovieService implements IMovieService {
  constructor(private readonly movieRepo: IMovieRepository) {}
  async addMovie(movieData: CreateMovieDto): Promise<MovieResponseDto> {
    const existingMovie = await this.movieRepo.findByTmdbId(
      movieData.tmdbId!.toString()
    );
    if (existingMovie) {
      throw new Error(`Movie with TMDB ID ${movieData.tmdbId} already exists`);
    }
    return this.movieRepo.create(movieData);
  }

  async getMovies(): Promise<MovieResponseDto[]> {
    return this.movieRepo.findAll();
  }

  async getMoviesPaginated(
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedMoviesResponseDto> {
    const result = await this.movieRepo.findPaginated(page, limit);

    return {
      movies: result.movies,
      total: result.total,
      totalPages: result.totalPages,
      currentPage: page,
      hasNextPage: page < result.totalPages,
      hasPrevPage: page > 1,
    };
  }

  async getMoviesWithFilters(filters: MovieFiltersDto): Promise<PaginatedMoviesResponseDto> {
    const result = await this.movieRepo.findWithFilters(filters);
    const currentPage = filters.page || 1;

    return {
      movies: result.movies,
      total: result.total,
      totalPages: result.totalPages,
      currentPage,
      hasNextPage: currentPage < result.totalPages,
      hasPrevPage: currentPage > 1,
    };
  }

  async getMovieById(id: string): Promise<MovieResponseDto | null> {
    return this.movieRepo.findById(id);
  }

  async updateMovie(
    id: string,
    movieData: UpdateMovieDto
  ): Promise<MovieResponseDto | null> {
    return this.movieRepo.update(id, movieData);
  }

  async deleteMovie(id: string): Promise<boolean> {
    return this.movieRepo.delete(id);
  }

  async toggleMovieStatus(id: string): Promise<MovieResponseDto | null> {
    if (!id) {
      throw new Error("Please provide movie id");
    }
    return this.movieRepo.toggleStatus(id);
  }

  async getMoviesForUser(filters: MovieFiltersDto = {}): Promise<PaginatedMoviesResponseDto> {
    const userFilters = { ...filters, isActive: true };
    return this.getMoviesWithFilters(userFilters);
  }

  async getMoviesForOwner(ownerId: string, filters: MovieFiltersDto = {}): Promise<PaginatedMoviesResponseDto> {
    const ownerFilters = { ...filters, ownerId };
    return this.getMoviesWithFilters(ownerFilters);
  }

  async getMoviesForAdmin(filters: MovieFiltersDto = {}): Promise<PaginatedMoviesResponseDto> {
    return this.getMoviesWithFilters(filters);
  }
}

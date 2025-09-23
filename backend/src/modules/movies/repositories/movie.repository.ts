import { 
  CreateMovieDto, 
  UpdateMovieDto, 
  MovieFiltersDto, 
  MovieRepositoryFindResult 
} from "../dtos/dtos";
import { IMovie } from "../interfaces/movies.model.interface";
import { 

  IMovieRepository 
} from "../interfaces/movies.repository.interface";
import { Movie } from "../models/movies.model";

export class MovieRepository implements IMovieRepository {
  
  async findById(movieId: string): Promise<IMovie | null> {
    try {
      return await Movie.findById(movieId).exec();
    } catch (error) {
      throw new Error(`Failed to find movie by id: ${error.message}`);
    }
  }

  async findMovieByTmdbId(tmdbId: string): Promise<IMovie | null> {
    try {
      return await Movie.findOne({ tmdbId }).exec();
    } catch (error) {
      throw new Error(`Failed to find movie by tmdbId: ${error.message}`);
    }
  }

  async findAll(page?: number, limit?: number): Promise<{ data: IMovie[]; total: number }> {
    try {
      return await Movie.find().exec();
    } catch (error) {
      throw new Error(`Failed to find all movies: ${error.message}`);
    }
  }

  async findMoviesWithQuery(
    query: Record<string, any>, 
    sort: Record<string, any>, 
    page: number = 1, 
    limit: number = 20
  ): Promise<MovieRepositoryFindResult> {
    try {
      const validPage = Math.max(1, page);
      const validLimit = Math.min(100, Math.max(1, limit));
      const skip = (validPage - 1) * validLimit;

      const [movies, total] = await Promise.all([
        Movie.find(query).sort(sort).skip(skip).limit(validLimit).lean().exec(),
        Movie.countDocuments(query).exec(),
      ]);

      const totalPages = Math.ceil(total / validLimit);
      return { movies, total, totalPages };
    } catch (error) {
      throw new Error(`Failed to find movies with query: ${error.message}`);
    }
  }

  async findMoviesPaginated(
    page: number = 1,
    limit: number = 20
  ): Promise<MovieRepositoryFindResult> {
    try {
      const validPage = Math.max(1, page);
      const validLimit = Math.min(100, Math.max(1, limit));
      const skip = (validPage - 1) * validLimit;

      const [movies, total] = await Promise.all([
        Movie.find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(validLimit)
          .lean()
          .exec(),
        Movie.countDocuments().exec(),
      ]);

      const totalPages = Math.ceil(total / validLimit);
      return { movies, total, totalPages };
    } catch (error) {
      throw new Error(`Failed to find movies paginated: ${error.message}`);
    }
  }

  async create(movieData: CreateMovieDto): Promise<IMovie> {
    try {
      const movie = new Movie(movieData);
      return await movie.save();
    } catch (error) {
      throw new Error(`Failed to create movie: ${error.message}`);
    }
  }

  async update(movieId: string, movieData: UpdateMovieDto): Promise<IMovie | null> {
    try {
      return await Movie.findByIdAndUpdate(movieId, movieData, { new: true }).exec();
    } catch (error) {
      throw new Error(`Failed to update movie: ${error.message}`);
    }
  }

  async delete(movieId: string): Promise<IMovie> {
    try {
      const deletionResult = await Movie.findByIdAndDelete(movieId).exec();
      return deletionResult;
    } catch (error) {
      throw new Error(`Failed to delete movie: ${error.message}`);
    }
  }

  async toggleStatus(movieId: string): Promise<IMovie | null> {
    try {
      const movie = await Movie.findById(movieId).exec();
      if (!movie) return null;
      
      movie.isActive = !movie.isActive;
      return await movie.save();
    } catch (error) {
      throw new Error(`Failed to toggle movie status: ${error.message}`);
    }
  }
}

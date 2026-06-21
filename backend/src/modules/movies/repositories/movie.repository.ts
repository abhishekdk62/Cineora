import { getErrorMessage } from "../../../utils/errorUtil";
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
      throw new Error(`Failed to find movie by id: ${getErrorMessage(error)}`);
    }
  }

  async findMovieByTmdbId(tmdbId: string): Promise<IMovie | null> {
    try {
      return await Movie.findOne({ tmdbId }).exec();
    } catch (error) {
      throw new Error(`Failed to find movie by tmdbId: ${getErrorMessage(error)}`);
    }
  }

  async findAll(page?: number, limit?: number): Promise<{ data: IMovie[]; total: number }> {
    try {
      const movies = await Movie.find().exec();
      return { data: movies, total: movies.length };
    } catch (error) {
      throw new Error(`Failed to find all movies: ${getErrorMessage(error)}`);
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
      return { data: movies as IMovie[], total, totalPages };
    } catch (error) {
      throw new Error(`Failed to find movies with query: ${getErrorMessage(error)}`);
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
      return { data: movies as IMovie[], total, totalPages };
    } catch (error) {
      throw new Error(`Failed to find movies paginated: ${getErrorMessage(error)}`);
    }
  }

  async create(movieData: CreateMovieDto): Promise<IMovie> {
    try {
      const movie = new Movie(movieData);
      return await movie.save();
    } catch (error) {
      throw new Error(`Failed to create movie: ${getErrorMessage(error)}`);
    }
  }

  async update(movieId: string, movieData: UpdateMovieDto): Promise<IMovie | null> {
    try {
      return await Movie.findByIdAndUpdate(movieId, movieData, { new: true }).exec();
    } catch (error) {
      throw new Error(`Failed to update movie: ${getErrorMessage(error)}`);
    }
  }

  async delete(movieId: string): Promise<IMovie> {
    try {
      const deletionResult = await Movie.findByIdAndDelete(movieId).exec();
      return deletionResult;
    } catch (error) {
      throw new Error(`Failed to delete movie: ${getErrorMessage(error)}`);
    }
  }

  async toggleStatus(movieId: string): Promise<IMovie | null> {
    try {
      const movie = await Movie.findById(movieId).exec();
      if (!movie) return null;
      
      movie.isActive = !movie.isActive;
      return await movie.save();
    } catch (error) {
      throw new Error(`Failed to toggle movie status: ${getErrorMessage(error)}`);
    }
  }
}

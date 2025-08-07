import { IMovieRepository } from "../interfaces/movies.interface";
import { Movie, IMovie } from "../models/movies.model";



export class MovieRepository implements IMovieRepository {
  async findById(id: string): Promise<IMovie | null> {
    return Movie.findById(id).exec();
  }

  async findByTmdbId(tmdbId: string): Promise<IMovie | null> {
    return Movie.findOne({ tmdbId }).exec();
  }

  async findAll(): Promise<IMovie[]> {
    return Movie.find().exec();
  }

  async findWithFilters(filters: any): Promise<{
    movies: IMovie[];
    total: number;
    totalPages: number;
  }> {
    let query: any = {};
    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: "i" } },
        { director: { $regex: filters.search, $options: "i" } },
        { cast: { $in: [new RegExp(filters.search, "i")] } },
      ];
    }
    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }
    if (filters.rating) {
      query.rating = filters.rating;
    }

    if (filters.minDuration || filters.maxDuration) {
      query.duration = {};
      if (filters.minDuration) query.duration.$gte = filters.minDuration;
      if (filters.maxDuration) query.duration.$lte = filters.maxDuration;
    }

    if (filters.releaseYearStart || filters.releaseYearEnd) {
      const startDate = filters.releaseYearStart
        ? new Date(`${filters.releaseYearStart}-01-01`)
        : new Date("1900-01-01");
      const endDate = filters.releaseYearEnd
        ? new Date(`${filters.releaseYearEnd}-12-31`)
        : new Date();

      query.releaseDate = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    if (filters.genre) {
      query.genre = { $in: [new RegExp(filters.genre, "i")] };
    }

    if (filters.language) {
      query.language = new RegExp(`^${filters.language}$`, "i");
    }

    let sort: any = {};
    if (filters.sortBy) {
      const sortOrder = filters.sortOrder === "desc" ? -1 : 1;

      switch (filters.sortBy) {
        case "title":
          sort.title = sortOrder;
          break;
        case "releaseDate":
          sort.releaseDate = sortOrder;
          break;
        case "rating":
          sort.rating = sortOrder;
          break;
        case "duration":
          sort.duration = sortOrder;
          break;
        default:
          sort.title = 1;
      }
    } else {
      sort.title = 1;
    }

    const page = Math.max(1, filters.page || 1);
    const limit = Math.min(100, Math.max(1, filters.limit || 20));
    const skip = (page - 1) * limit;

    const [movies, total] = await Promise.all([
      Movie.find(query).sort(sort).skip(skip).limit(limit).lean().exec(),
      Movie.countDocuments(query).exec(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return { movies, total, totalPages };
  }

  async findPaginated(
    page: number = 1,
    limit: number = 20
  ): Promise<{
    movies: IMovie[];
    total: number;
    totalPages: number;
  }> {
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
  }

  async create(movieData: Partial<IMovie>): Promise<IMovie> {
    const movie = new Movie(movieData);
    return movie.save();
  }

  async update(id: string, movieData: Partial<IMovie>): Promise<IMovie | null> {
    return Movie.findByIdAndUpdate(id, movieData, { new: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const res = await Movie.findByIdAndDelete(id).exec();
    return !!res;
  }

  async toggleStatus(id: string): Promise<IMovie | null> {
    const movie = await Movie.findById(id).exec();
    if (!movie) return null;
    movie.isActive = !movie.isActive;
    return movie.save();
  }
}

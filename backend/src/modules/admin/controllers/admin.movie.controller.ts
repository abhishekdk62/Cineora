import { Request, Response, NextFunction } from "express";
import { AdminMovieService } from "../services/admin.movie.service";
import { createResponse } from "../../../utils/createResponse";

const service = new AdminMovieService();

export async function addMovie(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const movieData = req.body;
    if (!movieData.title || !movieData.tmdbId) {
      return res
        .status(400)
        .json(
          createResponse({
            success: false,
            message: "Title and TMDB ID are required",
          })
        );
    }

    const result = await service.addMovie(movieData);

    return res.status(201).json(
      createResponse({
        success: true,
        data: result,
        message: "Movie added successfully",
      })
    );
  } catch (err: any) {
    if (err.message.includes("already exists")) {
      return res
        .status(409)
        .json(createResponse({ success: false, message: err.message }));
    }
    next(err);
  }
}

export async function getMovies(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    
    const result = await service.getMoviesPaginated(page, limit);
    
    return res.status(200).json(
      createResponse({
        success: true,
        data: result.movies,
        meta: {
          pagination: {
            currentPage: result.currentPage,
            totalPages: result.totalPages,
            total: result.total,
            limit: limit,
            hasNextPage: result.hasNextPage,
            hasPrevPage: result.hasPrevPage
          }
        }
      })
    );
  } catch (err) {
    next(err);
  }
}

export async function getMoviesWithFilters(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const filters = {
      search: req.query.search as string,
      isActive: req.query.isActive ? req.query.isActive === 'true' : undefined,
      rating: req.query.rating as string,
      minDuration: req.query.minDuration ? parseInt(req.query.minDuration as string) : undefined,
      maxDuration: req.query.maxDuration ? parseInt(req.query.maxDuration as string) : undefined,
      releaseYearStart: req.query.releaseYearStart ? parseInt(req.query.releaseYearStart as string) : undefined,
      releaseYearEnd: req.query.releaseYearEnd ? parseInt(req.query.releaseYearEnd as string) : undefined,
      language: req.query.language as string,
      genre: req.query.genre as string,
      sortBy: req.query.sortBy as string || 'title',
      sortOrder: req.query.sortOrder as 'asc' | 'desc' || 'asc',
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
    };

    const result = await service.getMoviesWithFilters(filters);
    
    return res.status(200).json(
      createResponse({
        success: true,
        data: result.movies,
        meta: {
          pagination: {
            currentPage: result.currentPage,
            totalPages: result.totalPages,
            total: result.total,
            limit: filters.limit,
            hasNextPage: result.hasNextPage,
            hasPrevPage: result.hasPrevPage
          },
          filters: {
            applied: Object.keys(filters).filter(key => 
              filters[key as keyof typeof filters] !== undefined && 
              filters[key as keyof typeof filters] !== null &&
              filters[key as keyof typeof filters] !== ''
            ).length
          }
        }
      })
    );
  } catch (err) {
    next(err);
  }
}

export async function toggleMovieStatus(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { movieId } = req.params;
    
    const movie = await service.toggleMovieStatus(movieId);
    return res.status(200).json(
      createResponse({
        success: true,
        data: movie,
        message: "Movie status updated successfully",
      })
    );
  } catch (err) {
    next(err);
  }
}

export async function updateMovie(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { movieId } = req.params;
    const movieData = req.body;
    const updated = await service.updateMovie(movieId, movieData);

    if (!updated) {
      return res
        .status(404)
        .json(createResponse({ success: false, message: "Movie not found" }));
    }

    return res.status(200).json(
      createResponse({
        success: true,
        data: updated,
        message: "Movie updated successfully",
      })
    );
  } catch (err) {
    next(err);
  }
}

export async function getMovieById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { movieId } = req.params;
   
    const movie = await service.getMovieById(movieId);

    if (!movie) {
      return res
        .status(404)
        .json(createResponse({ success: false, message: "Movie not found" }));
    }

    return res.status(200).json(
      createResponse({
        success: true,
        data: movie,
        message: "Movie found",
      })
    );
  } catch (err) {
    next(err);
  }
}

export async function deleteMovie(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { movieId } = req.params;
    
    const success = await service.deleteMovie(movieId);
    if (!success) {
      return res
        .status(404)
        .json(createResponse({ success: false, message: "Movie not found" }));
    }
    return res
      .status(200)
      .json(createResponse({ success: true, message: "Movie deleted successfully" }));
  } catch (err) {
    next(err);
  }
}

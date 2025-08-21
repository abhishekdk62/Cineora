import { Request, Response, NextFunction } from "express";
import { createResponse } from "../../../utils/createResponse";
import { IMovieService } from "../interfaces/movies.service.interface";
import {
  CreateMovieDto,
  MovieFiltersDto,
  PaginationQueryDto,
  UpdateMovieDto,
  UpdateMovieParamsDto,
} from "../dtos/dtos";

export class MoviesController {
  constructor(private readonly movieService: IMovieService) {}

  async getMoviesWithFilters(req: Request, res: Response): Promise<any> {
    try {
      const filters: MovieFiltersDto = req.query as unknown as MovieFiltersDto;

      const result = await this.movieService.getMoviesWithFilters(filters);

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
              hasPrevPage: result.hasPrevPage,
            },
            filters: {
              applied: Object.keys(filters).filter(
                (key) =>
                  filters[key as keyof typeof filters] !== undefined &&
                  filters[key as keyof typeof filters] !== null &&
                  filters[key as keyof typeof filters] !== ""
              ).length,
            },
          },
        })
      );
    } catch (err) {
      res.status(500).json(
        createResponse({
          success: false,
          message: err.message,
        })
      );
    }
  }

  async addMovie(req: Request, res: Response): Promise<any> {
    try {
      const movieData: CreateMovieDto = req.body;

      if (!movieData.title || !movieData.tmdbId) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "Title and TMDB ID are required",
          })
        );
      }

      const result = await this.movieService.addMovie(movieData);

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
      res.status(500).json(
        createResponse({
          success: false,
          message: err.message,
        })
      );
    }
  }

  async getMovies(req: Request, res: Response): Promise<any> {
    try {
      const paginationQuery: PaginationQueryDto =
        req.query as unknown as PaginationQueryDto;

      const result = await this.movieService.getMoviesPaginated(
        paginationQuery.page,
        paginationQuery.limit
      );

      return res.status(200).json(
        createResponse({
          success: true,
          data: result.movies,
          meta: {
            pagination: {
              currentPage: result.currentPage,
              totalPages: result.totalPages,
              total: result.total,
              limit: paginationQuery.limit,
              hasNextPage: result.hasNextPage,
              hasPrevPage: result.hasPrevPage,
            },
          },
        })
      );
    } catch (err) {
      res.status(500).json(
        createResponse({
          success: false,
          message: err.message,
        })
      );
    }
  }

  async toggleMovieStatus(req: Request, res: Response): Promise<any> {
    try {
      const { movieId } = req.params;

      const movie = await this.movieService.toggleMovieStatus(movieId);
      return res.status(200).json(
        createResponse({
          success: true,
          data: movie,
          message: "Movie status updated successfully",
        })
      );
    } catch (err) {
      res.status(500).json(
        createResponse({
          success: false,
          message: err.message,
        })
      );
    }
  }

 async updateMovie(req: Request, res: Response) { // ✅ Remove Promise<void>
  try {
    const { movieId } = req.params;
    if (!movieId) {
      return res.status(400).json({ error: "Movie ID is required" });
    }

    const movieData: UpdateMovieDto = req.body;

    // ✅ Use movieId (not params.movieId)
    const updated = await this.movieService.updateMovie(
      movieId, // ✅ Fixed - was params.movieId
      movieData
    );

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
    // ✅ Add return for consistency
    return res.status(500).json(
      createResponse({
        success: false,
        message: err.message,
      })
    );
  }
}


  async getMovieById(req: Request, res: Response): Promise<any> {
    try {
      const { movieId } = req.params;

      const movie = await this.movieService.getMovieById(movieId);

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
      res.status(500).json(
        createResponse({
          success: false,
          message: err.message,
        })
      );
    }
  }

  async deleteMovie(req: Request, res: Response): Promise<any> {
    try {
      const { movieId } = req.params;

      const success = await this.movieService.deleteMovie(movieId);
      if (!success) {
        return res
          .status(404)
          .json(createResponse({ success: false, message: "Movie not found" }));
      }
      return res.status(200).json(
        createResponse({
          success: true,
          message: "Movie deleted successfully",
        })
      );
    } catch (err) {
      res.status(500).json(
        createResponse({
          success: false,
          message: err.message,
        })
      );
    }
  }
}

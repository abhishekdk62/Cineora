import { Request, Response } from "express";
import { createResponse } from "../../../utils/createResponse";
import { IMovieService } from "../interfaces/movies.service.interface";
import {
  CreateMovieDto,
  UpdateMovieDto,
  MovieFiltersDto,
  PaginationQueryDto,
  MovieParamsDto,
} from "../dtos/dtos";
import { StatusCodes } from "../../../utils/statuscodes";
import { MOVIE_MESSAGES } from "../../../utils/messages.constants";

export class MoviesController {
  constructor(private readonly movieService: IMovieService) {}

  async getMoviesWithFilters(req: Request, res: Response): Promise<Response> {
    try {
      const filters: MovieFiltersDto = this.mapQueryToMovieFilters(req.query);

      const result = await this.movieService.getMoviesWithFilters(filters);

      return this._sendSuccessResponse(res, StatusCodes.OK, {
        data: result.movies,
        meta: this._buildPaginationMeta(result, filters),
      });
    } catch (error) {
      return this._sendErrorResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
  }

  async addMovie(req: Request, res: Response): Promise<Response> {
    try {
      const movieData: CreateMovieDto = this._mapBodyToCreateMovieDto(req.body);

      const result = await this.movieService.addMovie(movieData);

      if (!result) {
        return this._sendErrorResponse(
          res, 
          StatusCodes.BAD_REQUEST, 
          MOVIE_MESSAGES.TITLE_TMDB_REQUIRED
        );
      }

      return this._sendSuccessResponse(res, StatusCodes.CREATED, {
        data: result,
        message: MOVIE_MESSAGES.MOVIE_ADDED_SUCCESS,
      });
    } catch (error) {
      return this._sendErrorResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
  }

  async getMovies(req: Request, res: Response): Promise<Response> {
    try {
      const paginationQuery: PaginationQueryDto = this._mapQueryToPaginationDto(req.query);

      const result = await this.movieService.getMoviesPaginated(
        paginationQuery.page,
        paginationQuery.limit
      );

      return this._sendSuccessResponse(res, StatusCodes.OK, {
        data: result.movies,
        meta: this._buildSimplePaginationMeta(result, paginationQuery),
      });
    } catch (error) {
      return this._sendErrorResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
  }

  async toggleMovieStatus(req: Request, res: Response): Promise<Response> {
    try {
      const { movieId } = this._mapParamsToMovieParams(req.params);

      const movie = await this.movieService.toggleMovieStatus(movieId);

      if (!movie) {
        return this._sendErrorResponse(
          res, 
          StatusCodes.NOT_FOUND, 
          MOVIE_MESSAGES.MOVIE_NOT_FOUND
        );
      }

      return this._sendSuccessResponse(res, StatusCodes.OK, {
        data: movie,
        message: MOVIE_MESSAGES.MOVIE_STATUS_UPDATED,
      });
    } catch (error) {
      return this._sendErrorResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
  }

  async updateMovie(req: Request, res: Response): Promise<Response> {
    try {
      const { movieId } = this._mapParamsToMovieParams(req.params);
      
      if (!movieId) {
        return this._sendErrorResponse(
          res, 
          StatusCodes.BAD_REQUEST, 
          "Movie ID is required"
        );
      }

      const movieData: UpdateMovieDto = this._mapBodyToUpdateMovieDto(req.body);

      const updated = await this.movieService.updateMovie(movieId, movieData);

      if (!updated) {
        return this._sendErrorResponse(
          res, 
          StatusCodes.NOT_FOUND, 
          MOVIE_MESSAGES.MOVIE_NOT_FOUND
        );
      }

      return this._sendSuccessResponse(res, StatusCodes.OK, {
        data: updated,
        message: MOVIE_MESSAGES.MOVIE_UPDATED_SUCCESS,
      });
    } catch (error) {
      return this._sendErrorResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
  }

  async getMovieById(req: Request, res: Response): Promise<Response> {
    try {
      const { movieId } = this._mapParamsToMovieParams(req.params);

      const movie = await this.movieService.getMovieById(movieId);

      if (!movie) {
        return this._sendErrorResponse(
          res, 
          StatusCodes.NOT_FOUND, 
          MOVIE_MESSAGES.MOVIE_NOT_FOUND
        );
      }

      return this._sendSuccessResponse(res, StatusCodes.OK, {
        data: movie,
        message: MOVIE_MESSAGES.MOVIE_FOUND,
      });
    } catch (error) {
      return this._sendErrorResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
  }

  async deleteMovie(req: Request, res: Response): Promise<Response> {
    try {
      const { movieId } = this._mapParamsToMovieParams(req.params);

      const success = await this.movieService.deleteMovie(movieId);

      if (!success) {
        return this._sendErrorResponse(
          res, 
          StatusCodes.NOT_FOUND, 
          MOVIE_MESSAGES.MOVIE_NOT_FOUND
        );
      }

      return this._sendSuccessResponse(res, StatusCodes.OK, {
        message: MOVIE_MESSAGES.MOVIE_DELETED_SUCCESS,
      });
    } catch (error) {
      return this._sendErrorResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
  }

  // Private helper methods for request/response mapping
  private mapQueryToMovieFilters(query: any): MovieFiltersDto {
    return query as MovieFiltersDto;
  }

  private _mapQueryToPaginationDto(query: any): PaginationQueryDto {
    return query as PaginationQueryDto;
  }

  private _mapBodyToCreateMovieDto(body: any): CreateMovieDto {
    return body as CreateMovieDto;
  }

  private _mapBodyToUpdateMovieDto(body: any): UpdateMovieDto {
    return body as UpdateMovieDto;
  }

  private _mapParamsToMovieParams(params: any): MovieParamsDto {
    return params as MovieParamsDto;
  }

  private _buildPaginationMeta(result: any, filters: MovieFiltersDto) {
    return {
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
            filters[key as keyof MovieFiltersDto] !== undefined &&
            filters[key as keyof MovieFiltersDto] !== null &&
            filters[key as keyof MovieFiltersDto] !== ""
        ).length,
      },
    };
  }

  private _buildSimplePaginationMeta(result: any, paginationQuery: PaginationQueryDto) {
    return {
      pagination: {
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        total: result.total,
        limit: paginationQuery.limit,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
      },
    };
  }

  private _sendSuccessResponse(
    res: Response, 
    statusCode: number, 
    payload: { data?: any; message?: string; meta?: any }
  ): Response {
    return res.status(statusCode).json(
      createResponse({
        success: true,
        ...payload,
      })
    );
  }

  private _sendErrorResponse(
    res: Response, 
    statusCode: number, 
    message: string
  ): Response {
    return res.status(statusCode).json(
      createResponse({
        success: false,
        message,
      })
    );
  }
}

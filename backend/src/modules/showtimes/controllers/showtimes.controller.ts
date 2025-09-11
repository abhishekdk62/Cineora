import { Request, Response } from "express";
import { IShowtimeService } from "../interfaces/showtimes.service.interface";
import {
  CreateShowtimeDTO,
  UpdateShowtimeDTO,
  ShowtimeFilters,
  SeatBookingDTO,
  PaginationQueryDto,
  UpdateStatusDto,
  EditShowtimeDto
} from "../dtos/dto";
import { StatusCodes } from "../../../utils/statuscodes";
import { SHOWTIME_MESSAGES } from "../../../utils/messages.constants";
import { createResponse } from "../../../utils/createResponse";



export interface ShowtimeFiltersDto extends ShowtimeFilters {}
export interface CreateShowtimeDto extends CreateShowtimeDTO {}
export interface UpdateShowtimeDto extends UpdateShowtimeDTO {}
export interface BlockSeatsDto extends SeatBookingDTO {}

export interface ExtendedCreateResponseParams {
  success: boolean;
  message: string;
  data?: any;
  requestedDate?: string;
  meta?: {
    pagination?: {
      currentPage: number;
      totalPages: number;
      total: number;
      limit: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
    [key: string]: any;
  };
}

export class ShowtimeController {
  constructor(private readonly _showtimeService: IShowtimeService) {}

  async createShowtime(req: Request, res: Response): Promise<void> {
    try {
      const { ownerId } = req.owner;

      if (Array.isArray(req.body.showtimes)) {
        const results = await this._showtimeService.createBulkShowtimes(
          req.body.showtimes,
          ownerId
        );

        res.status(results.success ? StatusCodes.OK : StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: results.success,
            message: results.message,
            data: results.data,
          })
        );
        return;
      }

      const createShowtimeDto: CreateShowtimeDto = req.body;
      const result = await this._showtimeService.createShowtime(createShowtimeDto, ownerId);

      const statusCode = result.success ? StatusCodes.OK : StatusCodes.BAD_REQUEST;
      res.status(statusCode).json(
        createResponse({
          success: result.success,
          message: result.message,
          data: result.data,
        })
      );
    } catch (error) {
      this._handleError(res, error, SHOWTIME_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async updateShowtime(req: Request, res: Response): Promise<void> {
    try {
      const { showtimeId } = req.params;
      const updateShowtimeDto: UpdateShowtimeDto = req.body;

      const result = await this._showtimeService.updateShowtime(showtimeId, updateShowtimeDto);

      const statusCode = result.success ? StatusCodes.OK : StatusCodes.BAD_REQUEST;
      res.status(statusCode).json(
        createResponse({
          success: result.success,
          message: result.message,
          data: result.data,
        })
      );
    } catch (error) {
      this._handleError(res, error, SHOWTIME_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async editShowtime(req: Request, res: Response): Promise<void> {
    try {
      const { ownerId } = req.owner;
      const editShowtimeDto: EditShowtimeDto = req.body;

      if (!editShowtimeDto || !editShowtimeDto._id) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: SHOWTIME_MESSAGES.SHOWTIME_ID_REQUIRED,
          })
        );
        return;
      }

      const result = await this._showtimeService.updateShowtime(
        editShowtimeDto._id,
        editShowtimeDto,
        ownerId
      );

      const statusCode = result.success ? StatusCodes.OK : StatusCodes.BAD_REQUEST;
      res.status(statusCode).json(
        createResponse({
          success: result.success,
          message: result.message,
          data: result.data,
        })
      );
    } catch (error) {
      this._handleError(res, error, SHOWTIME_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteShowtime(req: Request, res: Response): Promise<void> {
    try {
      const { showtimeId } = req.params;
      const result = await this._showtimeService.deleteShowtime(showtimeId);

      const statusCode = result.success ? StatusCodes.OK : StatusCodes.NOT_FOUND;
      res.status(statusCode).json(
        createResponse({
          success: result.success,
          message: result.message,
          data: result.data,
        })
      );
    } catch (error) {
      this._handleError(res, error, SHOWTIME_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async changeShowtimeStatus(req: Request, res: Response): Promise<void> {
    try {
      const { showtimeId } = req.params;
      const updateStatusDto: UpdateStatusDto = req.body;

      const result = await this._showtimeService.updateShowtimeStatus(
        showtimeId,
        updateStatusDto.isActive
      );

      const statusCode = result.success ? StatusCodes.OK : StatusCodes.BAD_REQUEST;
      res.status(statusCode).json(
        createResponse({
          success: result.success,
          message: result.message,
          data: result.data,
        })
      );
    } catch (error) {
      this._handleError(res, error, SHOWTIME_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async getShowtimeById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this._showtimeService.getShowtimeById(id);

      const statusCode = result.success ? StatusCodes.OK : StatusCodes.NOT_FOUND;
      res.status(statusCode).json(
        createResponse({
          success: result.success,
          message: result.message,
          data: result.data,
        })
      );
    } catch (error) {
      this._handleError(res, error, SHOWTIME_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async getShowtimesByOwnerId(req: Request, res: Response): Promise<void> {
    try {
      const { ownerId } = req.owner;

      if (!ownerId) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: SHOWTIME_MESSAGES.OWNER_ID_REQUIRED,
          })
        );
        return;
      }

      const { page, limit } = req.query;

      if (page && limit) {
        const paginationQuery: PaginationQueryDto = {
          page: parseInt(page as string, 10),
          limit: parseInt(limit as string, 10)
        };

        const result = await this._showtimeService.getShowtimesByOwnerIdPaginated(
          ownerId,
          paginationQuery.page,
          paginationQuery.limit
        );

        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: SHOWTIME_MESSAGES.DATA_FETCHED_SUCCESSFULLY,
            data: result.data?.items,
            meta: {
              pagination: {
                currentPage: paginationQuery.page,
                totalPages: Math.ceil((result.data?.total || 0) / paginationQuery.limit),
                total: result.data?.total || 0,
                limit: paginationQuery.limit,
                hasNextPage: paginationQuery.page < Math.ceil((result.data?.total || 0) / paginationQuery.limit),
                hasPrevPage: paginationQuery.page > 1,
              },
            },
          })
        );
        return;
      }

      const result = await this._showtimeService.getShowtimesByOwnerId(ownerId);
      res.status(StatusCodes.OK).json(
        createResponse({
          success: true,
          message: SHOWTIME_MESSAGES.DATA_FETCHED_SUCCESSFULLY,
          data: result.data,
        })
      );
    } catch (error) {
      this._handleError(res, error, SHOWTIME_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async getTheatersByMovie(req: Request, res: Response): Promise<void> {
    try {
      const { movieId } = req.params;
      const { date } = req.query;

      if (!date) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: SHOWTIME_MESSAGES.DATE_PARAMETER_REQUIRED,
          })
        );
        return;
      }

      const result = await this._showtimeService.getTheatersByMovie(
        movieId,
        new Date(date as string)
      );

      const statusCode = result.success ? StatusCodes.OK : StatusCodes.NOT_FOUND;
      res.status(statusCode).json(
        createResponse({
          success: result.success,
          message: result.message,
          data: result.data,
        })
      );
    } catch (error) {
      this._handleError(res, error, SHOWTIME_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async getShowtimesByScreen(req: Request, res: Response): Promise<void> {
    try {
      const { screenId } = req.params;
      const { date } = req.query;

      if (!date) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: SHOWTIME_MESSAGES.DATE_PARAMETER_REQUIRED,
          })
        );
        return;
      }

      const result = await this._showtimeService.getShowtimesByScreen(
        screenId,
        new Date(date as string)
      );

      const statusCode = result.success ? StatusCodes.OK : StatusCodes.NOT_FOUND;
      res.status(statusCode).json(
        createResponse({
          success: result.success,
          message: result.message,
          data: result.data,
        })
      );
    } catch (error) {
      this._handleError(res, error, SHOWTIME_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async getShowtimesByTheater(req: Request, res: Response): Promise<void> {
    try {
      const { theaterId } = req.params;
      const { date } = req.query;

      if (!date) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: SHOWTIME_MESSAGES.DATE_PARAMETER_REQUIRED,
          })
        );
        return;
      }

      const result = await this._showtimeService.getShowtimesByTheater(
        theaterId,
        new Date(date as string)
      );

      const statusCode = result.success ? StatusCodes.OK : StatusCodes.NOT_FOUND;
      res.status(statusCode).json(
        createResponse({
          success: result.success,
          message: result.message,
          data: result.data,
        })
      );
    } catch (error) {
      this._handleError(res, error, SHOWTIME_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async blockShowtimeSeats(req: Request, res: Response): Promise<void> {
    try {
      const { showtimeId } = req.params;
      const blockSeatsDto: BlockSeatsDto = req.body;

      const result = await this._showtimeService.blockShowtimeSeats(
        showtimeId,
        blockSeatsDto.seatIds,
        blockSeatsDto.userId,
        blockSeatsDto.sessionId
      );

      const statusCode = result.success ? StatusCodes.OK : StatusCodes.BAD_REQUEST;
      res.status(statusCode).json(
        createResponse({
          success: result.success,
          message: result.message,
          data: result.data,
        })
      );
    } catch (error) {
      this._handleError(res, error, SHOWTIME_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async getShowtimesByScreenAdmin(req: Request, res: Response): Promise<void> {
    try {
      const { screenId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const filters: ShowtimeFiltersDto = {
        search: req.query.search as string,
        showDate: req.query.showDate as string,
        isActive: req.query.isActive ? req.query.isActive === "true" : undefined,
        format: req.query.format as string,
        language: req.query.language as string,
        sortBy: (req.query.sortBy as string) || "showDate",
        sortOrder: (req.query.sortOrder as "asc" | "desc") || "asc",
      };

      const result = await this._showtimeService.getShowtimesByScreenAdmin(
        screenId,
        page,
        limit,
        filters
      );

      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: result.message,
            data: result.data,
            meta: {
              pagination: {
                currentPage: page,
                totalPages: Math.ceil((result.data?.total || 0) / limit),
                total: result.data?.total || 0,
                limit: limit,
                hasNextPage: page < Math.ceil((result.data?.total || 0) / limit),
                hasPrevPage: page > 1,
              },
            },
          })
        );
      } else {
        res.status(StatusCodes.NOT_FOUND).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }
    } catch (error) {
      this._handleError(res, error, SHOWTIME_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async getShowtimesByFilters(req: Request, res: Response): Promise<void> {
    try {
      const { theaterId, screenId } = req.params;
      const { date } = req.query;

      if (!theaterId || !screenId) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: SHOWTIME_MESSAGES.THEATER_SCREEN_ID_REQUIRED,
          })
        );
        return;
      }

      const targetDate = date ? new Date(date as string) : new Date();

      if (isNaN(targetDate.getTime())) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: SHOWTIME_MESSAGES.INVALID_DATE_FORMAT,
          })
        );
        return;
      }

      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      const result = await this._showtimeService.getShowtimesByFilters(
        theaterId,
        screenId,
        startOfDay,
        endOfDay
      );

      if (result.success) {
        const responseData: ExtendedCreateResponseParams = {
          success: true,
          message: result.message,
          data: result.data,
          requestedDate: targetDate.toISOString().split('T')[0],
        };

        res.status(StatusCodes.OK).json(responseData);
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }
    } catch (error) {
      this._handleError(res, error, SHOWTIME_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  private _handleError(res: Response, error: unknown, defaultMessage: string): void {
    const errorMessage = error instanceof Error ? error.message : defaultMessage;
    
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      createResponse({
        success: false,
        message: errorMessage,
      })
    );
  }
}

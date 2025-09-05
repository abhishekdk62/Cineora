import { Request, Response } from "express";
import { IScreenService } from "../interfaces/screens.services.interface";
import {
  CreateScreenDto,
  UpdateScreenDto,
  ScreenFilterDto,
  AdvancedScreenFilterDto,
} from "../dtos/dtos";
import { StatusCodes } from "../../../utils/statuscodes";
import { SCREEN_MESSAGES } from "../../../utils/messages.constants";
import { createResponse } from "../../../utils/createResponse";

// Controller-specific DTOs
export interface GetAllScreensQueryDto {
  page: number;
  limit: number;
  filters?: ScreenFilterDto;
}

export interface ScreenExistsQueryDto {
  name: string;
  theaterId: string;
  excludedId?: string;
}

export interface PaginationQueryDto {
  page: number;
  limit: number;
}

export class ScreenController {
  constructor(private readonly screenService: IScreenService) {}

  async createScreen(req: Request, res: Response): Promise<void> {
    try {
      const createScreenDto: CreateScreenDto = req.body;

      const result = await this.screenService.createScreen(createScreenDto);

      const statusCode = result.success ? StatusCodes.CREATED : StatusCodes.BAD_REQUEST;
      res.status(statusCode).json(
        createResponse({
          success: result.success,
          message: result.message,
          data: result.data,
        })
      );
    } catch (error) {
      this._handleError(res, error, SCREEN_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async getScreenById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.screenService.getScreenById(id);

      const statusCode = result.success ? StatusCodes.OK : StatusCodes.NOT_FOUND;
      res.status(statusCode).json(
        createResponse({
          success: result.success,
          message: result.message,
          data: result.data,
        })
      );
    } catch (error) {
      this._handleError(res, error, SCREEN_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllScreensPaginated(req: Request, res: Response): Promise<void> {
    try {
      const queryDto: GetAllScreensQueryDto = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        filters: this.buildScreenFilters(req.query),
      };

      const result = await this.screenService.getAllScreensPaginated(
        queryDto.page,
        queryDto.limit,
        queryDto.filters
      );

      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: result.message,
            data: result.data,
            meta: {
              pagination: this._buildPaginationMeta(
                queryDto.page,
                queryDto.limit,
                result.data?.total || 0
              ),
            },
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }
    } catch (error) {
      this._handleError(res, error, SCREEN_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async getScreensByTheaterId(req: Request, res: Response): Promise<void> {
    try {
      const { theaterId } = req.params;
      const result = await this.screenService.getScreensByTheaterId(theaterId);

      const statusCode = result.success ? StatusCodes.OK : StatusCodes.NOT_FOUND;
      res.status(statusCode).json(
        createResponse({
          success: result.success,
          message: result.message,
          data: result.data,
        })
      );
    } catch (error) {
      this._handleError(res, error, SCREEN_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async getScreensByTheaterIdWithAdvancedFilters(req: Request, res: Response): Promise<void> {
    try {
      const { theaterId } = req.params;
      const filtersDto: AdvancedScreenFilterDto = this._buildAdvancedScreenFilters(req.query);

      const result = await this.screenService.getScreensByTheaterIdWithAdvancedFilters(
        theaterId,
        filtersDto
      );

      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: result.message,
            data: result.data,
            meta: {
              pagination: this._buildPaginationMeta(
                filtersDto.page || 1,
                filtersDto.limit || 10,
                result.data?.totalFiltered || 0
              ),
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
      this._handleError(res, error, SCREEN_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async getActiveScreensByTheaterId(req: Request, res: Response): Promise<void> {
    try {
      const { theaterId } = req.params;
      const result = await this.screenService.getActiveScreensByTheaterId(theaterId);

      const statusCode = result.success ? StatusCodes.OK : StatusCodes.NOT_FOUND;
      res.status(statusCode).json(
        createResponse({
          success: result.success,
          message: result.message,
          data: result.data,
        })
      );
    } catch (error) {
      this._handleError(res, error, SCREEN_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async getScreenStatisticsByTheaterId(req: Request, res: Response): Promise<void> {
    try {
      const { theaterId } = req.params;

      if (!theaterId) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: SCREEN_MESSAGES.THEATER_ID_REQUIRED,
          })
        );
        return;
      }

      const result = await this.screenService.getScreenStatisticsByTheaterId(theaterId);

      const statusCode = result.success ? StatusCodes.OK : StatusCodes.BAD_REQUEST;
      res.status(statusCode).json(
        createResponse({
          success: result.success,
          message: result.message,
          data: result.data,
        })
      );
    } catch (error) {
      this._handleError(res, error, SCREEN_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async getScreenCountByTheaterId(req: Request, res: Response): Promise<void> {
    try {
      const { theaterId } = req.params;
      const result = await this.screenService.getScreenCountByTheaterId(theaterId);

      const statusCode = result.success ? StatusCodes.OK : StatusCodes.NOT_FOUND;
      res.status(statusCode).json(
        createResponse({
          success: result.success,
          message: result.message,
          data: result.data,
        })
      );
    } catch (error) {
      this._handleError(res, error, SCREEN_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async getScreenByTheaterAndName(req: Request, res: Response): Promise<void> {
    try {
      const { theaterId, name } = req.params;
      const result = await this.screenService.getScreenByTheaterAndName(theaterId, name);

      const statusCode = result.success ? StatusCodes.OK : StatusCodes.NOT_FOUND;
      res.status(statusCode).json(
        createResponse({
          success: result.success,
          message: result.message,
          data: result.data,
        })
      );
    } catch (error) {
      this._handleError(res, error, SCREEN_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async getScreenWithTheaterData(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.screenService.getScreenWithTheaterData(id);

      const statusCode = result.success ? StatusCodes.OK : StatusCodes.NOT_FOUND;
      res.status(statusCode).json(
        createResponse({
          success: result.success,
          message: result.message,
          data: result.data,
        })
      );
    } catch (error) {
      this._handleError(res, error, SCREEN_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async updateScreen(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateScreenDto: UpdateScreenDto = req.body;
      
      const result = await this.screenService.updateScreen(id, updateScreenDto);

      const statusCode = result.success ? StatusCodes.OK : StatusCodes.BAD_REQUEST;
      res.status(statusCode).json(
        createResponse({
          success: result.success,
          message: result.message,
          data: result.data,
        })
      );
    } catch (error) {
      this._handleError(res, error, SCREEN_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async toggleScreenStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // Check if screen exists first using the correct method name
      const screenCheck = await this.screenService.getScreenWithTheaterData(id);
      if (!screenCheck.success) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: screenCheck.message,
          })
        );
        return;
      }

      const result = await this.screenService.toggleScreenStatus(id);

      const statusCode = result.success ? StatusCodes.OK : StatusCodes.NOT_FOUND;
      res.status(statusCode).json(
        createResponse({
          success: result.success,
          message: result.message,
          data: result.data,
        })
      );
    } catch (error) {
      this._handleError(res, error, SCREEN_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteScreen(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.screenService.deleteScreen(id);

      const statusCode = result.success ? StatusCodes.OK : StatusCodes.NOT_FOUND;
      res.status(statusCode).json(
        createResponse({
          success: result.success,
          message: result.message,
        })
      );
    } catch (error) {
      this._handleError(res, error, SCREEN_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteScreensByTheaterId(req: Request, res: Response): Promise<void> {
    try {
      const { theaterId } = req.params;
      const result = await this.screenService.deleteScreensByTheaterId(theaterId);

      const statusCode = result.success ? StatusCodes.OK : StatusCodes.NOT_FOUND;
      res.status(statusCode).json(
        createResponse({
          success: result.success,
          message: result.message,
          data: result.data,
        })
      );
    } catch (error) {
      this._handleError(res, error, SCREEN_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async checkScreenExists(req: Request, res: Response): Promise<void> {
    try {
      // Get data from query params, not body for GET requests
      const { name, theaterId, excludedId } = req.query;
      
      if (!name || !theaterId) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: "Name and theater ID are required",
          })
        );
        return;
      }

      const result = await this.screenService.checkScreenExists(
        name as string,
        theaterId as string,
        excludedId as string
      );

      res.status(StatusCodes.OK).json(
        createResponse({
          success: result.success,
          message: result.message,
          data: result.data,
        })
      );
    } catch (error) {
      this._handleError(res, error, SCREEN_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  // Private helper methods - Following SRP (Single Responsibility Principle)
  private buildScreenFilters(query: any): ScreenFilterDto {
    return {
      isActive: this._parseActiveStatus(query.isActive),
      screenType: query.screenType as string,
      theaterId: query.theaterId as string,
      search: query.search as string,
      sortBy: query.sortBy as string,
      sortOrder: query.sortOrder as "asc" | "desc",
    };
  }

  private _buildAdvancedScreenFilters(query: any): AdvancedScreenFilterDto {
    return {
      page: parseInt(query.page as string) || 1,
      limit: parseInt(query.limit as string) || 10,
      isActive: this._parseActiveStatus(query.isActive),
      screenType: query.screenType as string,
      search: query.search as string,
      sortBy: query.sortBy as string,
      sortOrder: query.sortOrder as "asc" | "desc",
    };
  }

  private _parseActiveStatus(isActive: string): boolean | undefined {
    if (isActive === "true") return true;
    if (isActive === "false") return false;
    return undefined;
  }

  private _buildPaginationMeta(page: number, limit: number, totalCount: number) {
    const totalPages = Math.ceil(totalCount / limit);
    return {
      currentPage: page,
      totalPages,
      total: totalCount,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
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

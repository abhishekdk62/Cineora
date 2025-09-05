import { Request, Response } from "express";
import { createResponse } from "../../../utils/createResponse";
import { ITheaterService } from "../interfaces/theater.service.interface";
import { IScreenService } from "../../screens/interfaces/screens.services.interface";
import { CreateTheaterDTO, UpdateTheaterDTO, TheaterFilters } from "../dtos/dto";
import { StatusCodes } from "../../../utils/statuscodes";
import { THEATER_MESSAGES } from "../../../utils/messages.constants";

export class TheaterController {
  constructor(
    private readonly theaterService: ITheaterService,
    private readonly screenService: IScreenService
  ) {}

  async getTheatersWithFilters(req: Request, res: Response): Promise<void> {
    try {
      const filters = this._extractTheaterFilters(req);
      
      const result = await this.theaterService.getTheatersWithFilters(filters);

      res.status(StatusCodes.OK).json(createResponse({
        success: true,
        message: "Theaters retrieved successfully",
        data: result.theaters,
        meta: {
          pagination: {
            currentPage: result.currentPage,
            totalPages: result.totalPages,
            total: result.total,
            limit: (filters.limit) as number,
            hasNextPage: result.hasNextPage,
            hasPrevPage: result.hasPrevPage,
          },
        },
      }));
    } catch (error: any) {
      this._handleControllerError(res, error, "Failed to retrieve theaters with filters");
    }
  }

  async createTheater(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = this._validateCreateTheaterRequest(req);
      if (!validationResult.isValid) {
        res.status(StatusCodes.BAD_REQUEST).json(createResponse({
          success: false,
          message: validationResult.message,
        }));
        return;
      }

      const { ownerId } = req.owner;
      const createTheaterDto: CreateTheaterDTO = req.body;

      const result = await this.theaterService.createTheater(ownerId, createTheaterDto);

      if (!result.success) {
        res.status(StatusCodes.BAD_REQUEST).json(createResponse({
          success: false,
          message: result.message,
        }));
        return;
      }

      res.status(StatusCodes.CREATED).json(createResponse({
        success: true,
        message: result.message,
        data: result.data,
      }));
    } catch (error: any) {
      this._handleControllerError(res, error, "Failed to create theater");
    }
  }

  async getTheatersByOwnerId(req: Request, res: Response): Promise<void> {
    try {
      const ownerId = this._extractOwnerId(req);
      if (!ownerId) {
        res.status(StatusCodes.BAD_REQUEST).json(createResponse({
          success: false,
          message: THEATER_MESSAGES.OWNER_ID_REQUIRED,
        }));
        return;
      }

      const filters: TheaterFilters = req.query;
      const result = await this.theaterService.getTheatersByOwnerId(ownerId, filters);

      if (!result.success) {
        res.status(StatusCodes.NOT_FOUND).json(createResponse({
          success: false,
          message: result.message,
        }));
        return;
      }

      res.status(StatusCodes.OK).json(createResponse({
        success: true,
        message: result.message,
        data: result.data,
      }));
    } catch (error: any) {
      this._handleControllerError(res, error, "Failed to retrieve theaters by owner");
    }
  }

  async updateTheater(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = this._validateUpdateTheaterRequest(req);
      if (!validationResult.isValid) {
        res.status(StatusCodes.BAD_REQUEST).json(createResponse({
          success: false,
          message: validationResult.message,
        }));
        return;
      }

      const { theaterId } = req.params;
      const updateData: UpdateTheaterDTO = req.body;

      const result = await this.theaterService.updateTheater(theaterId, updateData);

      if (!result.success) {
        const statusCode = this._getUpdateErrorStatusCode(result.message);
        res.status(statusCode).json(createResponse({
          success: false,
          message: result.message,
        }));
        return;
      }

      res.status(StatusCodes.OK).json(createResponse({
        success: true,
        message: result.message,
        data: result.data,
      }));
    } catch (error: any) {
      this._handleControllerError(res, error, "Failed to update theater");
    }
  }

  async deleteTheater(req: Request, res: Response): Promise<void> {
    try {
      const { theaterId } = req.params;

      if (!theaterId) {
        res.status(StatusCodes.BAD_REQUEST).json(createResponse({
          success: false,
          message: THEATER_MESSAGES.THEATER_ID_REQUIRED,
        }));
        return;
      }

      const result = await this.theaterService.deleteTheater(theaterId);

      if (!result.success) {
        const statusCode = this._getDeleteErrorStatusCode(result.message);
        res.status(statusCode).json(createResponse({
          success: false,
          message: result.message,
        }));
        return;
      }

      await this.screenService.deleteScreensByTheaterId(theaterId);

      res.status(StatusCodes.OK).json(createResponse({
        success: true,
        message: result.message,
      }));
    } catch (error: any) {
      this._handleControllerError(res, error, "Failed to delete theater");
    }
  }

  async toggleTheaterStatus(req: Request, res: Response): Promise<void> {
    try {
      const theaterId = this._extractTheaterIdFromParams(req);

      if (!theaterId) {
        res.status(StatusCodes.BAD_REQUEST).json(createResponse({
          success: false,
          message: THEATER_MESSAGES.THEATER_ID_REQUIRED,
        }));
        return;
      }

      const result = await this.theaterService.toggleTheaterStatus(theaterId);

      if (!result.success) {
        res.status(StatusCodes.NOT_FOUND).json(createResponse({
          success: false,
          message: result.message,
        }));
        return;
      }

      res.status(StatusCodes.OK).json(createResponse({
        success: true,
        message: result.message,
        data: result.data,
      }));
    } catch (error: any) {
      this._handleControllerError(res, error, "Failed to toggle theater status");
    }
  }

  async verifyTheater(req: Request, res: Response): Promise<void> {
    try {
      const { theatreId } = req.params;

      if (!theatreId) {
        res.status(StatusCodes.BAD_REQUEST).json(createResponse({
          success: false,
          message: THEATER_MESSAGES.THEATER_ID_REQUIRED,
        }));
        return;
      }

      const result = await this.theaterService.verifyTheater(theatreId);

      if (!result.success) {
        res.status(StatusCodes.NOT_FOUND).json(createResponse({
          success: false,
          message: result.message,
        }));
        return;
      }

      res.status(StatusCodes.OK).json(createResponse({
        success: true,
        message: result.message,
        data: result.data,
      }));
    } catch (error: any) {
      this._handleControllerError(res, error, "Failed to verify theater");
    }
  }

  async rejectTheater(req: Request, res: Response): Promise<void> {
    try {
      const { theatreId } = req.params;
      const { rejectionReason } = req.body;

      if (!theatreId) {
        res.status(StatusCodes.BAD_REQUEST).json(createResponse({
          success: false,
          message: THEATER_MESSAGES.THEATER_ID_REQUIRED,
        }));
        return;
      }

      const result = await this.theaterService.rejectTheater(theatreId, rejectionReason);

      if (!result.success) {
        res.status(StatusCodes.NOT_FOUND).json(createResponse({
          success: false,
          message: result.message,
        }));
        return;
      }

      res.status(StatusCodes.OK).json(createResponse({
        success: true,
        message: result.message,
        data: result.data,
      }));
    } catch (error: any) {
      this._handleControllerError(res, error, "Failed to reject theater");
    }
  }

  async getTheaterById(req: Request, res: Response): Promise<void> {
    try {
      const { theatreId } = req.params;

      if (!theatreId) {
        res.status(StatusCodes.BAD_REQUEST).json(createResponse({
          success: false,
          message: THEATER_MESSAGES.THEATER_ID_REQUIRED,
        }));
        return;
      }

      const result = await this.theaterService.getTheaterById(theatreId);

      if (!result.success) {
        const statusCode = this._getTheaterByIdErrorStatusCode(result.message);
        res.status(statusCode).json(createResponse({
          success: false,
          message: result.message,
        }));
        return;
      }

      res.status(StatusCodes.OK).json(createResponse({
        success: true,
        message: result.message,
        data: result.data,
      }));
    } catch (error: any) {
      this._handleControllerError(res, error, "Failed to retrieve theater");
    }
  }

  // Private helper methods
  private _extractTheaterFilters(req: Request): TheaterFilters {
    let facilities: string[] | undefined;

    if (req.query.facilities && typeof req.query.facilities === "string") {
      facilities = req.query.facilities.split(",").map((f) => f.trim());
    }

    return {
      search: req.query.search as string,
      sortBy: req.query.sortBy as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 6,
      latitude: req.query.latitude ? parseFloat(req.query.latitude as string) : undefined,
      longitude: req.query.longitude ? parseFloat(req.query.longitude as string) : undefined,
      facilities: facilities,
    };
  }

  private _extractOwnerId(req: Request): string | null {
    return req.query.ownerId as string || req.owner?.ownerId || null;
  }

  private _extractTheaterIdFromParams(req: Request): string | null {
    return req.params.id || req.params.theaterId || null;
  }

  private _validateCreateTheaterRequest(req: Request): { isValid: boolean; message: string } {
    const { ownerId } = req.owner || {};
    const createTheaterDto = req.body;

    if (!ownerId) {
      return { isValid: false, message: THEATER_MESSAGES.OWNER_ID_REQUIRED };
    }

    if (!createTheaterDto) {
      return { isValid: false, message: THEATER_MESSAGES.THEATER_DATA_REQUIRED };
    }

    return { isValid: true, message: "" };
  }

  private _validateUpdateTheaterRequest(req: Request): { isValid: boolean; message: string } {
    const { theaterId } = req.params;
    const updateData = req.body;

    if (!theaterId) {
      return { isValid: false, message: THEATER_MESSAGES.THEATER_ID_REQUIRED };
    }

    if (!updateData || Object.keys(updateData).length === 0) {
      return { isValid: false, message: THEATER_MESSAGES.UPDATE_DATA_REQUIRED };
    }

    return { isValid: true, message: "" };
  }

  private _getUpdateErrorStatusCode(message: string): number {
    if (message === THEATER_MESSAGES.THEATER_NOT_FOUND) {
      return StatusCodes.NOT_FOUND;
    } else if (message === THEATER_MESSAGES.THEATER_EXIST_ERROR) {
      return StatusCodes.CONFLICT;
    } else if (message === THEATER_MESSAGES.SOMETHING_WENT_WRONG) {
      return StatusCodes.INTERNAL_SERVER_ERROR;
    }
    return StatusCodes.BAD_REQUEST;
  }

  private _getDeleteErrorStatusCode(message: string): number {
    if (message === THEATER_MESSAGES.THEATER_NOT_FOUND) {
      return StatusCodes.NOT_FOUND;
    } else if (message === THEATER_MESSAGES.SOMETHING_WENT_WRONG) {
      return StatusCodes.INTERNAL_SERVER_ERROR;
    }
    return StatusCodes.BAD_REQUEST;
  }

  private _getTheaterByIdErrorStatusCode(message: string): number {
    if (message === THEATER_MESSAGES.THEATER_EXIST_ERROR) {
      return StatusCodes.CONFLICT;
    } else if (message === THEATER_MESSAGES.THEATER_NOT_FOUND) {
      return StatusCodes.NOT_FOUND;
    } else if (message === THEATER_MESSAGES.SOMETHING_WENT_WRONG) {
      return StatusCodes.INTERNAL_SERVER_ERROR;
    }
    return StatusCodes.NOT_FOUND;
  }

  private _handleControllerError(res: Response, error: any, defaultMessage: string): void {
    console.error(`Controller error: ${defaultMessage}`, error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(createResponse({
      success: false,
      message: error.message || defaultMessage,
    }));
  }
}

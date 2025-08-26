import { Request, Response, NextFunction } from "express";
import { createResponse } from "../../../utils/createResponse";
import { ScreenService } from "../../screens/services/screens.service";
import { ITheaterService } from "../interfaces/theater.service.interface";
import {
  CreateTheaterDto,
  PaginatedTheatersDto,
  TheaterFilters,
  TheatersByOwnerDto,
  UpdateTheaterDto,
} from "../dtos/dto";
import { ServiceResponse } from "../../../interfaces/interface";
import { IScreenService } from "../../screens/interfaces/screens.services.interface";

export class TheaterController {
  constructor(
    private readonly theaterService: ITheaterService,
    private readonly screenService: IScreenService
  ) {}

  async getTheatersWithFilters(req: Request, res: Response): Promise<any> {
    try {
      let facilities: string[] | undefined;

      if (req.query.facilities && typeof req.query.facilities === "string") {
        facilities = req.query.facilities.split(",").map((f) => f.trim());
      }
      const filters: TheaterFilters = {
        search: req.query.search as string,
        sortBy: req.query.sortBy as string,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 6,
        latitude: req.query.latitude
          ? parseFloat(req.query.latitude as string)
          : undefined,
        longitude: req.query.longitude
          ? parseFloat(req.query.longitude as string)
          : undefined,
        facilities: facilities,
      };

      const result: PaginatedTheatersDto =
        await this.theaterService.getTheatersWithFilters(filters);

      return res.status(200).json({
        theaters: result.theaters,
        totalCount: result.total,
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
      });
    } catch (err) {
      res.status(500).json(
        createResponse({
          success: false,
          message: err.message,
        })
      );
    }
  }

  async createTheater(req: Request, res: Response): Promise<any> {
    try {
      const { ownerId } = req.owner;
      const createTheaterDto: CreateTheaterDto = req.body;

      if (!ownerId) {
        res.status(400).json(
          createResponse({
            success: false,
            message: "Owner id is required",
          })
        );
        return;
      }
      if (!createTheaterDto) {
        res.status(400).json(
          createResponse({
            success: false,
            message: "Theater data is required",
          })
        );
        return;
      }

      const result = await this.theaterService.createTheater(
        ownerId,
        createTheaterDto
      );

      if (!result.success) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }

      return res.status(201).json(
        createResponse({
          success: true,
          message: result.message,
          data: result.data,
        })
      );
    } catch (error) {
      res.status(500).json(
        createResponse({
          success: false,
          message: error.message,
        })
      );
    }
  }

  async getTheatersByOwnerId(req: Request, res: Response): Promise<any> {
    try {
      const ownerId = req.query.ownerId || req.owner.ownerId;
      const filters: TheaterFilters = req.query;

      if (!ownerId) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "Owner id required",
          })
        );
      }
      const result: ServiceResponse<TheatersByOwnerDto> =
        await this.theaterService.getTheatersByOwnerId(ownerId, filters);

      if (!result.success) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }

      return res.status(200).json(
        createResponse({
          success: true,
          message: result.message,
          data: result.data,
        })
      );
    } catch (error) {
      res.status(500).json(
        createResponse({
          success: false,
          message: error.message,
        })
      );
    }
  }

  async updateTheater(req: Request, res: Response): Promise<any> {
    try {
      const { theaterId } = req.params;
      const updateData: UpdateTheaterDto = req.body;

      if (!theaterId) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "Theater ID is required",
          })
        );
      }

      if (!updateData || Object.keys(updateData).length === 0) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "Update data is required",
          })
        );
      }

      const result = await this.theaterService.updateTheater(
        theaterId,
        updateData
      );

      if (!result.success) {
        let statusCode = 400;

        if (
          result.message ===
          "Theater with this name already exists in this city"
        ) {
          statusCode = 409;
        } else if (result.message === "Theater not found or update failed") {
          statusCode = 404;
        } else if (result.message === "Something went wrong") {
          statusCode = 500;
        }

        return res.status(statusCode).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }

      return res.status(200).json(
        createResponse({
          success: true,
          message: result.message,
          data: result.data,
        })
      );
    } catch (error) {
      res.status(500).json(
        createResponse({
          success: false,
          message: error.message,
        })
      );
    }
  }

  async deleteTheater(req: Request, res: Response): Promise<any> {
    try {
      const { theaterId } = req.params;

      if (!theaterId) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "Theater ID is required",
          })
        );
      }

      const result = await this.theaterService.deleteTheater(theaterId);

      if (!result.success) {
        let statusCode = 400;
        if (result.message === "Theater not found or deletion failed") {
          statusCode = 404;
        } else if (result.message === "Something went wrong") {
          statusCode = 500;
        }

        return res.status(statusCode).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }
      const resp = await this.screenService.deleteScreensByTheater(theaterId);

      return res.status(200).json(
        createResponse({
          success: true,
          message: result.message,
        })
      );
    } catch (error) {
      res.status(500).json(
        createResponse({
          success: false,
          message: error.message,
        })
      );
    }
  }

  // async toggleTheaterStatus(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const { theaterId } = req.params;
  //     const { ownerId } = req.owner;

  //     if (!theaterId) {
  //       return res.status(400).json(
  //         createResponse({
  //           success: false,
  //           message: "Theater ID is required",
  //         })
  //       );
  //     }

  //     const result = await this.theaterService.toggleTheaterStatus(theaterId);

  //     if (!result.success) {
  //       let statusCode = 400;

  //       if (result.message === "Theater not found") {
  //         statusCode = 404;
  //       } else if (result.message === "Something went wrong") {
  //         statusCode = 500;
  //       }

  //       return res.status(statusCode).json(
  //         createResponse({
  //           success: false,
  //           message: result.message,
  //         })
  //       );
  //     }

  //     return res.status(200).json(
  //       createResponse({
  //         success: true,
  //         message: result.message,
  //         data: result.data,
  //       })
  //     );
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  async toggleTheaterStatus(req: Request, res: Response): Promise<any> {
    try {
      const id = req.params.id || req.params.theaterId;

      if (!id) {
        return res.status(400).json({
          message: "Theater ID is required",
          success: false,
        });
      }
      const result = await this.theaterService.toggleTheaterStatus(id);
      if (!result) {
        return res.status(404).json({
          message: "Theater not found",
          success: false,
        });
      }
      res.status(200).json({
        message: "Theater status toggled successfully",
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        message: error.message || "Failed to toggle theater status",
        success: false,
      });
    }
  }
  async verifyTheater(req: Request, res: Response): Promise<any> {
    try {
      const { theatreId } = req.params;

      let id = theatreId;
      if (!id) {
        return res.status(400).json({
          message: "Theater ID is required",
          success: false,
        });
      }

      const result = await this.theaterService.verifyTheater(id);
      if (!result) {
        return res.status(404).json({
          message: "Theater not found",
          success: false,
        });
      }

      res.status(200).json({
        message: "Theater verified successfully",
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        message: error.message || "Failed to verify theater",
        success: false,
      });
    }
  }
  async rejectTheater(req: Request, res: Response): Promise<any> {
    try {
      const { theatreId } = req.params;

      let id = theatreId;
      if (!id) {
        return res.status(400).json({
          message: "Theater ID is required",
          success: false,
        });
      }

      const result = await this.theaterService.rejectTheater(id);
      if (!result) {
        return res.status(404).json({
          message: "Theater not found",
          success: false,
        });
      }

      res.status(200).json({
        message: "Theater rejected successfully",
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        message: error.message || "Failed to reject theater",
        success: false,
      });
    }
  }
  async getTheaterById(req: Request, res: Response): Promise<any> {
    try {
      const { theatreId } = req.params;
      if (!theatreId) {
        return res.status(400).json({
          message: "Theater ID is required",
          success: false,
        });
      }

      const result = await this.theaterService.getTheaterById(theatreId);

      if (!result.success) {
        let statusCode = 400;

        if (
          result.message ===
          "Theater with this name already exists in this city"
        ) {
          statusCode = 409;
        } else if (result.message === "Theater not found or update failed") {
          statusCode = 404;
        } else if (result.message === "Something went wrong") {
          statusCode = 500;
        }

        return res.status(statusCode).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }

      return res.status(200).json(
        createResponse({
          success: true,
          message: result.message,
          data: result.data,
        })
      );
    } catch (error) {
      res.status(500).json(
        createResponse({
          success: false,
          message: error.message,
        })
      );
    }
  }
}

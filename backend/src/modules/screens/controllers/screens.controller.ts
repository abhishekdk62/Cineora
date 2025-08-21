import { Request, Response } from "express";
import { ScreenService } from "../services/screens.service";
import { IScreenService } from "../interfaces/screens.services.interface";
import { AdvancedScreenFilters, CreateScreenDto, GetAllScreensQueryDto, ScreenExistsQueryDto, ScreenFilters, UpdateScreenDto } from "../dtos/dtos";

export class ScreenController {

  constructor(

  private screenService: IScreenService


  ) {
   
  }

  async createScreen(req: Request, res: Response): Promise<void> {
    try {
      const createScreenDto: CreateScreenDto = req.body;


    const result = await this.screenService.createScreen(createScreenDto);


      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  async getScreenById(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.screenService.getScreenById(req.params.id);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  async getAllScreens(req: Request, res: Response): Promise<void> {
    try {

    const queryDto: GetAllScreensQueryDto = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      filters: {
        isActive: req.query.isActive === "true" ? true : req.query.isActive === "false" ? false : undefined,
        screenType: req.query.screenType as string,
        theaterId: req.query.theaterId as string,
        search: req.query.search as string,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as "asc" | "desc",
      } as ScreenFilters
    };

        const result = await this.screenService.getAllScreens(queryDto.page, queryDto.limit, queryDto.filters);

      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  async getScreensByTheaterId(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.screenService.getScreensByTheaterId(
        req.params.theaterId
      );

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  async getScreensByTheaterIdWithFilters(
    req: Request,
    res: Response
  ): Promise<void> {
    try {

    const filtersDto: AdvancedScreenFilters = {
      isActive: req.query.isActive === "true" ? true : req.query.isActive === "false" ? false : undefined,
      screenType: req.query.screenType as string,
      search: req.query.search as string,
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as "asc" | "desc",
    };

    const result = await this.screenService.getScreensByTheaterIdWithFilters(req.params.theaterId, filtersDto);


     

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  async getActiveScreensByTheaterId(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const result = await this.screenService.getActiveScreensByTheaterId(
        req.params.theaterId
      );

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }
  
  getScreenStats = async (req: Request, res: Response) => {
    try {
      const { theaterId } = req.params;

      if (!theaterId) {
        return res.status(400).json({
          success: false,
          message: "Theater ID is required",
        });
      }

      const result = await this.screenService.getScreenStats(theaterId);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Something went wrong",
      });
    }
  };

  async getScreenCountByTheaterId(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.screenService.getScreenCountByTheaterId(
        req.params.theaterId
      );

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  async getScreenByTheaterAndName(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.screenService.getScreenByTheaterAndName(
        req.params.theaterId,
        req.params.name
      );

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  async updateScreen(req: Request, res: Response): Promise<void> {
    try {
          const updateScreenDto: UpdateScreenDto = req.body;
    const result = await this.screenService.updateScreen(req.params.id, updateScreenDto);
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  async toggleScreenStatus(req: Request, res: Response): Promise<void> {
    try {
      const screen = await this.screenService.getScreensTheaterData(
        req.params.id
      );
      if (!screen.success) {
        res.status(403).json(screen.message);
      }
      const result = await this.screenService.toggleScreenStatus(req.params.id);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  async deleteScreen(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.screenService.deleteScreen(req.params.id);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  async checkScreenExists(req: Request, res: Response): Promise<void> {
    try {
    const screenExistsDto: ScreenExistsQueryDto = req.body;
    const result = await this.screenService.checkScreenExists(screenExistsDto.name, screenExistsDto.theaterId, screenExistsDto.excludedId);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }
}

import { Request, Response } from "express";
import { ShowtimeService } from "../services/showtimes.service";
import { ShowtimeRepository } from "../repositories/showtimes.repository";
import { IShowtimeService } from "../interfaces/showtimes.service.interface";
import {
  AdminFiltersDto,
  BlockSeatsDto,
  BookSeatsDto,
  CreateBulkShowtimesDto,
  CreateShowtimeDto,
  DateQueryDto,
  EditShowtimeDto,
  GetAllShowtimesFiltersDto,
  ReleaseSeatsDto,
  UpdateShowtimeDto,
  UpdateStatusDto,
} from "../dtos/dto";

export class ShowtimeController {
  constructor(private readonly showtimeService: IShowtimeService) {}
  async updateShowtime(req: Request, res: Response): Promise<any> {
    try {
      const { showtimeId } = req.params;
      const updateShowtimeDto: UpdateShowtimeDto = req.body;

      const result = await this.showtimeService.updateShowtime(
        showtimeId,
        updateShowtimeDto
      );

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
  async deleteShowtime(req: Request, res: Response): Promise<any> {
    try {
      const { showtimeId } = req.params;
      const result = await this.showtimeService.deleteShowtime(showtimeId);

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
  async getAllShowtimes(req: Request, res: Response): Promise<any> {
    try {
      const { page = 1, limit = 10, theaterId, movieId, date } = req.query;
      const filters: GetAllShowtimesFiltersDto = {
        theaterId: theaterId as string,
        movieId: movieId as string,
        date: date ? new Date(date as string) : undefined,
      };

      const result = await this.showtimeService.getAllShowtimes(
        Number(page),
        Number(limit),
        filters
      );

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
  async changeShowtimeStatus(req: Request, res: Response): Promise<any> {
    try {
      const { showtimeId } = req.params;
      const updateStatusDto: UpdateStatusDto = req.body;
      let id = showtimeId;
      const result = await this.showtimeService.changeShowtimeStatus(
        id,
        updateStatusDto.isActive
      );

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
  async getShowTimes(req: Request, res: Response): Promise<any> {
    try {
      const { ownerId } = req.owner;
      if (!ownerId) {
        return res
          .status(400)
          .json({ succus: false, message: "owner id is required" });
      }

      const data = await this.showtimeService.getShowtimesByOwnerId(ownerId);
      return res.status(200).json({
        message: "data fetched succusfully",
        data: data,
        success: true,
      });
    } catch (error) {
      console.log(error);
    }
  }
  async createShowtime(req: Request, res: Response): Promise<any> {
    try {
      const { ownerId } = req.owner;
      const createBulkDto: CreateBulkShowtimesDto = {
        showtimeList: req.body.showtimes,
      };

      if (Array.isArray(req.body.showtimes)) {
        const results = await this.showtimeService.createBulkShowtimes(
          createBulkDto.showtimeList,
          ownerId
        );

        res.status(results.success ? 201 : 400).json(results);
        return;
      }
      const createShowtimeDto: CreateShowtimeDto = req.body;
      const result = await this.showtimeService.createShowtime(
        createShowtimeDto,
        ownerId
      );

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
  async editShowtime(req: Request, res: Response): Promise<any> {
    try {
      const { ownerId } = req.owner;
      const editShowtimeDto: EditShowtimeDto = req.body;

      if (!editShowtimeDto || !editShowtimeDto._id) {
        res.status(400).json({
          success: false,
          message: "Showtime _id is required for updating.",
        });
        return;
      }

      const result = await this.showtimeService.updateShowtime(
        editShowtimeDto._id,
        editShowtimeDto,
        ownerId
      );

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

  async getShowtime(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const result = await this.showtimeService.getShowtimeById(id);

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
  async getShowtimesByMovie(req: Request, res: Response): Promise<any> {
    try {
      const { movieId } = req.params;
      const { date } = req.query;

      if (!date) {
        res.status(400).json({
          success: false,
          message: "Date parameter is required",
        });
        return;
      }

      const result = await this.showtimeService.getShowtimesByMovie(
        movieId,
        new Date(date as string)
      );

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
  async getTheatersByMovie(req: Request, res: Response): Promise<any> {
    try {
      const { movieId } = req.params;
      const { date } = req.query;
      const dateQueryDto: DateQueryDto = { date: date as string };

      if (!date) {
        res.status(400).json({
          success: false,
          message: "Date parameter is required",
        });
        return;
      }
      const result = await this.showtimeService.getTheatersByMovie(
        movieId,
        new Date(dateQueryDto.date)
      );

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
  async getShowtimesByScreen(req: Request, res: Response): Promise<any> {
    try {
      const { screenId } = req.params;
      const { date } = req.query;
      const dateQueryDto: DateQueryDto = { date: date as string };

      if (!date) {
        res.status(400).json({
          success: false,
          message: "Date parameter is required",
        });
        return;
      }
      const result = await this.showtimeService.getShowtimesByScreen(
        screenId,
        new Date(dateQueryDto.date)
      );

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
  async getShowtimesByTheater(req: Request, res: Response): Promise<any> {
    try {
      const { theaterId } = req.params;
      const { date } = req.query;
      const dateQueryDto: DateQueryDto = { date: date as string };


      if (!date) {
        res.status(400).json({
          success: false,
          message: "Date parameter is required",
        });
        return;
      }
      const result = await this.showtimeService.getShowtimesByTheater(
        theaterId,
        new Date(dateQueryDto.date)
      );

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
  async blockSeats(req: Request, res: Response): Promise<any> {
    try {
      const { showtimeId } = req.params;
      const blockSeatsDto: BlockSeatsDto = req.body;
      const result = await this.showtimeService.blockSeats(
        showtimeId,
        blockSeatsDto.seatIds,
        blockSeatsDto.userId,
        blockSeatsDto.sessionId
      );

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
  async releaseSeats(req: Request, res: Response): Promise<any> {
    try {
      const { showtimeId } = req.params;
const releaseSeatsDto: ReleaseSeatsDto = req.body;
const result = await this.showtimeService.releaseSeats(showtimeId, releaseSeatsDto.seatIds, releaseSeatsDto.userId, releaseSeatsDto.sessionId);

    
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
  async bookSeats(req: Request, res: Response): Promise<any> {
    try {
      const { showtimeId } = req.params;
      const { seatIds } = req.body;
const bookSeatsDto: BookSeatsDto = req.body;
const result = await this.showtimeService.bookSeats(showtimeId, bookSeatsDto.seatIds);



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
  async getShowtimesByScreenAdmin(req: Request, res: Response): Promise<any> {
    try {
      const { screenId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const filters:AdminFiltersDto = {
        search: req.query.search as string,
        showDate: req.query.showDate as string,
        isActive: req.query.isActive
          ? req.query.isActive === "true"
          : undefined,
        format: req.query.format as string,
        language: req.query.language as string,
        sortBy: (req.query.sortBy as string) || "showDate",
        sortOrder: (req.query.sortOrder as "asc" | "desc") || "asc",
      };

      const result = await this.showtimeService.getShowtimesByScreenAdmin(
        screenId,
        page,
        limit,
        filters
      );

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

  async getAllShowtimesAdmin(req: Request, res: Response): Promise<any> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const filters:AdminFiltersDto = {
        search: req.query.search as string,
        showDate: req.query.showDate as string,
        isActive: req.query.isActive
          ? req.query.isActive === "true"
          : undefined,
        format: req.query.format as string,
        language: req.query.language as string,
        theaterId: req.query.theaterId as string,
        screenId: req.query.screenId as string,
        movieId: req.query.movieId as string,
        sortBy: (req.query.sortBy as string) || "showDate",
        sortOrder: (req.query.sortOrder as "asc" | "desc") || "asc",
      };

      const result = await this.showtimeService.getAllShowtimesAdmin(
        page,
        limit,
        filters
      );

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

  async updateShowtimeStatus(req: Request, res: Response): Promise<any> {
    try {
      const { showtimeId } = req.params;
      const { isActive } = req.body;
const updateStatusDto: UpdateStatusDto = req.body;
const result = await this.showtimeService.updateShowtimeStatus(showtimeId, updateStatusDto.isActive);


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
}

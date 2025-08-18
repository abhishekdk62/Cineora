import { Request, Response } from "express";
import { ShowtimeService } from "../services/showtimes.services";
import { ShowtimeRepository } from "../repositories/showtimes.repository";

export class ShowtimeController {
  private showtimeService: ShowtimeService;

  constructor() {
    const showtimeRepo = new ShowtimeRepository();
    this.showtimeService = new ShowtimeService(showtimeRepo);
  }
  async updateShowtime(req: Request, res: Response): Promise<void> {
    try {
      const { showtimeId } = req.params;
      const result = await this.showtimeService.updateShowtime(
        showtimeId,
        req.body
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
  async deleteShowtime(req: Request, res: Response): Promise<void> {
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
  async getAllShowtimes(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, theaterId, movieId, date } = req.query;
      const filters = {
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
  async changeShowtimeStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { isActive } = req.body;

      const result = await this.showtimeService.changeShowtimeStatus(
        id,
        isActive
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
  async getShowTimes(req: Request, res: Response): Promise<void> {
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
  async createShowtime(req: Request, res: Response): Promise<void> {
    try {
      const { ownerId } = req.owner;

      if (Array.isArray(req.body.showtimes)) {
        const results = await this.showtimeService.createBulkShowtimes(
          req.body.showtimes,
          ownerId
        );
        res.status(results.success ? 201 : 400).json(results);
        return;
      }

      const result = await this.showtimeService.createShowtime(
        req.body,
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
 async editShowtime(req: Request, res: Response): Promise<void> {
  try {
    const { ownerId } = req.owner;
    const showtime = req.body; 

  

    if (!showtime || !showtime._id) {
      res.status(400).json({
        success: false,
        message: "Showtime _id is required for updating.",
      });
      return;
    }

    const result = await this.showtimeService.updateShowtime(showtime._id, showtime, ownerId);

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


  async getShowtime(req: Request, res: Response): Promise<void> {
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
  async getShowtimesByMovie(req: Request, res: Response): Promise<void> {
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
  async getTheatersByMovie(req: Request, res: Response): Promise<void> {
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

      const result = await this.showtimeService.getTheatersByMovie(
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
  async getShowtimesByScreen(req: Request, res: Response): Promise<void> {
    try {
      const { screenId } = req.params;
      const { date } = req.query;

      if (!date) {
        res.status(400).json({
          success: false,
          message: "Date parameter is required",
        });
        return;
      }

      const result = await this.showtimeService.getShowtimesByScreen(
        screenId,
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
  async getShowtimesByTheater(req: Request, res: Response): Promise<void> {
    try {
      const { theaterId } = req.params;
      const { date } = req.query;

      if (!date) {
        res.status(400).json({
          success: false,
          message: "Date parameter is required",
        });
        return;
      }

      const result = await this.showtimeService.getShowtimesByTheater(
        theaterId,
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
  async blockSeats(req: Request, res: Response): Promise<void> {
    try {
      const { showtimeId } = req.params;
      const { seatIds, userId, sessionId } = req.body;

      const result = await this.showtimeService.blockSeats(
        showtimeId,
        seatIds,
        userId,
        sessionId
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
  async releaseSeats(req: Request, res: Response): Promise<void> {
    try {
      const { showtimeId } = req.params;
      const { seatIds, userId, sessionId } = req.body;

      const result = await this.showtimeService.releaseSeats(
        showtimeId,
        seatIds,
        userId,
        sessionId
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
  async bookSeats(req: Request, res: Response): Promise<void> {
    try {
      const { showtimeId } = req.params;
      const { seatIds } = req.body;

      const result = await this.showtimeService.bookSeats(showtimeId, seatIds);

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

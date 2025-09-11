import { Request, Response } from "express";
import { IReviewService } from "../interfaces/review.service.interface";
import { AddReviewDto, UpdateReviewDto } from "../dtos/dtos";

export class ReviewController {
  constructor(private readonly _reviewService: IReviewService) {}

  async addReview(req: Request, res: Response): Promise<void> {
    try {
      const reviewData = req.body as AddReviewDto;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ success: false, message: "User not authenticated" });
        return;
      }

      if (!reviewData.rating || (reviewData.rating < 1 || reviewData.rating > 5)) {
        res.status(400).json({ success: false, message: "Valid rating (1-5) is required" });
        return;
      }

      if (!reviewData.movieId && !reviewData.theaterId) {
        res.status(400).json({ success: false, message: "Either movieId or theaterId is required" });
        return;
      }

      const result = await this._reviewService.addReview(userId, reviewData);
      
      const statusCode = result.success ? 201 : 400;
      res.status(statusCode).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  async updateReview(req: Request, res: Response): Promise<void> {
    try {
      const { reviewId } = req.params;
      const reviewData = req.body as UpdateReviewDto;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ success: false, message: "User not authenticated" });
        return;
      }

      const result = await this._reviewService.updateReview(reviewId, userId, reviewData);
      
      const statusCode = result.success ? 200 : 404;
      res.status(statusCode).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  async deleteReview(req: Request, res: Response): Promise<void> {
    try {
      const { reviewId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ success: false, message: "User not authenticated" });
        return;
      }

      const result = await this._reviewService.deleteReview(reviewId, userId);
      
      const statusCode = result.success ? 200 : 404;
      res.status(statusCode).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  async getMovieReviews(req: Request, res: Response): Promise<void> {
    try {
      const { movieId } = req.params;
      const {reviewType}=req.query
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this._reviewService.getMovieReviews(movieId, page, limit);
      
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  async getTheaterReviews(req: Request, res: Response): Promise<void> {
    try {
      const { theaterId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this._reviewService.getTheaterReviews(theaterId, page, limit);
      
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  async getUserReviews(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!userId) {
        res.status(401).json({ success: false, message: "User not authenticated" });
        return;
      }

      const result = await this._reviewService.getUserReviews(userId, page, limit);
      
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  async getMovieRatingStats(req: Request, res: Response): Promise<void> {
    try {
      const { movieId } = req.params;

      const result = await this._reviewService.getMovieRatingStats(movieId);
      
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  async getTheaterRatingStats(req: Request, res: Response): Promise<void> {
    try {
      const { theaterId } = req.params;

      const result = await this._reviewService.getTheaterRatingStats(theaterId);
      
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  async markHelpful(req: Request, res: Response): Promise<void> {
    try {
      const { reviewId } = req.params;

      const result = await this._reviewService.markHelpful(reviewId);
      
      const statusCode = result.success ? 200 : 404;
      res.status(statusCode).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  async reportReview(req: Request, res: Response): Promise<void> {
    try {
      const { reviewId } = req.params;

      const result = await this._reviewService.reportReview(reviewId);
      
      const statusCode = result.success ? 200 : 404;
      res.status(statusCode).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }
}

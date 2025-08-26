import { Request, Response } from "express";
import { ReviewService } from "../services/review.service";
import { IReviewService } from "../interfaces/review.service.interface";
import { CreateReviewDto, UpdateReviewDto, ModerateReviewDto } from "../dtos/dto";

export class ReviewController {
  constructor(private readonly reviewService: IReviewService) {}
  
  async submitReview(req: Request, res: Response): Promise<any> {
    try {
      const reviewDto: CreateReviewDto = req.body;
      const result = await this.reviewService.submitReview(reviewDto);
      
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
  
  async getMovieReviews(req: Request, res: Response): Promise<any> {
    try {
      const { movieId } = req.params;
      const { page = 1, limit = 10 } = req.query;
      
      const result = await this.reviewService.getMovieReviews(
        movieId,
        Number(page),
        Number(limit)
      );
      
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }
  
  async getTheaterReviews(req: Request, res: Response): Promise<any> {
    try {
      const { theaterId } = req.params;
      const { page = 1, limit = 10 } = req.query;
      
      const result = await this.reviewService.getTheaterReviews(
        theaterId,
        Number(page),
        Number(limit)
      );
      
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }
  
  async getUserReviews(req: Request, res: Response): Promise<any> {
    try {
      const { userId } = req.params;
      const result = await this.reviewService.getUserReviews(userId);
      
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }
  
  async moderateReview(req: Request, res: Response): Promise<any> {
    try {
      const { reviewId } = req.params;
      const { status, moderatorId, rejectionReason }: ModerateReviewDto = req.body;
      
      const result = await this.reviewService.moderateReview(
        reviewId,
        status,
        moderatorId,
        rejectionReason
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
  
  async likeReview(req: Request, res: Response): Promise<any> {
    try {
      const { reviewId } = req.params;
      const { userId, type } = req.body;
      
      const result = await this.reviewService.likeReview(userId, reviewId, type);
      
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
  
  async getPendingReviews(req: Request, res: Response): Promise<any> {
    try {
      const { page = 1, limit = 10 } = req.query;
      
      const result = await this.reviewService.getPendingReviews(
        Number(page),
        Number(limit)
      );
      
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }
  
  async updateReview(req: Request, res: Response): Promise<any> {
    try {
      const { reviewId } = req.params;
      const { userId } = req.body;
      const updateData: UpdateReviewDto = req.body;
      
      const result = await this.reviewService.updateReview(
        reviewId,
        userId,
        updateData
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
  
  async deleteReview(req: Request, res: Response): Promise<any> {
    try {
      const { reviewId } = req.params;
      const { userId } = req.body;
      
      const result = await this.reviewService.deleteReview(reviewId, userId);
      
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

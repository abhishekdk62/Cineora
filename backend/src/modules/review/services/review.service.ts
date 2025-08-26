import { IReviewService } from "../interfaces/review.service.interface";
import { IReviewRepository } from "../interfaces/review.repository.interface";
import { ServiceResponse } from "../../../interfaces/interface";
import { CreateReviewDto, UpdateReviewDto } from "../dtos/dto";
import mongoose from "mongoose";

export class ReviewService implements IReviewService {
  constructor(private readonly reviewRepo: IReviewRepository) {}
  
  async submitReview(reviewData: CreateReviewDto): Promise<ServiceResponse> {
    try {
      // Generate review ID
      const reviewId = `REV${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      
      // Convert string IDs to ObjectId
      const reviewPayload = {
        reviewId,
        userId: new mongoose.Types.ObjectId(reviewData.userId),
        reviewType: reviewData.reviewType,
        rating: reviewData.rating,
        title: reviewData.title,
        comment: reviewData.comment,
        status: "pending" as const,
        isVerifiedReview: !!reviewData.bookingId,
        likesCount: 0,
        dislikesCount: 0,
        helpfulCount: 0,
      };
      
      // Add movie or theater ID
      if (reviewData.reviewType === "movie" && reviewData.movieId) {
        reviewPayload["movieId"] = new mongoose.Types.ObjectId(reviewData.movieId);
      } else if (reviewData.reviewType === "theater" && reviewData.theaterId) {
        reviewPayload["theaterId"] = new mongoose.Types.ObjectId(reviewData.theaterId);
      }
      
      // Add booking reference if provided
      if (reviewData.bookingId) {
        reviewPayload["bookingId"] = new mongoose.Types.ObjectId(reviewData.bookingId);
      }
      
      const review = await this.reviewRepo.create(reviewPayload);
      
      if (!review) {
        throw new Error("Failed to create review");
      }
      
      return {
        success: true,
        message: "Review submitted successfully. It will be visible after moderation.",
        data: review,
      };
      
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to submit review",
        data: null,
      };
    }
  }
  
  async getMovieReviews(
    movieId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ServiceResponse> {
    try {
      const result = await this.reviewRepo.findByMovieId(movieId, page, limit);
      
      return {
        success: true,
        message: "Movie reviews retrieved successfully",
        data: result,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to get movie reviews",
        data: null,
      };
    }
  }
  
  async getTheaterReviews(
    theaterId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ServiceResponse> {
    try {
      const result = await this.reviewRepo.findByTheaterId(theaterId, page, limit);
      
      return {
        success: true,
        message: "Theater reviews retrieved successfully",
        data: result,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to get theater reviews",
        data: null,
      };
    }
  }
  
  async getUserReviews(userId: string): Promise<ServiceResponse> {
    try {
      const reviews = await this.reviewRepo.findByUserId(userId);
      
      return {
        success: true,
        message: "User reviews retrieved successfully",
        data: reviews,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to get user reviews",
        data: null,
      };
    }
  }
  
  async moderateReview(
    reviewId: string,
    status: "approved" | "rejected",
    moderatorId: string,
    rejectionReason?: string
  ): Promise<ServiceResponse> {
    try {
      const review = await this.reviewRepo.moderateReview(
        reviewId,
        status,
        moderatorId,
        rejectionReason
      );
      
      if (!review) {
        throw new Error("Review not found");
      }
      
      return {
        success: true,
        message: `Review ${status} successfully`,
        data: review,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to moderate review",
        data: null,
      };
    }
  }
  
  async likeReview(
    userId: string,
    reviewId: string,
    type: "like" | "dislike" | "helpful"
  ): Promise<ServiceResponse> {
    try {
      const success = await this.reviewRepo.addLike(userId, reviewId, type);
      
      if (!success) {
        throw new Error("Failed to like review");
      }
      
      return {
        success: true,
        message: `Review ${type}d successfully`,
        data: null,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to like review",
        data: null,
      };
    }
  }
  
  async getPendingReviews(
    page: number = 1,
    limit: number = 10
  ): Promise<ServiceResponse> {
    try {
      const result = await this.reviewRepo.findPendingReviews(page, limit);
      
      return {
        success: true,
        message: "Pending reviews retrieved successfully",
        data: result,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to get pending reviews",
        data: null,
      };
    }
  }
  
  async getReviewById(reviewId: string): Promise<ServiceResponse> {
    try {
      const review = await this.reviewRepo.findByReviewId(reviewId);
      
      if (!review) {
        return {
          success: false,
          message: "Review not found",
          data: null,
        };
      }
      
      return {
        success: true,
        message: "Review found",
        data: review,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to get review",
        data: null,
      };
    }
  }
  
  async updateReview(
    reviewId: string,
    userId: string,
    updateData: UpdateReviewDto
  ): Promise<ServiceResponse> {
    try {
      const review = await this.reviewRepo.findByReviewId(reviewId);
      
      if (!review) {
        throw new Error("Review not found");
      }
      
      if (review.userId.toString() !== userId) {
        throw new Error("Unauthorized to update this review");
      }
      
      const updatedReview = await this.reviewRepo.updateById(
        review._id.toString(),
        { ...updateData, status: "pending" } // Reset to pending after edit
      );
      
      return {
        success: true,
        message: "Review updated successfully",
        data: updatedReview,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to update review",
        data: null,
      };
    }
  }
  
  async deleteReview(reviewId: string, userId: string): Promise<ServiceResponse> {
    try {
      const review = await this.reviewRepo.findByReviewId(reviewId);
      
      if (!review) {
        throw new Error("Review not found");
      }
      
      if (review.userId.toString() !== userId) {
        throw new Error("Unauthorized to delete this review");
      }
      
      const deleted = await this.reviewRepo.deleteById(review._id.toString());
      
      return {
        success: deleted,
        message: deleted ? "Review deleted successfully" : "Failed to delete review",
        data: null,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to delete review",
        data: null,
      };
    }
  }
  
  async unlikeReview(userId: string, reviewId: string): Promise<ServiceResponse> {
    try {
      const success = await this.reviewRepo.removeLike(userId, reviewId);
      
      return {
        success,
        message: success ? "Like removed successfully" : "Failed to remove like",
        data: null,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to unlike review",
        data: null,
      };
    }
  }
  
  async getReviewStats(): Promise<ServiceResponse> {
    try {
      const stats = await this.reviewRepo.getReviewStats();
      
      return {
        success: true,
        message: "Review stats retrieved successfully",
        data: stats,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to get review stats",
        data: null,
      };
    }
  }
  
  async getMovieRatingStats(movieId: string): Promise<ServiceResponse> {
    try {
      const result = await this.reviewRepo.findByMovieId(movieId, 1, 0);
      
      return {
        success: true,
        message: "Movie rating stats retrieved successfully",
        data: {
          averageRating: result.averageRating,
          totalReviews: result.total,
          ratingDistribution: result.ratingDistribution,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to get movie rating stats",
        data: null,
      };
    }
  }
  
  async getTheaterRatingStats(theaterId: string): Promise<ServiceResponse> {
    try {
      const result = await this.reviewRepo.findByTheaterId(theaterId, 1, 0);
      
      return {
        success: true,
        message: "Theater rating stats retrieved successfully",
        data: {
          averageRating: result.averageRating,
          totalReviews: result.total,
          ratingDistribution: result.ratingDistribution,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to get theater rating stats",
        data: null,
      };
    }
  }
}

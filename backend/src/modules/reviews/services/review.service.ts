import { IReviewRepository } from "../interfaces/review.repository.interface";
import { IReviewService } from "../interfaces/review.service.interface";

export class ReviewService implements IReviewService {
  constructor(private readonly _reviewRepo: IReviewRepository) {}
  async addReview(
    userId: string,
    reviewData: any
  ): Promise<{
    success: boolean;
    message?: string;
    data?: any;
  }> {
    try {
      const hasReviewed = await this._reviewRepo.hasUserReviewed(
        userId,
        reviewData.movieId,
        reviewData.theaterId,
        reviewData.reviewType
      );

      if (hasReviewed) {
        return {
          success: false,
          message: `You have already reviewed this ${reviewData.reviewType}`,
        };
      }

      const review = await this._reviewRepo.addReview({
        userId,
        ...reviewData,
      });

      return {
        success: true,
        message: "Review added successfully",
        data: review,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to add review",
      };
    }
  }

  async updateReview(
    reviewId: string,
    userId: string,
    reviewData: any
  ): Promise<{
    success: boolean;
    message?: string;
    data?: any;
  }> {
    try {
      const updated = await this._reviewRepo.updateReview(reviewId, reviewData);

      if (!updated) {
        return {
          success: false,
          message: "Review not found or unauthorized",
        };
      }

      return {
        success: true,
        message: "Review updated successfully",
        data: updated,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to update review",
      };
    }
  }

  async deleteReview(
    reviewId: string,
    userId: string
  ): Promise<{
    success: boolean;
    message?: string;
  }> {
    try {
      const deleted = await this._reviewRepo.deleteReview(reviewId, userId);

      if (!deleted) {
        return {
          success: false,
          message: "Review not found or unauthorized",
        };
      }

      return {
        success: true,
        message: "Review deleted successfully",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to delete review",
      };
    }
  }
  

  async getMovieReviews(
    movieId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    success: boolean;
    data?: any;
    message?: string;
  }> {
    try {
      const result = await this._reviewRepo.getMovieReviews(
        movieId,
        page,
        limit
      );

      return {
        success: true,
        data: {
          ...result,
          page,
          limit,
          totalPages: Math.ceil(result.total / limit),
        },
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to get movie reviews",
      };
    }
  }
async getBulkMovieRatings(movieIds: string[]): Promise<{
  success: boolean;
  data?: { [movieId: string]: { averageRating: number; totalReviews: number } };
}> {
  try {
    const ratings = await this._reviewRepo.getBulkMovieRatings(movieIds);
    
    const ratingsMap: { [key: string]: { averageRating: number; totalReviews: number } } = {};
    
    movieIds.forEach(id => {
      ratingsMap[id] = { averageRating: 0, totalReviews: 0 };
    });

    ratings.forEach(rating => {
      ratingsMap[rating._id.toString()] = {
        averageRating: Math.round(rating.averageRating * 10) / 10,
        totalReviews: rating.totalReviews
      };
    });

    return { success: true, data: ratingsMap };
  } catch (error: any) {
    return { success: false };
  }
}

async getBulkTheaterRatings(theaterIds: string[]): Promise<{
  success: boolean;
  data?: { [theaterId: string]: { averageRating: number; totalReviews: number } };
}> {
  try {
    const ratings = await this._reviewRepo.getBulkTheaterRatings(theaterIds);
    
    const ratingsMap: { [key: string]: { averageRating: number; totalReviews: number } } = {};
    
    theaterIds.forEach(id => {
      ratingsMap[id] = { averageRating: 0, totalReviews: 0 };
    });

    ratings.forEach(rating => {
      ratingsMap[rating._id.toString()] = {
        averageRating: Math.round(rating.averageRating * 10) / 10,
        totalReviews: rating.totalReviews
      };
    });

    return { success: true, data: ratingsMap };
  } catch (error: any) {
    return { success: false };
  }
}

  async getTheaterReviews(
    theaterId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    success: boolean;
    data?: any;
    message?: string;
  }> {
    try {
      const result = await this._reviewRepo.getTheaterReviews(
        theaterId,
        page,
        limit
      );

      return {
        success: true,
        data: {
          ...result,
          page,
          limit,
          totalPages: Math.ceil(result.total / limit),
        },
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to get theater reviews",
      };
    }
  }

  async getUserReviews(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    success: boolean;
    data?: any;
    message?: string;
  }> {
    try {
      const result = await this._reviewRepo.getUserReviews(userId, page, limit);

      return {
        success: true,
        data: {
          ...result,
          page,
          limit,
          totalPages: Math.ceil(result.total / limit),
        },
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to get user reviews",
      };
    }
  }

  async getMovieRatingStats(movieId: string): Promise<{
    success: boolean;
    data?: any;
  }> {
    try {
      const stats = await this._reviewRepo.getMovieRatingStats(movieId);

      return {
        success: true,
        data: stats,
      };
    } catch (error: any) {
      return {
        success: false,
      };
    }
  }

  async getTheaterRatingStats(theaterId: string): Promise<{
    success: boolean;
    data?: any;
  }> {
    try {
      const stats = await this._reviewRepo.getTheaterRatingStats(theaterId);

      return {
        success: true,
        data: stats,
      };
    } catch (error: any) {
      return {
        success: false,
      };
    }
  }

  async markHelpful(reviewId: string): Promise<{
    success: boolean;
    message?: string;
  }> {
    try {
      const marked = await this._reviewRepo.markHelpful(reviewId);

      if (!marked) {
        return {
          success: false,
          message: "Review not found",
        };
      }

      return {
        success: true,
        message: "Review marked as helpful",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to mark as helpful",
      };
    }
  }

  async reportReview(reviewId: string): Promise<{
    success: boolean;
    message?: string;
  }> {
    try {
      const reported = await this._reviewRepo.reportReview(reviewId);

      if (!reported) {
        return {
          success: false,
          message: "Review not found",
        };
      }

      return {
        success: true,
        message: "Review reported successfully",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to report review",
      };
    }
  }
}

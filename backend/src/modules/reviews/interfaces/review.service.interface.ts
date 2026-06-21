import { AddReviewDto, UpdateReviewDto, ReviewsListResponseDto, RatingStatsDto } from "../dtos/dtos";
import { IReview } from "./review.model.interface";

export interface IReviewService {
  addReview(userId: string, reviewData: AddReviewDto): Promise<{
    success: boolean;
    message?: string;
    data?: IReview;
  }>;
  
  updateReview(reviewId: string, userId: string, reviewData: UpdateReviewDto): Promise<{
    success: boolean;
    message?: string;
    data?: IReview;
  }>;
  
  deleteReview(reviewId: string, userId: string): Promise<{
    success: boolean;
    message?: string;
  }>;
  
  getMovieReviews(movieId: string, page?: number, limit?: number): Promise<{
    success: boolean;
    data?: ReviewsListResponseDto["data"];
    message?: string;
  }>;
  
  getTheaterReviews(theaterId: string, page?: number, limit?: number): Promise<{
    success: boolean;
    data?: ReviewsListResponseDto["data"];
    message?: string;
  }>;
  
  getUserReviews(userId: string, page?: number, limit?: number): Promise<{
    success: boolean;
    data?: ReviewsListResponseDto["data"];
    message?: string;
  }>;
  
  getMovieRatingStats(movieId: string): Promise<{
    success: boolean;
    data?: RatingStatsDto;
  }>;
  
  getTheaterRatingStats(theaterId: string): Promise<{
    success: boolean;
    data?: RatingStatsDto;
  }>;
  
  markHelpful(reviewId: string): Promise<{
    success: boolean;
    message?: string;
  }>;
  
  reportReview(reviewId: string): Promise<{
    success: boolean;
    message?: string;
  }>;
getBulkMovieRatings(movieIds: string[]): Promise<{
  success: boolean;
  data?: { [movieId: string]: { averageRating: number; totalReviews: number } };
}>;

getBulkTheaterRatings(theaterIds: string[]): Promise<{
  success: boolean;
  data?: { [theaterId: string]: { averageRating: number; totalReviews: number } };
}>;

}

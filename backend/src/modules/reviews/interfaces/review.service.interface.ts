import { ReviewResponseDto } from "../dtos/dtos";

export interface IReviewService {
  addReview(userId: string, reviewData: ReviewResponseDto): Promise<{
    success: boolean;
    message?: string;
    data?: ReviewResponseDto;
  }>;
  
  updateReview(reviewId: string, userId: string, reviewData: ReviewResponseDto): Promise<{
    success: boolean;
    message?: string;
    data?: ReviewResponseDto;
  }>;
  
  deleteReview(reviewId: string, userId: string): Promise<{
    success: boolean;
    message?: string;
  }>;
  
  getMovieReviews(movieId: string, page?: number, limit?: number): Promise<{
    success: boolean;
    data?: ReviewResponseDto;
    message?: string;
  }>;
  
  getTheaterReviews(theaterId: string, page?: number, limit?: number): Promise<{
    success: boolean;
    data?: ReviewResponseDto;
    message?: string;
  }>;
  
  getUserReviews(userId: string, page?: number, limit?: number): Promise<{
    success: boolean;
    data?: ReviewResponseDto;
    message?: string;
  }>;
  
  getMovieRatingStats(movieId: string): Promise<{
    success: boolean;
    data?: ReviewResponseDto;
  }>;
  
  getTheaterRatingStats(theaterId: string): Promise<{
    success: boolean;
    data?: ReviewResponseDto;
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

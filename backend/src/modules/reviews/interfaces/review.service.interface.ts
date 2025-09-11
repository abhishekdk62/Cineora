export interface IReviewService {
  addReview(userId: string, reviewData: any): Promise<{
    success: boolean;
    message?: string;
    data?: any;
  }>;
  
  updateReview(reviewId: string, userId: string, reviewData: any): Promise<{
    success: boolean;
    message?: string;
    data?: any;
  }>;
  
  deleteReview(reviewId: string, userId: string): Promise<{
    success: boolean;
    message?: string;
  }>;
  
  getMovieReviews(movieId: string, page?: number, limit?: number): Promise<{
    success: boolean;
    data?: any;
    message?: string;
  }>;
  
  getTheaterReviews(theaterId: string, page?: number, limit?: number): Promise<{
    success: boolean;
    data?: any;
    message?: string;
  }>;
  
  getUserReviews(userId: string, page?: number, limit?: number): Promise<{
    success: boolean;
    data?: any;
    message?: string;
  }>;
  
  getMovieRatingStats(movieId: string): Promise<{
    success: boolean;
    data?: any;
  }>;
  
  getTheaterRatingStats(theaterId: string): Promise<{
    success: boolean;
    data?: any;
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

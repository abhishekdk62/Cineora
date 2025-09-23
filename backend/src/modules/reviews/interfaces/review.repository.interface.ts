import { IReview, ReviewData } from "./review.model.interface";

export interface IReviewRepository {
  addReview(reviewData: ReviewData): Promise<IReview>;
  updateReview(reviewId: string, reviewData: Partial<ReviewData>): Promise<IReview | null>;
  deleteReview(reviewId: string, userId: string): Promise<boolean>;
  getReviewById(reviewId: string): Promise<IReview | null>;
  
  getMovieReviews(movieId: string, page?: number, limit?: number): Promise<{
    reviews: IReview[];
    total: number;
    averageRating: number;
  }>;
  
  getTheaterReviews(theaterId: string, page?: number, limit?: number): Promise<{
    reviews: IReview[];
    total: number;
    averageRating: number;
  }>;
  
  getUserReviews(userId: string, page?: number, limit?: number): Promise<{
    reviews: IReview[];
    total: number;
  }>;
  
  hasUserReviewed(userId: string, movieId?: string, theaterId?: string,reviewType?:string): Promise<boolean>;
  
  getMovieRatingStats(movieId: string): Promise<{
    averageRating: number;
    totalReviews: number;
    ratingDistribution: { [key: number]: number };
  }>;
getBulkMovieRatings(movieIds: string[]): Promise<Array<{ 
  _id: string; 
  averageRating: number; 
  totalReviews: number; 
}>>;

getBulkTheaterRatings(theaterIds: string[]): Promise<Array<{ 
  _id: string; 
  averageRating: number; 
  totalReviews: number; 
}>>;

  getTheaterRatingStats(theaterId: string): Promise<{
    averageRating: number;
    totalReviews: number;
    ratingDistribution: { [key: number]: number };
  }>;
  
  markHelpful(reviewId: string): Promise<boolean>;
  reportReview(reviewId: string): Promise<boolean>;
  
  getReportedReviews(page?: number, limit?: number): Promise<{
    reviews: IReview[];
    total: number;
  }>;
  
  updateReviewStatus(reviewId: string, status: 'active' | 'hidden' | 'reported'): Promise<boolean>;
}

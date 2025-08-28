import { ServiceResponse } from "../../../interfaces/interface";

export interface IReviewService {
  submitReview(reviewData: any): Promise<ServiceResponse>;
  
  getReviewById(reviewId: string): Promise<ServiceResponse>;
  
  getMovieReviews(
    movieId: string,
    page?: number,
    limit?: number
  ): Promise<ServiceResponse>;
  
  getTheaterReviews(
    theaterId: string,
    page?: number,
    limit?: number
  ): Promise<ServiceResponse>;
  
  getUserReviews(userId: string): Promise<ServiceResponse>;
  
  updateReview(
    reviewId: string,
    userId: string,
    updateData: any
  ): Promise<ServiceResponse>;
  
  deleteReview(reviewId: string, userId: string): Promise<ServiceResponse>;
  
  moderateReview(
    reviewId: string,
    status: "approved" | "rejected",
    moderatorId: string,
    rejectionReason?: string
  ): Promise<ServiceResponse>;
  
  getPendingReviews(
    page?: number,
    limit?: number
  ): Promise<ServiceResponse>;
  
  likeReview(
    userId: string,
    reviewId: string,
    type: "like" | "dislike" | "helpful"
  ): Promise<ServiceResponse>;
  
  unlikeReview(userId: string, reviewId: string): Promise<ServiceResponse>;
  
  getReviewStats(): Promise<ServiceResponse>;
  
  getMovieRatingStats(movieId: string): Promise<ServiceResponse>;
  
  getTheaterRatingStats(theaterId: string): Promise<ServiceResponse>;
}

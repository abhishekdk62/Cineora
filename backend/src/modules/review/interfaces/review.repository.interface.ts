import { IReview, IReviewLike } from "./review.model.interface";

export interface IReviewRepository {
  create(reviewData: Partial<IReview>): Promise<IReview | null>;
  
  findById(id: string): Promise<IReview | null>;
  
  findByReviewId(reviewId: string): Promise<IReview | null>;
  
  findByMovieId(
    movieId: string,
    page: number,
    limit: number,
    status?: string
  ): Promise<{
    reviews: IReview[];
    total: number;
    averageRating: number;
    ratingDistribution: { [key: number]: number };
  }>;
  
  findByTheaterId(
    theaterId: string,
    page: number,
    limit: number,
    status?: string
  ): Promise<{
    reviews: IReview[];
    total: number;
    averageRating: number;
    ratingDistribution: { [key: number]: number };
  }>;
  
  findByUserId(userId: string): Promise<IReview[]>;
  
  updateById(
    id: string,
    updateData: Partial<IReview>
  ): Promise<IReview | null>;
  
  moderateReview(
    reviewId: string,
    status: string,
    moderatorId: string,
    rejectionReason?: string
  ): Promise<IReview | null>;
  
  deleteById(id: string): Promise<boolean>;
  
  // Review Likes
  addLike(
    userId: string,
    reviewId: string,
    type: "like" | "dislike" | "helpful"
  ): Promise<boolean>;
  
  removeLike(userId: string, reviewId: string): Promise<boolean>;
  
  updateLikeCounts(reviewId: string): Promise<IReview | null>;
  
  // Admin queries
  findPendingReviews(page: number, limit: number): Promise<{
    reviews: IReview[];
    total: number;
  }>;
  
  findReviewsByStatus(
    status: string,
    page: number,
    limit: number
  ): Promise<{
    reviews: IReview[];
    total: number;
  }>;
  
  getReviewStats(): Promise<{
    totalReviews: number;
    pendingReviews: number;
    approvedReviews: number;
    rejectedReviews: number;
  }>;
}

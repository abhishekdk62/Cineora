export interface CreateReviewDto {
  userId: string;
  movieId?: string;
  theaterId?: string;
  reviewType: "movie" | "theater";
  rating: number;
  title: string;
  comment: string;
  bookingId?: string; // For verified reviews
}

export interface UpdateReviewDto {
  rating?: number;
  title?: string;
  comment?: string;
}

export interface ModerateReviewDto {
  reviewId: string;
  status: "approved" | "rejected";
  moderatorId: string;
  rejectionReason?: string;
}

export interface ReviewResponseDto {
  reviewId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  movieTitle?: string;
  theaterName?: string;
  reviewType: string;
  rating: number;
  title: string;
  comment: string;
  status: string;
  isVerifiedReview: boolean;
  likesCount: number;
  dislikesCount: number;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface LikeReviewDto {
  userId: string;
  reviewId: string;
  type: "like" | "dislike" | "helpful";
}

export interface ReviewStatsDto {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: { [key: number]: number };
}

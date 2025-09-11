export interface AddReviewDto {
  movieId?: string;
  theaterId?: string;
  bookingId?: string;
  rating: number;
  reviewText?: string;
  reviewType: 'movie' | 'theater' | 'experience';
}

export interface UpdateReviewDto {
  rating?: number;
  reviewText?: string;
}

export interface GetReviewsDto {
  page?: number;
  limit?: number;
}

export interface ReviewResponseDto {
  success: boolean;
  message?: string;
  data?: any;
}

export interface ReviewsListResponseDto {
  success: boolean;
  data?: {
    reviews: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    averageRating: number;
  };
  message?: string;
}

export interface RatingStatsDto {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { [key: number]: number };
}

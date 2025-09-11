import { ApiResponse } from "./common.dto";

export type ReviewType = "movie" | "theater" | "experience";
export type ReviewStatus = "active" | "hidden" | "reported";

export interface ReviewEntity {
  _id: string;
  userId: string;
  movieId?: string;
  theaterId?: string;
  bookingId?: string;
  rating: number;
  reviewText?: string;
  reviewType: ReviewType;
  isVerifiedBooking: boolean;
  helpfulCount: number;
  reportCount: number;
  status: ReviewStatus;
  createdAt: Date;
  updatedAt: Date;
}

/* -------------------- REQUEST DTOs -------------------- */

export interface AddReviewRequestDto {
  movieId?: string;
  theaterId?: string;
  bookingId?: string;
  rating: number;
  reviewText?: string;
  reviewType: ReviewType;
}

export interface UpdateReviewRequestDto {
  rating?: number;
  reviewText?: string;
  status?: ReviewStatus;
}

export interface DeleteReviewRequestDto {
  reviewId: string;
}

export interface MarkHelpfulRequestDto {
  reviewId: string;
}

export interface ReportReviewRequestDto {
  reviewId: string;
  reason?: string;
}

export interface ReviewResponseDto {
  _id: string;
  userId: string;
  movieId?: string;
  theaterId?: string;
  bookingId?: string;
  rating: number;
  reviewText?: string;
  reviewType: ReviewType;
  isVerifiedBooking: boolean;
  helpfulCount: number;
  reportCount: number;
  status: ReviewStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface AddReviewResponseDto extends ApiResponse<ReviewResponseDto> {}
export interface UpdateReviewResponseDto extends ApiResponse<ReviewResponseDto> {}
export interface DeleteReviewResponseDto extends ApiResponse<{ deleted: boolean }> {}
export interface MarkHelpfulResponseDto extends ApiResponse<{ helpfulCount: number }> {}
export interface ReportReviewResponseDto extends ApiResponse<{ reportCount: number; status: ReviewStatus }> {}

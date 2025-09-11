import { USER_REVIEWS } from "../../constants/userConstants/reviewConstants";
import {
  AddReviewRequestDto,
  UpdateReviewRequestDto,
} from "../../dtos/review.dto";
import apiClient from "../../Utils/apiClient";

export const addReview = async (reviewData: AddReviewRequestDto) => {
  return (await apiClient.post(USER_REVIEWS.ADD_REVIEW, reviewData)).data;
};
export const deleteReview = async (reviewId: string) => {
  return (await apiClient.delete(USER_REVIEWS.DELETE_REVIEW(reviewId))).data;
};
export const updateReview = async (
  reviewId: string,
  reviewData: UpdateReviewRequestDto
) => {
  return (await apiClient.put(USER_REVIEWS.UPDATE_REVIEW(reviewId), reviewData))
    .data;
};

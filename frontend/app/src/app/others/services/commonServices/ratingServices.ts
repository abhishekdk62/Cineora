import { COMMON_ROUTES } from "../../constants/commonConstants/ratingConstants";
import apiClient from "../../Utils/apiClient";

export const getMovieRatingApi = async (movieId: string) => {
  return (await apiClient.get(COMMON_ROUTES.GET_MOVIE_REVIEWS(movieId))).data
};
export const getTheaterRatingApi = async (theaterId: string) => {
  return (await apiClient.get(COMMON_ROUTES.GET_THEATER_REVIEWS(theaterId))).data
};
export const getTheaterReviewStats = async (theaterId: string) => {
  return (await apiClient.get(COMMON_ROUTES.GET_THEATER_REVIEW_STATS(theaterId))).data
};
export const getMovieReviewStats = async (movieId: string) => {
  return (await apiClient.get(COMMON_ROUTES.GET_MOVIE_REVIEW_STATS(movieId))).data
};


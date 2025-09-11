export const COMMON_ROUTES = {
  GET_MOVIE_REVIEWS: (movieId: string) =>
    `/common/reviews/movies/${movieId}` as const,
  GET_THEATER_REVIEWS: (theaterId: string) =>
    `/common/reviews/theater/${theaterId}` as const,
  GET_THEATER_REVIEW_STATS: (theaterId: string) =>
    `/common/reviews/stats/theaters/${theaterId}` as const,
  GET_MOVIE_REVIEW_STATS: (movieId: string) =>
    `/common/reviews/stats/movies/${movieId}` as const,
  GET_ALL_MOVIE_STATS: "/common/reviews/movie",
  GET_ALL_THEATER_STATS: "/common/reviews/theater",
};

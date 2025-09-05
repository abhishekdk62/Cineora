// constants/commonRoutes/movies.ts

const COMMON_MOVIES = {
  BY_ID: (id: string) => `/common/movies/${id}`,
  FILTER: '/common/movies/filter' as const,
  BY_THEATER: (theaterId: string, date: string) => `/common/movies/from-theater/${theaterId}?date=${date}`,
};

export default COMMON_MOVIES;

export type CommonMoviesRoutes = typeof COMMON_MOVIES;

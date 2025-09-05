// constants/commonRoutes/theaters.ts

const COMMON_THEATERS = {
  FILTER: '/common/theaters/filter' as const,
  BY_ID: (id: string) => `/common/theater/${id}`,
  BY_MOVIE: (movieId: string, date: string) => `/common/theaters/from-movie/${movieId}?date=${date}`,
};

export default COMMON_THEATERS;

export type CommonTheatersRoutes = typeof COMMON_THEATERS;

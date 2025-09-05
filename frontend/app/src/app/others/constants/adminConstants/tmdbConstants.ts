const TMDB_ROUTES = {
  POPULAR_MOVIES: '/movie/popular' as const,
  GENRES: '/genre/movie/list' as const,
  SEARCH_MOVIES: '/search/movie' as const,
  MOVIE_DETAILS: (id: number) => `/movie/${id}`,
};

export default TMDB_ROUTES;

export type TmdbRoutes = typeof TMDB_ROUTES;

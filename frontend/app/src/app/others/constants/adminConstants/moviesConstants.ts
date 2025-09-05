const ADMIN_MOVIES = {
  BASE: '/admin/movies' as const,
  FILTER: '/admin/movies/filter' as const,
  TOGGLE_STATUS: (id: string) => `/admin/movies/${id}/toggle-status`,
  BY_ID: (id: string) => `/admin/movies/${id}`,
};

export default ADMIN_MOVIES;

export type AdminMoviesRoutes = typeof ADMIN_MOVIES;

// constants/ownerRoutes/movies.ts

const OWNER_MOVIES = {
  FILTER: '/owner/movies/filter' as const,
};

export default OWNER_MOVIES;

export type OwnerMoviesRoutes = typeof OWNER_MOVIES;

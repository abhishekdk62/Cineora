
const OWNER_THEATERS = {
  BASE: '/owner/theaters' as const,
  BY_ID: (id: string) => `/owner/theaters/${id}`,
  TOGGLE_STATUS: (id: string) => `/owner/theaters/${id}`,
};

export default OWNER_THEATERS;

export type OwnerTheatersRoutes = typeof OWNER_THEATERS;

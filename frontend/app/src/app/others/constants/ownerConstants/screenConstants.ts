
const OWNER_SCREENS = {
  BASE: '/owner/screens' as const,
  BY_THEATER_ID: (theaterId: string) => `/owner/screens/theater/${theaterId}`,
  STATS: (theaterId: string) => `/owner/screens/stats/${theaterId}`,
  BY_ID: (id: string) => `/owner/screens/${id}`,
};

export default OWNER_SCREENS;

export type OwnerScreensRoutes = typeof OWNER_SCREENS;

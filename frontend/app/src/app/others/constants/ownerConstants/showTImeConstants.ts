// constants/ownerRoutes/showtime.ts

const OWNER_SHOWTIME = {
  BASE: '/owner/showtime' as const,
  BY_ID: (id: string) => `/owner/showtime/${id}`,
};

export default OWNER_SHOWTIME;

export type OwnerShowtimeRoutes = typeof OWNER_SHOWTIME;

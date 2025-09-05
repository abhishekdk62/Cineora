// constants/adminRoutes/showtimes.ts

const ADMIN_SHOWTIMES = {
  BY_SCREEN_ID: (id: string) => `/admin/showtimes/${id}`,
  BY_ID: (id: string) => `/admin/showtimes/${id}`,
};

export default ADMIN_SHOWTIMES;

export type AdminShowtimesRoutes = typeof ADMIN_SHOWTIMES;

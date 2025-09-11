
const ADMIN_THEATERS = {
  BASE: '/admin/theaters' as const,
  VERIFY: (id: string) => `/admin/theaters/verify/${id}`,
  REJECT: (id: string) => `/admin/theaters/reject/${id}`,
  TOGGLE_STATUS: (id: string) => `/admin/theaters/${id}`,
};

export default ADMIN_THEATERS;

export type AdminTheatersRoutes = typeof ADMIN_THEATERS;

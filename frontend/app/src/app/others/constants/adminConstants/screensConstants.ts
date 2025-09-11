
const ADMIN_SCREENS = {
  BASE: '/admin/screens' as const,
  BY_ID: (id: string) => `/admin/screens/${id}`,
};

export default ADMIN_SCREENS;

export type AdminScreensRoutes = typeof ADMIN_SCREENS;

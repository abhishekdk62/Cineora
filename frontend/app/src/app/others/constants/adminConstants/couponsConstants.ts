

const ADMIN_COUPONS = {
  BASE: '/admin/coupons' as const,
  TOGGLE_STATUS: (id: string) => `/admin/coupons/${id}`,
};

export default ADMIN_COUPONS;

export type AdminOwnersRoutes = typeof ADMIN_COUPONS;

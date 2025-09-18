const OWNER_COUPON = {
  CREATE: '/owner/coupon' as const,
  GET_ALL: '/owner/coupon' as const,
  UPDATE: '/owner/coupon' as const,
  DELETE: '/owner/coupon' as const,
  TOGGLE_STATUS: '/owner/coupon' as const,
} as const;

export default OWNER_COUPON;

export type OwnerCouponRoutes = typeof OWNER_COUPON;

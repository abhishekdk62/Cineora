const USER_COUPON = {
  GET_BY_THEATER: '/users/coupon' as const,
  GET_ALL: '/users/coupon' as const,
  CHECK:'/users/coupon/check' as const
} as const;

export default USER_COUPON;

export type UserCouponRoutes = typeof USER_COUPON;

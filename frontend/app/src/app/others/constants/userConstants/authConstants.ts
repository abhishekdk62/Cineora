
const USER_AUTH_ROUTES = {
  SIGNUP: '/auth/signup' as const,
  VERIFY_OTP: '/auth/verify-otp' as const,
  RESEND_OTP: '/auth/resend-otp' as const,
  LOGIN: '/auth/login' as const,
  PROFILE: '/users/profile' as const,
  NEARBY_USERS: (userId: string, maxDistance: number = 5000) =>
    `/users/nearby/${userId}?maxDistance=${maxDistance}`,
  ADD_XP: (userId: string) => `/users/xp/${userId}`,
  RESET_PASSWORD: '/users/reset-password' as const,
  EMAIL_CHANGE_OTP_SEND: '/users/email/change' as const,
  EMAIL_CHANGE_OTP_VERIFY: '/users/email/verify' as const,
};

export default USER_AUTH_ROUTES;

export type UserAuthRoutes = typeof USER_AUTH_ROUTES;

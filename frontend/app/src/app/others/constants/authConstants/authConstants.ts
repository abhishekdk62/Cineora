const AUTH_ROUTES = {
  LOGIN: '/auth/login' as const,
  FORGOT_PASSWORD_SEND_OTP: '/auth/forgot-password/send-otp' as const,
  VERIFY_OTP: '/auth/forgot-password/verify-otp' as const,
  RESET_PASSWORD: '/auth/forgot-password/reset-password' as const,
  GOOGLE_AUTH: '/auth/google' as const,
  LOGOUT: '/auth/logout' as const,
  REFRESH:'/auth/refresh' as const,
};

export default AUTH_ROUTES;

export type AuthRoutes = typeof AUTH_ROUTES;

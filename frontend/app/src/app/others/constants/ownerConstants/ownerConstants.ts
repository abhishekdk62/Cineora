
const OWNER_ROUTES = {
  SEND_OTP: '/owners/send-otp' as const,
  VERIFY_OTP: '/owners/verify-otp' as const,
  SUBMIT_REQUEST: '/owners/submit-kyc' as const,
  REQUEST_STATUS: (id: string) => `/owners/request-status/${id}`,
  PROFILE: '/owner/profile' as const,
  UPDATE_PROFILE: '/owner' as const,
  RESET_PASSWORD: '/owner/reset-password' as const,
  EMAIL_CHANGE_OTP_SEND: '/owner/email/change' as const,
  EMAIL_CHANGE_OTP_VERIFY: '/owner/email/verify' as const,
};

export default OWNER_ROUTES;

export type OwnerRoutes = typeof OWNER_ROUTES;

// constants/userRoutes/payments.ts

const USER_PAYMENTS = {
  CREATE_RAZORPAY_ORDER: '/users/razorpay/create-order' as const,
  VERIFY_RAZORPAY_PAYMENT: '/users/razorpay/verify-payment' as const,
};

export default USER_PAYMENTS;

export type UserPaymentsRoutes = typeof USER_PAYMENTS;

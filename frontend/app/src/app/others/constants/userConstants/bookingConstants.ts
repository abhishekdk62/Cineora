// constants/userBookingRoutes.ts

const USER_BOOKING_ROUTES = {
  CREATE_BOOKING: '/users/bookings/create-booking' as const,
  WALLET_DEBIT: '/users/wallet/debit' as const,
};

export default USER_BOOKING_ROUTES;

export type UserBookingRoutes = typeof USER_BOOKING_ROUTES;

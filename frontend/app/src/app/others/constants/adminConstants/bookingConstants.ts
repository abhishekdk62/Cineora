

const ADMIN_USER_BOOKINGS = {
  GET_BOOKINGS: (theaterId: string) => `/admin/theater/bookings/${theaterId}`,
};

export default ADMIN_USER_BOOKINGS;

export type AdminOwnersRoutes = typeof ADMIN_USER_BOOKINGS;

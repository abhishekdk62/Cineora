
const OWNER_BOOKINGS = {
  SHOWTIMES_FOR_BOOKINGS: (theaterId: string, screenId: string, date: string) =>
    `/owner/showtimes/${theaterId}/${screenId}?date=${date}`,
  BOOKING_DETAILS: (showtimeId: string) => `/owner/bookings/${showtimeId}`,
  BOOKING_BY_OWNER_ID:`/owner/bookings/by-owner`,
};

export default OWNER_BOOKINGS;

export type OwnerBookingRoutes = typeof OWNER_BOOKINGS;

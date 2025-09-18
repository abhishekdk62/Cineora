import OWNER_BOOKINGS from "../../constants/ownerConstants/bookingConstants";
import apiClient from "../../Utils/apiClient";

export const getShowTimesForBookings = async (
  theaterId: string,
  screenId: string,
  date: string
) => {
  const url = OWNER_BOOKINGS.SHOWTIMES_FOR_BOOKINGS(theaterId, screenId, date);
  const result = await apiClient.get(url);
  return result.data;
};

export const getBookingDetails = async (showtimeId: string) => {
  const result = await apiClient.get(
    OWNER_BOOKINGS.BOOKING_DETAILS(showtimeId)
  );
  return result.data;
};
export const getBookingDetailsByOwnerIdForPanel = async () => {
  
  const result = await apiClient.get(OWNER_BOOKINGS.BOOKING_BY_OWNER_ID);
  return result.data;
};

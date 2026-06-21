
import ADMIN_USER_BOOKINGS from "../../constants/adminConstants/bookingConstants";
import apiClient from "../../Utils/apiClient";
import { GetBookingsForAdminResponseDto } from "../../dtos/booking.dto";

export const getBookingsForAdmin = async (
  theaterId: string,
  startDate: string,
  endDate: string,
  page: number,
  limit: number
): Promise<GetBookingsForAdminResponseDto> => {
  const queryParams = new URLSearchParams({
    startDate,
    endDate,
    page: page.toString(),
    limit: limit.toString()
  }).toString();

  const data = await apiClient.get(`${ADMIN_USER_BOOKINGS.GET_BOOKINGS(theaterId)}?${queryParams}`);
  return data.data;
};

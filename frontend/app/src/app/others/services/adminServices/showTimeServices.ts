import ADMIN_SHOWTIMES from "../../constants/adminConstants/showtimesConstants";
import apiClient from "../../Utils/apiClient";
import {
  GetShowtimesByScreenIdResponseDto,
  ToggleShowtimeResponseDto,
  ToggleShowtimeRequestDto
} from '../../dtos/showtime.dto';
import { ParamsType } from "../../components/Admin/Dashboard/Showtimes/ShowtimesModal";

export const getShowTimeByScreenIdAdmin = async (
  screenId: string,
  params: ParamsType
): Promise<GetShowtimesByScreenIdResponseDto> => {
  const result = await apiClient.get(ADMIN_SHOWTIMES.BY_SCREEN_ID(screenId), {
    params,
  });
  return result.data;
};

export const toggleleShowTime = async (
  showtimeId: string, 
  isActive: boolean
): Promise<ToggleShowtimeResponseDto> => {
  const requestData: ToggleShowtimeRequestDto = { isActive };
  const result = await apiClient.patch(ADMIN_SHOWTIMES.BY_ID(showtimeId), requestData);
  return result.data;
};

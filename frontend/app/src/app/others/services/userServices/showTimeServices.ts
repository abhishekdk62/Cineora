import USER_SHOWTIME from "../../constants/userConstants/showTimeConstants";
import apiClient from "../../Utils/apiClient";
import {
  GetShowTimeUserResponseDto
} from '../../dtos/showtime.dto';

export const getShowTimeUser = async (id: string): Promise<GetShowTimeUserResponseDto> => {
  const response = await apiClient.get(USER_SHOWTIME.BY_ID(id));
  return response.data;
};

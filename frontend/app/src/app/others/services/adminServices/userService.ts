import ADMIN_USERS from "../../constants/adminConstants/usersConstants";
import apiClient from "../../Utils/apiClient";
import {
  UserFilters,
  GetUserCountsResponseDto,
  GetUsersResponseDto,
  GetUserDetailsResponseDto,
  ToggleUserStatusResponseDto
} from '../../dtos/user.dto';
export interface ParamsDto{

}
const buildQuery = (params: Record<string, ParamsDto>): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== null) {
      searchParams.append(key, value.toString());
    }
  });
  return searchParams.toString();
};

export const getUserCounts = async (): Promise<GetUserCountsResponseDto> => {
  const response = await apiClient.get(ADMIN_USERS.COUNTS);
  return response.data;
};

export const getUsers = async (filters: UserFilters): Promise<GetUsersResponseDto> => {
  const query = buildQuery(filters);
  const response = await apiClient.get(`${ADMIN_USERS.BASE}?${query}`);
  return response.data;
};

export const getUserDetails = async (userId: string): Promise<GetUserDetailsResponseDto> => {
  const response = await apiClient.get(ADMIN_USERS.BY_ID(userId));
  return response.data;
};

export const toggleUserStatus = async (userId: string): Promise<ToggleUserStatusResponseDto> => {
  const response = await apiClient.patch(ADMIN_USERS.TOGGLE_STATUS(userId));
  return response.data;
};

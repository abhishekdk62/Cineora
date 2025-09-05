import USER_GENERAL from "../../constants/userConstants/userConstants";
import apiClient from "../../Utils/apiClient";
import {
  GetUserProfileResponseDto,
  UpdateUserRequestDto,
  UpdateProfileResponseDto,
  GetNearbyUsersResponseDto,
  AddXpPointsRequestDto,
  AddXpPointsResponseDto,
  UpdateLocationRequestDto,
  UpdateLocationResponseDto
} from '../../dtos/user.dto';

export const getUserProfile = async (): Promise<GetUserProfileResponseDto> => {
  const response = await apiClient.get(USER_GENERAL.PROFILE);
  return response.data;
};

export const updateProfile = async (updateData: UpdateUserRequestDto): Promise<UpdateProfileResponseDto> => {
  const response = await apiClient.put(USER_GENERAL.PROFILE, updateData);
  return response.data;
};

export const getNearbyUsers = async (userId: string, maxDistance: number = 5000): Promise<GetNearbyUsersResponseDto> => {
  const response = await apiClient.get(USER_GENERAL.NEARBY_USERS(userId, maxDistance));
  return response.data;
};

export const addXpPoints = async (userId: string, points: number): Promise<AddXpPointsResponseDto> => {
  const requestData: AddXpPointsRequestDto = { points };
  const response = await apiClient.post(USER_GENERAL.ADD_XP(userId), requestData);
  return response.data;
};

export const updateLocation = async (locationData: UpdateLocationRequestDto): Promise<UpdateLocationResponseDto> => {
  const result = await apiClient.patch(USER_GENERAL.UPDATE_LOCATION, locationData);
  return result.data;
};

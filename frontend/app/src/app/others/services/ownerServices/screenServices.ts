import { FormData } from "../../components/Owner/Screens/types";
import OWNER_SCREENS from "../../constants/ownerConstants/screenConstants";
import apiClient from "../../Utils/apiClient";
import {
  CreateScreenResponseDto,
  GetScreensByTheaterIdResponseDto,
  GetScreensStatsOwnerResponseDto,
  
  DeleteScreenResponseDto,
  GetScreenResponseDto
} from '../../dtos/screen.dto';

export const createScreen = async (data: FormData ): Promise<CreateScreenResponseDto> => {
  const result = await apiClient.post(OWNER_SCREENS.BASE, data);
  return result.data;
};

export const getScreensByTheaterId = async (theaterId: string): Promise<GetScreensByTheaterIdResponseDto> => {
  const result = await apiClient.get(OWNER_SCREENS.BY_THEATER_ID(theaterId));
  return result.data;
};

export const getScreensStatsOwner = async (theaterId: string): Promise<GetScreensStatsOwnerResponseDto> => {
  const result = await apiClient.get(OWNER_SCREENS.STATS(theaterId));
  return result.data;
};

export const toggleScreenStatusOwner = async (id: string): Promise<GetScreensStatsOwnerResponseDto> => {
  const result = await apiClient.patch(OWNER_SCREENS.BY_ID(id));
  return result.data;
};

export const deleteScreenOwner = async (id: string): Promise<DeleteScreenResponseDto> => {
  const result = await apiClient.delete(OWNER_SCREENS.BY_ID(id));
  return result.data;
};

export const editScreenOwner = async (id: string, data: FormData): Promise<GetScreenResponseDto> => {
  const result = await apiClient.put(OWNER_SCREENS.BY_ID(id), data);
  return result.data;
};

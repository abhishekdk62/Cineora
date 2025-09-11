import OWNER_THEATERS from "../../constants/ownerConstants/theaterConstants";
import { ITheater } from "../../types";
import apiClient from "../../Utils/apiClient";
import {
  TheaterFilters,
  CreateTheaterResponseDto,
  GetTheatersByOwnerIdResponseDto,
  ToggleTheaterStatusResponseDto,
  UpdateTheaterResponseDto,
  DeleteTheaterResponseDto
} from '../../dtos/theater.dto';

export async function createTheater(theaterData: Partial<ITheater>): Promise<CreateTheaterResponseDto> {
  const result = await apiClient.post(OWNER_THEATERS.BASE, theaterData);
  return result.data;
}

export const getTheatersByOwnerId = async (filters?: TheaterFilters): Promise<GetTheatersByOwnerIdResponseDto> => {
  try {
    const result = await apiClient.get(OWNER_THEATERS.BASE, { params: filters });
    return result.data;
  } catch (error) {
    console.error("Error fetching theaters:", error);
    throw error;
  }
};

export const toggleTheaterStatusOwner = async (id: string): Promise<ToggleTheaterStatusResponseDto> => {
  const result = await apiClient.patch(OWNER_THEATERS.TOGGLE_STATUS(id));
  return result.data;
};

export const updateTheaterOwner = async (theaterId: string, theaterData: Partial<ITheater>): Promise<UpdateTheaterResponseDto> => {
  const result = await apiClient.put(OWNER_THEATERS.BY_ID(theaterId), theaterData);
  return result.data;
};

export async function deleteTheaterOwner(theaterId: string): Promise<DeleteTheaterResponseDto> {
  const result = await apiClient.delete(OWNER_THEATERS.BY_ID(theaterId));
  return result.data;
}

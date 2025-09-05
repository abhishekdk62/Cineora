import ADMIN_THEATERS from "../../constants/adminConstants/theatersConstants";
import apiClient from "../../Utils/apiClient";
import {
  VerifyTheaterResponseDto,
  RejectTheaterResponseDto,
  ToggleTheaterStatusResponseDto,
  GetTheatersByOwnerIdResponseDto,
  TheaterFilters
} from '../../dtos/theater.dto';

export async function verifyTheaterAdmin(theatreId: string): Promise<VerifyTheaterResponseDto> {
  const result = await apiClient.patch(ADMIN_THEATERS.VERIFY(theatreId));
  return result.data;
}

export async function rejectTheaterAdmin(theatreId: string): Promise<RejectTheaterResponseDto> {
  const result = await apiClient.patch(ADMIN_THEATERS.REJECT(theatreId));
  return result.data;
}

export const toggleTheaterStatusAdmin = async (id: string): Promise<ToggleTheaterStatusResponseDto> => {
  const result = await apiClient.patch(ADMIN_THEATERS.TOGGLE_STATUS(id));
  return result.data;
};

export const getTheatersByOwnerIdAdmin = async (
  ownerId: string,
  filters?: TheaterFilters
): Promise<GetTheatersByOwnerIdResponseDto> => {
  try {
    const result = await apiClient.get(ADMIN_THEATERS.BASE, { params: { ownerId, ...filters } });
    return result.data;
  } catch (error) {
    console.error("Error fetching theaters:", error);
    throw error;
  }
};

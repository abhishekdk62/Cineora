import ADMIN_OWNERS from "../../constants/adminConstants/ownersConstants";
import apiClient from "../../Utils/apiClient";
import {
  OwnerFilters,
  OwnerRequestFilters,
  GetOwnersResponseDto,
  GetOwnerRequestsResponseDto,
  GetOwnerCountsResponseDto,
  AcceptOwnerRequestResponseDto,
  RejectOwnerRequestResponseDto,
  RejectOwnerRequestDto,
  ToggleOwnerStatusResponseDto,
} from '../../dtos/owner.dto';
import { ParamsDto } from "./userService";

const buildQuery = (params: Record<string, ParamsDto>): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== null) {
      searchParams.append(key, value.toString());
    }
  });
  return searchParams.toString();
};

export const getOwners = async (filters: OwnerFilters): Promise<GetOwnersResponseDto> => {
  const query = buildQuery(filters);
  const response = await apiClient.get(`${ADMIN_OWNERS.BASE}?${query}`);
  return response.data;
};

export const getOwnerRequests = async (filters: OwnerRequestFilters): Promise<GetOwnerRequestsResponseDto> => {
  const query = buildQuery(filters);
  const response = await apiClient.get(`${ADMIN_OWNERS.REQUESTS}?${query}`);
  return response.data;
};

export const getOwnerCounts = async (): Promise<GetOwnerCountsResponseDto> => {
  const response = await apiClient.get(ADMIN_OWNERS.COUNTS);
  return response.data;
};

export const acceptOwnerRequest = async (requestId: string): Promise<AcceptOwnerRequestResponseDto> => {
  const response = await apiClient.patch(ADMIN_OWNERS.ACCEPT_REQUEST(requestId));
  return response.data;
};

export const rejectOwnerRequest = async (
  requestId: string, 
  rejectionData?: RejectOwnerRequestDto
): Promise<RejectOwnerRequestResponseDto> => {
  const response = await apiClient.patch(
    ADMIN_OWNERS.REJECT_REQUEST(requestId), 
    rejectionData
  );
  return response.data;
};

export const toggleOwnerStatus = async (ownerId: string): Promise<ToggleOwnerStatusResponseDto> => {
  const response = await apiClient.patch(ADMIN_OWNERS.TOGGLE_STATUS(ownerId));
  return response.data;
};

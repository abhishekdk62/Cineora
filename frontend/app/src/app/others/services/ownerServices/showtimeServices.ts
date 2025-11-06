import OWNER_SHOWTIME from "../../constants/ownerConstants/showTImeConstants";
import apiClient from "../../Utils/apiClient";
import {
  GetShowTimesOwnerParamsDto,
  GetShowTimesOwnerResponseDto,
  CreateShowtimeOwnerResponseDto,
  EditShowtimeOwnerResponseDto,
  ToggleShowtimeStatusOwnerResponseDto,
  ToggleShowtimeRequestDto,
  BulkCreateShowtimeResponseDto
} from '../../dtos/showtime.dto';
import { ShowTimeData } from "../../types";

export const getShowTimesOwner = async (params?: GetShowTimesOwnerParamsDto): Promise<GetShowTimesOwnerResponseDto> => {
  let url = OWNER_SHOWTIME.BASE;
   if (params) {
    const queryParams = new URLSearchParams();
    if (params.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params.filter) {
      queryParams.append('filter', params.filter);
    }
    const queryString = queryParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const result = await apiClient.get(url);
  return result.data;
};

export const createShowtimeOwner = async (data: ShowTimeData): Promise<BulkCreateShowtimeResponseDto> => {
  const result = await apiClient.post(OWNER_SHOWTIME.BASE, data);
  return result.data;
};

export const editShowtimeOwner = async (data: ShowTimeData): Promise<EditShowtimeOwnerResponseDto> => {
  const result = await apiClient.put(OWNER_SHOWTIME.BASE, data);
  return result.data;
};

export const toggleShowtimeStatusOwner = async (id: string, isActive: boolean): Promise<ToggleShowtimeStatusOwnerResponseDto> => {
  const requestData: ToggleShowtimeRequestDto = { isActive };
  const result = await apiClient.patch(OWNER_SHOWTIME.BY_ID(id), requestData);
  return result.data;
};

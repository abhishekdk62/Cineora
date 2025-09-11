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

export const getShowTimesOwner = async (params?: GetShowTimesOwnerParamsDto): Promise<GetShowTimesOwnerResponseDto> => {
  let url = OWNER_SHOWTIME.BASE;
  if (params?.page && params?.limit) {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString()
    });
    url += `?${queryParams}`;
  }
  const result = await apiClient.get(url);
  return result.data;
};

export const createShowtimeOwner = async (data: any): Promise<BulkCreateShowtimeResponseDto> => {
  const result = await apiClient.post(OWNER_SHOWTIME.BASE, data);
  return result.data;
};

export const editShowtimeOwner = async (data: any): Promise<EditShowtimeOwnerResponseDto> => {
  const result = await apiClient.put(OWNER_SHOWTIME.BASE, data);
  return result.data;
};

export const toggleShowtimeStatusOwner = async (id: string, isActive: boolean): Promise<ToggleShowtimeStatusOwnerResponseDto> => {
  const requestData: ToggleShowtimeRequestDto = { isActive };
  const result = await apiClient.patch(OWNER_SHOWTIME.BY_ID(id), requestData);
  return result.data;
};

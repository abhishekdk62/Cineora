import { ScreenFilters } from "../../components/Admin/Dashboard/Screens/ScreenAndShowManager";
import ADMIN_SCREENS from "../../constants/adminConstants/screensConstants";
import apiClient from "../../Utils/apiClient";
import {
  GetAllScreensAdminResponseDto,
  ToggleScreenResponseDto,
  ToggleScreenRequestDto
} from '../../dtos/screen.dto';

export const getAllScreensAdmin = async (
  page: number,
  currentFilters: ScreenFilters
): Promise<GetAllScreensAdminResponseDto> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: "5",
    ...Object.entries(currentFilters)
      .filter(([_, value]) => value !== undefined && value !== "")
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value.toString() }), {}),
  });

  const result = await apiClient.get(ADMIN_SCREENS.BASE, { params });
  return result.data;
};

export const toggleScreen = async (
  screenId: string, 
  isActive: boolean
): Promise<ToggleScreenResponseDto> => {
  const requestData: ToggleScreenRequestDto = { isActive };
  const result = await apiClient.patch(ADMIN_SCREENS.BY_ID(screenId), requestData);
  return result.data;
};

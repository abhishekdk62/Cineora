import { ScreenFilters } from "../../components/Admin/Dashboard/Screens/ScreenAndShowManager";
import apiClient from "../../Utils/apiClient";

export const getAllScreensAdmin = async (
  page: number,
  currentFilters: ScreenFilters
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: "5",
    ...Object.entries(currentFilters)
      .filter(([_, value]) => value !== undefined && value !== "")
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value.toString() }), {}),
  });

  const result = await apiClient.get("/admin/screens", { params });
  return result.data;
};

export const toggleScreen = async (screenId: string, isActive: boolean) => {
  const result = await apiClient.patch(`/admin/screens/${screenId}`, {isActive});
  return result.data;
};

import apiClient from "../../Utils/apiClient";

export const getShowTimeByScreenIdAdmin = async (
  screenId: string,
  params: any
) => {
  const result = await apiClient.get(`/admin/showtimes/${screenId}`, {
    params,
  });
  
  return result.data;
};

export const toggleleShowTime = async (showtimeId: string, isActive: boolean) => {
  const result = await apiClient.patch(
    `/admin/showtimes/${showtimeId}`,
    {isActive}
  );
  return result.data;
};

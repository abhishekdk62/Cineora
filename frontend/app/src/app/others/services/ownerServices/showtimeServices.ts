import apiClient from "../../Utils/apiClient";

export const getShowTimesOwner = async () => {
  const result = await apiClient.get("/owner/showtime");
  return result.data;
};

export const createShowtimeOwner = async (data: any) => {
  const result = await apiClient.post("/owner/showtime", data);
  return result.data;
};
export const editShowtimeOwner = async (data: any) => {
  const result = await apiClient.put("/owner/showtime", data);
  return result.data;
};

export const toggleShowtimeStatusOwner = async (id: string,isActive:boolean) => {
  const result = await apiClient.patch(`/owner/showtime/${id}`,{isActive});
  return result.data;
};
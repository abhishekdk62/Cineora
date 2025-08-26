import apiClient from "../../Utils/apiClient";

export const getShowTimeUser = async (id: string) => {
  return (await apiClient.get(`/users/showtime/${id}`)).data;
};

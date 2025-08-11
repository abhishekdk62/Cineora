import apiClient from "../../Utils/apiClient";


export const getUserProfile = async () => {
  const response = await apiClient.get(`/users/profile`);
  return response.data;
};

export const updateProfile = async ( updateData: any) => {
  const response = await apiClient.put(`/users/profile`, updateData);
  return response.data;
};

export const getNearbyUsers = async (userId: string, maxDistance: number = 5000) => {
  const response = await apiClient.get(`/users/nearby/${userId}?maxDistance=${maxDistance}`);
  return response.data;
};

export const addXpPoints = async (userId: string, points: number) => {
  const response = await apiClient.post(`/users/xp/${userId}`, { points });
  return response.data;
};

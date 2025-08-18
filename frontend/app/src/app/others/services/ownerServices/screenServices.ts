import { FormData } from "../../components/Owner/Screens/types";
import apiClient from "../../Utils/apiClient";

export const createScreen = async (data: FormData & any) => {
  const result = await apiClient.post("/owner/screens", data);
  return result.data;
};

export const getScreensByTheaterId = async (theaterId: string) => {
  const result = await apiClient.get(`/owner/screens/${theaterId}`);
  return result;
};

export const getScreensStatsOwner = async (theaterId: string) => {
  const result = await apiClient.get(`/owner/screens/stats/${theaterId}`);
  return result.data;
};

export const toggleScreenStatusOwner = async (id: string) => {
  const result = await apiClient.patch(`/owner/screens/${id}`);
  return result.data;
};

export const deleteScreenOwner=async(id:string)=>{
  const result=await apiClient.delete(`/owner/screens/${id}`)
}

export const editScreenOwner=async(id:string,data:any)=>{
  const result=await apiClient.put(`/owner/screens/${id}`,data)
  return result.data
}
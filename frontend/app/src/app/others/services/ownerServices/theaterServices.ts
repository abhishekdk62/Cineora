import axios from "axios";
import { ITheater } from "../../Types";
import apiClient from "../../Utils/apiClient";

export async function createTheater(theaterData: Partial<ITheater>) {
  const result = await apiClient.post("/owner/theaters", theaterData);
  return result.data;
}
export const getTheatersByOwnerId = async (filters?: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  try {
  
    const result = await apiClient.get("/owner/theaters", { params: filters });
    return result.data;

  } catch (error) {
    console.error("Error fetching theaters:", error);
    throw error;
  }
};

export const toggleTheaterStatusOwner = async (id:string) => {
  const result = await apiClient.patch(`/owner/theaters/${id}`);
  return result.data;
};

export const updateTheaterOwner=async(theaterId:string,theaterData:Partial<ITheater>)=>
{
  const result=await apiClient.put(`/owner/theaters/${theaterId}`,theaterData)
  return result.data
}

export async function deleteTheaterOwner(theaterId:string) {
  const result=await apiClient.delete(`/owner/theaters/${theaterId}`)
  return result.data
}


import axios from "axios";
import { Theater } from "../../Types";
import apiClient from "../../Utils/apiClient";


export async function createTheater(theaterData:Partial<Theater>) {
    const result =await apiClient.post('/owner/theaters',theaterData)
    return result.data
}
export const getTheatersByOwnerId = async (filters?: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
  try {
    const result = await apiClient.get('/owner/theaters', {params:filters});
    return result.data;
  } catch (error) {
    console.error('Error fetching theaters:', error);
    throw error;
  }
};


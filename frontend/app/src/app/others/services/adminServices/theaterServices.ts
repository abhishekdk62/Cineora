import apiClient from "../../Utils/apiClient";



export async function verifyTheaterAdmin(theatreId:string) {

  const result =await apiClient.patch(`/admin/theaters/verify/${theatreId}`)
  return result.data
}
export async function rejectTheaterAdmin(theatreId:string) {

  const result =await apiClient.patch(`/admin/theaters/reject/${theatreId}`)
  return result.data
}
export const toggleTheaterStatusAdmin = async (id:string) => {
  const result = await apiClient.patch(`/admin/theaters/${id}`);
  return result.data;
};

export const getTheatersByOwnerIdAdmin = async (ownerId:string,filters?: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  try {
  
    const result = await apiClient.get("/admin/theaters", { params: {ownerId,...filters} });
    return result.data;

  } catch (error) {
    console.error("Error fetching theaters:", error);
    throw error;
  }
};
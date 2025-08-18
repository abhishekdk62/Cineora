import apiClient from "../../Utils/apiClient"

export const getMoviesForShowtime=async()=>{
  const response = await apiClient.get(`/owner/movies/filter`,{params:{isActive:true}});
    return response.data
}
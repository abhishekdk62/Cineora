import apiClient from "../../Utils/apiClient"

export const getMovieById = async (id:string) => {
  const response = await apiClient.get(`/movies/${id}`);
  return response.data;
};


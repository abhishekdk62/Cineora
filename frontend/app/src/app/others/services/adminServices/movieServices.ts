// services/adminServices/movieService.ts
import apiClient from "../../Utils/apiClient";

export const addMovie = async (data: any) => {
  const response = await apiClient.post("/admin/movies", data);
  return response.data;
};

export const getMovies = async () => {
  const response = await apiClient.get(`/admin/movies`);
  return response.data;
};

export const getMoviesWithFilters = async (filters: {
  search?: string;
  isActive?: boolean;
  rating?: string;
  minDuration?: number;
  maxDuration?: number;
  releaseYearStart?: number;
  releaseYearEnd?: number;
  language?: string;
  genre?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}) => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value.toString());
    }
  });

  const response = await apiClient.get(`/admin/movies/filter?${params.toString()}`);
  return response.data;
};

export const toggleMovieStatus = async (movieId: string) => {
  const response = await apiClient.patch(`/admin/movies/${movieId}/toggle-status`);
  return response.data;
};


export const updateMovie = async (id: string, data: any) => {
  const res = await apiClient.put(`/admin/movies/${id}`, data);
  return res.data;
};

export const getMovieById = async (id: string) => {
  const response = await apiClient.get(`/admin/movies/${id}`);
  return response.data;
};

export const deleteMovie = async (id: string) => {
  const res = await apiClient.delete(`/admin/movies/${id}`);
  return res.data as { success: boolean; message?: string };
};

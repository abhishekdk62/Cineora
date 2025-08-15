import axios from "axios";
import apiClient from "../../Utils/apiClient"

export const getMovieById = async (id:string) => {
  const response = await apiClient.get(`/common/movies/${id}`);
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

  const response = await apiClient.get(`/users/movies/filter?${params.toString()}`);
  return response.data;
};



import COMMON_THEATERS from "../../constants/userConstants/theaterConstants";
import apiClient from "../../Utils/apiClient";
import { 
  TheaterFilters,
  TheaterResponse,
  GetTheatersResponseDto,
  GetTheatersByMovieResponseDto
} from '../../dtos/theater.dto';

export const getTheatersWithFilters = async (
  filters: TheaterFilters = {}
): Promise<TheaterResponse> => {
  const params = new URLSearchParams();

  if (filters.search) params.append("search", filters.search);
  if (filters.sortBy) params.append("sortBy", filters.sortBy);
  if (filters.page) params.append("page", filters.page.toString());
  if (filters.limit) params.append("limit", filters.limit.toString());
  if (filters.latitude !== undefined) params.append("latitude", filters.latitude.toString());
  if (filters.longitude !== undefined) params.append("longitude", filters.longitude.toString());
  if (filters.facilities !== undefined) params.append("facilities", filters.facilities.toString());

  const res = await apiClient.get(`${COMMON_THEATERS.FILTER}?${params.toString()}`);
  return res.data;
};

export const getTheaterById = async (theaterId: string): Promise<GetTheatersResponseDto> => {
  const response = await apiClient.get(COMMON_THEATERS.BY_ID(theaterId));
  return response.data;
};

export const getTheatersByMovie = async (movieId: string, date: string): Promise<GetTheatersByMovieResponseDto> => {
  const result = await apiClient.get(COMMON_THEATERS.BY_MOVIE(movieId, date));
  return result.data;
};

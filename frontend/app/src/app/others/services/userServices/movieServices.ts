import COMMON_MOVIES from "../../constants/userConstants/movieConstants";
import apiClient from "../../Utils/apiClient";
import {
  GetMoviesWithFiltersQueryDto,
  GetMoviesResponseDto,
  GetMoviesWithFiltersResponseDto,
  GetMoviesByTheaterResponseDto
} from '../../dtos/movie.dto';

export const getMovieById = async (id: string): Promise<GetMoviesResponseDto> => {
  const response = await apiClient.get(COMMON_MOVIES.BY_ID(id));
  return response.data;
};

export const getMoviesWithFilters = async (filters: GetMoviesWithFiltersQueryDto): Promise<GetMoviesWithFiltersResponseDto> => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value.toString());
    }
  });

  const response = await apiClient.get(`${COMMON_MOVIES.FILTER}?${params.toString()}`);
  
  return response.data;
};

export const getMoviesByTheater = async (theaterId: string, date: string): Promise<GetMoviesByTheaterResponseDto> => {
  const result = await apiClient.get(COMMON_MOVIES.BY_THEATER(theaterId, date));
  return result.data;
};

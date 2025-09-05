import ADMIN_MOVIES from "../../constants/adminConstants/moviesConstants";
import apiClient from "../../Utils/apiClient";
import {
  CreateMovieRequestDto,
  CreateMovieResponseDto,
  GetMoviesResponseDto,
  GetMoviesWithFiltersQueryDto,
  GetMoviesWithFiltersResponseDto,
  GetMovieResponseDto,
  UpdateMovieRequestDto,
  UpdateMovieResponseDto,
  DeleteMovieResponseDto,
  ToggleMovieStatusResponseDto
} from '../../dtos/movie.dto';

export const addMovie = async (data: CreateMovieRequestDto): Promise<CreateMovieResponseDto> => {
  const response = await apiClient.post(ADMIN_MOVIES.BASE, data);
  return response.data;
};

export const getMovies = async (): Promise<GetMoviesResponseDto> => {
  const response = await apiClient.get(ADMIN_MOVIES.BASE);
  return response.data;
};

export const getMoviesWithFilters = async (
  filters: GetMoviesWithFiltersQueryDto
): Promise<GetMoviesWithFiltersResponseDto> => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value.toString());
    }
  });

  const response = await apiClient.get(`${ADMIN_MOVIES.FILTER}?${params.toString()}`);
  return response.data;
};

export const toggleMovieStatus = async (movieId: string): Promise<ToggleMovieStatusResponseDto> => {
  const response = await apiClient.patch(ADMIN_MOVIES.TOGGLE_STATUS(movieId));
  return response.data;
};

export const updateMovie = async (
  id: string, 
  data: UpdateMovieRequestDto
): Promise<UpdateMovieResponseDto> => {
  const res = await apiClient.put(ADMIN_MOVIES.BY_ID(id), data);
  return res.data;
};

export const getMovieById = async (id: string): Promise<GetMovieResponseDto> => {
  const response = await apiClient.get(ADMIN_MOVIES.BY_ID(id));
  return response.data;
};

export const deleteMovie = async (id: string): Promise<DeleteMovieResponseDto> => {
  const res = await apiClient.delete(ADMIN_MOVIES.BY_ID(id));
  return res.data;
};

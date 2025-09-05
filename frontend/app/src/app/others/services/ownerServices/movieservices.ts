import OWNER_MOVIES from "../../constants/ownerConstants/movieConstants";
import apiClient from "../../Utils/apiClient";
import {
  GetMoviesForShowtimeResponseDto
} from '../../dtos/movie.dto';

export const getMoviesForShowtime = async (): Promise<GetMoviesForShowtimeResponseDto> => {
  const response = await apiClient.get(OWNER_MOVIES.FILTER, { params: { isActive: true } });
  return response.data;
};

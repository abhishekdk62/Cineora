import TMDB_ROUTES from "../../constants/adminConstants/tmdbConstants";
import tmdbClient from "../../Utils/tmdbClient";
import {
  TMDBPopularMoviesResponseDto,
  TMDBGenreDto,
  TMDBSearchMoviesResponseDto,
  TMDBMovieDetailsResponseDto
} from '../../dtos/tmdb.dto';

export const fetchPopularMovies = async (page = 1): Promise<TMDBPopularMoviesResponseDto> => {
  const response = await tmdbClient.get(TMDB_ROUTES.POPULAR_MOVIES, {
    params: {
      language: "en-US",
      page,
    },
  });
  return response.data;
};

export const fetchGenres = async (): Promise<TMDBGenreDto[]> => {
  const response = await tmdbClient.get(TMDB_ROUTES.GENRES, {
    params: { language: "en-US" },
  });
  return response.data.genres;
};

export const searchMoviesFromDb = async (searchTerm: string, page = 1): Promise<TMDBSearchMoviesResponseDto> => {
  const response = await tmdbClient.get(TMDB_ROUTES.SEARCH_MOVIES, {
    params: {
      query: searchTerm,
      page,
    },
  });
  return response.data;
};

export const getMovieDetails = async (id: number): Promise<TMDBMovieDetailsResponseDto> => {
  const response = await tmdbClient.get(TMDB_ROUTES.MOVIE_DETAILS(id));
  return response.data;
};

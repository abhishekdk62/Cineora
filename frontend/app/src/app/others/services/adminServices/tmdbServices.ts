import { Movie } from "@/app/others/components/Admin/Dashboard/AdminContext";

import tmdbClient from "../../Utils/tmdbClient";
import axios from "axios";

export const fetchPopularMovies = async (page = 1) => {
  const response = await tmdbClient.get("/movie/popular", {
    params: {
      language: "en-US",
      page,
    },
  });
  return response.data;
};

export const fetchGenres = async () => {
  const response = await tmdbClient.get("/genre/movie/list", {
    params: { language: "en-US" },
  });
  return response.data.genres; 
};

export const searchMoviesFromDb = async (searchTerm: string, page = 1) => {
  const response = await tmdbClient.get("/search/movie", {
    params: {
      query: searchTerm,
      page,
    },
  });
  return response.data;
};

export const getMovieDetails = async (id: number) => {
  const response = await tmdbClient.get(`/movie/${id}`);
  return response.data;
};


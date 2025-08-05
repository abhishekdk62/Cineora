import { useState, useEffect } from "react";
import { TMDBMovie, TMDBGenre } from "../types/tmdb";
import {
  fetchGenres,
  fetchPopularMovies,
  searchMoviesFromDb
} from "@/app/others/services/adminServices/tmdbServices";
import { useAdmin } from "../../AdminContext";

export const useTMDBMovies = () => {
  const { tmdbMovies, setTmdbMovies, loading, setLoading } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("popularity");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [genres, setGenres] = useState<TMDBGenre[]>([]);

  const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

  useEffect(() => {
    if (searchTerm.trim()) {
      const term = searchTerm.trim();
      const timer = setTimeout(() => {
        searchMovies(term, currentPage);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      fetchMovies(currentPage);
    }
  }, [searchTerm, currentPage]);

  const fetchMovies = async (page: number) => {
    setLoading(true);
    try {
      const [moviesData, genresData] = await Promise.all([
        fetchPopularMovies(page),
        fetchGenres(),
      ]);
      setTmdbMovies(moviesData.results);
      setGenres(genresData);
      setTotalPages(moviesData.total_pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  
  const searchMovies = async (term: string, page: number) => {
    setLoading(true);
    try {
      const data = await searchMoviesFromDb(term, page);
      setTmdbMovies(data.results);
      setTotalPages(data.total_pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

const getGenreNames = (ids: number[]) =>
  ids.map((id) => genres.find((g) => g.id === id)?.name).filter(Boolean).join(", ");
  const filteredMovies = (tmdbMovies || [])
    .filter((m) =>
      selectedGenre === "all" ? true : m.genre_ids.includes(+selectedGenre)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "release_date":
          return (
            new Date(b.release_date).getTime() -
            new Date(a.release_date).getTime()
          );
        case "vote_average":
          return b.vote_average - a.vote_average;
        case "popularity":
        default:
          return (b.popularity ?? 0) - (a.popularity ?? 0);
      }
    });

  const onSetSearchTerm = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  return {
    searchTerm,
    setSearchTerm: onSetSearchTerm,
    selectedGenre,
    setSelectedGenre,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    currentPage,
    setCurrentPage,
    totalPages,
    genres,
    loading,
    filteredMovies,
    getGenreNames,
    TMDB_IMAGE_BASE_URL,
  };
};

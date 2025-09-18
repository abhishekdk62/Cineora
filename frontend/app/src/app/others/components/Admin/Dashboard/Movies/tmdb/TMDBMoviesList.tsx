"use client";
import React from "react";
import { TMDBMoviesListProps } from "../types/tmdb"; 
import { useTMDBMovies } from "../hooks/useTMDBMovies"; 
import PageHeader from "./PageHeader";
import SearchAndFilters from "./SearchAndFilters";
import MovieCard from "./MovieCard";
import MovieListItem from "./MovieListItem";
import Pagination from "./Pagination";
import LoadingState from "./LoadingState";
import EmptyState from "./EmptyState";
interface TMDBMovie {
  id: number;
  title: string;
  genre_ids: number[];
  release_date: string;
  overview: string;
  poster_path: string;
  original_language: string;
  // Optional additional fields you might need
  adult?: boolean;
  backdrop_path?: string | null;
  popularity?: number;
  vote_average?: number;
  vote_count?: number;
  video?: boolean;
}
const TMDBMoviesList: React.FC<TMDBMoviesListProps> = ({ onAddMovie }) => {
  const {
    searchTerm,
    setSearchTerm,
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
  } = useTMDBMovies();

  const handleAddMovie = async (movie: TMDBMovie) => {
    try {
      
      const movieData = {
        tmdbId: movie.id,
        title: movie.title,
        genre: getGenreNames(movie.genre_ids).split(", ").filter(Boolean),
        releaseDate: movie.release_date,
        duration: 120,
        rating: "PG-13",
        description: movie.overview,
        poster: `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`,
        trailer: "",
        cast: ["Sample Actor 1", "Sample Actor 2"],
        director: "Sample Director",
        language: movie.original_language,
      };
      onAddMovie(movieData);
    } catch (err) {
      console.error("Error adding movie:", err);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader />
      
      <SearchAndFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        genres={genres}
      />

      {loading && <LoadingState />}

      {!loading && filteredMovies.length === 0 ? (
        <EmptyState />
      ) : !loading ? (
        <>
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {filteredMovies.map((movie) =>
              viewMode === "grid" ? (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onAddMovie={handleAddMovie}
                  getGenreNames={getGenreNames}
                  loading={loading}
                />
              ) : (
                <MovieListItem
                  key={movie.id}
                  movie={movie}
                  onAddMovie={handleAddMovie}
                  getGenreNames={getGenreNames}
                  loading={loading}
                />
              )
            )}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : null}
    </div>
  );
};

export default TMDBMoviesList;
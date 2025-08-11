"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Lexend } from "next/font/google";
import MoviesTopBar from "./MoviesTopBar";
import MoviesList, { Movie } from "./MoviesList";
import TMDBMoviesList from "./tmdb/TMDBMoviesList";
import AddMovieModal from "./tmdb/AddMovieModal";
import { useAdmin } from "../AdminContext";
import {
  addMovie,
  deleteMovie,
  getMovies,
  getMoviesWithFilters,
  toggleMovieStatus,
  updateMovie,
} from "@/app/others/services/adminServices/movieServices";
import toast from "react-hot-toast";
import { confirmAction } from "@/app/others/Utils/ConfirmDialog";

const lexend = Lexend({
  weight: "500",
  subsets: ["latin"],
});

const lexendSmall = Lexend({
  weight: "300",
  subsets: ["latin"],
});

export interface MovieFilters {
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
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

const MoviesManager: React.FC = () => {
  const { movies, setMovies } = useAdmin();
  const [activeView, setActiveView] = useState<"current" | "expired" | "tmdb">(
    "current"
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTmdbMovie, setSelectedTmdbMovie] = useState<any>(null);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<MovieFilters>({});
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);

  const getMoviesList = async () => {
    console.log("yes");

    try {
      setIsLoading(true);
      const response = await getMovies();
      setMovies(response.data);
      if (!hasActiveFilters) {
        setFilteredMovies(response.data);
        setTotalItems(response.data.length);
        setTotalPages(Math.ceil(response.data.length / itemsPerPage));
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load movies");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMoviesList();
  }, []);

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      if (hasActiveFilters) {
        const filtersWithPage = {
          ...currentFilters,
          page,
          limit: itemsPerPage,
        };
        handleFiltersChange(filtersWithPage, false);
      }
    },
    [currentFilters, itemsPerPage, hasActiveFilters]
  );

  const handleFiltersChange = useCallback(
    async (filters: MovieFilters, resetPage: boolean = true) => {
      if (resetPage) {
        setCurrentPage(1);
        filters = { ...filters, page: 1, limit: itemsPerPage };
      } else {
        filters = { ...filters, limit: itemsPerPage };
      }

      const filtersChanged =
        JSON.stringify(filters) !== JSON.stringify(currentFilters);
      if (!filtersChanged) return;

      setCurrentFilters(filters);

      const isFilterActive = Object.entries(filters).some(([key, value]) => {
        if (key === "page" || key === "limit") return false;
        return value !== undefined && value !== null && value !== "";
      });

      setHasActiveFilters(isFilterActive);

      if (!isFilterActive) {
        // No active filters - show all movies with client-side pagination
        setFilteredMovies(movies);
        setTotalPages(Math.ceil(movies.length / itemsPerPage));
        setTotalItems(movies.length);
        setCurrentPage(1);
        return;
      }

      try {
        setIsLoading(true);
        const response = await getMoviesWithFilters(filters);
        console.log(response);

        setFilteredMovies(response.data || []);

        if (response.meta?.pagination) {
          setTotalPages(response.meta.pagination.totalPages);
          setTotalItems(response.meta.pagination.total);
          setCurrentPage(response.meta.pagination.currentPage);
        }
      } catch (error: any) {
        console.error("Filter error:", error);
        toast.error(error.response?.data?.message || "Filter failed");
        setFilteredMovies([]);
        setTotalPages(1);
        setTotalItems(0);
      } finally {
        setIsLoading(false);
      }
    },
    [currentFilters, movies, itemsPerPage, hasActiveFilters]
  );

  const handleAddMovie = async (movieData: any) => {
    try {
      const response = await addMovie(movieData);
      toast.success("Movie added successfully!");
      setMovies((prev) => [...prev, response.data]);
      setIsAddModalOpen(false);
      setSelectedTmdbMovie(null);
      if (hasActiveFilters) {
        handleFiltersChange(currentFilters, false);
      } else {
        getMoviesList();
      }
    } catch (error: any) {
      if (error) {
        toast.error("Movie already exists!");
      }
      console.error(error);
    }
  };

  const handleEditMovie = async (movieData: any) => {
    if (!editingMovie) return;
    try {
      const response = await updateMovie(editingMovie._id, movieData);
      toast.success("Movie updated successfully!");
      setMovies((prev) =>
        prev.map((m) =>
          m._id === editingMovie._id
            ? { ...m, ...movieData, updatedAt: new Date() }
            : m
        )
      );
      setIsAddModalOpen(false);
      setEditingMovie(null);
      if (hasActiveFilters) {
        handleFiltersChange(currentFilters, false);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update movie");
      console.error(error);
    }
  };

  const handleAddFromTmdb = (tmdbMovie: any) => {
    setSelectedTmdbMovie(tmdbMovie);
    setIsAddModalOpen(true);
  };

  const handleEditExisting = (movie: Movie) => {
    setEditingMovie(movie);
    setIsAddModalOpen(true);
    setSelectedTmdbMovie(null);
  };

  const handleDeleteMovie = async (movie: Movie) => {
    const confirmed = await confirmAction({
      title: "Delete Movie?",
      message: `Are you sure you want to delete "${movie.title}"?`,
      confirmText: "Delete",
      cancelText: "Cancel",
    });
    if (!confirmed) return;

    try {
      await deleteMovie(movie._id);
      toast.success("Movie deleted successfully!");

      if (hasActiveFilters) {
        handleFiltersChange(currentFilters, false);
      } else {
        getMoviesList();
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete movie");
    }
  };

  const handleToggleStatus = async (movie: Movie) => {
    try {
      const willDisable = movie.isActive;
      const verb = willDisable ? "disable" : "activate";
      const capitalVerb = verb[0].toUpperCase() + verb.slice(1);

      const confirmed = await confirmAction({
        title: `${capitalVerb} Movie?`,
        message: `Are you sure you want to ${verb} "${movie.title}"?`,
        confirmText: capitalVerb,
        cancelText: "Cancel",
      });
      if (!confirmed) return;

      const response = await toggleMovieStatus(movie._id);
      if (response.success) {
        toast.success(`Movie ${verb}d successfully!`);

        if (hasActiveFilters) {
          handleFiltersChange(currentFilters, false);
        } else {
          getMoviesList();
        }
      } else {
        toast.error(`Failed to ${verb} movie.`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  const getDisplayMovies = () => {
    let moviesToShow = filteredMovies;

    // Apply active/inactive filter based on view
    const viewFiltered =
      activeView === "current"
        ? moviesToShow.filter((m) => m.isActive)
        : moviesToShow.filter((m) => !m.isActive);

    // If no server-side filtering is active, apply client-side pagination
    if (!hasActiveFilters) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return viewFiltered.slice(startIndex, endIndex);
    }

    return viewFiltered;
  };

  const currentMovies = movies.filter((m) => m.isActive);
  const expiredMovies = movies.filter((m) => !m.isActive);

  return (
    <React.Fragment>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1
              className={`${lexend.className} text-3xl font-bold text-white mb-2`}
            >
              Movies Management
            </h1>
            <p className={`${lexendSmall.className} text-gray-300`}>
              Manage your movie collection and track performance
            </p>
          </div>
        </div>

        {/* Top Bar */}
        <MoviesTopBar
          activeView={activeView}
          setActiveView={setActiveView}
          currentCount={currentMovies.length}
          expiredCount={expiredMovies.length}
        />

        {/* Views */}
        {activeView === "current" && (
          <MoviesList
            movies={getDisplayMovies()}
            allMovies={movies}
            onEdit={handleEditExisting}
            onDelete={handleDeleteMovie}
            onToggleStatus={handleToggleStatus}
            onFiltersChange={handleFiltersChange}
            isLoading={isLoading}
            currentFilters={currentFilters}
            title="Current Movies"
            emptyMessage="No active movies found"
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            onPageChange={handlePageChange}
          />
        )}
        {activeView === "expired" && (
          <MoviesList
            movies={getDisplayMovies()}
            allMovies={movies}
            onEdit={handleEditExisting}
            onDelete={handleDeleteMovie}
            onToggleStatus={handleToggleStatus}
            onFiltersChange={handleFiltersChange}
            isLoading={isLoading}
            currentFilters={currentFilters}
            title="Inactive Movies"
            emptyMessage="No inactive movies found"
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            onPageChange={handlePageChange}
          />
        )}
        {activeView === "tmdb" && (
          <TMDBMoviesList onAddMovie={handleAddFromTmdb} />
        )}

        {isAddModalOpen && (
          <AddMovieModal
            isOpen={isAddModalOpen}
            onClose={() => {
              setIsAddModalOpen(false);
              setSelectedTmdbMovie(null);
              setEditingMovie(null);
            }}
            onSubmit={editingMovie ? handleEditMovie : handleAddMovie}
            tmdbMovie={selectedTmdbMovie}
            editingMovie={editingMovie}
          />
        )}
      </div>
    </React.Fragment>
  );
};

export default MoviesManager;

import React, { useEffect, useState } from "react";
import { Lexend } from "next/font/google";
import {
  Edit,
  Trash2,
  Search,
  Filter,
  Grid3X3,
  List,
  Star,
  Clock,
  Eye,
  Play,
  Pause,
  Calendar,
  Users,
  Loader2,
  ChevronDown,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { MovieFilters } from "./MoviesManager";
import Pagination from "./tmdb/Pagination";

const lexend = Lexend({
  weight: "500",
  subsets: ["latin"],
});

const lexendSmall = Lexend({
  weight: "300",
  subsets: ["latin"],
});

export interface Movie {
  _id: string;
  tmdbId: number;
  title: string;
  genre: string[];
  releaseDate: string;
  duration: number;
  rating: string;
  description: string;
  poster: string;
  trailer: string;
  cast: string[];
  director: string;
  language: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface MoviesListProps {
  movies: Movie[];
  onEdit: (movie: Movie) => void;
  onDelete: (movie: Movie) => void;
  onToggleStatus: (movie: Movie) => void;
  onFiltersChange: (filters: MovieFilters, resetPage?: boolean) => void;
  isLoading: boolean;
  currentFilters: MovieFilters;
  title: string;
  allMovies: Movie[];
  emptyMessage: string;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

const MoviesList: React.FC<MoviesListProps> = ({
  movies,
  onEdit,
  onDelete,
  onToggleStatus,
  onFiltersChange,
  isLoading,
  currentFilters,
  title,
  allMovies,
  emptyMessage,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] =
    useState<MovieFilters>(currentFilters);

  useEffect(() => {
    const delayedFilter = setTimeout(() => {
      onFiltersChange(localFilters, true);
    }, 500);

    return () => clearTimeout(delayedFilter);
  }, [localFilters, onFiltersChange]);

  const availableRatings = [
    ...new Set(allMovies.map((movie) => movie.rating)),
  ].filter(Boolean);

  const availableLanguages = [
    ...new Set(allMovies.map((movie) => movie.language)),
  ].filter(Boolean);

  const availableGenres = [
    ...new Set(allMovies.flatMap((movie) => movie.genre)),
  ].filter(Boolean);

  const releaseYears = [
    ...new Set(
      allMovies.map((movie) => new Date(movie.releaseDate).getFullYear())
    ),
  ].sort((a, b) => b - a);
  const handleFilterChange = (key: keyof MovieFilters, value: any) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value === "" ? undefined : value,
    }));
  };

  const clearAllFilters = () => {
    setLocalFilters({});
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case "G":
        return "bg-green-500";
      case "PG":
        return "bg-blue-500";
      case "PG-13":
        return "bg-yellow-500";
      case "R":
        return "bg-orange-500";
      case "NC-17":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getGenreColor = (genre: string) => {
    const colors = {
      Action: "bg-red-500/20 text-red-200 border-red-400/50",
      Comedy: "bg-yellow-500/20 text-yellow-200 border-yellow-400/50",
      Drama: "bg-purple-500/20 text-purple-200 border-purple-400/50",
      Horror: "bg-gray-500/20 text-gray-200 border-gray-400/50",
      "Sci-Fi": "bg-blue-500/20 text-blue-200 border-blue-400/50",
      Romance: "bg-pink-500/20 text-pink-200 border-pink-400/50",
      Thriller: "bg-orange-500/20 text-orange-200 border-orange-400/50",
      Crime: "bg-indigo-500/20 text-indigo-200 border-indigo-400/50",
    };
    return (
      colors[genre as keyof typeof colors] ||
      "bg-gray-500/20 text-gray-200 border-gray-400/50"
    );
  };

  const renderMovieCard = (movie: Movie): React.ReactElement => (
      <div className="group bg-[#1a1a1a] border border-gray-600 rounded-lg hover:border-[#e78f03] transition-all duration-300 hover:shadow-2xl hover:shadow-[#e78f03]/20 backdrop-blur-sm">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={movie.poster || "/placeholder.svg"}
            alt={movie.title}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-3 left-3">
            <span
              className={`${getRatingColor(
                movie.rating
              )} text-white text-xs px-2 py-1 rounded-full font-medium`}
            >
              {movie.rating}
            </span>
          </div>
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex gap-1">
              <button
                className="h-8 w-8 p-0 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center justify-center transition-colors"
                onClick={() => onToggleStatus(movie)}
                title={movie.isActive ? "Deactivate" : "Activate"}
              >
                {movie.isActive ? <Pause size={14} /> : <Play size={14} />}
              </button>
              <button
                className="h-8 w-8 p-0 bg-[#e78f03] hover:bg-[#d17a02] text-black rounded-md flex items-center justify-center transition-colors"
                onClick={() => onEdit(movie)}
              >
                <Edit size={14} />
              </button>
              <button
                className="h-8 w-8 p-0 bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center justify-center transition-colors"
                onClick={() => onDelete(movie)}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3
              className={`${lexend.className} text-lg font-semibold text-white line-clamp-1`}
            >
              {movie.title}
            </h3>
            <div className="flex items-center gap-1 text-yellow-400">
              <Star size={14} fill="currentColor" />
              <span className="text-sm">4.5</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {movie.genre.slice(0, 2).map((genre, index) => (
              <span
                key={index}
                className={`text-xs px-2 py-1 rounded-full border ${getGenreColor(
                  genre
                )}`}
              >
                {genre}
              </span>
            ))}
            <div className="flex items-center gap-1 text-gray-300 text-sm">
              <Clock size={12} />
              <span>{movie.duration}m</span>
            </div>
          </div>
          <p
            className={`${lexendSmall.className} text-gray-300 text-sm mb-4 line-clamp-2`}
          >
            {movie.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <Users size={12} />
              <span>{movie.director}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-300 text-sm">
              <Calendar size={12} />
              <span>{new Date(movie.releaseDate).getFullYear()}</span>
            </div>
          </div>
        </div>
      </div>
  );

  const renderMovieList = (movie: Movie): React.ReactElement => (
    <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg hover:border-[#e78f03] transition-all duration-300">
      <div className="p-4">
        <div className="flex items-center gap-4">
          <img
            src={movie.poster || "/placeholder.svg"}
            alt={movie.title}
            className="w-16 h-24 object-cover rounded-lg"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3
                className={`${lexend.className} text-lg font-semibold text-white`}
              >
                {movie.title}
              </h3>
              <div className="flex items-center gap-2">
                <span
                  className={`${getRatingColor(
                    movie.rating
                  )} text-white text-xs px-2 py-1 rounded-full font-medium`}
                >
                  {movie.rating}
                </span>
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star size={14} fill="currentColor" />
                  <span className="text-sm">4.5</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-2 flex-wrap">
              {movie.genre.slice(0, 3).map((genre, index) => (
                <span
                  key={index}
                  className={`text-xs px-2 py-1 rounded-full border ${getGenreColor(
                    genre
                  )}`}
                >
                  {genre}
                </span>
              ))}
              <div className="flex items-center gap-1 text-gray-300 text-sm">
                <Clock size={12} />
                <span>{movie.duration}m</span>
              </div>
              <div className="flex items-center gap-1 text-gray-300 text-sm">
                <Calendar size={12} />
                <span>{new Date(movie.releaseDate).getFullYear()}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-300 text-sm">
                <span>{movie.language}</span>
              </div>
            </div>
            <p
              className={`${lexendSmall.className} text-gray-300 text-sm mb-3 line-clamp-1`}
            >
              {movie.description}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="px-3 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
              onClick={() => onToggleStatus(movie)}
              title={movie.isActive ? "Deactivate" : "Activate"}
            >
              {movie.isActive ? <Pause size={14} /> : <Play size={14} />}
            </button>
            <button
              className="px-3 py-2 text-sm bg-[#e78f03] hover:bg-[#d17a02] text-black rounded-md transition-colors font-medium"
              onClick={() => onEdit(movie)}
            >
              <Edit size={14} />
            </button>
            <button
              className="px-3 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
              onClick={() => onDelete(movie)}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const activeFilterCount = Object.values(localFilters).filter(
    (value) => value !== undefined && value !== null && value !== ""
  ).length;

  return (
    <React.Fragment>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm font-medium">
                  Total Movies
                </p>
                <p className="text-2xl font-bold text-white">
                  {allMovies.length}
                </p>
              </div>
              <Eye className="h-8 w-8 text-[#e78f03]" />
            </div>
          </div>
          <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm font-medium">Active</p>
                <p className="text-2xl font-bold text-green-400">
                  {allMovies.filter((m) => m.isActive).length}
                </p>
              </div>
              <Play className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm font-medium">Inactive</p>
                <p className="text-2xl font-bold text-red-400">
                  {allMovies.filter((m) => !m.isActive).length}
                </p>
              </div>
              <Pause className="h-8 w-8 text-red-400" />
            </div>
          </div>
          <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm font-medium">
                  Search Results
                </p>
                <p className="text-2xl font-bold text-white">{totalItems}</p>
              </div>
              <Filter className="h-8 w-8 text-[#e78f03]" />
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className={`${lexend.className} text-2xl font-bold text-white`}>
            {title}
          </h2>
          <div className="flex items-center gap-4">
            {isLoading && (
              <div className="flex items-center gap-2 text-gray-400">
                <Loader2 className="animate-spin" size={16} />
                <span className="text-sm">Loading...</span>
              </div>
            )}
            {/* Pagination Info */}
            <div className="text-sm text-gray-400">
              Showing {movies.length} of {totalItems} results (Page{" "}
              {currentPage} of {totalPages})
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md border transition-colors ${
                  viewMode === "grid"
                    ? "bg-[#e78f03] text-black border-[#e78f03]"
                    : "border-gray-500 text-gray-300 hover:text-white hover:border-[#e78f03]"
                }`}
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md border transition-colors ${
                  viewMode === "list"
                    ? "bg-[#e78f03] text-black border-[#e78f03]"
                    : "border-gray-500 text-gray-300 hover:text-white hover:border-[#e78f03]"
                }`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Your existing Search and Filter Bar */}
        <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-4 shadow-lg">
          <div className="flex flex-col gap-4">
            {/* Search and Toggle Filters Row */}
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search movies by title, director, cast..."
                  value={localFilters.search || ""}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className={`${lexendSmall.className} w-full pl-10 pr-4 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03]`}
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  showFilters
                    ? "bg-[#e78f03] text-black border-[#e78f03]"
                    : "border-gray-500 text-gray-300 hover:text-white hover:border-[#e78f03]"
                }`}
              >
                <SlidersHorizontal size={16} />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                >
                  <X size={14} />
                  Clear All
                </button>
              )}
            </div>

            {/* Advanced Filters - Your existing filters remain the same */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-4 border-t border-gray-600">
                {/* All your existing filter components remain the same */}
                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Rating
                  </label>
                  <select
                    value={localFilters.rating || ""}
                    onChange={(e) =>
                      handleFilterChange("rating", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03] appearance-none"
                  >
                    <option value="">All Ratings</option>
                    {availableRatings.map((rating) => (
                      <option
                        key={rating}
                        value={rating}
                        className="bg-[#2a2a2a]"
                      >
                        {rating}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Genre Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Genre
                  </label>
                  <select
                    value={localFilters.genre || ""}
                    onChange={(e) =>
                      handleFilterChange("genre", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03] appearance-none"
                  >
                    <option value="">All Genres</option>
                    {availableGenres.map((genre) => (
                      <option
                        key={genre}
                        value={genre}
                        className="bg-[#2a2a2a]"
                      >
                        {genre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Language Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Language
                  </label>
                  <select
                    value={localFilters.language || ""}
                    onChange={(e) =>
                      handleFilterChange("language", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03] appearance-none"
                  >
                    <option value="">All Languages</option>
                    {availableLanguages.map((language) => (
                      <option
                        key={language}
                        value={language}
                        className="bg-[#2a2a2a]"
                      >
                        {language}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Sort By
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={localFilters.sortBy || "title"}
                      onChange={(e) =>
                        handleFilterChange("sortBy", e.target.value)
                      }
                      className="flex-1 px-3 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03] appearance-none"
                    >
                      <option value="title">Title</option>
                      <option value="releaseDate">Release Date</option>
                      <option value="rating">Rating</option>
                      <option value="duration">Duration</option>
                    </select>
                    <select
                      value={localFilters.sortOrder || "asc"}
                      onChange={(e) =>
                        handleFilterChange(
                          "sortOrder",
                          e.target.value as "asc" | "desc"
                        )
                      }
                      className="px-3 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03] appearance-none"
                    >
                      <option value="asc">A→Z / Low→High</option>
                      <option value="desc">Z→A / High→Low</option>
                    </select>
                  </div>
                </div>

                {/* Duration Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Duration (minutes)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={localFilters.minDuration || ""}
                      onChange={(e) =>
                        handleFilterChange(
                          "minDuration",
                          e.target.value ? parseInt(e.target.value) : undefined
                        )
                      }
                      className="flex-1 px-3 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03]"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={localFilters.maxDuration || ""}
                      onChange={(e) =>
                        handleFilterChange(
                          "maxDuration",
                          e.target.value ? parseInt(e.target.value) : undefined
                        )
                      }
                      className="flex-1 px-3 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03]"
                    />
                  </div>
                </div>

                {/* Release Year Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Release Year
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={localFilters.releaseYearStart || ""}
                      onChange={(e) =>
                        handleFilterChange(
                          "releaseYearStart",
                          e.target.value ? parseInt(e.target.value) : undefined
                        )
                      }
                      className="flex-1 px-3 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03] appearance-none"
                    >
                      <option value="">From</option>
                      {releaseYears.map((year) => (
                        <option
                          key={year}
                          value={year}
                          className="bg-[#2a2a2a]"
                        >
                          {year}
                        </option>
                      ))}
                    </select>
                    <select
                      value={localFilters.releaseYearEnd || ""}
                      onChange={(e) =>
                        handleFilterChange(
                          "releaseYearEnd",
                          e.target.value ? parseInt(e.target.value) : undefined
                        )
                      }
                      className="flex-1 px-3 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03] appearance-none"
                    >
                      <option value="">To</option>
                      {releaseYears.map((year) => (
                        <option
                          key={year}
                          value={year}
                          className="bg-[#2a2a2a]"
                        >
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        {movies.length === 0 ? (
          <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-12 text-center">
            {isLoading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-16 w-16 text-gray-400 animate-spin mb-4" />
                <h3 className={`${lexend.className} text-xl text-white mb-2`}>
                  Loading movies...
                </h3>
              </div>
            ) : (
              <>
                <Eye className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className={`${lexend.className} text-xl text-white mb-2`}>
                  {activeFilterCount > 0
                    ? "No movies match your filters"
                    : emptyMessage}
                </h3>
                <p className={`${lexendSmall.className} text-gray-400`}>
                  {activeFilterCount > 0
                    ? "Try adjusting your filter criteria"
                    : "No movies found"}
                </p>
              </>
            )}
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {movies.map((movie) => (
              <React.Fragment key={movie._id}>
                {viewMode === "grid"
                  ? renderMovieCard(movie)
                  : renderMovieList(movie)}
              </React.Fragment>
            ))}
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </React.Fragment>
  );
};

export default MoviesList;

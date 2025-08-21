import React, { useState } from "react";
import { Lexend } from "next/font/google";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { MovieFilters } from "./MoviesManager";
import { Movie } from "./MoviesList";

const lexendSmall = Lexend({
  weight: "300",
  subsets: ["latin"],
});

interface MoviesSearchFilterProps {
  localFilters: MovieFilters;
  allMovies: Movie[];
  onFilterChange: (key: keyof MovieFilters, value: any) => void;
  onClearAllFilters: () => void;
  activeFilterCount: number;
}

const MoviesSearchFilter: React.FC<MoviesSearchFilterProps> = ({
  localFilters,
  allMovies,
  onFilterChange,
  onClearAllFilters,
  activeFilterCount,
}) => {
  const [showFilters, setShowFilters] = useState(false);

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

  return (
    <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-4 shadow-lg">
      <div className="flex flex-col gap-4">
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
              onChange={(e) => onFilterChange("search", e.target.value)}
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
          </button>
          {activeFilterCount > 0 && (
            <button
              onClick={onClearAllFilters}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
            >
              <X size={14} />
              Clear All
            </button>
          )}
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-4 border-t border-gray-600">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Rating
              </label>
              <select
                value={localFilters.rating || ""}
                onChange={(e) => onFilterChange("rating", e.target.value)}
                className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03] appearance-none"
              >
                <option value="">All Ratings</option>
                {availableRatings.map((rating) => (
                  <option key={rating} value={rating} className="bg-[#2a2a2a]">
                    {rating}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Genre
              </label>
              <select
                value={localFilters.genre || ""}
                onChange={(e) => onFilterChange("genre", e.target.value)}
                className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03] appearance-none"
              >
                <option value="">All Genres</option>
                {availableGenres.map((genre) => (
                  <option key={genre} value={genre} className="bg-[#2a2a2a]">
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Language
              </label>
              <select
                value={localFilters.language || ""}
                onChange={(e) => onFilterChange("language", e.target.value)}
                className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03] appearance-none"
              >
                <option value="">All Languages</option>
                {availableLanguages.map((language) => (
                  <option key={language} value={language} className="bg-[#2a2a2a]">
                    {language}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sort By
              </label>
              <div className="flex gap-2">
                <select
                  value={localFilters.sortBy || "title"}
                  onChange={(e) => onFilterChange("sortBy", e.target.value)}
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
                    onFilterChange("sortOrder", e.target.value as "asc" | "desc")
                  }
                  className="px-3 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03] appearance-none"
                >
                  <option value="asc">A→Z / Low→High</option>
                  <option value="desc">Z→A / High→Low</option>
                </select>
              </div>
            </div>

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
                    onFilterChange(
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
                    onFilterChange(
                      "maxDuration",
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  className="flex-1 px-3 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Release Year
              </label>
              <div className="flex gap-2">
                <select
                  value={localFilters.releaseYearStart || ""}
                  onChange={(e) =>
                    onFilterChange(
                      "releaseYearStart",
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  className="flex-1 px-3 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03] appearance-none"
                >
                  <option value="">From</option>
                  {releaseYears.map((year) => (
                    <option key={year} value={year} className="bg-[#2a2a2a]">
                      {year}
                    </option>
                  ))}
                </select>
                <select
                  value={localFilters.releaseYearEnd || ""}
                  onChange={(e) =>
                    onFilterChange(
                      "releaseYearEnd",
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  className="flex-1 px-3 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03] appearance-none"
                >
                  <option value="">To</option>
                  {releaseYears.map((year) => (
                    <option key={year} value={year} className="bg-[#2a2a2a]">
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
  );
};

export default MoviesSearchFilter;

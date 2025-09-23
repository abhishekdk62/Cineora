import React, { useState } from "react";
import { Lexend } from "next/font/google";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { MovieFilters } from "./MoviesManager";
import { Movie, MovieFilterValue } from "./MoviesList";
import { MovieResponseDto } from "@/app/others/dtos";

const lexendSmall = Lexend({
  weight: "300",
  subsets: ["latin"],
});

const lexendMedium = { fontFamily: 'Lexend', fontWeight: '500' };
const lexendSmallStyle = { fontFamily: 'Lexend', fontWeight: '400' };

interface MoviesSearchFilterProps {
  localFilters: MovieFilters;
  allMovies: MovieResponseDto[];
  onFilterChange: (key: keyof MovieFilters, value: MovieFilterValue) => void;
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
    <div className="bg-gray-900/90 backdrop-blur-sm border border-yellow-500/20 rounded-lg p-6">
      <div className="flex flex-col gap-6">
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
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-yellow-500/30 rounded-lg text-white placeholder-gray-500 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-200"
              style={lexendSmallStyle}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-all duration-200 ${
              showFilters
                ? "bg-yellow-500 text-black border-yellow-500"
                : "border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 hover:border-yellow-500/60"
            }`}
            style={lexendSmallStyle}
          >
            <SlidersHorizontal size={16} />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                showFilters 
                  ? "bg-black/20 text-black" 
                  : "bg-yellow-500/20 text-yellow-400"
              }`}>
                {activeFilterCount}
              </span>
            )}
          </button>
          {activeFilterCount > 0 && (
            <button
              onClick={onClearAllFilters}
              className="flex items-center gap-2 px-4 py-3 text-sm bg-red-500 hover:bg-red-400 text-white rounded-lg transition-all duration-200"
              style={lexendSmallStyle}
            >
              <X size={14} />
              Clear All
            </button>
          )}
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-6 border-t border-yellow-500/20">
            <div>
              <label 
                className="block text-sm text-gray-400 mb-2" 
                style={lexendSmallStyle}
              >
                Rating
              </label>
              <select
                value={localFilters.rating || ""}
                onChange={(e) => onFilterChange("rating", e.target.value)}
                className="w-full px-4 py-2 bg-gray-800/50 border border-yellow-500/30 rounded-lg text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-200"
                style={lexendSmallStyle}
              >
                <option value="">All Ratings</option>
                {availableRatings.map((rating) => (
                  <option key={rating} value={rating} className="bg-gray-800">
                    {rating}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label 
                className="block text-sm text-gray-400 mb-2" 
                style={lexendSmallStyle}
              >
                Genre
              </label>
              <select
                value={localFilters.genre || ""}
                onChange={(e) => onFilterChange("genre", e.target.value)}
                className="w-full px-4 py-2 bg-gray-800/50 border border-yellow-500/30 rounded-lg text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-200"
                style={lexendSmallStyle}
              >
                <option value="">All Genres</option>
                {availableGenres.map((genre) => (
                  <option key={genre} value={genre} className="bg-gray-800">
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label 
                className="block text-sm text-gray-400 mb-2" 
                style={lexendSmallStyle}
              >
                Language
              </label>
              <select
                value={localFilters.language || ""}
                onChange={(e) => onFilterChange("language", e.target.value)}
                className="w-full px-4 py-2 bg-gray-800/50 border border-yellow-500/30 rounded-lg text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-200"
                style={lexendSmallStyle}
              >
                <option value="">All Languages</option>
                {availableLanguages.map((language) => (
                  <option key={language} value={language} className="bg-gray-800">
                    {language}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label 
                className="block text-sm text-gray-400 mb-2" 
                style={lexendSmallStyle}
              >
                Sort By
              </label>
              <div className="flex gap-2">
                <select
                  value={localFilters.sortBy || "title"}
                  onChange={(e) => onFilterChange("sortBy", e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-800/50 border border-yellow-500/30 rounded-lg text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-200"
                  style={lexendSmallStyle}
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
                  className="px-3 py-2 bg-gray-800/50 border border-yellow-500/30 rounded-lg text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-200"
                  style={lexendSmallStyle}
                >
                  <option value="asc">A→Z / Low→High</option>
                  <option value="desc">Z→A / High→Low</option>
                </select>
              </div>
            </div>

            <div>
              <label 
                className="block text-sm text-gray-400 mb-2" 
                style={lexendSmallStyle}
              >
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
                  className="flex-1 px-3 py-2 bg-gray-800/50 border border-yellow-500/30 rounded-lg text-white placeholder-gray-500 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-200"
                  style={lexendSmallStyle}
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
                  className="flex-1 px-3 py-2 bg-gray-800/50 border border-yellow-500/30 rounded-lg text-white placeholder-gray-500 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-200"
                  style={lexendSmallStyle}
                />
              </div>
            </div>

            <div>
              <label 
                className="block text-sm text-gray-400 mb-2" 
                style={lexendSmallStyle}
              >
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
                  className="flex-1 px-3 py-2 bg-gray-800/50 border border-yellow-500/30 rounded-lg text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-200"
                  style={lexendSmallStyle}
                >
                  <option value="">From</option>
                  {releaseYears.map((year) => (
                    <option key={year} value={year} className="bg-gray-800">
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
                  className="flex-1 px-3 py-2 bg-gray-800/50 border border-yellow-500/30 rounded-lg text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-200"
                  style={lexendSmallStyle}
                >
                  <option value="">To</option>
                  {releaseYears.map((year) => (
                    <option key={year} value={year} className="bg-gray-800">
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

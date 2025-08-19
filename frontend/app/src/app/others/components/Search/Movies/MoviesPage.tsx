"use client";

import { useState, useEffect } from "react";
import { Lexend } from "next/font/google";
import { useRouter } from "next/navigation";

const lexendSmall = Lexend({
  weight: "200",
  subsets: ["latin"],
});

const lexendMedium = Lexend({
  weight: "400",
  subsets: ["latin"],
});

const lexendBold = Lexend({
  weight: "700",
  subsets: ["latin"],
});

interface Movie {
  _id: string;
  tmdbId: string;
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
}

interface MoviesPageProps {
  movies: Movie[];
  loading: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onFiltersChange: (filters: any) => void;
}

export default function MoviesPage({ 
  movies, 
  loading, 
  totalPages, 
  currentPage, 
  onPageChange, 
  onFiltersChange 
}: MoviesPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [durationRange, setDurationRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("releaseDate");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>("desc");
  const [showFilters, setShowFilters] = useState(false);
  
  const router = useRouter();

  const genres = ["All", "Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama", "Family", "Fantasy", "History", "Horror", "Music", "Mystery", "Romance", "Sci-Fi", "Thriller", "War", "Western"];
  const ratings = ["All", "G", "PG", "PG-13", "R", "NC-17"];
  const languages = ["All", "en", "es", "fr", "de", "hi", "zh", "ja", "ko"];
  const years = ["All", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018"];
  const sortOptions = [
    { value: "releaseDate", label: "Release Date" },
    { value: "title", label: "Title" },
    { value: "duration", label: "Duration" },
    { value: "rating", label: "Rating" },
  ];

  const languageMap: { [key: string]: string } = {
    "en": "English",
    "es": "Spanish",
    "fr": "French",
    "de": "German",
    "hi": "Hindi",
    "zh": "Chinese",
    "ja": "Japanese",
    "ko": "Korean"
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  useEffect(() => {
    const filters: any = {};
    
    if (searchQuery) filters.search = searchQuery;
    if (selectedGenre !== "all") filters.genre = selectedGenre;
    if (selectedRating !== "all") filters.rating = selectedRating;
    if (selectedLanguage !== "all") filters.language = selectedLanguage;
    if (selectedYear !== "all") {
      filters.releaseYearStart = parseInt(selectedYear);
      filters.releaseYearEnd = parseInt(selectedYear);
    }
    if (durationRange.min) filters.minDuration = parseInt(durationRange.min);
    if (durationRange.max) filters.maxDuration = parseInt(durationRange.max);
    
    filters.sortBy = sortBy;
    filters.sortOrder = sortOrder;

    onFiltersChange(filters);
  }, [searchQuery, selectedGenre, selectedRating, selectedLanguage, selectedYear, durationRange, sortBy, sortOrder]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedGenre("all");
    setSelectedRating("all");
    setSelectedLanguage("all");
    setSelectedYear("all");
    setDurationRange({ min: "", max: "" });
    setSortBy("releaseDate");
    setSortOrder("desc");
  };

  const hasActiveFilters = selectedGenre !== 'all' || selectedRating !== 'all' || selectedLanguage !== 'all' || selectedYear !== 'all' || durationRange.min || durationRange.max;

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <div className="relative pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="backdrop-blur-sm bg-black/20 rounded-3xl p-8 border border-gray-500/30">
            <h1 className={`${lexendBold.className} text-4xl md:text-5xl text-white mb-8 text-center`}>
              Now Showing
            </h1>
            
            {/* Enhanced Search Bar */}
            <div className="max-w-4xl mx-auto">
              <div className="relative flex gap-3">
                {/* Filter Toggle Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`${lexendMedium.className} relative flex items-center gap-2 px-4 py-4 bg-white/10 backdrop-blur-sm border border-gray-500/30 rounded-2xl text-white hover:bg-white/20 transition-all duration-300 ${hasActiveFilters ? 'bg-blue-600/20 border-blue-500/50' : ''}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                  <span className="hidden sm:inline">Filters</span>
                  {hasActiveFilters && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></span>
                  )}
                </button>

                {/* Search Input */}
                <div className="relative flex-1">
                  <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search movies, actors, directors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`${lexendMedium.className} w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-sm border border-gray-500/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-white/50 focus:bg-white/20 transition-all duration-300`}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="hidden lg:flex gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={`${lexendSmall.className} px-4 py-4 bg-white/10 backdrop-blur-sm border border-gray-500/30 rounded-2xl text-white focus:outline-none focus:border-white/50 focus:bg-white/20 transition-all duration-300`}
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value} className="bg-gray-800 text-white">
                        {option.label}
                      </option>
                    ))}
                  </select>
                  
                  {/* Sort Order Toggle Button */}
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className={`${lexendSmall.className} flex items-center gap-1 px-3 py-4 bg-white/10 backdrop-blur-sm border border-gray-500/30 rounded-2xl text-white hover:bg-white/20 transition-all duration-300`}
                  >
                    <svg className={`w-4 h-4 transition-transform duration-200 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Sidebar Overlay */}
      {showFilters && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" 
            onClick={() => setShowFilters(false)} 
          />
          
          {/* Sidebar - Coming from Left */}
          <div className={`absolute top-0 left-0 h-full w-full max-w-md bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-md border-r border-gray-500/30 transform transition-all duration-500 ease-in-out ${
            showFilters ? 'translate-x-0' : '-translate-x-full'
          }`}>
            
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-500/30">
              <h2 className={`${lexendBold.className} text-2xl text-white`}>Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="p-6 overflow-y-auto h-full pb-24">
              <div className="space-y-6">
                
                {/* Active Filters Summary */}
                {hasActiveFilters && (
                  <div className="mb-6">
                    <h3 className={`${lexendMedium.className} text-white text-sm mb-3`}>Active Filters</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedGenre !== 'all' && (
                        <span className="inline-flex items-center gap-1 bg-blue-600/20 text-blue-300 px-2 py-1 rounded-lg text-xs">
                          {genres.find(g => g.toLowerCase() === selectedGenre) || selectedGenre}
                          <button onClick={() => setSelectedGenre('all')} className="hover:text-white">×</button>
                        </span>
                      )}
                      {selectedRating !== 'all' && (
                        <span className="inline-flex items-center gap-1 bg-purple-600/20 text-purple-300 px-2 py-1 rounded-lg text-xs">
                          {selectedRating.toUpperCase()}
                          <button onClick={() => setSelectedRating('all')} className="hover:text-white">×</button>
                        </span>
                      )}
                      {selectedLanguage !== 'all' && (
                        <span className="inline-flex items-center gap-1 bg-green-600/20 text-green-300 px-2 py-1 rounded-lg text-xs">
                          {languageMap[selectedLanguage] || selectedLanguage}
                          <button onClick={() => setSelectedLanguage('all')} className="hover:text-white">×</button>
                        </span>
                      )}
                      {selectedYear !== 'all' && (
                        <span className="inline-flex items-center gap-1 bg-orange-600/20 text-orange-300 px-2 py-1 rounded-lg text-xs">
                          {selectedYear}
                          <button onClick={() => setSelectedYear('all')} className="hover:text-white">×</button>
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Genre Filter */}
                <div>
                  <label className={`${lexendMedium.className} text-white block mb-3`}>Genre</label>
                  <select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className={`${lexendSmall.className} w-full bg-white/10 border border-gray-500/30 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-white/50 focus:bg-white/20 transition-all duration-300`}
                  >
                    {genres.map(genre => (
                      <option key={genre} value={genre.toLowerCase()} className="bg-gray-800 text-white">
                        {genre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className={`${lexendMedium.className} text-white block mb-3`}>Rating</label>
                  <select
                    value={selectedRating}
                    onChange={(e) => setSelectedRating(e.target.value)}
                    className={`${lexendSmall.className} w-full bg-white/10 border border-gray-500/30 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-white/50 focus:bg-white/20 transition-all duration-300`}
                  >
                    {ratings.map(rating => (
                      <option key={rating} value={rating.toLowerCase()} className="bg-gray-800 text-white">
                        {rating}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Language Filter */}
                <div>
                  <label className={`${lexendMedium.className} text-white block mb-3`}>Language</label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className={`${lexendSmall.className} w-full bg-white/10 border border-gray-500/30 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-white/50 focus:bg-white/20 transition-all duration-300`}
                  >
                    <option value="all" className="bg-gray-800 text-white">All</option>
                    {Object.entries(languageMap).map(([code, name]) => (
                      <option key={code} value={code} className="bg-gray-800 text-white">
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Year Filter */}
                <div>
                  <label className={`${lexendMedium.className} text-white block mb-3`}>Year</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className={`${lexendSmall.className} w-full bg-white/10 border border-gray-500/30 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-white/50 focus:bg-white/20 transition-all duration-300`}
                  >
                    {years.map(year => (
                      <option key={year} value={year.toLowerCase()} className="bg-gray-800 text-white">
                        {year}
                      </option>
                    ))}
                  </select>
                </div>


            
              </div>
            </div>

            {/* Sidebar Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent border-t border-gray-500/30">
              <div className="flex gap-3">
                <button
                  onClick={clearAllFilters}
                  className={`${lexendMedium.className} flex-1 bg-red-600/20 hover:bg-red-600/40 text-red-300 py-3 px-4 rounded-xl transition-all duration-300 border border-red-500/30`}
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className={`${lexendMedium.className} flex-1 bg-white text-black py-3 px-4 rounded-xl hover:bg-gray-200 transition-all duration-300`}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className={`${lexendSmall.className} text-gray-400`}>
            {loading ? "Loading..." : `Showing ${movies.length} movies`}
          </p>
          
          {/* Mobile Sort Order Toggle (for screens smaller than lg) */}
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className={`${lexendSmall.className} lg:hidden flex items-center gap-2 px-3 py-2 bg-white/10 border border-gray-500/30 rounded-lg text-white hover:bg-white/20 transition-all duration-300`}
          >
            <svg className={`w-4 h-4 transition-transform duration-200 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
            <span className="hidden sm:inline">{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="backdrop-blur-sm bg-black/20 rounded-2xl p-8 border border-gray-500/30">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className={`${lexendMedium.className} text-white`}>Loading movies...</p>
            </div>
          </div>
        )}

        {/* Movies Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {movies.map((movie) => (
              <div 
                key={movie._id} 
                onClick={() => router.push(`/search/movies/${movie._id}`)} 
                className="backdrop-blur-sm bg-black/30 rounded-2xl overflow-hidden border border-gray-500/30 hover:border-white/30 transition-all duration-300 group cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/api/placeholder/300/450";
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-lg">
                    <span className={`${lexendSmall.className} text-white text-sm`}>{movie.rating}</span>
                  </div>
                  <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-lg">
                    <span className={`${lexendSmall.className} text-white text-sm`}>{formatDuration(movie.duration)}</span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className={`${lexendMedium.className} text-white text-lg mb-2 line-clamp-2`}>{movie.title}</h3>
                  
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {movie.genre.slice(0, 2).map((genre, index) => (
                        <span
                          key={index}
                          className={`${lexendSmall.className} bg-white/10 text-white px-2 py-1 rounded text-xs`}
                        >
                          {genre}
                        </span>
                      ))}
                      {movie.genre.length > 2 && (
                        <span className={`${lexendSmall.className} text-gray-400 text-xs`}>
                          +{movie.genre.length - 2} more
                        </span>
                      )}
                    </div>
                    
                    <p className={`${lexendSmall.className} text-gray-400 text-sm mb-1`}>
                      Director: {movie.director}
                    </p>
                    <p className={`${lexendSmall.className} text-gray-400 text-sm mb-1`}>
                      {new Date(movie.releaseDate).getFullYear()} • {languageMap[movie.language] || movie.language}
                    </p>
                  </div>
                  
                  <button className={`${lexendMedium.className} w-full bg-white text-black py-3 rounded-xl hover:bg-gray-200 transition-all duration-300`}>
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && movies.length === 0 && (
          <div className="text-center py-12">
            <div className="backdrop-blur-sm bg-black/20 rounded-2xl p-8 border border-gray-500/30">
              <h3 className={`${lexendMedium.className} text-white text-xl mb-4`}>No movies found</h3>
              <p className={`${lexendSmall.className} text-gray-400 mb-6`}>
                Try adjusting your search criteria or filters
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className={`${lexendMedium.className} bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 py-2 px-6 rounded-lg transition-all duration-300 border border-blue-500/30`}
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

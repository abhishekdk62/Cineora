"use client";

import React, { useState, useEffect } from "react";
import { X, Search, Film, Calendar, Clock, ChevronRight } from "lucide-react";
import { getMoviesForShowtime } from "@/app/others/services/ownerServices/movieservices";
import MovieDetailsModal from "./MovieDetailsModal"; 

interface Movie {
  _id: string;
  title: string;
  genre: string[];
  duration: number;
  language: string;
  releaseDate: string;
  rating: string;
  poster?: string;
  description: string;
  director: string;
  cast: string[];
  trailer?: string;
  tmdbId?: string;
  isActive: boolean;
}

interface MovieSelectionModalProps {
  onSelect: (movie: Movie) => void;
  onClose: () => void;
  lexendMedium: any;
  lexendSmall: any;
}

const MovieSelectionModal: React.FC<MovieSelectionModalProps> = ({
  onSelect,
  onClose,
  lexendMedium,
  lexendSmall,
}) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null); 

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const result = await getMoviesForShowtime();
      setMovies(result.data.filter((movie: Movie) => movie.isActive)); 
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.genre.some(g => g.toLowerCase().includes(searchTerm.toLowerCase())) ||
    movie.language.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleFinalSelect = (movie: Movie) => {
    onSelect(movie);
    setSelectedMovie(null);
  };

  const closeDetailsModal = () => {
    setSelectedMovie(null);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-60 flex items-center justify-center p-4">
        <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-500/30">
            <h2 className={`${lexendMedium.className} text-lg text-white`}>
              Select Movie
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Search */}
          <div className="p-6 border-b border-gray-500/30">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-gray-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Movie List */}
          <div className="p-6 overflow-y-auto max-h-96">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredMovies.map((movie) => (
                  <div
                    key={movie._id}
                    onClick={() => handleMovieClick(movie)} 
                    className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 cursor-pointer group border border-transparent hover:border-gray-500/30"
                  >
                    <div className="w-16 h-20 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
                      {movie.poster ? (
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Film className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3
                          className={`${lexendMedium.className} text-white text-lg truncate`}
                        >
                          {movie.title}
                        </h3>
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-lg">
                          {movie.rating}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-gray-400 mb-2">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span className={`${lexendSmall.className} text-sm`}>
                            {formatDuration(movie.duration)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span className={`${lexendSmall.className} text-sm`}>
                            {new Date(movie.releaseDate).getFullYear()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-gray-400">
                        <span className={`${lexendSmall.className} text-sm`}>
                          {movie.genre.slice(0, 2).join(", ")}
                          {movie.genre.length > 2 && ` +${movie.genre.length - 2}`}
                        </span>
                        <span className="text-gray-500">•</span>
                        <span className={`${lexendSmall.className} text-sm`}>
                          {movie.language}
                        </span>
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                ))}

                {filteredMovies.length === 0 && !loading && (
                  <div className="text-center py-8">
                    <p className={`${lexendSmall.className} text-gray-400`}>
                      No movies found matching your search.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedMovie && (
        <MovieDetailsModal
          movie={selectedMovie}
          onSelect={handleFinalSelect}
          onClose={closeDetailsModal}
          lexendMedium={lexendMedium}
          lexendSmall={lexendSmall}
        />
      )}
    </>
  );
};

export default MovieSelectionModal;

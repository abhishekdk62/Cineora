"use client";
import React from "react";
import { Star, Calendar, Plus, Loader2 } from "lucide-react";
import { Lexend } from "next/font/google";
import { TMDBMovie } from "../types/tmdb"; 

const lexend = Lexend({
  weight: "500",
  subsets: ["latin"],
});
const lexendSmall = Lexend({
  weight: "300",
  subsets: ["latin"],
});

interface MovieListItemProps {
  movie: TMDBMovie;
  onAddMovie: (movie: TMDBMovie) => void;
  getGenreNames: (ids: number[]) => string;
  loading: boolean;
}

const MovieListItem: React.FC<MovieListItemProps> = ({
  movie,
  onAddMovie,
  getGenreNames,
  loading,
}) => {
  const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

  return (
    <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg hover:border-[#e78f03] transition-all duration-300">
      <div className="p-4">
        <div className="flex items-center gap-4">
          <img
            src={movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : "/placeholder.svg"}
            alt={movie.title}
            className="w-16 h-24 object-cover rounded-lg"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className={`${lexend.className} text-lg font-semibold text-white`}>{movie.title}</h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star size={14} fill="currentColor" />
                  <span className="text-sm">{movie.vote_average.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-300 text-sm">
                  <Calendar size={12} />
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-xs px-2 py-1 rounded-full border bg-blue-500/20 text-blue-200 border-blue-400/50">
                {getGenreNames(movie.genre_ids.slice(0, 3))}
              </span>
              <span className="text-gray-400 text-sm">Votes: {movie.vote_count}</span>
            </div>
            <p className={`${lexendSmall.className} text-gray-300 text-sm mb-3 line-clamp-1`}>{movie.overview}</p>
          </div>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 text-sm bg-[#e78f03] hover:bg-[#d17a02] text-black rounded-md transition-colors font-medium flex items-center gap-2"
              onClick={() => onAddMovie(movie)}
              disabled={loading}
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Add Movie
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieListItem;

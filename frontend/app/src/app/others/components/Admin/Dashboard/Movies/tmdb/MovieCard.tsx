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

interface MovieCardProps {
  movie: TMDBMovie;
  onAddMovie: (movie: TMDBMovie) => void;
  getGenreNames: (ids: number[]) => string;
  loading: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onAddMovie,
  getGenreNames,
  loading,
}) => {
  const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

  return (
    <div className="group bg-[#1a1a1a] border border-gray-600 rounded-lg hover:border-[#e78f03] transition-all duration-300 hover:shadow-2xl hover:shadow-[#e78f03]/20 backdrop-blur-sm">
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={
            movie.poster_path
              ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
              : "/placeholder.svg"
          }
          alt={movie.title}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 left-3">
          <div className="flex items-center gap-1 bg-black/50 text-yellow-400 text-xs px-2 py-1 rounded-full">
            <Star size={12} fill="currentColor" />
            <span>{movie.vote_average.toFixed(1)}</span>
          </div>
        </div>
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            className="h-8 w-8 p-0 bg-[#e78f03] hover:bg-[#d17a02] text-black rounded-md flex items-center justify-center transition-colors"
            onClick={() => onAddMovie(movie)}
            disabled={loading}
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Plus size={14} />
            )}
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3
            className={`${lexend.className} text-lg font-semibold text-white line-clamp-1`}
          >
            {movie.title}
          </h3>
          <div className="flex items-center gap-1 text-gray-300 text-sm">
            <Calendar size={12} />
            <span>
              {movie.release_date
                ? new Date(movie.release_date).getFullYear()
                : "N/A"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs px-2 py-1 rounded-full border bg-blue-500/20 text-blue-200 border-blue-400/50">
            {getGenreNames(movie.genre_ids.slice(0, 2))}
          </span>
        </div>
        <p
          className={`${lexendSmall.className} text-gray-300 text-sm mb-4 line-clamp-2`}
        >
          {movie.overview}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-yellow-400">
            <Star size={14} fill="currentColor" />
            <span className="text-sm">{movie.vote_average.toFixed(1)}</span>
            <span className="text-gray-400 text-xs">({movie.vote_count})</span>
          </div>
          <button
            className="bg-[#e78f03] text-black hover:bg-[#d17a02] px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center gap-1"
            onClick={() => onAddMovie(movie)}
            disabled={loading}
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Plus size={14} />
            )}
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;

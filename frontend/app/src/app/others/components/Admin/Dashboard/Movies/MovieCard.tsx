import React from "react";
import { Lexend } from "next/font/google";
import {
  Edit,
  Trash2,
  Star,
  Clock,
  Play,
  Pause,
  Calendar,
  Users,
} from "lucide-react";
import { Movie } from "./MoviesList";

const lexend = Lexend({
  weight: "500",
  subsets: ["latin"],
});

const lexendSmall = Lexend({
  weight: "300",
  subsets: ["latin"],
});

interface MovieCardProps {
  movie: Movie;
  onEdit: (movie: Movie) => void;
  onDelete: (movie: Movie) => void;
  onToggleStatus: (movie: Movie) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
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

  return (
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
};

export default MovieCard;

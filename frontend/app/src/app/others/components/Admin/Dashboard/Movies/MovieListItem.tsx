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

interface MovieListItemProps {
  movie: Movie;
  onEdit: (movie: Movie) => void;
  onDelete: (movie: Movie) => void;
  onToggleStatus: (movie: Movie) => void;
}

const MovieListItem: React.FC<MovieListItemProps> = ({
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
};

export default MovieListItem;

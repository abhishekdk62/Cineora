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
import { MovieResponseDto } from "@/app/others/dtos";

const lexend = Lexend({
  weight: "500",
  subsets: ["latin"],
});

const lexendSmall = Lexend({
  weight: "300",
  subsets: ["latin"],
});

const lexendMedium = { fontFamily: 'Lexend', fontWeight: '500' };
const lexendSmallStyle = { fontFamily: 'Lexend', fontWeight: '400' };

interface MovieListItemProps {
  movie: MovieResponseDto;
  onEdit: (movie: MovieResponseDto) => void;
  onDelete: (movie: MovieResponseDto) => void;
  onToggleStatus: (movie: MovieResponseDto) => void;
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
      Action: "bg-red-500/20 text-red-400 border-red-500/30",
      Comedy: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      Drama: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      Horror: "bg-gray-500/20 text-gray-400 border-gray-500/30",
      "Sci-Fi": "bg-blue-500/20 text-blue-400 border-blue-500/30",
      Romance: "bg-pink-500/20 text-pink-400 border-pink-500/30",
      Thriller: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      Crime: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
    };
    return (
      colors[genre as keyof typeof colors] ||
      "bg-gray-500/20 text-gray-400 border-gray-500/30"
    );
  };

  return (
    <div className="bg-gray-900/90 backdrop-blur-sm border border-yellow-500/20 rounded-lg hover:border-yellow-500/40 transition-all duration-200">
      <div className="p-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <img
              src={movie.poster || "/placeholder.svg"}
              alt={movie.title}
              className="w-20 h-28 object-cover rounded-lg border border-gray-700/50"
            />
            <div className="absolute -top-2 -right-2">
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  movie.isActive
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                }`}
              >
                {movie.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-start justify-between">
              <h3
                className="text-xl text-white"
                style={lexendMedium}
              >
                {movie.title}
              </h3>
              <div className="flex items-center gap-3 ml-4">
                <span
                  className={`${getRatingColor(
                    movie.rating
                  )} text-white text-xs px-2 py-1 rounded-full font-medium`}
                >
                  {movie.rating}
                </span>
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star size={14} fill="currentColor" />
                  <span className="text-sm" style={lexendSmallStyle}>4.5</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {movie.genre.slice(0, 3).map((genre, index) => (
                <span
                  key={index}
                  className={`text-xs px-2 py-1 rounded-full border ${getGenreColor(
                    genre
                  )}`}
                  style={lexendSmallStyle}
                >
                  {genre}
                </span>
              ))}
              <div className="flex items-center gap-1 text-gray-400 text-sm">
                <Clock size={12} />
                <span style={lexendSmallStyle}>{movie.duration}m</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400 text-sm">
                <Calendar size={12} />
                <span style={lexendSmallStyle}>{new Date(movie.releaseDate).getFullYear()}</span>
              </div>
              <div className="text-gray-400 text-sm">
                <span style={lexendSmallStyle}>{movie.language}</span>
              </div>
            </div>

            <p
              className="text-gray-300 text-sm line-clamp-2"
              style={lexendSmallStyle}
            >
              {movie.description}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-200 hover:scale-105"
              onClick={() => onToggleStatus(movie)}
              title={movie.isActive ? "Deactivate" : "Activate"}
            >
              {movie.isActive ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button
              className="p-2 bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg transition-all duration-200 hover:scale-105"
              onClick={() => onEdit(movie)}
            >
              <Edit size={16} />
            </button>
            <button
              className="p-2 bg-red-500 hover:bg-red-400 text-white rounded-lg transition-all duration-200 hover:scale-105"
              onClick={() => onDelete(movie)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieListItem;

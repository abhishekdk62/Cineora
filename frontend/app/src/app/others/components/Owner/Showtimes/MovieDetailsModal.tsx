"use client";

import React from "react";
import { X, Calendar, Clock, Star, Play, Users, User } from "lucide-react";
import { lexendMedium, lexendSmall } from "@/app/others/Utils/fonts";

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

interface MovieDetailsModalProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
  onClose: () => void;

}

const MovieDetailsModal: React.FC<MovieDetailsModalProps> = ({
  movie,
  onSelect,
  onClose,
}) => {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-70 flex items-center justify-center p-4">
      <div className="bg-black/95 backdrop-blur-sm border border-gray-500/30 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-500/30">
          <h2 className={`${lexendMedium.className} text-xl text-white`}>
            Movie Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6">
            {/* Movie Header Section */}
            <div className="flex gap-6 mb-6">
              {/* Poster */}
              <div className="w-48 h-72 rounded-xl overflow-hidden bg-gray-700 flex-shrink-0">
                {movie.poster ? (
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Play className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Movie Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className={`${lexendMedium.className} text-3xl text-white mb-2`}>
                      {movie.title}
                    </h1>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-lg font-medium">
                        {movie.rating}
                      </span>
                      <div className="flex items-center gap-1 text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span className={`${lexendSmall.className} text-sm`}>
                          {formatDuration(movie.duration)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span className={`${lexendSmall.className} text-sm`}>
                          {formatDate(movie.releaseDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Genres */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {movie.genre.map((g, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-700/50 text-gray-300 text-sm rounded-full border border-gray-600/50"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Language & Director */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className={`${lexendSmall.className} text-gray-400 text-sm mb-1`}>
                      Language
                    </p>
                    <p className={`${lexendMedium.className} text-white`}>
                      {movie.language}
                    </p>
                  </div>
                  <div>
                    <p className={`${lexendSmall.className} text-gray-400 text-sm mb-1`}>
                      Director
                    </p>
                    <p className={`${lexendMedium.className} text-white flex items-center gap-2`}>
                      <User className="w-4 h-4" />
                      {movie.director}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className={`${lexendMedium.className} text-white text-lg mb-3`}>
                Description
              </h3>
              <p className={`${lexendSmall.className} text-gray-300 leading-relaxed`}>
                {movie.description}
              </p>
            </div>

            {/* Cast */}
            {movie.cast && movie.cast.length > 0 && (
              <div className="mb-6">
                <h3 className={`${lexendMedium.className} text-white text-lg mb-3 flex items-center gap-2`}>
                  <Users className="w-5 h-5" />
                  Cast
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {movie.cast.map((actor, index) => (
                    <div
                      key={index}
                      className="p-3 bg-white/5 border border-gray-600/30 rounded-lg"
                    >
                      <p className={`${lexendSmall.className} text-gray-200 text-sm`}>
                        {actor}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-white/5 rounded-xl border border-gray-600/30">
              <div>
                <p className={`${lexendSmall.className} text-gray-400 text-sm mb-1`}>
                  Release Date
                </p>
                <p className={`${lexendMedium.className} text-white text-sm`}>
                  {formatDate(movie.releaseDate)}
                </p>
              </div>
         
            </div>
          </div>
        </div>

        {/* Footer with Select Button */}
        <div className="p-6 border-t border-gray-500/30 bg-black/50">
          <div className="flex items-center justify-end gap-4">
            <button
              onClick={onClose}
              className={`${lexendMedium.className} px-6 py-3 text-gray-300 hover:text-white transition-colors`}
            >
              Cancel
            </button>
            <button
              onClick={() => onSelect(movie)}
              className={`${lexendMedium.className} px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300 flex items-center gap-2`}
            >
              <Star className="w-4 h-4" />
              Select Movie
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsModal;

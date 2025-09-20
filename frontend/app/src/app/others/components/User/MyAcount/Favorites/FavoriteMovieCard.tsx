'use client';

import React, { useState } from 'react';

const lexendBold = { className: "font-bold" };
const lexendSmall = { className: "font-normal text-sm" };
const lexendMedium = { className: "font-medium" };

interface FavoriteMovie {
  _id: string;
  movieId: {
    _id: string;
    title: string;
    poster: string;
    genre: string[];
    releaseDate: string;
    duration: number;
    rating: number;
    language: string;
    synopsis?: string;
  };
  addedAt: string;
  createdAt: string;
}

interface FavoriteMovieCardProps {
  favorite: FavoriteMovie;
  onRemoveFromFavorites: (movieId: string) => void;
  onViewMovie: (movieId: string) => void;
  onBookTickets: (movieId: string) => void;
}

const FavoriteMovieCard: React.FC<FavoriteMovieCardProps> = ({
  favorite,
  onRemoveFromFavorites,
  onViewMovie,
  onBookTickets
}) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDateAdded = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Added today';
    if (diffDays < 7) return `Added ${diffDays} days ago`;
    if (diffDays < 30) return `Added ${Math.ceil(diffDays / 7)} weeks ago`;
    return `Added on ${formatDate(dateString)}`;
  };

  const handleRemoveClick = async () => {
    setIsRemoving(true);
    try {
      await onRemoveFromFavorites(favorite.movieId._id);
    } catch (error) {
      console.error('Failed to remove:', error);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="flex bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl hover:scale-[1.02] transition-transform duration-300 group">
      {/* Movie Poster */}
      <div className="w-40 shrink-0 relative bg-gray-800">
        <img
          src={favorite.movieId.poster}
          alt={favorite.movieId.title}
          className="w-full h-full object-cover"
      
        />
        
        {/* Rating Badge */}
        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1">
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className={`${lexendSmall.className} text-white text-xs font-semibold`}>
              {favorite.movieId.rating}/10
            </span>
          </div>
        </div>
      </div>

      {/* Movie Details */}
      <div className="flex flex-col flex-1 px-7 py-6">
        <div className="flex items-start justify-between mb-2">
          <div className={`${lexendBold.className} text-xl text-white`}>
            {favorite.movieId.title}
          </div>
          
          {/* Heart Icon for Favorited Status */}
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500 fill-current" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
        </div>

        <p className={`${lexendSmall.className} text-gray-300 mb-3`}>
          {formatDateAdded(favorite.addedAt)}
        </p>

        {/* Movie Info */}
        <div className={`${lexendMedium.className} flex items-center gap-6 mt-2 text-base text-white mb-4`}>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formatDate(favorite.movieId.releaseDate)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{formatDuration(favorite.movieId.duration)}</span>
          </div>
        </div>

        {/* Genres */}
        <div className="flex flex-wrap gap-2 mt-2 mb-6">
          {favorite.movieId.genre.slice(0, 3).map((genre, index) => (
            <span key={index} className={`${lexendSmall.className} bg-white/10 text-white px-3 py-1.5 rounded-lg font-medium border border-white/20`}>
              {genre}
            </span>
          ))}
          <span className={`${lexendSmall.className} bg-white/10 text-white px-3 py-1.5 rounded-lg font-medium border border-white/20`}>
            {favorite.movieId.language}
          </span>
        </div>

        {/* Synopsis Preview */}
        {favorite.movieId.synopsis && (
          <p className={`${lexendSmall.className} text-gray-400 mb-4 line-clamp-2`}>
            {favorite.movieId.synopsis.length > 150 
              ? `${favorite.movieId.synopsis.substring(0, 150)}...` 
              : favorite.movieId.synopsis
            }
          </p>
        )}

        {/* Action Buttons */}
        <div className="mt-auto flex gap-3">
          <button
            onClick={() => onViewMovie(favorite.movieId._id)}
            className={`${lexendMedium.className} bg-white text-black px-5 py-2.5 rounded-xl hover:bg-white/90 transition-colors text-sm`}
          >
            View Details
          </button>
          
          <button
            onClick={() => onBookTickets(favorite.movieId._id)}
            className={`${lexendMedium.className} bg-transparent text-white px-5 py-2.5 rounded-xl border border-white hover:bg-white/10 transition-colors text-sm`}
          >
            Book Tickets
          </button>
          
          <button
            onClick={handleRemoveClick}
            disabled={isRemoving}
            className={`${lexendMedium.className} bg-transparent text-white/70 px-5 py-2.5 rounded-xl border border-white/50 hover:bg-red-900/20 hover:text-red-400 hover:border-red-500/30 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isRemoving ? 'Removing...' : 'Remove'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FavoriteMovieCard;

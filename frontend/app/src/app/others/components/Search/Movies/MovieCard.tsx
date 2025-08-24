"use client";

import React from "react";
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

interface Movie {
  _id: string;
  title: string;
  genre: string[];
  releaseDate: string;
  duration: number;
  rating: string;
  poster: string;
  director: string;
  language: string;
}

interface MovieCardProps {
  movie: Movie;
  languageMap: { [key: string]: string };
  formatDuration: (minutes: number) => string;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, languageMap, formatDuration }) => {
  const router = useRouter();

  return (
    <div 
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
  );
};

export default MovieCard;

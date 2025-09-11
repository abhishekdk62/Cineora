import React from "react";
import { Lexend } from "next/font/google";

const lexend = Lexend({
  weight: "500",
  subsets: ["latin"],
});

const lexendSmall = Lexend({
  weight: "300",
  subsets: ["latin"],
});

interface GenreSelectorProps {
  selectedGenres: string[];
  onGenreChange: (genre: string) => void;
  genreError?: string; 
}

const GenreSelector: React.FC<GenreSelectorProps> = ({
  selectedGenres,
  onGenreChange,
  genreError, 
}) => {
  const genres = [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Fantasy",
    "History",
    "Horror",
    "Music",
    "Mystery",
    "Romance",
    "Science Fiction",
    "TV Movie",
    "Thriller",
    "War",
    "Western",
  ];

  return (
    <div className={`bg-[#1a1a1a] border ${
      genreError ? 'border-red-400' : 'border-gray-600' 
    } rounded-lg p-4`}>
      <h3 className={`${lexend.className} text-lg text-white mb-4`}>
        Genres <span className="text-red-400">*</span> 
      </h3>
      <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
        {genres.map((genre) => (
          <label
            key={genre}
            className="flex items-center space-x-2 cursor-pointer hover:bg-[#2a2a2a] p-2 rounded-md transition-colors"
          >
            <input
              type="checkbox"
              checked={selectedGenres.includes(genre)}
              onChange={() => onGenreChange(genre)}
              className="rounded border-gray-400 text-[#e78f03] focus:ring-[#e78f03] focus:ring-2"
            />
            <span
              className={`${lexendSmall.className} text-gray-300 text-sm`}
            >
              {genre}
            </span>
          </label>
        ))}
      </div>
      
      {/* 🔥 Add error message display */}
      {genreError && (
        <p className="text-red-400 text-sm mt-2">{genreError}</p>
      )}
      
      <div className="mt-4 flex flex-wrap gap-2">
        {selectedGenres.map((genre, index) => (
          <span
            key={index}
            className="bg-[#e78f03] text-black px-2 py-1 rounded-full text-xs font-medium"
          >
            {genre}
          </span>
        ))}
      </div>
    </div>
  );
};

export default GenreSelector;

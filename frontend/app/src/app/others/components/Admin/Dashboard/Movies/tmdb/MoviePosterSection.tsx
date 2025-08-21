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

interface MoviePosterSectionProps {
  poster: string;
  onPosterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MoviePosterSection: React.FC<MoviePosterSectionProps> = ({
  poster,
  onPosterChange,
}) => {
  return (
    <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-4">
      <h3 className={`${lexend.className} text-lg text-white mb-4`}>
        Movie Poster
      </h3>
      <div className="space-y-4">
        <img
          src={poster || "/placeholder.svg"}
          alt="Movie Poster"
          className="w-full h-80 object-cover rounded-lg border border-gray-500"
        />
        <div className="space-y-2">
          <label
            className={`${lexendSmall.className} block text-sm text-gray-300 font-medium`}
          >
            Poster URL
          </label>
          <input
            type="url"
            name="poster"
            value={poster}
            onChange={onPosterChange}
            className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03]"
            placeholder="https://example.com/poster.jpg"
          />
        </div>
      </div>
    </div>
  );
};

export default MoviePosterSection;

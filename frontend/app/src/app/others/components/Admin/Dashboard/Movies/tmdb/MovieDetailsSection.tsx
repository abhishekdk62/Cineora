import React from "react";
import { Lexend } from "next/font/google";
import { Star, Calendar, Clock, Users } from "lucide-react";

const lexend = Lexend({
  weight: "500",
  subsets: ["latin"],
});

interface MovieDetailsSectionProps {
  formData: {
    tmdbId?: number;
    releaseDate?: string;
    duration?: number;
    cast?: string[];
  };
}

const MovieDetailsSection: React.FC<MovieDetailsSectionProps> = ({
  formData,
}) => {
  return (
    <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-4">
      <h3 className={`${lexend.className} text-lg text-white mb-4`}>
        Movie Details
      </h3>
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-gray-300">
          <Star className="h-4 w-4 text-yellow-400" />
          <span className="text-sm">
            TMDB ID: {formData.tmdbId || "N/A"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <Calendar className="h-4 w-4 text-blue-400" />
          <span className="text-sm">
            Release:{" "}
            {formData.releaseDate
              ? new Date(formData.releaseDate).getFullYear()
              : "N/A"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <Clock className="h-4 w-4 text-green-400" />
          <span className="text-sm">
            Duration: {formData.duration || 0} minutes
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <Users className="h-4 w-4 text-purple-400" />
          <span className="text-sm">
            Cast: {formData.cast?.length || 0} actors
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsSection;

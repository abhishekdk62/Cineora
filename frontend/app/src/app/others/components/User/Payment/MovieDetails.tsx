// components/MovieDetails.tsx
import React from "react";
import { Lexend } from "next/font/google";
import { Film, MapPin, Calendar, Clock, Star } from "lucide-react";

const lexendSmall = Lexend({ weight: "200", subsets: ["latin"] });
const lexendBold = Lexend({ weight: "700", subsets: ["latin"] });

interface MovieDetailsProps {
  data: {
    movieTitle: string;
    movieRating: number;
    theaterName: string;
    screenName: string;
    showDate: string;
    showTime: string;
    format?: string;
    language?: string;
  };
}

export const MovieDetails: React.FC<MovieDetailsProps> = ({ data }) => {
  return (
    <div className="flex items-start gap-6 pb-6 border-b border-gray-600/30">
      <div className="relative">
        <div className="w-20 h-28 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl shadow-lg flex items-center justify-center">
          <Film className="w-8 h-8 text-white" />
        </div>
        <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
          <Star className="w-3 h-3 text-black" />
        </div>
      </div>

      <div className="flex-1">
        <h2 className={`${lexendBold.className} text-white text-2xl mb-3`}>
          {data.movieTitle}
        </h2>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-300">
            <MapPin className="w-4 h-4" />
            <span className={`${lexendSmall.className} text-sm`}>
              {data.theaterName} • {data.screenName}
            </span>
          </div>
          
          <div className="flex items-center gap-6 text-gray-300">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className={`${lexendSmall.className} text-sm`}>
                {data.showDate}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className={`${lexendSmall.className} text-sm`}>
                {data.showTime}
              </span>
            </div>
          </div>

          {(data.format || data.language) && (
            <div className="flex items-center gap-4 mt-3">
              {data.format && (
                <span className={`${lexendSmall.className} px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full`}>
                  {data.format}
                </span>
              )}
              {data.language && (
                <span className={`${lexendSmall.className} px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full`}>
                  {data.language}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

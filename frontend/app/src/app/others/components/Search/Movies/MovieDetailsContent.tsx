import { Lexend } from "next/font/google";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";
import MovieInfo from "./MovieInfo";
import MoviePoster from "./MoviePoster";
import { RatingStats } from "./MovieHeader";

const lexendSmall = Lexend({
  weight: "200",
  subsets: ["latin"],
});

const lexendMedium = Lexend({
  weight: "400",
  subsets: ["latin"],
});

const lexendBold = Lexend({
  weight: "700",
  subsets: ["latin"],
});

interface Movie {
  _id: string;
  title: string;
  genre: string[];
  releaseDate: string;
  duration: number;
  rating: string;
  description: string;
  poster: string;
  trailer: string;
  cast: string[];
  director: string;
  language: string;
}

interface MovieDetailsContentProps {
  movie: Movie;
  isFav: boolean;
  onFavoriteToggle: (isAdd: boolean) => void;
  onBookTicket: () => void;
  onWatchTrailer: () => void;
  onGoBack: () => void;
  ratingStats: RatingStats | null;
}

export default function MovieDetailsContent({
  movie,
  isFav,
  onFavoriteToggle,
  onBookTicket,
  onWatchTrailer,
  onGoBack
  ,ratingStats 
}: MovieDetailsContentProps) {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const languageMap: { [key: string]: string } = {
    "en": "English",
    "es": "Spanish", 
    "fr": "French",
    "de": "German",
    "hi": "Hindi",
    "zh": "Chinese",
    "ja": "Japanese",
    "ko": "Korean"
  };

  const handleFavoriteClick = () => {
    if (isFav) {
      onFavoriteToggle(false);
      toast.success('Removed from Favorites');
    } else {
      onFavoriteToggle(true);
      toast.success('Added to Favorites');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="pt-20 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={onGoBack}
            className={`${lexendSmall.className} flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-300`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Movies
          </button>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="backdrop-blur-sm bg-black/20 rounded-3xl p-8 border border-gray-500/30">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <MoviePoster movie={movie} />
            <MovieInfo
              movie={movie}
              isFav={isFav}
              onFavoriteClick={handleFavoriteClick}
              onBookTicket={onBookTicket}
              onWatchTrailer={onWatchTrailer}
              formatDuration={formatDuration}
              languageMap={languageMap}
                            ratingStats={ratingStats} 

            />
          </div>
        </div>
      </div>
    </div>
  );
}

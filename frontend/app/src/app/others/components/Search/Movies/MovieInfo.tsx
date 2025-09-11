import { Lexend } from "next/font/google";
import { Heart } from "lucide-react";
import MovieHeader, { RatingStats } from "./MovieHeader";
import MovieGenres from "./MovieGenres";
import MovieSynopsis from "./MovieSynopsis";
import MovieCredits from "./MovieCredits";
import MovieActionButtons from "./MovieActionButtons";

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
  title: string;
  genre: string[];
  releaseDate: string;
  duration: number;
  description: string;
  director: string;
  cast: string[];
  language: string;
  trailer?: string;
}

interface MovieInfoProps {
  movie: Movie;
  isFav: boolean;
  onFavoriteClick: () => void;
  onBookTicket: () => void;
  onWatchTrailer: () => void;
  formatDuration: (minutes: number) => string;
  languageMap: { [key: string]: string };
  ratingStats: RatingStats | null; 
}

export default function MovieInfo({
  movie,
  isFav,
  onFavoriteClick,
  onBookTicket,
  onWatchTrailer,
  formatDuration,
  languageMap,
  ratingStats 
}: MovieInfoProps) {
  return (
    <div className="lg:col-span-2">
      <div className="space-y-6">
        <MovieHeader
          title={movie.title}
          releaseDate={movie.releaseDate}
          duration={movie.duration}
          language={movie.language}
          isFav={isFav}
          onFavoriteClick={onFavoriteClick}
          formatDuration={formatDuration}
          languageMap={languageMap}
          ratingStats={ratingStats}
        />

        <MovieGenres genres={movie.genre} />
        <MovieSynopsis description={movie.description} />
        <MovieCredits director={movie.director} cast={movie.cast} />
        <MovieActionButtons
          onBookTicket={onBookTicket}
          onWatchTrailer={onWatchTrailer}
          hasTrailer={!!movie.trailer}
        />
      </div>
    </div>
  );
}

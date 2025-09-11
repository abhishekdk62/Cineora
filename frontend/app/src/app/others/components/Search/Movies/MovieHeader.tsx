import { Lexend } from "next/font/google";
import { Heart, Star } from "lucide-react";
import { lexendMedium } from "@/app/others/Utils/fonts";

const lexendSmall = Lexend({
  weight: "200",
  subsets: ["latin"],
});

const lexendBold = Lexend({
  weight: "700",
  subsets: ["latin"],
});
export interface RatingStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { [key: number]: number };
}

interface MovieHeaderProps {
  title: string;
  releaseDate: string;
  duration: number;
  language: string;
  isFav: boolean;
  onFavoriteClick: () => void;
  formatDuration: (minutes: number) => string;
  languageMap: { [key: string]: string };
  ratingStats: RatingStats | null; // Add this line

}
const MovieRating = ({ ratingStats }: { ratingStats: RatingStats | null }) => {
  if (!ratingStats || ratingStats.totalReviews === 0) {
    return (
      <div className="inline-block">
        <div className=" flex items-center gap-2  px-3 py-1.5 rounded-lg">
          <Star className="w-4 h-4 text-gray-400" />
          <span className={`${lexendSmall.className} text-gray-400 text-sm`}>
            No ratings yet
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className=" inline-block  ">
      <div className="flex items-center gap-2  px-3 py-1.5 rounded-lg">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span className={`${lexendMedium.className} text-yellow-400 text-sm font-medium`}>
          {ratingStats.averageRating.toFixed(1)}
        </span>
        <span className={`${lexendSmall.className} text-gray-300 text-xs`}>
          ({ratingStats.totalReviews})
        </span>
      </div>
    </div>
  );
};

export default function MovieHeader({
  title,
  releaseDate,
  duration,
  language,
  isFav,
  onFavoriteClick,
  formatDuration,
  languageMap,
  ratingStats
}: MovieHeaderProps) {


  return (
    <div>
      <div className="flex justify-between">
        <div>
          <h1 className={`${lexendBold.className} text-4xl md:text-5xl text-white mb-4`}>
            {title}
            <MovieRating ratingStats={ratingStats} />
          </h1>

        </div>
        <div>
          <button
            onClick={onFavoriteClick}
            className={`${isFav
              ? "bg-red-500/20 text-red-500 hover:bg-red-500/30"
              : "bg-white/10 text-white hover:bg-white/20"
              } p-3 rounded-full transition-all duration-300`}
            title={isFav ? "Remove from Favorites" : "Add to Favorites"}
          >
            <Heart className={`w-6 h-6 ${isFav ? "fill-red-500" : ""}`} />
          </button>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4 text-gray-300">
        <span className={`${lexendSmall.className}`}>
          {new Date(releaseDate).getFullYear()}
        </span>
        <span className={`${lexendSmall.className}`}>•</span>
        <span className={`${lexendSmall.className}`}>
          {formatDuration(duration)}
        </span>
        <span className={`${lexendSmall.className}`}>•</span>
        <span className={`${lexendSmall.className}`}>
          {languageMap[language] || language}
        </span>
      </div>
    </div>
  );
}

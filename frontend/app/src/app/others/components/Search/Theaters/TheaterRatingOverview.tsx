import { Lexend } from "next/font/google";
import { Star } from "lucide-react";

const lexendSmall = Lexend({
  weight: "200",
  subsets: ["latin"],
});

interface RatingStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { [key: number]: number };
}

interface TheaterRatingOverviewProps {
  stats: RatingStats;
}

export default function TheaterRatingOverview({ stats }: TheaterRatingOverviewProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-400"
        }`}
      />
    ));
  };

  const mostCommonRating = Object.keys(stats.ratingDistribution).find(
    key => stats.ratingDistribution[parseInt(key)] === Math.max(...Object.values(stats.ratingDistribution))
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white/5 rounded-xl p-4 border border-gray-600/30 text-center">
        <div className="text-3xl font-bold text-white mb-1">
          {stats.averageRating.toFixed(1)}
        </div>
        <div className="flex items-center justify-center gap-1 mb-1">
          {renderStars(Math.round(stats.averageRating))}
        </div>
        <div className={`${lexendSmall.className} text-gray-400`}>
          Average Rating
        </div>
      </div>
      
      <div className="bg-white/5 rounded-xl p-4 border border-gray-600/30 text-center">
        <div className="text-3xl font-bold text-white mb-2">
          {stats.totalReviews}
        </div>
        <div className={`${lexendSmall.className} text-gray-400`}>
          Total Reviews
        </div>
      </div>
      
      <div className="bg-white/5 rounded-xl p-4 border border-gray-600/30 text-center">
        <div className="text-3xl font-bold text-white mb-2">
          {mostCommonRating}★
        </div>
        <div className={`${lexendSmall.className} text-gray-400`}>
          Most Common Rating
        </div>
      </div>
    </div>
  );
}

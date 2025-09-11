import { Lexend } from "next/font/google";
import { Star } from "lucide-react";

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

interface RatingStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { [key: number]: number };
}

interface ReviewsHeaderProps {
  ratingStats: RatingStats;
}

export default function ReviewsHeader({ ratingStats }: ReviewsHeaderProps) {
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

  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className={`${lexendBold.className} text-2xl text-white`}>
        Movie Reviews
      </h2>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          {renderStars(Math.round(ratingStats.averageRating))}
        </div>
        <span className={`${lexendMedium.className} text-white ml-2`}>
          {ratingStats.averageRating.toFixed(1)} 
        </span>
        <span className={`${lexendSmall.className} text-gray-400`}>
          ({ratingStats.totalReviews} {ratingStats.totalReviews === 1 ? 'review' : 'reviews'})
        </span>
      </div>
    </div>
  );
}

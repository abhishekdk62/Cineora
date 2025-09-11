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

interface RatingStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { [key: number]: number };
}

interface RatingDistributionProps {
  stats: RatingStats;
}

export default function RatingDistribution({ stats }: RatingDistributionProps) {
  return (
    <div className="bg-white/5 rounded-2xl p-6 border border-gray-600/30 mb-6">
      <h3 className={`${lexendMedium.className} text-white text-lg mb-4`}>Rating Breakdown</h3>
      <div className="space-y-3">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = stats.ratingDistribution[rating] || 0;
          const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
          
          return (
            <div key={rating} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-12">
                <span className={`${lexendSmall.className} text-white`}>{rating}</span>
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              </div>
              
              <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              
              <div className="flex items-center gap-2 w-20">
                <span className={`${lexendSmall.className} text-gray-300 text-sm`}>
                  {count}
                </span>
                <span className={`${lexendSmall.className} text-gray-400 text-xs`}>
                  ({percentage.toFixed(0)}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

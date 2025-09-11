"use client";

import { useState, useEffect } from "react";
import { Lexend } from "next/font/google";
import LoadingReviews from "./LoadingReviews";
import ReviewsHeader from "./ReviewsHeader";
import RatingOverview from "./RatingOverview";
import RatingDistribution from "./RatingDistribution";
import EmptyReviews from "./EmptyReviews";
import ReviewCard from "./ReviewCard";
import { ChevronDown, ChevronUp } from "lucide-react";

const lexendMedium = Lexend({
  weight: "400",
  subsets: ["latin"],
});

interface Review {
  _id: string;
  bookingId: string;
  createdAt: string;
  helpfulCount: number;
  isVerifiedBooking: boolean;
  movieId: string;
  rating: number;
  reportCount: number;
  reviewText: string;
  reviewType: "movie" | "theater";
  status: string;
  theaterId: string;
  updatedAt: string;
  userId: {
    _id: string;
    email: string;
    username: string;
    profilePicture?: string;
  };
}

interface ReviewsData {
  averageRating: number;
  limit: number;
  page: number;
  reviews: Review[];
  total: number;
  totalPages: number;
}

interface RatingStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { [key: number]: number };
}

interface MovieReviewsProps {
  movieId: string;
  reviewsData: ReviewsData | null;
  ratingStats: RatingStats | null;
}

export default function MovieReviews({ movieId, reviewsData, ratingStats }: MovieReviewsProps) {
  const [loading, setLoading] = useState(true);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    if (reviewsData !== null && ratingStats !== null) {
      setLoading(false);
    }
  }, [reviewsData, ratingStats]);

  if (loading) {
    return <LoadingReviews />;
  }

  if (!reviewsData || !ratingStats) {
    return null;
  }

  const movieReviews = reviewsData.reviews || [];
  const hasMoreReviews = movieReviews.length > 2;

  return (
    <div className="backdrop-blur-sm bg-black/20 rounded-3xl p-8 border border-gray-500/30 mt-8">
      <ReviewsHeader ratingStats={ratingStats} />
      <RatingOverview stats={ratingStats} />
      <RatingDistribution stats={ratingStats} />
      
      {movieReviews.length === 0 ? (
        <EmptyReviews />
      ) : (
        <div className="space-y-6">
          <div className="border-t border-gray-600/30 pt-6">
            <h3 className={`${lexendMedium.className} text-white text-lg mb-4`}>Recent Reviews</h3>
            
            {/* Always show first 2 reviews */}
            <div className="space-y-4">
              {movieReviews.slice(0, 2).map((review: Review) => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>
            
            {/* Collapsible additional reviews */}
            {hasMoreReviews && (
              <>
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  showAllReviews ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="space-y-4 mt-4">
                    {movieReviews.slice(2).map((review: Review) => (
                      <ReviewCard key={review._id} review={review} />
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className={`${lexendMedium.className} flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-xl hover:bg-white/20 border border-gray-500/30 transition-all duration-300`}
                  >
                    {showAllReviews ? (
                      <>
                        <span>Show Less</span>
                        <ChevronUp className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <span>View More Reviews ({movieReviews.length - 2})</span>
                        <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Lexend } from "next/font/google";
import { ChevronDown, ChevronUp } from "lucide-react";
import TheaterReviewCard from "./TheaterReviewCard";
import EmptyTheaterReviews from "./EmptyTheaterReviews";
import TheaterRatingDistribution from "./TheaterRatingDistribution";
import TheaterRatingOverview from "./TheaterRatingOverview";
import LoadingTheaterReviews from "./LoadingTheaterReviews";


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
  theaterId: string;
  rating: number;
  reportCount: number;
  reviewText: string;
  reviewType: "theater";
  status: string;
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

interface TheaterReviewsContentProps {
  onEdit:(rev:string)=>void
  onDelete:(rev:string)=>void
  theaterId: string;
  reviewsData: ReviewsData | null;
  ratingStats: RatingStats | null;
}

export default function TheaterReviewsContent({
  onEdit,
  onDelete,
  theaterId,
  reviewsData,
  ratingStats
}: TheaterReviewsContentProps) {
  const [showAllReviews, setShowAllReviews] = useState(false);

  if (!reviewsData && !ratingStats) {
    return <LoadingTheaterReviews />;
  }

  if (!reviewsData || !ratingStats) {
    return <EmptyTheaterReviews />;
  }

  const theaterReviews = reviewsData.reviews || [];
  const hasMoreReviews = theaterReviews.length > 2;

  return (
    <div className="p-6">
      <TheaterRatingOverview stats={ratingStats} />
      <TheaterRatingDistribution stats={ratingStats} />
      {theaterReviews.length === 0 ? (
        <EmptyTheaterReviews />
      ) : (
        <div className="space-y-6">
          <div className="border-t border-gray-700 pt-6">
            <h3 className={`${lexendMedium.className} text-white text-lg mb-4`}>
              Recent Reviews
            </h3>
            
            <div className="space-y-4">
              {theaterReviews.slice(0, 2).map((review: Review) => (
                <TheaterReviewCard key={review._id} review={review} onEdit={onEdit} onDelete={onDelete} />
              ))}
            </div>
            
            {hasMoreReviews && (
              <>
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  showAllReviews ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="space-y-4 mt-4">
                    {theaterReviews.slice(2).map((review: Review) => (
                      <TheaterReviewCard  key={review._id} review={review} onEdit={onEdit} onDelete={onDelete} />
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
                        <span>View More Reviews ({theaterReviews.length - 2})</span>
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

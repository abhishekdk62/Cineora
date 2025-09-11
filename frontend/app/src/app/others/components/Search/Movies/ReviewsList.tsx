import { Lexend } from "next/font/google";
import ReviewCard from "./ReviewCard";

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

interface ReviewsListProps {
  reviews: Review[];
}

export default function ReviewsList({ reviews }: ReviewsListProps) {
  return (
    <div className="space-y-6">
      <div className="border-t border-gray-600/30 pt-6">
        <h3 className={`${lexendMedium.className} text-white text-lg mb-4`}>Recent Reviews</h3>
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </div>
      </div>
    </div>
  );
}

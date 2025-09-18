import { Lexend } from "next/font/google";
import { Star, Edit2, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import UserAvatar from "./UserAvatar";
import ReviewActions from "./ReviewActions";

const lexendSmall = Lexend({
  weight: "200",
  subsets: ["latin"],
});

const lexendMedium = Lexend({
  weight: "400",
  subsets: ["latin"],
});

interface Review {
  _id: string;
  createdAt: string;
  helpfulCount: number;
  isVerifiedBooking: boolean;
  rating: number;
  reviewText: string;
  userId: {
    _id: string;
    email: string;
    username: string;
    profilePicture?: string;
  };
}

interface ReviewCardProps {
  review: Review;
  onEdit: (reviewId: string) => void;
  onDelete: (reviewId: string) => void;
}

interface RootState {
  auth: {
    user: {
      id: string;
    };
  };
}

export default function ReviewCard({ review, onEdit, onDelete }: ReviewCardProps) {
  const isAuthenticated = useSelector((state: RootState) => state?.auth?.user?.id)||45345;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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

  const getUserDisplayName = (user: Review['userId']) => {
    return user.username || user.email.split('@');
  };

  const isOwner = isAuthenticated === review.userId._id;

  return (
    <div className="bg-white/5 rounded-2xl p-6 border border-gray-600/30 mb-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <UserAvatar user={review.userId} />
          <div>
            <p className={`${lexendMedium.className} text-white`}>
              {getUserDisplayName(review.userId)}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                {renderStars(review.rating)}
              </div>
              <span className={`${lexendSmall.className} text-gray-400`}>
                {formatDate(review.createdAt)}
              </span>
              {review.isVerifiedBooking && (
                <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">
                  Verified Booking
                </span>
              )}
            </div>
          </div>
        </div>
        
        {isOwner && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(review._id)}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
            >
              <Edit2 className="w-3 h-3" />
              <span className={`${lexendSmall.className} text-xs`}>Edit</span>
            </button>
            <button
              onClick={() => onDelete(review._id)}
              className="flex items-center gap-1 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              <span className={`${lexendSmall.className} text-xs`}>Delete</span>
            </button>
          </div>
        )}
      </div>

      <p className={`${lexendSmall.className} text-gray-300 leading-relaxed mb-4`}>
        {review.reviewText}
      </p>

      <ReviewActions helpfulCount={review.helpfulCount} />
    </div>
  );
}

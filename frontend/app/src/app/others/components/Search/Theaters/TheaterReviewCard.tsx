import { Lexend } from "next/font/google";
import { Star, ThumbsUp, Flag, Edit2, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";

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

interface TheaterReviewCardProps {
  review: Review;
  onEdit: (revid:string) => void;
  onDelete: (revid:string) => void;
}

interface RootState {
  auth: {
    user: {
      id: string;
    };
  };
}

export default function TheaterReviewCard({ review, onEdit, onDelete }: TheaterReviewCardProps) {
  const isAuthenticated = useSelector((state: RootState) => state?.auth?.user?.id)||4545345;

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

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  const getUserDisplayName = (user: Review['userId']) => {
    return user.username || user.email.split('@')[0];
  };

  const isOwner = isAuthenticated === review.userId._id;

  return (
    <div className="bg-white/5 rounded-2xl p-6 border border-gray-600/30 mb-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
            {review.userId.profilePicture ? (
              <img 
                src={review.userId.profilePicture} 
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className={`${lexendMedium.className} text-white text-sm`}>
                {getInitials(review.userId.email)}
              </span>
            )}
          </div>
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

        {/* Edit and Delete buttons - only show for review owner */}
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

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ThumbsUp className="w-4 h-4" />
            <span className={`${lexendSmall.className}`}>
              Helpful ({review.helpfulCount})
            </span>
          </button>
        </div>
        <button className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors">
          <Flag className="w-4 h-4" />
          <span className={`${lexendSmall.className}`}>Report</span>
        </button>
      </div>
    </div>
  );
}

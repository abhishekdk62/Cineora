import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Lexend } from "next/font/google";

const lexendSmall = Lexend({
  weight: "200",
  subsets: ["latin"],
});

const lexendMedium = Lexend({
  weight: "400",
  subsets: ["latin"],
});

interface EditReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: {
    _id: string;
    rating: number;
    reviewText: string;
  } | null;
  onSubmit: (reviewId: string, updateData: { rating: number; reviewText: string }) => void;
  isUpdating: boolean;
}

const EditReviewModal: React.FC<EditReviewModalProps> = ({
  isOpen,
  onClose,
  review,
  onSubmit,
  isUpdating
}) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  useEffect(() => {
    if (review) {
      setRating(review.rating);
      setReviewText(review.reviewText);
    }
  }, [review]);

  const handleSubmit = () => {
    if (!review || rating === 0) return;
    onSubmit(review._id, { rating, reviewText });
  };

  const handleClose = () => {
    if (!isUpdating) {
      onClose();
    }
  };

  if (!isOpen || !review) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-black border border-white/20 rounded-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className={`${lexendMedium.className} text-xl font-semibold text-white`}>
            Edit Review
          </h2>
          <button
            onClick={handleClose}
            disabled={isUpdating}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <label className={`${lexendSmall.className} block text-sm font-medium text-white mb-3`}>
            Rating <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                disabled={isUpdating}
                className={`w-8 h-8 transition-colors disabled:opacity-50 ${
                  star <= rating ? 'text-yellow-400' : 'text-gray-600'
                }`}
              >
                <Star className="w-full h-full fill-current" />
              </button>
            ))}
          </div>
          <p className={`${lexendSmall.className} text-xs text-gray-400`}>
            {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Click to rate'}
          </p>
        </div>

        <div className="mb-6">
          <label className={`${lexendSmall.className} block text-sm font-medium text-white mb-2`}>
            Review <span className="text-gray-400">(Optional)</span>
          </label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your updated thoughts..."
            disabled={isUpdating}
            className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 resize-none disabled:opacity-50"
            rows={4}
            maxLength={500}
          />
          <p className={`${lexendSmall.className} text-xs text-gray-400 mt-1`}>
            {reviewText.length}/500 characters
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isUpdating}
            className={`${lexendSmall.className} flex-1 px-4 py-2 border border-white/30 text-white rounded-lg hover:bg-white/5 hover:border-white/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={rating === 0 || isUpdating}
            className={`${lexendSmall.className} flex-1 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`}
          >
            {isUpdating ? 'Updating...' : 'Update Review'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditReviewModal;

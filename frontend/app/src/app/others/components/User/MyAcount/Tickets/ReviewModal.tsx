import React from 'react';
import { Star } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBooking: any;
  rating: number;
  setRating: (rating: number) => void;
  reviewText: string;
  setReviewText: (text: string) => void;
  onSubmit: () => void;
  submittingReview: boolean;
  reviewType: 'movie' | 'theater' | 'experience';
  setReviewType: React.Dispatch<React.SetStateAction<"movie" | "theater" | "experience">>;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  selectedBooking,
  rating,
  setRating,
  reviewText,
  setReviewText,
  onSubmit,
  submittingReview,
  reviewType,
  setReviewType
}) => {
  if (!isOpen) return null;

  const getMovieData = (booking: any) => {
    return booking.movie || booking.movieId || {};
  };

  const getTheaterData = (booking: any) => {
    return booking.theater || booking.theaterId || {};
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPlaceholderText = () => {
    switch (reviewType) {
      case 'movie':
        return 'Share your thoughts about the movie - plot, acting, direction...';
      case 'theater':
        return 'Share your experience about the theater - facilities, sound, screen quality, seating...';
      case 'experience':
        return 'Share your overall experience about the movie and theater...';
      default:
        return 'Share your experience...';
    }
  };

  const movieData = getMovieData(selectedBooking);
  const theaterData = getTheaterData(selectedBooking);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-black border border-white/20 rounded-2xl p-6 w-2xl  mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Add Review</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-3 mb-4 p-3 bg-white/5 border border-white/10 rounded-lg">
          <img
            src={movieData.poster || '/placeholder-movie.jpg'}
            alt={movieData.title || 'Movie'}
            className="w-12 h-16 rounded object-cover"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-movie.jpg';
            }}
          />
          <div>
            <h3 className="font-medium text-white">{movieData.title || 'Unknown Movie'}</h3>
            <p className="text-sm text-gray-300">{theaterData.name || 'Unknown Theater'}</p>
            <p className="text-xs text-gray-400">
              {selectedBooking?.showDate ? formatDate(selectedBooking.showDate) : 'No date available'}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-white mb-2">
            Review Type <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setReviewType('movie')}
              className={`flex-1 px-4 py-2 rounded-lg border transition-all duration-200 ${reviewType === 'movie'
                  ? 'bg-white text-black border-white'
                  : 'bg-transparent text-white border-white/30 hover:border-white/60 hover:bg-white/5'
                }`}
            >
              Movie
            </button>
            <button
              type="button"
              onClick={() => setReviewType('theater')}
              className={`flex-1 px-4 py-2 rounded-lg border transition-all duration-200 ${reviewType === 'theater'
                  ? 'bg-white text-black border-white'
                  : 'bg-transparent text-white border-white/30 hover:border-white/60 hover:bg-white/5'
                }`}
            >
              Theater
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-white mb-2">
            Rating <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`w-8 h-8 transition-colors ${star <= rating ? 'text-yellow-400' : 'text-gray-600'
                  }`}
              >
                <Star className="w-full h-full fill-current" />
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Click to rate'}
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-white mb-2">
            Review <span className="text-gray-400">(Optional)</span>
          </label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder={getPlaceholderText()}
            className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 resize-none"
            rows={4}
            maxLength={500}
          />
          <p className="text-xs text-gray-400 mt-1">{reviewText.length}/500 characters</p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-white/30 text-white rounded-lg hover:bg-white/5 hover:border-white/60 transition-colors"
            disabled={submittingReview}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={rating === 0 || submittingReview}
            className="flex-1 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {submittingReview ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;

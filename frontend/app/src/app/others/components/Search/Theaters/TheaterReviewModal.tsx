"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Lexend } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import TheaterReviewsContent from "./TheaterReviewsContent";
import { confirmAction } from "../../utils/ConfirmDialog";
import EditReviewModal from "../Movies/EditReviewModal";
import { deleteReview, updateReview } from "@/app/others/services/userServices/reviewServices";

const lexendBold = Lexend({
  weight: "700",
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

interface TheaterReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  theaterId: string;
  reviewsData: any;
  ratingStats: any;
  theaterName: string;
}

export default function TheaterReviewModal({
  isOpen,
  onClose,
  theaterId,
  reviewsData,
  ratingStats,
  theaterName
}: TheaterReviewModalProps) {
  // State for managing reviews locally
  const [reviews, setReviews] = useState<Review[]>([]);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Update local reviews state when reviewsData prop changes
  useEffect(() => {
    if (reviewsData?.reviews) {
      setReviews(reviewsData.reviews);
    }
  }, [reviewsData]);

  const handleEdit = (revid: string) => {
    const review = reviews.find(r => r._id === revid);
    if (review) {
      setSelectedReview(review);
      setEditModalOpen(true);
    }
  };

  const handleDelete = async (revid: string) => {
    const review = reviews.find(r => r._id === revid)

    if (!review) return;

    const confirmed = await confirmAction({
      title: "Delete Review?",
      message: `Are you sure you want to delete this review? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
    });

    if (!confirmed) return;

    try {
      await deleteReview(revid)
      toast.success('Review Deleted succusfully')
let filteredReviews=reviews.filter((r)=>r._id!=revid)
      setReviews(filteredReviews)

    } catch (error) {
      console.log(error);

    }
  };

  const handleUpdateReview = async (reviewId: string, updateData: { rating: number; reviewText: string }) => {
    setIsUpdating(true);
    try {
      const data = await updateReview(reviewId, updateData)

      toast.success('Review updated successfully!');
      setEditModalOpen(false);
      setSelectedReview(null);

    } catch (error) {
      console.error('Error updating review:', error);
      toast.error('Failed to update review');
    } finally {
      setIsUpdating(false);
    }
  };

  const closeEditModal = () => {
    if (!isUpdating) {
      setEditModalOpen(false);
      setSelectedReview(null);
    }
  };

  // Create updated reviewsData with local reviews state
  const updatedReviewsData = {
    ...reviewsData,
    reviews: reviews,
    total: reviews.length
  };

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />

            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-black border border-gray-200 shadow-2xl"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="sticky top-0 z-10 bg-black border border-gray-200 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h2 className={`${lexendBold.className} text-2xl text-white`}>
                      {theaterName} Reviews
                    </h2>
                    <button
                      onClick={onClose}
                      className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                    >
                      <X className="w-6 h-6 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="max-h-[calc(90vh-80px)] overflow-y-auto">
                  <TheaterReviewsContent
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    theaterId={theaterId}
                    reviewsData={updatedReviewsData}
                    ratingStats={ratingStats}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      <EditReviewModal
        isOpen={editModalOpen}
        onClose={closeEditModal}
        review={selectedReview}
        onSubmit={handleUpdateReview}
        isUpdating={isUpdating}
      />
    </>
  );
}

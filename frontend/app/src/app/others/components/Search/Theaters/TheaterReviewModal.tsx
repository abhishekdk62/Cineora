"use client";

import React from "react";
import { X } from "lucide-react";
import { Lexend } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import TheaterReviewsContent from "./TheaterReviewsContent";

const lexendBold = Lexend({
  weight: "700",
  subsets: ["latin"],
});

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
  if (!isOpen) return null;

  return (
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
                  theaterId={theaterId}
                  reviewsData={reviewsData}
                  ratingStats={ratingStats}
                />
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

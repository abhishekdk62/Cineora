"use client";

import React from "react";
import { Lexend } from "next/font/google";

const lexendMedium = Lexend({ weight: "400", subsets: ["latin"] });

interface LoadingStateProps {
  bookingFlow: 'movie-first' | 'theater-first' | null;
}

export default function LoadingState({ bookingFlow }: LoadingStateProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="backdrop-blur-sm bg-black/20 rounded-2xl p-8 border border-gray-500/30">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className={`${lexendMedium.className} text-white text-center`}>
          Loading {bookingFlow === 'movie-first' ? 'theaters' : 'movies'}...
        </p>
      </div>
    </div>
  );
}

// components/booking/EmptyState.tsx
"use client";

import React from "react";
import { Lexend } from "next/font/google";

const lexendSmall = Lexend({ weight: "200", subsets: ["latin"] });
const lexendMedium = Lexend({ weight: "400", subsets: ["latin"] });
const lexendBold = Lexend({ weight: "700", subsets: ["latin"] });

interface EmptyStateProps {
  bookingFlow: 'movie-first' | 'theater-first' | null;
}

export default function EmptyState({ bookingFlow }: EmptyStateProps) {
  return (
    <div className="h-100 flex items-center justify-center">
      <div className="backdrop-blur-sm bg-black/20 rounded-2xl p-8 border border-gray-500/30 text-center">
        <h2 className={`${lexendBold.className} text-white text-2xl mb-4`}>
          Oops
        </h2>
        <p className={`${lexendSmall.className} text-gray-400 mb-6`}>
          There are no shows {bookingFlow==='movie-first'?'for':'in'} this {bookingFlow === 'movie-first' ? 'movie' : 'theater'} for this date.
        </p>
     
      </div>
    </div>
  );
}

"use client";
import React from "react";
import { Loader2 } from "lucide-react";
import { Lexend } from "next/font/google";

const lexend = Lexend({
  weight: "500",
  subsets: ["latin"],
});
const lexendSmall = Lexend({
  weight: "300",
  subsets: ["latin"],
});

const LoadingState: React.FC = () => {
  return (
    <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-12 text-center">
      <Loader2 className="h-16 w-16 text-[#e78f03] mx-auto mb-4 animate-spin" />
      <h3 className={`${lexend.className} text-xl text-white mb-2`}>Loading Movies...</h3>
      <p className={`${lexendSmall.className} text-gray-400`}>Fetching data from TMDB</p>
    </div>
  );
};

export default LoadingState;


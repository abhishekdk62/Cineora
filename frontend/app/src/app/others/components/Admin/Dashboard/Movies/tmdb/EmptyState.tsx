"use client";
import React from "react";
import { Search } from "lucide-react";
import { Lexend } from "next/font/google";

const lexend = Lexend({
  weight: "500",
  subsets: ["latin"],
});
const lexendSmall = Lexend({
  weight: "300",
  subsets: ["latin"],
});

const EmptyState: React.FC = () => {
  return (
    <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-12 text-center">
      <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 className={`${lexend.className} text-xl text-white mb-2`}>No movies found</h3>
      <p className={`${lexendSmall.className} text-gray-400`}>Try adjusting your search or filter criteria</p>
    </div>
  );
};

export default EmptyState;


"use client";
import React from "react";
import { Lexend } from "next/font/google";

const lexend = Lexend({
  weight: "500",
  subsets: ["latin"],
});

const lexendSmall = Lexend({
  weight: "300",
  subsets: ["latin"],
});

const PageHeader: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 className={`${lexend.className} text-2xl font-bold text-white mb-2`}>
          Add Movies from TMDB
        </h2>
        <p className={`${lexendSmall.className} text-gray-300`}>
          Search and add movies from The Movie Database
        </p>
      </div>
    </div>
  );
};

export default PageHeader;
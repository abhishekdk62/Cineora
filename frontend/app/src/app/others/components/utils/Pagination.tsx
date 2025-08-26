"use client";

import { Lexend } from "next/font/google";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPages?: number;
  className?: string;
};

const lexendSmall = Lexend({
  weight: "200",
  subsets: ["latin"],
});

const lexendBold = Lexend({
  weight: "700",
  subsets: ["latin"],
});

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showPages = 5,
  className = "",
}: PaginationProps) {
  
  console.log('Pagination rendering with:', { currentPage, totalPages });

  const getVisiblePages = () => {
    const pages = [];
    const halfShow = Math.floor(showPages / 2);
    
    let startPage = Math.max(1, currentPage - halfShow);
    let endPage = Math.min(totalPages, startPage + showPages - 1);
    
    if (endPage - startPage + 1 < showPages) {
      startPage = Math.max(1, endPage - showPages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) {
    console.log('Pagination hidden: totalPages <= 1');
    return null;
  }

  return (
    <div className={`flex justify-center mb-12 ${className}`}>
      <div className="backdrop-blur-sm bg-black/20 rounded-2xl p-4 border border-gray-500/30">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`${lexendSmall.className} px-4 py-2 rounded-lg transition-all duration-300 ${
              currentPage === 1
                ? "text-gray-500 cursor-not-allowed"
                : "text-white hover:bg-white/10"
            }`}
          >
            Previous
          </button>
          
          <span className={`${lexendSmall.className} text-white px-4`}>
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`${lexendSmall.className} px-4 py-2 rounded-lg transition-all duration-300 ${
              currentPage === totalPages
                ? "text-gray-500 cursor-not-allowed"
                : "text-white hover:bg-white/10"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

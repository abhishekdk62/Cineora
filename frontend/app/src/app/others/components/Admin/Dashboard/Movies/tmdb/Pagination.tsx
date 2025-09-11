"use client";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Font variables for styling
const lexendSmallStyle = { fontFamily: 'Lexend', fontWeight: '400' };

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 mt-8">
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="p-3 bg-gray-800/50 border border-yellow-500/30 rounded-lg text-yellow-400 hover:bg-yellow-500/10 hover:border-yellow-500/60 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-800/50 disabled:hover:border-yellow-500/30 transition-all duration-200"
      >
        <ChevronLeft size={20} />
      </button>
      
      <div className="flex items-center gap-2">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const pageNumber = Math.max(1, currentPage - 2) + i;
          if (pageNumber > totalPages) return null;
          
          return (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                currentPage === pageNumber
                  ? "bg-yellow-500 text-black font-medium"
                  : "bg-gray-800/50 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 hover:border-yellow-500/60"
              }`}
              style={lexendSmallStyle}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="p-3 bg-gray-800/50 border border-yellow-500/30 rounded-lg text-yellow-400 hover:bg-yellow-500/10 hover:border-yellow-500/60 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-800/50 disabled:hover:border-yellow-500/30 transition-all duration-200"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default Pagination;

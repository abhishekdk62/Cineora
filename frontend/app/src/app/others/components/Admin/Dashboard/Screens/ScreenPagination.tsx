import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ScreenPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

const ScreenPagination: React.FC<ScreenPaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  onPageChange
}) => (
  <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-4">
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-sm text-gray-400">
        Page {currentPage} of {totalPages} ({totalItems} total)
      </div>
      <div className="flex gap-2 flex-wrap justify-center">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3a3a3a] transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        {[...Array(Math.min(totalPages, 5))].map((_, index) => {
          let page = index + 1;
          if (totalPages > 5) {
            const start = Math.max(1, currentPage - 2);
            page = start + index;
            if (page > totalPages) return null;
          }
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-[#e78f03] text-black"
                  : "bg-[#2a2a2a] border border-gray-500 text-white hover:bg-[#3a3a3a]"
              }`}
            >
              {page}
            </button>
          );
        })}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3a3a3a] transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  </div>
);

export default ScreenPagination;

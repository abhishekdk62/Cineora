import React from "react";
import { Lexend } from "next/font/google";
import { Eye, Loader2 } from "lucide-react";

const lexend = Lexend({
  weight: "500",
  subsets: ["latin"],
});

const lexendSmall = Lexend({
  weight: "300",
  subsets: ["latin"],
});

interface MoviesEmptyStateProps {
  isLoading: boolean;
  activeFilterCount: number;
  emptyMessage: string;
}

const MoviesEmptyState: React.FC<MoviesEmptyStateProps> = ({
  isLoading,
  activeFilterCount,
  emptyMessage,
}) => {
  return (
    <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-12 text-center">
      {isLoading ? (
        <div className="flex flex-col items-center">
          <Loader2 className="h-16 w-16 text-gray-400 animate-spin mb-4" />
          <h3 className={`${lexend.className} text-xl text-white mb-2`}>
            Loading movies...
          </h3>
        </div>
      ) : (
        <>
          <Eye className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className={`${lexend.className} text-xl text-white mb-2`}>
            {activeFilterCount > 0
              ? "No movies match your filters"
              : emptyMessage}
          </h3>
          <p className={`${lexendSmall.className} text-gray-400`}>
            {activeFilterCount > 0
              ? "Try adjusting your filter criteria"
              : "No movies found"}
          </p>
        </>
      )}
    </div>
  );
};

export default MoviesEmptyState;

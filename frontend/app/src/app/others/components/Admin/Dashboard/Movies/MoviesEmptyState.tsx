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

// Font variables for styling
const lexendMedium = { fontFamily: 'Lexend', fontWeight: '500' };
const lexendSmallStyle = { fontFamily: 'Lexend', fontWeight: '400' };

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
    <div className="bg-gray-900/90 backdrop-blur-sm border border-yellow-500/20 rounded-lg p-12 text-center">
      {isLoading ? (
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <Loader2 className="h-12 w-12 text-yellow-400 animate-spin" />
          </div>
          <div>
            <h3 
              className="text-xl text-yellow-400 mb-2"
              style={lexendMedium}
            >
              Loading movies...
            </h3>
            <p 
              className="text-gray-300"
              style={lexendSmallStyle}
            >
              Please wait while we fetch your movies
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-gray-800/50 rounded-lg inline-block">
            <Eye className="h-12 w-12 text-gray-400" />
          </div>
          <div>
            <h3 
              className="text-xl text-white mb-2"
              style={lexendMedium}
            >
              {activeFilterCount > 0
                ? "No movies match your filters"
                : emptyMessage}
            </h3>
            <p 
              className="text-gray-400"
              style={lexendSmallStyle}
            >
              {activeFilterCount > 0
                ? "Try adjusting your filter criteria to find more results"
                : "No movies have been added to your collection yet"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoviesEmptyState;

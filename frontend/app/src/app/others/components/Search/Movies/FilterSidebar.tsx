"use client";

import React from "react";
import { Lexend } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";

const lexendSmall = Lexend({
  weight: "200",
  subsets: ["latin"],
});

const lexendMedium = Lexend({
  weight: "400",
  subsets: ["latin"],
});

const lexendBold = Lexend({
  weight: "700",
  subsets: ["latin"],
});

const sidebarVariants = {
  open: {
    x: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30
    }
  },
  closed: {
    x: "-100%",
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30
    }
  }
};

const backdropVariants = {
  open: {
    opacity: 1,
    transition: {
      duration: 0.3
    }
  },
  closed: {
    opacity: 0,
    transition: {
      duration: 0.3
    }
  }
};

interface FilterSidebarProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
  selectedRating: string;
  setSelectedRating: (rating: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  clearAllFilters: () => void;
  hasActiveFilters: boolean;
  genres: string[];
  ratings: string[];
  languageMap: { [key: string]: string };
  years: string[];
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  showFilters,
  setShowFilters,
  selectedGenre,
  setSelectedGenre,
  selectedRating,
  setSelectedRating,
  selectedLanguage,
  setSelectedLanguage,
  selectedYear,
  setSelectedYear,
  clearAllFilters,
  hasActiveFilters,
  genres,
  ratings,
  languageMap,
  years,
}) => {
  return (
    <AnimatePresence>
      {showFilters && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-black/50"
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={() => setShowFilters(false)} 
          />
          
          <motion.div 
            className="absolute top-0 left-0 h-full w-full max-w-md bg-black backdrop-blur-md border-r border-gray-500/30"
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-500/30">
              <h2 className={`${lexendBold.className} text-2xl text-white`}>Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto h-full pb-24">
              <div className="space-y-6">
                {hasActiveFilters && (
                  <div className="mb-6">
                    <h3 className={`${lexendMedium.className} text-white text-sm mb-3`}>Active Filters</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedGenre !== 'all' && (
                        <span className="inline-flex items-center gap-1 bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-xs border border-blue-500/30">
                          {genres.find(g => g.toLowerCase() === selectedGenre) || selectedGenre}
                          <button 
                            onClick={() => setSelectedGenre('all')} 
                            className="hover:text-white ml-1 w-4 h-4 flex items-center justify-center rounded-full hover:bg-blue-500/30 transition-colors duration-200"
                          >
                            ×
                          </button>
                        </span>
                      )}
                      {selectedRating !== 'all' && (
                        <span className="inline-flex items-center gap-1 bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full text-xs border border-purple-500/30">
                          {selectedRating.toUpperCase()}
                          <button 
                            onClick={() => setSelectedRating('all')} 
                            className="hover:text-white ml-1 w-4 h-4 flex items-center justify-center rounded-full hover:bg-purple-500/30 transition-colors duration-200"
                          >
                            ×
                          </button>
                        </span>
                      )}
                      {selectedLanguage !== 'all' && (
                        <span className="inline-flex items-center gap-1 bg-green-600/20 text-green-300 px-3 py-1 rounded-full text-xs border border-green-500/30">
                          {languageMap[selectedLanguage] || selectedLanguage}
                          <button 
                            onClick={() => setSelectedLanguage('all')} 
                            className="hover:text-white ml-1 w-4 h-4 flex items-center justify-center rounded-full hover:bg-green-500/30 transition-colors duration-200"
                          >
                            ×
                          </button>
                        </span>
                      )}
                      {selectedYear !== 'all' && (
                        <span className="inline-flex items-center gap-1 bg-orange-600/20 text-orange-300 px-3 py-1 rounded-full text-xs border border-orange-500/30">
                          {selectedYear}
                          <button 
                            onClick={() => setSelectedYear('all')} 
                            className="hover:text-white ml-1 w-4 h-4 flex items-center justify-center rounded-full hover:bg-orange-500/30 transition-colors duration-200"
                          >
                            ×
                          </button>
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <label className={`${lexendMedium.className} text-white block mb-3`}>Genre</label>
                    <select
                      value={selectedGenre}
                      onChange={(e) => setSelectedGenre(e.target.value)}
                      className={`${lexendSmall.className} w-full bg-white/10 border border-gray-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/20 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300`}
                    >
                      {genres.map(genre => (
                        <option key={genre} value={genre.toLowerCase()} className="bg-gray-800 text-white">
                          {genre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`${lexendMedium.className} text-white block mb-3`}>Language</label>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className={`${lexendSmall.className} w-full bg-white/10 border border-gray-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/20 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300`}
                    >
                      <option value="all" className="bg-gray-800 text-white">All</option>
                      {Object.entries(languageMap).map(([code, name]) => (
                        <option key={code} value={code} className="bg-gray-800 text-white">
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`${lexendMedium.className} text-white block mb-3`}>Rating</label>
                    <select
                      value={selectedRating}
                      onChange={(e) => setSelectedRating(e.target.value)}
                      className={`${lexendSmall.className} w-full bg-white/10 border border-gray-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/20 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300`}
                    >
                      {ratings.map(rating => (
                        <option key={rating} value={rating.toLowerCase()} className="bg-gray-800 text-white">
                          {rating}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`${lexendMedium.className} text-white block mb-3`}>Year</label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className={`${lexendSmall.className} w-full bg-white/10 border border-gray-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/20 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300`}
                    >
                      {years.map(year => (
                        <option key={year} value={year.toLowerCase()} className="bg-gray-800 text-white">
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/90 to-transparent border-t border-gray-500/30">
              <div className="flex gap-3">
                <button
                  onClick={clearAllFilters}
                  className={`${lexendMedium.className} flex-1 bg-red-600/20 hover:bg-red-600/40 text-red-300 py-3 px-4 rounded-xl transition-all duration-300 border border-red-500/30 hover:border-red-400/50 hover:scale-[1.02] active:scale-[0.98]`}
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className={`${lexendMedium.className} flex-1 bg-white text-black py-3 px-4 rounded-xl hover:bg-gray-200 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]`}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FilterSidebar;

// @ts-nocheck

"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Lexend } from "next/font/google";
import { X, Search, Film, MapPin, Loader2 } from "lucide-react";
import { getMoviesWithFilters } from "@/app/others/services/userServices/movieServices";
import { useRouter } from "next/navigation";

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

type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string, type: "movies" | "theaters") => void;
};

export default function SearchModal({
  isOpen,
  onClose,
  onSearch,
}: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"movies" | "theaters">("movies");
  const [filteredResults, setFilteredResults] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const [movies, setMovies] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getAllMovies = async () => {
    try {
      setIsLoading(true);
      const response = await getMoviesWithFilters({});
      setMovies(response.data || []);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const searchMovies = async (query: string) => {
    if (!query.trim()) return movies;

    try {
      setIsLoading(true);
      const response = await getMoviesWithFilters({
        search: query,
        isActive: true,
      });
      return response.data || [];
    } catch (error) {
      console.error("Error searching movies:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen && searchType === "movies") {
      getAllMovies();
    }
  }, [isOpen, searchType]);

  const theaters = [
    {
      id: 1,
      name: "IMAX Downtown",
      location: "Downtown",
      screens: 12,
      amenities: ["IMAX", "4DX", "Premium Seating", "Dolby Atmos"],
      distance: "2.1 km",
      image: "/api/placeholder/400/250",
    },
    {
      id: 2,
      name: "CineMax Mall",
      location: "Mall District",
      screens: 8,
      amenities: ["Premium Seating", "Food Court", "Parking"],
      distance: "3.5 km",
      image: "/api/placeholder/400/250",
    },
    {
      id: 3,
      name: "Starlight Cinema",
      location: "North Side",
      screens: 6,
      amenities: ["Recliner Seats", "Snack Bar", "Student Discount"],
      distance: "5.2 km",
      image: "/api/placeholder/400/250",
    },
  ];


  useEffect(() => {
    const filterResults = async () => {
      if (searchType === "movies") {
        if (searchQuery.trim() === "") {
          setFilteredResults(movies);
        } else {
          const searchResults = await searchMovies(searchQuery);
          setFilteredResults(searchResults);
        }
      } else {
        const results =
          searchQuery.trim() === ""
            ? theaters
            : theaters.filter(
                (theater) =>
                  theater.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  theater.location
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
              );
        setFilteredResults(results);
      }
    };

    const delayedSearch = setTimeout(() => {
      filterResults();
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery, searchType, movies]);
  const router = useRouter();
  const handleSubmit = (e: React.FormEvent) => {
    router.push("/search/movies");
  };

  if (!isOpen || !mounted) return null;

  const displayResults = filteredResults.slice(0, 6);

    const handleClick=(item:string)=>{

    router.push(`/search/movies/${item._id}`)

onClose()

  }

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-10 pb-10">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal with fixed height and flex layout */}
      <div className="relative w-full max-w-2xl mx-4 h-[80vh] max-h-[600px] min-h-[500px]">
        <div className="backdrop-blur-sm bg-black/90 rounded-3xl border border-gray-500/30 shadow-2xl h-full flex flex-col">
          {/* Fixed Header */}
          <div className="flex-shrink-0 p-6 pb-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`${lexendBold.className} text-2xl text-white`}>
                Search Movies & Theaters
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="flex mb-6">
              <div className="backdrop-blur-sm flex bg-black/30 rounded-2xl p-1 border border-gray-500/30 w-full">
                <button
                  onClick={() => setSearchType("movies")}
                  className={`${
                    lexendMedium.className
                  } flex-1 px-4 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                    searchType === "movies"
                      ? "bg-white text-black"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <Film className="w-4 h-4" />
                  Movies
                </button>
                <button
                  onClick={() => setSearchType("theaters")}
                  className={`${
                    lexendMedium.className
                  } flex-1 px-4 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                    searchType === "theaters"
                      ? "bg-white text-black"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  Theaters
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                {isLoading && (
                  <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 animate-spin" />
                )}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search for ${searchType}...`}
                  className={`${lexendMedium.className} w-full pl-12 pr-12 py-4 bg-white/10 border border-gray-500/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all duration-300`}
                  autoFocus
                />
              </div>
            </form>
          </div>

          {/* Scrollable Results - Takes remaining space */}
          <div className="flex-1 overflow-y-auto px-6">
            {isLoading && searchQuery.trim() ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-2" />
                <p className={`${lexendSmall.className} text-gray-400`}>
                  Searching...
                </p>
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="text-center py-8">
                <p className={`${lexendSmall.className} text-gray-400`}>
                  {searchQuery.trim() === ""
                    ? `No ${searchType} available`
                    : `No ${searchType} found for "${searchQuery}"`}
                </p>
              </div>
            ) : (
              <>
                {/* Results Counter */}
                <div className="mb-3 text-center">
                  <p className={`${lexendSmall.className} text-gray-400`}>
                    Showing {Math.min(filteredResults.length, 6)} of{" "}
                    {filteredResults.length} results
                    {filteredResults.length > 6 && " (showing first 6)"}
                  </p>
                </div>

                <div className="space-y-3 pb-4">
                  {displayResults.map((item) => (
                    <div
                      key={item.id || item._id}
                      className="flex items-center p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors duration-200 cursor-pointer"
                      onClick={() => {

                        handleClick(item)
                      }}
                    >
                      <img
                        src={
                          item.poster ||
                          item.image ||
                          "/api/placeholder/300/400"
                        }
                        alt={searchType === "movies" ? item.title : item.name}
                        className="w-16 h-20 object-cover rounded-lg mr-4"
                      />
                      <div className="flex-1">
                        <h3
                          className={`${lexendMedium.className} text-white text-lg mb-1`}
                        >
                          {searchType === "movies" ? item.title : item.name}
                        </h3>
                        {searchType === "movies" ? (
                          <div className="flex items-center gap-4">
                            <span
                              className={`${lexendSmall.className} text-gray-300`}
                            >
                              {Array.isArray(item.genre)
                                ? item.genre[0]
                                : item.genre}
                            </span>
                            <span
                              className={`${lexendSmall.className} text-gray-300`}
                            >
                              {item.rating}
                            </span>
                            <span
                              className={`${lexendSmall.className} text-gray-300`}
                            >
                              {item.duration}m
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-4">
                            <span
                              className={`${lexendSmall.className} text-gray-300`}
                            >
                              {item.location}
                            </span>
                            <span
                              className={`${lexendSmall.className} text-gray-300`}
                            >
                              {item.screens} screens
                            </span>
                            <span
                              className={`${lexendSmall.className} text-gray-300`}
                            >
                              {item.distance}
                            </span>
                          </div>
                        )}
                      </div>
                      <Search className="w-4 h-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Fixed Footer Button - Always visible */}
          {filteredResults.length > 0 && !isLoading && (
            <div className="flex-shrink-0 p-6 pt-4 border-t border-gray-500/30">
              <button
                onClick={handleSubmit}
                className={`${lexendMedium.className} w-full bg-white text-black py-3 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium`}
              >
                View All Results ({filteredResults.length})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

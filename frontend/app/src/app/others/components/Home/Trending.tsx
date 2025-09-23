"use client";

import { Lexend } from "next/font/google";
import CircularGallery from "../ReactBits/CircularGallery";
import { getMoviesWithFilters } from "../../services/userServices/movieServices";
import { useEffect, useState } from "react";
import { Movie } from "../Admin/Dashboard/Movies/MoviesList";
import { useRouter } from "next/navigation";
import { MovieResponseDto } from "../../dtos";

const lexendSmall = Lexend({
  weight: "200",
  subsets: ["latin"],
});

const lexendBold = Lexend({
  weight: "700",
  subsets: ["latin"],
});

export default function Trending() {
  const [trendingMovies, setTrendingMovies] = useState<MovieResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getTrending = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getMoviesWithFilters({
        sortBy: "releaseDate",
        sortOrder: "desc",
      });
      
      
      if (result.data && result.data.length > 0) {
        const moviesSlice = result.data.slice(0, 5);
        setTrendingMovies(moviesSlice);
      } else {
        setError("No trending movies found");
      }
    } catch (error) {
      console.error(' Error fetching trending movies:', error);
      setError("Failed to load trending movies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTrending();
  }, []);

  const router = useRouter();
  const handleClick = (id: string) => {
    router.push(`/search/movies/${id}`);
  };


return (
  <section
    id="movies"
    className="relative z-10 pt-30 py-20 px-4 sm:px-6 lg:px-8"
  >
    <div className="text-center mb-16">
      <h2 className={`${lexendBold.className} text-4xl md:text-5xl text-white mb-4`}>
        Trending Now
      </h2>
      <p className={`${lexendSmall.className} text-xl text-gray-300`}>
        Catch the Hottest Movies Everyone's Talking About
      </p>
    </div>
    
    {/* ✅ ADD background color to see container */}
    <div style={{ 
      height: "600px", 
      position: "relative",
      width: "100%",
      overflow: "visible",
     
    }}>
      {trendingMovies && trendingMovies.length > 0 ? (
        <>
         
          <CircularGallery
            items={trendingMovies}
            bend={2}
            textColor="#ffffff"
            borderRadius={0.05}
            scrollEase={0.02}
            handleClick={handleClick}
          />
        </>

        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">No trending movies available</p>
          </div>
        )}
      </div>
    </section>
  );
}

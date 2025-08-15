"use client";

import { useEffect, useRef, useState } from "react";
import VariableProximity from "../../Utils/ReactBits/VariableProximity";
import { getMoviesWithFilters } from "../../services/userServices/movieServices";
import { Movie } from "../Admin/Dashboard/Movies/MoviesList";
import { useRouter } from "next/navigation";

export default function Upcoming() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [latestMovies, setLatestMovies] = useState<Movie[]>([]);

  const getLatestMovies = async () => {
    try {
      const result = await getMoviesWithFilters({
        sortBy: "releaseDate",
        sortOrder: "desc",
      });
      setLatestMovies(result.data.slice(0, 3));
      console.log(latestMovies);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLatestMovies();
  }, []);
  const router = useRouter();
  const handleClick = (id: string) => {
    router.push(`/search/movies/${id}`);
  };


  return (
    <>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>

      <section
        id="upcoming-releases"
        className="relative z-10 py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto lg:flex lg:items-center lg:space-x-12">
          <div
            ref={containerRef}
            className="relative flex items-center justify-center lg:w-1/3 min-h-[400px]"
          >
            <VariableProximity
              label="Upcoming Releases"
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white text-center lg:text-left"
              fromFontVariationSettings="'wght' 400, 'opsz' 9"
              toFontVariationSettings="'wght' 1000, 'opsz' 40"
              containerRef={containerRef}
              radius={150}
              falloff="linear"
            />
          </div>

          <div className="lg:w-2/3">
            <div className="overflow-x-auto p-5 custom-scrollbar">
              <div className="flex space-x-6 min-w-max">
                {latestMovies.map((movie, index) => (
                  <div
                    onClick={() => handleClick(movie._id)}
                    key={index}
                    className="bg-black/30 backdrop-blur-sm border border-gray-500/30 rounded-xl overflow-hidden hover:bg-black/50 transition-transform duration-300 w-[290px] flex-shrink-0 transform hover:scale-105"
                  >
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-[350px] object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-white text-lg font-semibold">
                        {movie.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4">
                        Releasing on {movie.releaseDate.split("T")[0]}
                      </p>
                      <div className="text-center flex justify-center">
                        <button
                          type="button"
                          className="px-8 py-3 cursor-pointer bg-transparent border hover:bg-white hover:border-white hover:text-black border-gray-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200 max-w-xs mx-auto"
                        >
                          Notify Me
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

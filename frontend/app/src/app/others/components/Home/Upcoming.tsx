"use client";

import { useRef } from "react";
import VariableProximity from "../../Utils/ReactBits/VariableProximity";

export default function Upcoming() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const upcomingMovies = [
    {
      title: "Avengers: Reassembled",
      date: "Aug 15, 2025",
      poster:
        "https://creativereview.imgix.net/content/uploads/2024/12/AlienRomulus-scaled.jpg?auto=compress,format&q=60&w=1728&h=2560",
    },
    {
      title: "Fast & Furious X2",
      date: "Sep 2, 2025",
      poster:
        "https://www.tallengestore.com/cdn/shop/products/1917_-_Sam_Mendes_-_Hollywood_War_Film_Classic_English_Movie_Poster_9ef86295-4756-4c71-bb4e-20745c5fbc1a.jpg?v=1582781084",
    },

  ];

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
          {/* Left Side - Animated Title */}
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
                {upcomingMovies.map((movie, index) => (
                  <div
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
                      <p className="text-gray-400 text-sm mb-4">{movie.date}</p>
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
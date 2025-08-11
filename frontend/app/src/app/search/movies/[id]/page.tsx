"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Lexend } from "next/font/google";
import { Footer, NavBar } from "../../../others/components/Home";
import Orb from "../../../others/Utils/ReactBits/Orb";
import { getMovieById } from "@/app/others/services/userServices/movieServices";

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

interface Movie {
  _id: string;
  tmdbId: string;
  title: string;
  genre: string[];
  releaseDate: string;
  duration: number;
  rating: string;
  description: string;
  poster: string;
  trailer: string;
  cast: string[];
  director: string;
  language: string;
  isActive: boolean;
}

export default function MovieDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const languageMap: { [key: string]: string } = {
    "en": "English",
    "es": "Spanish",
    "fr": "French",
    "de": "German",
    "hi": "Hindi",
    "zh": "Chinese",
    "ja": "Japanese",
    "ko": "Korean"
  };
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const response = await getMovieById(params.id as string);
        
        setMovie(response.data);
        
     
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchMovieDetails();
    }
  }, [params.id]);
const handleBookTicket=()=>{
  router.push(`/book/${params.id}`)
}
  if (loading) {
    return (
      <div className="relative min-h-screen bg-black overflow-hidden">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <Orb hoverIntensity={0.5} rotateOnHover={true} hue={0} forceHoverState={false} />
        </div>
        <div className="relative z-10">
          <NavBar />
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
            <div className="backdrop-blur-sm bg-black/20 rounded-2xl p-8 border border-gray-500/30">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className={`${lexendMedium.className} text-white text-center`}>Loading movie details...</p>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="relative min-h-screen bg-black overflow-hidden">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <Orb hoverIntensity={0.5} rotateOnHover={true} hue={0} forceHoverState={false} />
        </div>
        <div className="relative z-10">
          <NavBar  />
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
            <div className="backdrop-blur-sm bg-black/20 rounded-2xl p-8 border border-gray-500/30 text-center">
              <h2 className={`${lexendBold.className} text-white text-2xl mb-4`}>Movie Not Found</h2>
              <p className={`${lexendSmall.className} text-gray-400 mb-6`}>
                The movie you're looking for doesn't exist or has been removed.
              </p>
              <button
                onClick={() => router.back()}
                className={`${lexendMedium.className} bg-white text-black px-6 py-3 rounded-xl hover:bg-gray-200 transition-all duration-300`}
              >
                Go Back
              </button>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Orb hoverIntensity={0.5} rotateOnHover={true} hue={0} forceHoverState={false} />
      </div>

      <div className="relative z-10">
        <NavBar  />
        
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
          <div className="pt-20 pb-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <button
                onClick={() => router.back()}
                className={`${lexendSmall.className} flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-300`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Movies
              </button>
            </div>
          </div>

          {/* Movie Details */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <div className="backdrop-blur-sm bg-black/20 rounded-3xl p-8 border border-gray-500/30">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Movie Poster */}
                <div className="lg:col-span-1">
                  <div className="relative group">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full rounded-2xl shadow-2xl "
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/api/placeholder/400/600";
                      }}
                    />
                    <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-lg">
                      <span className={`${lexendSmall.className} text-white text-sm`}>{movie.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Movie Information */}
                <div className="lg:col-span-2">
                  <div className="space-y-6">
                    
                    {/* Title and Basic Info */}
                    <div>
                      <h1 className={`${lexendBold.className} text-4xl md:text-5xl text-white mb-4`}>
                        {movie.title}
                      </h1>
                      <div className="flex flex-wrap items-center gap-4 text-gray-300">
                        <span className={`${lexendSmall.className}`}>
                          {new Date(movie.releaseDate).getFullYear()}
                        </span>
                        <span className={`${lexendSmall.className}`}>•</span>
                        <span className={`${lexendSmall.className}`}>
                          {formatDuration(movie.duration)}
                        </span>
                        <span className={`${lexendSmall.className}`}>•</span>
                        <span className={`${lexendSmall.className}`}>
                          {languageMap[movie.language] || movie.language}
                        </span>
                      </div>
                    </div>

                    {/* Genres */}
                    <div>
                      <h3 className={`${lexendMedium.className} text-white text-lg mb-3`}>Genres</h3>
                      <div className="flex flex-wrap gap-2">
                        {movie.genre.map((genre, index) => (
                          <span
                            key={index}
                            className={`${lexendSmall.className} bg-white/10 text-white px-3 py-1 rounded-lg text-sm border border-gray-500/30`}
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h3 className={`${lexendMedium.className} text-white text-lg mb-3`}>Synopsis</h3>
                      <p className={`${lexendSmall.className} text-gray-300 leading-relaxed`}>
                        {movie.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className={`${lexendMedium.className} text-white text-lg mb-3`}>Director</h3>
                        <p className={`${lexendSmall.className} text-gray-300`}>{movie.director}</p>
                      </div>
                      <div>
                        <h3 className={`${lexendMedium.className} text-white text-lg mb-3`}>Cast</h3>
                        <div className="space-y-1">
                          {movie.cast.map((actor, index) => (
                            <p key={index} className={`${lexendSmall.className} text-gray-300`}>
                              {actor}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <button onClick={handleBookTicket} className={`${lexendMedium.className} flex-1 bg-white text-black py-4 px-6 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium`}>
                        Book Tickets
                      </button>
                      
                      {movie.trailer && (
                        <button
                          onClick={() => setShowTrailer(true)}
                          className={`${lexendMedium.className} flex-1 bg-white/10 text-white py-4 px-6 rounded-xl hover:bg-white/20 border border-gray-500/30 transition-all duration-300`}
                        >
                          Watch Trailer
                        </button>
                      )}
                      
                      <button className={`${lexendMedium.className} bg-white/10 text-white py-4 px-6 rounded-xl hover:bg-white/20 border border-gray-500/30 transition-all duration-300`}>
                        Add to Wishlist
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showTrailer && movie.trailer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-4xl">
              <button
                onClick={() => setShowTrailer(false)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-200"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="aspect-video rounded-2xl overflow-hidden">
                <iframe
                  src={movie.trailer}
                  className="w-full h-full"
                  allowFullScreen
                  title={`${movie.title} Trailer`}
                />
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
}

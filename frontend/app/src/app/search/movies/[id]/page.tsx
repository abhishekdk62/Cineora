"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Footer, NavBar } from "../../../others/components/Home";
import Orb from "../../../others/components/ReactBits/Orb";
import { getMovieById } from "@/app/others/services/userServices/movieServices";
import { addToFavorites, checkIsFavorite, removeFromFavorites } from "@/app/others/services/userServices/favoriteServices";
import { getMovieRatingApi, getMovieReviewStats } from "@/app/others/services/commonServices/ratingServices";
import MovieReviews from "@/app/others/components/Search/Movies/MovieReviews";
import LoadingSpinner from "@/app/others/components/Search/Movies/LoadingSpinner";
import NotFoundPage from "@/app/others/components/Search/Movies/NotFoundPage";
import MovieDetailsContent from "@/app/others/components/Search/Movies/MovieDetailsContent";
import MovieTrailerModal from "@/app/others/components/Search/Movies/MovieTrailerModal";

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

interface ReviewsData {
  averageRating: number;
  limit: number;
  page: number;
  reviews: any[];
  total: number;
  totalPages: number;
}

interface RatingStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { [key: number]: number };
}

export default function MovieDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [reviewsData, setReviewsData] = useState<ReviewsData | null>(null);
  const [ratingStats, setRatingStats] = useState<RatingStats | null>(null);

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

  const handleFavoriteToggle = async (isAdd: boolean) => {
    try {
      if (movie) {
        if (isAdd) {
          await addToFavorites(movie._id);
        } else {
          await removeFromFavorites(movie._id);
        }
        setIsFav(isAdd);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIsFav = async () => {
    try {
      if (movie) {
        const data = await checkIsFavorite(movie._id);
        setIsFav(data.isFavorite);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getMovieRating = async () => {
    try {
      const data = await getMovieRatingApi(params.id as string);
      if (data.success) {
        setReviewsData(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getMovieRatingStats = async () => {
    try {
      const data = await getMovieReviewStats(params.id as string);
      if (data.success) {
        setRatingStats(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIsFav();
  }, [movie]);

  useEffect(() => {
    if (params.id) {
      getMovieRating();
      getMovieRatingStats();
    }
  }, [params.id]);

  const handleBookTicket = () => {
    router.push(`/book/${params.id}?flow=movie-first`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!movie) {
    return <NotFoundPage onGoBack={() => router.back()} />;
  }

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Orb hoverIntensity={0.5} rotateOnHover={true} hue={0} forceHoverState={false} />
      </div>

      <div className="relative z-10">
        <NavBar />

    <MovieDetailsContent
  movie={movie}
  isFav={isFav}
  onFavoriteToggle={handleFavoriteToggle}
  onBookTicket={handleBookTicket}
  onWatchTrailer={() => setShowTrailer(true)}
  onGoBack={() => router.back()}
  ratingStats={ratingStats} // Add this line
/>


        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <MovieReviews
            movieId={params.id as string}
            reviewsData={reviewsData}
            ratingStats={ratingStats}
          />
        </div>

        <MovieTrailerModal
          movie={movie}
          showTrailer={showTrailer}
          onClose={() => setShowTrailer(false)}
        />

        <Footer />
      </div>
    </div>
  );
}

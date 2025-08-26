"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Orb from "@/app/others/components/ReactBits/Orb";
import { Footer, NavBar } from "@/app/others/components/Home";
import RouteGuard from "@/app/others/components/Auth/common/RouteGuard";
import { getMovieById, getMoviesByTheater } from "@/app/others/services/userServices/movieServices";
import { getTheaterById, getTheatersByMovie } from "@/app/others/services/userServices/theaterServices";
import LoadingState from "@/app/others/components/User/Book/LoadingState";
import EmptyState from "@/app/others/components/User/Book/EmptyState";
import BookingHeader from "@/app/others/components/User/Book/BookingHeader";
import DateSelector from "@/app/others/components/User/Book/DateSelector";
import BookingContent from "@/app/others/components/User/Book/BookingContent";

export interface UnifiedBookingEntity {
  _id: string;
  title?: string;
  poster?: string;
  duration?: number;
  rating?: string;
  genre?: string[];
  name?: string;
  language?: string;
  format?: string;
  showTime?: string;
  theaterName?: string;
  location?: {
    coordinates: [string, string]
  }
  theaterLocation?: { coordinates: [number, number]; type: string };
  distance?: string;
  amenities?: string[];
  city?: string;
  state?: string;
  screens?: number;
  movieId?: {
    _id: string;
    title: string;
    poster: string;
    duration: number;
    rating: string;
    genre: string[];
    language: string;
    description?: string;
    director?: string;
    cast?: string[];
    releaseDate?: string;
    tmdbId?: string;
    trailer?: string;
  };
  screenId?: {
    _id: string;
    name: string;
    screenType?: string;
    totalSeats: number;
    theaterId: string;
    features?: string[];
    layout?: any;
  };
  rowPricing?: {
    rowLabel: string;
    seatType: string;
    basePrice: number;
    showtimePrice: number;
    totalSeats: number;
    availableSeats: number;
    bookedSeats: any[];
    _id: string;
  }[];
  availableSeats?: number;
  totalSeats?: number;
  blockedSeats?: any[];
  bookedSeats?: any[];
  theaterId?: string;
  ownerId?: string;
  showDate?: string;
  endTime?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  showtimes?: {
    _id?: string;
    showtimeId?: string;
    time?: string;
    showTime?: string;
    endTime?: string;
    format?: string;
    language?: string;
    screenName?: string;
    screenType?: string;
    availableSeats?: number;
    totalSeats?: number;
    price?: number;
    rowPricing?: {
      rowLabel: string;
      seatType: string;
      basePrice: number;
      showtimePrice: number;
      totalSeats: number;
      availableSeats: number;
      bookedSeats: any[];
      _id: string;
    }[];
  }[];
}
export default function BookTicketsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [movie, setMovie] = useState<UnifiedBookingEntity | null>(null);
  const [theater, setTheater] = useState<UnifiedBookingEntity | null>(null);
  const [movies, setMovies] = useState<UnifiedBookingEntity[]>([]);
  const [theaters, setTheaters] = useState<UnifiedBookingEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [bookingFlow, setBookingFlow] = useState<'movie-first' | 'theater-first' | null>(null);

  const formatDateForAPI = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const flowType = searchParams.get('flow');
        const referrer = document.referrer;

        let detectedFlow: 'movie-first' | 'theater-first' = 'movie-first';

        if (flowType) {
          detectedFlow = flowType as 'movie-first' | 'theater-first';
        } else if (referrer.includes('/search/theaters')) {
          detectedFlow = 'theater-first';
        } else if (referrer.includes('/search/movies')) {
          detectedFlow = 'movie-first';
        }

        setBookingFlow(detectedFlow);
        const dateString = formatDateForAPI(selectedDate);

        if (detectedFlow === 'movie-first') {
          const movieResponse = await getMovieById(params.id as string);
          setMovie(movieResponse.data);

          const theatersResponse = await getTheatersByMovie(params.id as string, dateString);
          setTheaters(theatersResponse.data || []);
          console.log('SHOWTIME DS theaterId', theatersResponse.data[0]);


        } else if (detectedFlow === 'theater-first') {
          const theaterResponse = await getTheaterById(params.id as string);

          setTheater(theaterResponse.data);

          const moviesResponse = await getMoviesByTheater(params.id as string, dateString);
          console.log('SHOWTIME DS BY movieId', moviesResponse.data[0]);

          setMovies(moviesResponse.data || []);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id, selectedDate, searchParams]);

  const handleShowtimeSelect = (showtimeId: string) => {
    router.push(`/book/tickets/${showtimeId}`)


  };

  const handleGoBack = () => {
    router.back();
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <RouteGuard allowUnauthenticated={true} excludedRoles={['admin,owner']}>
      <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <Orb hoverIntensity={0.5} rotateOnHover={true} hue={0} forceHoverState={false} />
        </div>

        <div className="relative z-10">
          <NavBar />

          {loading && <LoadingState bookingFlow={bookingFlow} />}

          {!loading && (movie || theater) && (
            <div className="min-h-screen">
              <BookingHeader
                movie={movie}
                theater={theater}
                bookingFlow={bookingFlow}
                onBack={handleGoBack}
              />

              <DateSelector
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
              />

              <BookingContent
                bookingFlow={bookingFlow}
                movie={movie}
                theater={theater}
                movies={movies}
                theaters={theaters}
                selectedDate={selectedDate}
                onShowtimeSelect={handleShowtimeSelect}
              />
            </div>
          )}

          <Footer />
        </div>
      </div>
    </RouteGuard>
  );
}

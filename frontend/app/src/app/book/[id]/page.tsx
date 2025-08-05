"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Lexend } from "next/font/google";
import Orb from "@/app/others/Utils/ReactBits/Orb";
import { Footer, NavBar } from "@/app/others/components/Home";
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

interface Theater {
  _id: string;
  name: string;
  location: string;
  distance: string;
  amenities: string[];
  showtimes: {
    time: string;
    availableSeats: number;
    totalSeats: number;
    price: number;
    screenType: string;
    _id: string;
  }[];
}

interface Movie {
  _id: string;
  title: string;
  poster: string;
  duration: number;
  rating: string;
  genre: string[];
}

export default function BookTicketsPage() {
  const params = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Helper function to format duration
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Generate next 7 days for date selection
  const getNext7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const movieResponse = await getMovieById(params.id as string);

        const mockTheaters: Theater[] = [
          {
            _id: "1",
            name: "IMAX Downtown",
            location: "Downtown Plaza, City Center",
            distance: "2.1 km",
            amenities: ["IMAX", "4DX", "Dolby Atmos", "Premium Seating"],
            showtimes: [
              {
                time: "10:00 AM",
                availableSeats: 45,
                totalSeats: 150,
                price: 350,
                screenType: "IMAX",
                _id: "1",
              },
              {
                time: "01:30 PM",
                availableSeats: 78,
                totalSeats: 150,
                price: 350,
                screenType: "IMAX",
                _id: "2",
              },
              {
                time: "05:00 PM",
                availableSeats: 12,
                totalSeats: 150,
                price: 400,
                screenType: "IMAX",
                _id: "3",
              },
              {
                time: "08:30 PM",
                availableSeats: 89,
                totalSeats: 150,
                price: 400,
                screenType: "IMAX",
                _id: "4",
              },
            ],
          },
          {
            _id: "2",
            name: "CineMax Mall",
            location: "Grand Mall, Shopping District",
            distance: "3.5 km",
            amenities: ["Premium Seating", "Food Court", "Parking"],
            showtimes: [
              {
                time: "11:15 AM",
                availableSeats: 56,
                totalSeats: 120,
                price: 250,
                screenType: "2D",
                _id: "5",
              },
              {
                time: "02:45 PM",
                availableSeats: 34,
                totalSeats: 120,
                price: 250,
                screenType: "2D",
                _id: "6",
              },
              {
                time: "06:15 PM",
                availableSeats: 78,
                totalSeats: 120,
                price: 300,
                screenType: "2D",
                _id: "7",
              },
              {
                time: "09:45 PM",
                availableSeats: 92,
                totalSeats: 120,
                price: 300,
                screenType: "2D",
                _id: "8",
              },
            ],
          },
          {
            _id: "3",
            name: "Starlight Cinema",
            location: "North Side Avenue",
            distance: "5.2 km",
            amenities: ["Recliner Seats", "Snack Bar", "Student Discount"],
            showtimes: [
              {
                time: "12:00 PM",
                availableSeats: 23,
                totalSeats: 100,
                price: 200,
                screenType: "2D",
                _id: "9",
              },
              {
                time: "03:30 PM",
                availableSeats: 67,
                totalSeats: 100,
                price: 200,
                screenType: "2D",
                _id: "10",
              },
              {
                time: "07:00 PM",
                availableSeats: 45,
                totalSeats: 100,
                price: 250,
                screenType: "2D",
                _id: "11",
              },
              {
                time: "10:30 PM",
                availableSeats: 78,
                totalSeats: 100,
                price: 250,
                screenType: "2D",
                _id: "12",
              },
            ],
          },
          {
            _id: "4",
            name: "Grand Theater",
            location: "City Center, Business District",
            distance: "1.8 km",
            amenities: ["VIP Lounge", "Valet Parking", "Fine Dining"],
            showtimes: [
              {
                time: "10:30 AM",
                availableSeats: 34,
                totalSeats: 180,
                price: 500,
                screenType: "VIP",
                _id: "13",
              },
              {
                time: "02:00 PM",
                availableSeats: 56,
                totalSeats: 180,
                price: 500,
                screenType: "VIP",
                _id: "14",
              },
              {
                time: "05:30 PM",
                availableSeats: 12,
                totalSeats: 180,
                price: 600,
                screenType: "VIP",
                _id: "15",
              },
              {
                time: "09:00 PM",
                availableSeats: 67,
                totalSeats: 180,
                price: 600,
                screenType: "VIP",
                _id: "16",
              },
            ],
          },
        ];

        setMovie(movieResponse.data);
        setTheaters(mockTheaters);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id, selectedDate]);

  const handleShowtimeSelect = (theaterId: string, showtimeId: string) => {
    // Navigate to seat selection page
    // router.push(`/search/movies/${params.id}/book/${theaterId}/${showtimeId}`);
  };

  // Loading State with Orb Background
  if (loading) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <Orb
            hoverIntensity={0.5}
            rotateOnHover={true}
            hue={0}
            forceHoverState={false}
          />
        </div>

        <div className="relative z-10">
          <NavBar scrollToSection={() => {}} />
          
          <div className="min-h-screen flex items-center justify-center">
            <div className="backdrop-blur-sm bg-black/20 rounded-2xl p-8 border border-gray-500/30">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className={`${lexendMedium.className} text-white text-center`}>
                Loading theaters...
              </p>
            </div>
          </div>
          
          <Footer />
        </div>
      </div>
    );
  }

  // Movie Not Found State with Orb Background
  if (!movie) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <Orb
            hoverIntensity={0.5}
            rotateOnHover={true}
            hue={0}
            forceHoverState={false}
          />
        </div>

        <div className="relative z-10">
          <NavBar scrollToSection={() => {}} />
          
          <div className="min-h-screen flex items-center justify-center">
            <div className="backdrop-blur-sm bg-black/20 rounded-2xl p-8 border border-gray-500/30 text-center">
              <h2 className={`${lexendBold.className} text-white text-2xl mb-4`}>
                Movie Not Found
              </h2>
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

  // Main Content with Orb Background
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Orb
          hoverIntensity={0.5}
          rotateOnHover={true}
          hue={0}
          forceHoverState={false}
        />
      </div>

      <div className="relative z-10">
        <NavBar scrollToSection={() => {}} />

        <div className="min-h-screen">
          {/* Header with Movie Info */}
          <div className="pt-20 pb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Back Button */}
              <button
                onClick={() => router.back()}
                className={`${lexendSmall.className} flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-300 mb-6`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Movie Details
              </button>

              {/* Movie Header */}
              <div className="backdrop-blur-sm bg-black/20 rounded-2xl p-6 border border-gray-500/30">
                <div className="flex items-center gap-6">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-20 h-28 rounded-lg object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/api/placeholder/80/112";
                    }}
                  />
                  <div>
                    <h1
                      className={`${lexendBold.className} text-2xl md:text-3xl text-white mb-2`}
                    >
                      {movie.title}
                    </h1>
                    <div className="flex items-center gap-4 text-gray-300">
                      <span className={`${lexendSmall.className}`}>
                        {movie.rating}
                      </span>
                      <span className={`${lexendSmall.className}`}>•</span>
                      <span className={`${lexendSmall.className}`}>
                        {formatDuration(movie.duration)}
                      </span>
                      <span className={`${lexendSmall.className}`}>•</span>
                      <span className={`${lexendSmall.className}`}>
                        {movie.genre.join(", ")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Date Selection */}
          <div className="pb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="backdrop-blur-sm bg-black/20 rounded-2xl p-4 border border-gray-500/30">
                <h2
                  className={`${lexendMedium.className} text-white text-lg mb-4`}
                >
                  Select Date
                </h2>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {getNext7Days().map((date, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(date)}
                      className={`${
                        lexendSmall.className
                      } flex-shrink-0 px-4 py-3 rounded-lg transition-all duration-300 ${
                        selectedDate.toDateString() === date.toDateString()
                          ? "bg-white text-black"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      <div className="text-center">
                        <div className="font-medium">{formatDate(date)}</div>
                        <div className="text-xs opacity-75">
                          {date.toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short",
                          })}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Theaters List */}
          <div className="pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="space-y-4">
                {theaters.map((theater) => (
                  <div
                    key={theater._id}
                    className="backdrop-blur-sm bg-black/20 rounded-2xl p-6 border border-gray-500/30 hover:border-white/30 transition-all duration-300"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Theater Info */}
                      <div className="lg:col-span-1">
                        <h3
                          className={`${lexendMedium.className} text-white text-xl mb-2`}
                        >
                          {theater.name}
                        </h3>
                        <p
                          className={`${lexendSmall.className} text-gray-400 mb-2`}
                        >
                          {theater.location}
                        </p>
                        <p
                          className={`${lexendSmall.className} text-gray-400 mb-4`}
                        >
                          {theater.distance} away
                        </p>

                        {/* Amenities */}
                        <div className="flex flex-wrap gap-2">
                          {theater.amenities.map((amenity, index) => (
                            <span
                              key={index}
                              className={`${lexendSmall.className} bg-white/10 text-white px-2 py-1 rounded text-xs border border-gray-500/30`}
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Showtimes */}
                      <div className="lg:col-span-2">
                        <h4
                          className={`${lexendMedium.className} text-white text-lg mb-4`}
                        >
                          Show Times
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {theater.showtimes.map((showtime) => (
                            <button
                              key={showtime._id}
                              onClick={() =>
                                handleShowtimeSelect(theater._id, showtime._id)
                              }
                              className={`${
                                lexendSmall.className
                              } bg-white/10 hover:bg-white/20 border border-gray-500/30 hover:border-white/50 rounded-lg p-3 transition-all duration-300 text-left ${
                                showtime.availableSeats < 20
                                  ? "border-red-400/50"
                                  : ""
                              }`}
                            >
                              <div className="text-white font-medium mb-1">
                                {showtime.time}
                              </div>
                              <div className="text-xs text-gray-400 mb-1">
                                {showtime.screenType}
                              </div>
                              <div className="text-xs text-gray-400 mb-2">
                                ₹{showtime.price}
                              </div>

                              {/* Availability Indicator */}
                              <div className="flex items-center gap-1">
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    showtime.availableSeats > 50
                                      ? "bg-green-400"
                                      : showtime.availableSeats > 20
                                      ? "bg-yellow-400"
                                      : "bg-red-400"
                                  }`}
                                />
                                <span className="text-xs text-gray-400">
                                  {showtime.availableSeats} seats
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

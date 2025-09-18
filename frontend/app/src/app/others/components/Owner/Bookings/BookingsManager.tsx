// @ts-nocheck

"use client";

import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Monitor, Search, Download, ChevronDown } from "lucide-react";
import ShowtimeCard from "./ShowtimeCard";
import ShowDetailsPage from "./ShowDetailsPage";
import { getTheatersByOwnerId } from "@/app/others/services/ownerServices/theaterServices";
import { getScreensByTheaterId } from "@/app/others/services/ownerServices/screenServices";
import { getShowTimesForBookings } from "@/app/others/services/ownerServices/bookingServices";

interface BookingsManagerProps {
    lexendMedium: string;
    lexendSmall: string;
}

const BookingsManager: React.FC<BookingsManagerProps> = ({
    lexendMedium,
    lexendSmall,
}) => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedTheater, setSelectedTheater] = useState("");
    const [selectedScreen, setSelectedScreen] = useState("");
    const [theaters, setTheaters] = useState([]);
    const [screens, setScreens] = useState([]);
    const [showtimes, setShowtimes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedShowtime, setSelectedShowtime] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
const [isInitialLoad, setIsInitialLoad] = useState(true); // ✅ Add this state

    useEffect(() => {
        fetchOwnerTheaters();
    }, []);

useEffect(() => {
    if (selectedTheater) {
        const shouldAutoSelect = theaters.length > 0 && selectedTheater === theaters[0]._id && !isInitialLoad;
        fetchTheaterScreens(selectedTheater, shouldAutoSelect);  
    } else {
        setScreens([]);
        setSelectedScreen("");
    }
}, [selectedTheater, theaters, isInitialLoad]);  


    useEffect(() => {
        if (selectedDate && selectedTheater && selectedScreen) {
            fetchShowtimes();
        } else {
            setShowtimes([]);
        }
    }, [selectedDate, selectedTheater, selectedScreen]);

   const fetchOwnerTheaters = async () => {
    try {
        const result = await getTheatersByOwnerId();
        const theatersData = result.data.theaters || [];  
        setTheaters(theatersData);
        
        if (isInitialLoad && theatersData.length > 0) {  
            setSelectedTheater(theatersData[0]._id);
            // Don't call fetchTheaterScreens here, let useEffect handle it
            setIsInitialLoad(false);  // ✅ Fix: Mark initial load as complete
        }
    } catch (error) {
        console.log(error);
    }
}

const fetchTheaterScreens = async (theaterId, autoSelectFirst = false) => {  // ✅ Fix: Add parameter
    try {
        const result = await getScreensByTheaterId(theaterId);
        const screensData = result.data || [];
        setScreens(screensData);
        
        // Auto-select first screen if requested and available
        if (autoSelectFirst && screensData.length > 0) {  // ✅ Fix: Now autoSelectFirst is defined
            setSelectedScreen(screensData[0]._id);
        }
    } catch (error) {
        console.log(error);
    }
};


  const fetchShowtimes = async () => {
    try {
        setIsLoading(true);  
        const data = await getShowTimesForBookings(selectedTheater, selectedScreen, selectedDate);
        console.log('show suiii', data.data);
        setShowtimes(data.data || []);
    } catch (error) {
        setShowtimes([]);
        console.log(error);
    } finally {
        setIsLoading(false);  
    }
};

    const handleShowtimeClick = (showtime: string) => {
        setSelectedShowtime(showtime);
        setShowDetails(true);
    };

    const handleBackToShowtimes = () => {
        setShowDetails(false);
        setSelectedShowtime(null);
    };

    if (showDetails && selectedShowtime) {
        return (
            <ShowDetailsPage
                showtime={selectedShowtime}
                theater={theaters.find(t => t._id === selectedTheater)}
                screen={screens.find(s => s._id === selectedScreen)}
                date={selectedDate}
                onBack={handleBackToShowtimes}
                lexendMedium={lexendMedium}
                lexendSmall={lexendSmall}
            />
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className={`${lexendMedium.className} text-3xl text-white mb-2`}>
                    Booking Management
                </h1>
                <p className={`${lexendSmall.className} text-gray-400`}>
                    Track and manage theater bookings by show
                </p>
            </div>

            {/* Top Filter Bar */}
            <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Date Picker */}
                    <div className="space-y-2">
                        <label className={`${lexendSmall.className} text-gray-400 text-sm flex items-center gap-2`}>
                            <Calendar className="w-4 h-4" />
                            Select Date
                        </label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className={`${lexendMedium.className} w-full px-4 py-3 bg-white/10 border border-gray-500/30 rounded-xl text-white focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all duration-300`}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className={`${lexendSmall.className} text-gray-400 text-sm flex items-center gap-2`}>
                            <MapPin className="w-4 h-4" />
                            Select Theater
                        </label>
                        <div className="relative">
                            <select
                                value={selectedTheater}
                                onChange={(e) => {
                                    setSelectedTheater(e.target.value);
                                    setSelectedScreen("");
                                }}
                                className={`${lexendMedium.className} w-full px-4 py-3 bg-white/10 border border-gray-500/30 rounded-xl text-white focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all duration-300 appearance-none`}
                            >
                                <option value="" className="bg-gray-900">Select Theater</option>
                                {theaters.map((theater: any) => (
                                    <option key={theater._id} value={theater._id} className="bg-gray-900">
                                        {theater.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className={`${lexendSmall.className} text-gray-400 text-sm flex items-center gap-2`}>
                            <Monitor className="w-4 h-4" />
                            Select Screen
                        </label>
                        <div className="relative">
                            <select
                                value={selectedScreen}
                                onChange={(e) => setSelectedScreen(e.target.value)}
                                disabled={!selectedTheater}
                                className={`${lexendMedium.className} w-full px-4 py-3 bg-white/10 border border-gray-500/30 rounded-xl text-white focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all duration-300 appearance-none disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                <option value="" className="bg-gray-900">Select Screen</option>
                                {screens.map((screen: string) => (
                                    <option key={screen._id} value={screen._id} className="bg-gray-900">
                                        {screen.name} ({screen.totalSeats} seats)
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {!selectedDate || !selectedTheater || !selectedScreen ? (
                    <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-12 text-center">
                        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className={`${lexendMedium.className} text-xl text-white mb-2`}>
                            Select Filters to View Shows
                        </h3>
                        <p className={`${lexendSmall.className} text-gray-400`}>
                            Choose date, theater, and screen to see showtimes
                        </p>
                    </div>
                ) : isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6 animate-pulse"
                            >
                                <div className="flex gap-4">
                                    <div className="w-16 h-20 bg-gray-600 rounded"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                                        <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                                        <div className="h-3 bg-gray-600 rounded w-2/3"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : showtimes.length === 0 ? (
                    <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-12 text-center">
                        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className={`${lexendMedium.className} text-xl text-white mb-2`}>
                            No Shows Found
                        </h3>
                        <p className={`${lexendSmall.className} text-gray-400`}>
                            No showtimes scheduled for selected date and screen
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between">
                            <h2 className={`${lexendMedium.className} text-xl text-white`}>
                                Shows for {new Date(selectedDate).toLocaleDateString('en-IN', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </h2>
                            <p className={`${lexendSmall.className} text-gray-400`}>
                                {showtimes.length} show{showtimes.length !== 1 ? 's' : ''} found
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {showtimes.map((showtime) => (
                                <ShowtimeCard
                                    key={showtime._id}
                                    showtime={showtime}
                                    onClick={() => handleShowtimeClick(showtime)}
                                    lexendMedium={lexendMedium}
                                    lexendSmall={lexendSmall}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default BookingsManager;

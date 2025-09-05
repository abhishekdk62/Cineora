"use client";
import * as XLSX from 'xlsx';

import React, { useState, useEffect } from "react";
import { ArrowLeft, Search, Download, DollarSign, Users, Eye, Filter, Clock } from "lucide-react";
import BookingTable from "./BookingTable";
import SeatLayoutVisualizer from "./SeatLayoutVisualizer";
import { getBookingDetails } from "@/app/others/services/ownerServices/bookingServices";

interface ShowDetailsPageProps {
  showtime: any;
  theater: any;
  screen: any;
  date: string;
  onBack: () => void;
  lexendMedium: any;
  lexendSmall: any;
}

const ShowDetailsPage: React.FC<ShowDetailsPageProps> = ({
  showtime,
  theater,
  screen,
  date,
  onBack,
  lexendMedium,
  lexendSmall,
}) => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBookingDetails();
  }, []);
  useEffect(() => {
    filterBookings();
  }, [bookings, searchQuery, filterStatus]);
  const fetchBookingDetails = async () => {
    try {
      const response = await getBookingDetails(showtime._id)
       setBookings(response.data);
       
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = bookings;

    if (searchQuery) {
      filtered = filtered.filter(booking =>
        booking.contactInfo?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.selectedSeats?.some((seat: string) => seat.toLowerCase().includes(searchQuery.toLowerCase())) ||
        booking.bookingId?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(booking => booking.bookingStatus === filterStatus);
    }

    setFilteredBookings(filtered);
  };

const handleExportExcel = () => {
  if (!filteredBookings || filteredBookings.length === 0) {
    alert('No data to export');
    return;
  }

  const worksheetData = filteredBookings.map(booking => ({
    'Booking ID': booking.bookingId || 'N/A',
    'Customer Email': booking.userId?.email || booking.contactInfo?.email || 'N/A',
    'Customer ID': booking.userId?._id?.slice(-8) || 'N/A',
    'Selected Seats': booking.selectedSeats?.join(', ') || 'No seats',
    'Number of Seats': booking.selectedSeats?.length || 0,
    'Subtotal': booking.priceDetails?.subtotal || 0,
    'Taxes': booking.priceDetails?.taxes || 0,
    'Convenience Fee': booking.priceDetails?.convenienceFee || 0,
    'Total Amount': booking.priceDetails?.total || 0,
    'Payment Status': booking.paymentStatus || 'N/A',
    'Payment Method': booking.paymentMethod || 'N/A',
    'Booking Status': booking.bookingStatus || 'N/A',
    'Booking Date': new Date(booking.bookedAt).toLocaleDateString('en-IN'),
    'Booking Time': new Date(booking.bookedAt).toLocaleTimeString('en-IN'),
    'Show Date': new Date(booking.showDate).toLocaleDateString('en-IN'),
    'Show Time': booking.showTime || 'N/A',
    'Cancelled At': booking.cancelledAt ? new Date(booking.cancelledAt).toLocaleDateString('en-IN') : 'N/A',
    'Movie Title': showtime.movieId?.title || 'N/A',
    'Theater': theater?.name || 'N/A',
    'Screen': screen?.name || 'N/A',
    'Language': showtime.language?.toUpperCase() || 'N/A',
    'Format': showtime.format || 'N/A'
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  
  // Set column widths
  const columnWidths = [
    { width: 20 }, // Booking ID
    { width: 25 }, // Customer Email
    { width: 12 }, // Customer ID
    { width: 20 }, // Selected Seats
    { width: 8 },  // Number of Seats
    { width: 12 }, // Subtotal
    { width: 10 }, // Taxes
    { width: 15 }, // Convenience Fee
    { width: 15 }, // Total Amount
    { width: 15 }, // Payment Status
    { width: 15 }, // Payment Method
    { width: 15 }, // Booking Status
    { width: 15 }, // Booking Date
    { width: 12 }, // Booking Time
    { width: 15 }, // Show Date
    { width: 10 }, // Show Time
    { width: 15 }, // Cancelled At
    { width: 25 }, // Movie Title
    { width: 20 }, // Theater
    { width: 15 }, // Screen
    { width: 10 }, // Language
    { width: 8 }   // Format
  ];
  
  worksheet['!cols'] = columnWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Bookings');
  
  const currentDate = new Date().toISOString().split('T')[0];
  const movieTitle = showtime.movieId?.title?.replace(/[^a-zA-Z0-9]/g, '_') || 'Movie';
  const filename = `${movieTitle}_bookings_${currentDate}.xlsx`;
  
  XLSX.writeFile(workbook, filename);
};



  // Calculate stats from your actual data structure
  const bookedSeatsCount = showtime.bookedSeats?.length || 0;
  const occupancyPercentage = Math.round((bookedSeatsCount / showtime.totalSeats) * 100);
   const totalRevenue = bookings
    .filter(booking => booking.bookingStatus !== 'cancelled')
    .reduce((sum, booking) => sum + (booking.priceDetails?.total || 0), 0);


  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className={`${lexendMedium.className} text-2xl text-white mb-1`}>
            Show Details
          </h1>
          <p className={`${lexendSmall.className} text-gray-400`}>
            {theater?.name} • {screen?.name} • {new Date(date).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Movie Info */}
          <div className="flex gap-4">
            <img
              src={showtime.movieId.poster}
              alt={showtime.movieId.title}
              className="w-24 h-32 object-cover rounded-lg border border-gray-500/30"
            />
            <div className="space-y-2">
              <h2 className={`${lexendMedium.className} text-xl text-white`}>
                {showtime.movieId.title}
              </h2>
              <p className={`${lexendSmall.className} text-gray-400`}>
                {showtime.language?.toUpperCase()} • {showtime.format}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className={`${lexendMedium.className} text-blue-400 text-lg`}>
                    {showtime.showTime}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span className={`${lexendMedium.className} text-purple-400 text-lg`}>
                    {showtime.endTime}
                  </span>
                </div>
              </div>
              <p className={`${lexendSmall.className} text-gray-400`}>
                Screen: {showtime.screenId.name}
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <p className={`${lexendSmall.className} text-gray-400 text-sm mb-1`}>Total Seats</p>
              <p className={`${lexendMedium.className} text-white text-xl`}>
                {showtime.totalSeats}
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-4 text-center">
              <Users className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <p className={`${lexendSmall.className} text-gray-400 text-sm mb-1`}>Booked</p>
              <p className={`${lexendMedium.className} text-green-400 text-xl`}>
                {bookedSeatsCount}
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-4 text-center">
              <Users className="w-6 h-6 text-orange-400 mx-auto mb-2" />
              <p className={`${lexendSmall.className} text-gray-400 text-sm mb-1`}>Available</p>
              <p className={`${lexendMedium.className} text-orange-400 text-xl`}>
                {showtime.totalSeats - bookedSeatsCount}
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-4 text-center">
              <DollarSign className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <p className={`${lexendSmall.className} text-gray-400 text-sm mb-1`}>Revenue</p>
              <p className={`${lexendMedium.className} text-yellow-400 text-xl`}>
                ₹{totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Occupancy Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className={`${lexendSmall.className} text-gray-400`}>Theater Occupancy</span>
            <span className={`${lexendMedium.className} text-white`}>{occupancyPercentage}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${occupancyPercentage >= 80
                  ? 'bg-green-400'
                  : occupancyPercentage >= 60
                    ? 'bg-yellow-400'
                    : 'bg-red-400'
                }`}
              style={{ width: `${occupancyPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
      {/* Seat Layout Visualization */}
      <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
        <h3 className={`${lexendMedium.className} text-lg text-white mb-4 flex items-center gap-2`}>
          <Eye className="w-5 h-5 text-purple-400" />
          Seat Layout
        </h3>
        <SeatLayoutVisualizer
          totalSeats={showtime.totalSeats}
          bookedSeats={showtime.bookedSeats || []}
          showtime={showtime}
          lexendSmall={lexendSmall}
        />
      </div>

      <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <h3 className={`${lexendMedium.className} text-lg text-white flex items-center gap-2`}>
            <Users className="w-5 h-5 text-green-400" />
            Booking List ({filteredBookings.length})
          </h3>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by email, seat, booking ID..."
                className={`${lexendMedium.className} pl-10 pr-4 py-2 bg-white/10 border border-gray-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/50 w-64`}
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`${lexendMedium.className} px-3 py-2 bg-white/10 border border-gray-500/30 rounded-lg text-white focus:outline-none focus:border-white/50`}
            >
              <option value="all" className="bg-gray-900">All Status</option>
              <option value="confirmed" className="bg-gray-900">Confirmed</option>
              <option value="cancelled" className="bg-gray-900">Cancelled</option>
            </select>

            <button
              onClick={handleExportExcel}
              className={`${lexendMedium.className} flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-300`}
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        <BookingTable
          bookings={filteredBookings}
          isLoading={isLoading}
          lexendMedium={lexendMedium}
          lexendSmall={lexendSmall}
        />
      </div>
    </div>
  );
};

export default ShowDetailsPage;

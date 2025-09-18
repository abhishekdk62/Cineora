"use client";
import React, { useState } from 'react';
import { Lexend } from "next/font/google";
import { 
  User, 
  Calendar, 
  Clock, 
  MapPin, 
  Ticket, 
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Users,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const lexend = Lexend({
  weight: "500",
  subsets: ["latin"],
});

const lexendSmall = Lexend({
  weight: "300",
  subsets: ["latin"],
});

interface BookingUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface Movie {
  _id: string;
  title: string;
  genre: string;
  duration: number;
  language: string;
}

interface Screen {
  _id: string;
  name: string;
  screenType: string;
  totalSeats: number;
}

interface Showtime {
  _id: string;
  showDate: string;
  showTime: string;
}

interface PriceDetails {
  subtotal: number;
  convenienceFee: number;
  taxes: number;
  discount: number;
  total: number;
}

interface TheaterBooking {
  _id: string;
  bookingId: string;
  userId: BookingUser;
  movieId: Movie;
  screenId: Screen;
  showtimeId: Showtime;
  selectedSeats: string[];
  priceDetails: PriceDetails;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  bookingStatus: 'confirmed' | 'cancelled' | 'expired';
  bookedAt: string;
  showDate: string;
  showTime: string;
  contactInfo: {
    email: string; 
  };
}

interface BookingsListProps {
  bookings: TheaterBooking[];
  totalBookings: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

const BookingsListForAdmins: React.FC<BookingsListProps> = ({
  bookings,
  totalBookings,
  currentPage,
  totalPages,
  onPageChange,
  isLoading
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed':
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'confirmed':
        return 'text-green-400 bg-green-400/10';
      case 'failed':
      case 'cancelled':
        return 'text-red-400 bg-red-400/10';
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (isLoading) {
    return (
      <div className="bg-gray-900/90 border border-yellow-500/20 rounded-lg p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-yellow-500 border-t-transparent"></div>
          <span className="ml-3 text-gray-300">Loading bookings...</span>
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="bg-gray-900/90 border border-yellow-500/20 rounded-lg p-8">
        <div className="text-center">
          <Ticket className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h3 className={`${lexend.className} text-lg text-gray-400 mb-2`}>
            No Bookings Found
          </h3>
          <p className={`${lexendSmall.className} text-gray-500`}>
            No bookings available for the selected date range.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/90 border border-yellow-500/20 rounded-lg">
      {/* Header */}
      <div className="p-6 border-b border-yellow-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="text-yellow-400" size={20} />
            <h3 className={`${lexend.className} text-lg text-yellow-400 font-medium`}>
              Recent Bookings
            </h3>
          </div>
          <div className="text-sm text-gray-400">
            Total: {totalBookings} bookings
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="p-6">
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-5 hover:border-yellow-500/30 transition-all duration-200"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left Section - User & Movie Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-yellow-500/20 p-2 rounded-lg">
                      <User className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <h4 className={`${lexend.className} text-white font-medium`}>
                        {booking.userId.firstName} {booking.userId.lastName}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {booking.userId.email}
                        </div>
                        {booking.userId.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {booking.userId.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                      <Ticket className="w-4 h-4 text-yellow-400" />
                      <span className="font-medium">{booking.movieId.title}</span>
                      <span className="text-gray-500">•</span>
                      <span>{booking.movieId.language}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-yellow-400" />
                      <span>{booking.screenId.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-yellow-400" />
                      <span>{formatDate(booking.showDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-400" />
                      <span>{formatTime(booking.showTime)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-400">
                      Seats: {booking.selectedSeats.join(', ')}
                    </span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-400">
                      Booking ID: {booking.bookingId}
                    </span>
                  </div>
                </div>

                {/* Right Section - Status & Amount */}
                <div className="flex flex-col lg:items-end gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.paymentStatus)}`}>
                      {getStatusIcon(booking.paymentStatus)}
                      {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.bookingStatus)}`}>
                      {getStatusIcon(booking.bookingStatus)}
                      {booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1)}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-2 text-lg font-semibold text-white">
                      <CreditCard className="w-4 h-4 text-yellow-400" />
                      ₹{booking.priceDetails.total.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400">
                      {booking.paymentMethod} • {formatDate(booking.bookedAt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-700/50">
            <div className="text-sm text-gray-400">
              Page {currentPage} of {totalPages}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPage === 1
                    ? 'bg-gray-700/30 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-800/50 text-gray-300 border border-yellow-500/30 hover:bg-gray-700/50 hover:border-yellow-500/50'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPage === totalPages
                    ? 'bg-gray-700/30 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-800/50 text-gray-300 border border-yellow-500/30 hover:bg-gray-700/50 hover:border-yellow-500/50'
                }`}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsListForAdmins;

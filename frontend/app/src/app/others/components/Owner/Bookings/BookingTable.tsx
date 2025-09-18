//@ts-nocheck

"use client";

import React from "react";
import { Mail, CreditCard, Check, X, Clock, User, RefreshCcw } from "lucide-react";

interface BookingTableProps {
  bookings: string[];
  isLoading: boolean;
  lexendMedium: string;
  lexendSmall: string;
}

const BookingTable: React.FC<BookingTableProps> = ({
  bookings,
  isLoading,
  lexendMedium,
  lexendSmall,
}) => {
  const totalRevenue = bookings
    .filter(booking => booking.bookingStatus !== 'cancelled')
    .reduce((sum, booking) => sum + (booking.priceDetails?.total || 0), 0);

  const confirmedBookings = bookings.filter(booking => booking.bookingStatus !== 'cancelled');
  const cancelledBookings = bookings.filter(booking => booking.bookingStatus === 'cancelled');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="w-4 h-4 text-green-400" />;
      case 'refunded':
        return <RefreshCcw className="w-4 h-4 text-orange-400" />;
      case 'failed':
        return <X className="w-4 h-4 text-red-400" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-500/20';
      case 'refunded':
        return 'text-orange-400 bg-orange-500/20';
      case 'failed':
        return 'text-red-400 bg-red-500/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getBookingStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-400 bg-green-500/20';
      case 'cancelled':
        return 'text-red-400 bg-red-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="grid grid-cols-6 gap-4">
                <div className="h-4 bg-gray-600 rounded"></div>
                <div className="h-4 bg-gray-600 rounded"></div>
                <div className="h-4 bg-gray-600 rounded"></div>
                <div className="h-4 bg-gray-600 rounded"></div>
                <div className="h-4 bg-gray-600 rounded"></div>
                <div className="h-4 bg-gray-600 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className={`${lexendMedium.className} text-lg text-white mb-2`}>
          No Bookings Found
        </h3>
        <p className={`${lexendSmall.className} text-gray-400`}>
          No bookings match your search criteria
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Revenue Summary - Only from confirmed bookings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-xl p-4">
          <div className="text-center">
            <p className={`${lexendSmall.className} text-green-300 text-sm`}>Active Revenue</p>
            <p className={`${lexendMedium.className} text-white text-2xl font-bold`}>
              ₹{totalRevenue.toLocaleString()}
            </p>
            <p className={`${lexendSmall.className} text-gray-400 text-xs`}>
              From {confirmedBookings.length} confirmed bookings
            </p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl p-4">
          <div className="text-center">
            <p className={`${lexendSmall.className} text-blue-300 text-sm`}>Total Bookings</p>
            <p className={`${lexendMedium.className} text-white text-2xl font-bold`}>
              {bookings.length}
            </p>
            <p className={`${lexendSmall.className} text-gray-400 text-xs`}>
              {confirmedBookings.length} confirmed + {cancelledBookings.length} cancelled
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl p-4">
          <div className="text-center">
            <p className={`${lexendSmall.className} text-orange-300 text-sm`}>Cancelled</p>
            <p className={`${lexendMedium.className} text-white text-2xl font-bold`}>
              {cancelledBookings.length}
            </p>
            <p className={`${lexendSmall.className} text-gray-400 text-xs`}>
              {cancelledBookings.length > 0 ? 
                `₹${cancelledBookings.reduce((sum, booking) => sum + (booking.priceDetails?.total || 0), 0).toLocaleString()} refunded` : 
                'No cancellations'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-7 gap-4 px-4 py-3 bg-white/5 rounded-lg">
        <div className={`${lexendSmall.className} text-gray-400 text-sm font-medium`}>
          Booking ID
        </div>
        <div className={`${lexendSmall.className} text-gray-400 text-sm font-medium`}>
          Customer
        </div>
        <div className={`${lexendSmall.className} text-gray-400 text-sm font-medium`}>
          Seats
        </div>
        <div className={`${lexendSmall.className} text-gray-400 text-sm font-medium`}>
          Amount
        </div>
        <div className={`${lexendSmall.className} text-gray-400 text-sm font-medium`}>
          Payment
        </div>
        <div className={`${lexendSmall.className} text-gray-400 text-sm font-medium`}>
          Status
        </div>
        <div className={`${lexendSmall.className} text-gray-400 text-sm font-medium`}>
          Date/Time
        </div>
      </div>

      {/* Table Rows */}
      {bookings.map((booking) => (
        <div 
          key={booking._id}
          className={`grid grid-cols-7 gap-4 px-4 py-4 rounded-lg hover:bg-white/10 transition-all duration-300 border ${
            booking.bookingStatus === 'cancelled' 
              ? 'bg-red-500/5 border-red-500/20' 
              : 'bg-white/5 border-gray-500/20'
          }`}
        >
          {/* Booking ID */}
          <div>
            <p className={`${lexendMedium.className} text-white text-sm mb-1`}>
              {booking.bookingId}
            </p>
            <p className={`${lexendSmall.className} text-gray-400 text-xs`}>
              {booking.paymentMethod || 'razorpay'}
            </p>
          </div>

          {/* Customer */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <User className="w-3 h-3 text-gray-400" />
              <p className={`${lexendMedium.className} text-white text-sm`}>
                {booking.userId?.email || booking.contactInfo?.email || 'N/A'}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Mail className="w-3 h-3 text-gray-400" />
              <p className={`${lexendSmall.className} text-gray-400 text-xs truncate`}>
                ID: {booking.userId?._id?.slice(-8) || 'N/A'}
              </p>
            </div>
          </div>

          {/* Seats */}
          <div>
            <div className="flex flex-wrap gap-1">
              {booking.selectedSeats?.map((seat: string) => (
                <span 
                  key={seat}
                  className={`${lexendSmall.className} px-2 py-1 rounded text-xs ${
                    booking.bookingStatus === 'cancelled'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}
                >
                  {seat}
                </span>
              )) || (
                <span className={`${lexendSmall.className} text-gray-400 text-xs`}>
                  No seats
                </span>
              )}
            </div>
            <p className={`${lexendSmall.className} text-gray-400 text-xs mt-1`}>
              {booking.selectedSeats?.length || 0} seat{(booking.selectedSeats?.length || 0) !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Amount */}
          <div>
            <p className={`${lexendMedium.className} text-sm font-bold ${
              booking.bookingStatus === 'cancelled' 
                ? 'text-red-400 line-through' 
                : 'text-green-400'
            }`}>
              ₹{booking.priceDetails?.total?.toLocaleString() || 0}
            </p>
            <div className={`${lexendSmall.className} text-gray-400 text-xs space-y-0.5`}>
              <div>Subtotal: ₹{booking.priceDetails?.subtotal || 0}</div>
              <div>Taxes: ₹{booking.priceDetails?.taxes || 0}</div>
              <div>Fee: ₹{booking.priceDetails?.convenienceFee || 0}</div>
             {booking.priceDetails?.discount&&<div>Discount: ₹{booking.priceDetails?.discount || 0}</div>} 
            </div>
          </div>

          {/* Payment Status */}
          <div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(booking.paymentStatus)}`}>
              {getStatusIcon(booking.paymentStatus)}
              <span className={`${lexendSmall.className} text-xs font-medium capitalize`}>
                {booking.paymentStatus}
              </span>
            </div>
          </div>

          {/* Booking Status */}
          <div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getBookingStatusColor(booking.bookingStatus)}`}>
              <span className={`${lexendSmall.className} text-xs font-medium capitalize`}>
                {booking.bookingStatus}
              </span>
            </div>
            {booking.bookingStatus === 'cancelled' && booking.cancelledAt && (
              <p className={`${lexendSmall.className} text-red-400 text-xs mt-1`}>
                Cancelled: {new Date(booking.cancelledAt).toLocaleDateString('en-IN', {
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            )}
          </div>

          {/* Date/Time */}
          <div>
            <p className={`${lexendSmall.className} text-white text-sm`}>
              {new Date(booking.bookedAt).toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
            <p className={`${lexendSmall.className} text-gray-400 text-xs`}>
              {new Date(booking.bookedAt).toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      ))}

      {/* Summary Footer */}
      <div className="bg-white/5 rounded-lg p-4 border-t-2 border-green-500/50">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className={`${lexendSmall.className} text-gray-400 text-sm`}>Confirmed</p>
            <p className={`${lexendMedium.className} text-green-400 text-lg`}>{confirmedBookings.length}</p>
          </div>
          <div>
            <p className={`${lexendSmall.className} text-gray-400 text-sm`}>Cancelled</p>
            <p className={`${lexendMedium.className} text-red-400 text-lg`}>{cancelledBookings.length}</p>
          </div>
          <div>
            <p className={`${lexendSmall.className} text-gray-400 text-sm`}>Seats Sold</p>
            <p className={`${lexendMedium.className} text-white text-lg`}>
              {confirmedBookings.reduce((sum, booking) => sum + (booking.selectedSeats?.length || 0), 0)}
            </p>
          </div>
          <div>
            <p className={`${lexendSmall.className} text-gray-400 text-sm`}>Active Revenue</p>
            <p className={`${lexendMedium.className} text-green-400 text-lg font-bold`}>
              ₹{totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingTable;

// components/BookingsList.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, DollarSign, Search, Filter, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { lexendBold, lexendSmall } from '@/app/others/Utils/fonts';
import { useDebounce } from '@/app/others/Utils/debounce';


interface Booking {
  _id: string;
  userId: string;
  movieTitle: string;
  screenName: string;
  showtime: string;
  seatNumbers: string[];
  totalAmount: number;
  paymentStatus: string;
  bookingStatus: string;
  createdAt: string;
}

interface BookingsListProps {
  theaterId: string;
  ownerId: string;
  theaterName: string;
}

const BookingsList: React.FC<BookingsListProps> = ({ theaterId, ownerId, theaterName }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const debouncedSearch = useDebounce(
    (term) => {
      setCurrentPage(1);
      fetchBookings({ search: term, status: statusFilter, page: 1 });
    },
    500
  );

  const fetchBookings = async (filters: any = {}) => {
    try {
      setIsLoading(true);
      
      // Mock data for demonstration - replace with actual API call
      const mockBookings = [
        {
          _id: 'book_001',
          userId: 'user_001',
          movieTitle: 'Avengers: Endgame',
          screenName: 'Screen 1',
          showtime: '2025-09-10T19:00:00Z',
          seatNumbers: ['A1', 'A2'],
          totalAmount: 500,
          paymentStatus: 'completed',
          bookingStatus: 'confirmed',
          createdAt: '2025-09-10T15:30:00Z'
        },
        {
          _id: 'book_002',
          userId: 'user_002',
          movieTitle: 'Spider-Man: No Way Home',
          screenName: 'Screen 2',
          showtime: '2025-09-10T21:00:00Z',
          seatNumbers: ['B5', 'B6', 'B7'],
          totalAmount: 750,
          paymentStatus: 'completed',
          bookingStatus: 'confirmed',
          createdAt: '2025-09-10T16:45:00Z'
        }
      ];

      setBookings(mockBookings);
      setTotalItems(mockBookings.length);
      setTotalPages(Math.ceil(mockBookings.length / itemsPerPage));
      
      const response = await getTheaterBookingsAp({
        theaterId,
        ownerId,
        ...filters,
        page: currentPage,
        limit: itemsPerPage
      });
      setBookings(response.data.bookings);
      setTotalItems(response.data.totalCount);
      setTotalPages(response.data.totalPages);
      
    } catch (error: any) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings");
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [theaterId, ownerId]);

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
    fetchBookings({ search: searchTerm, status, page: 1 });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-900/30 text-green-400';
      case 'cancelled': return 'bg-red-900/30 text-red-400';
      case 'pending': return 'bg-yellow-900/30 text-yellow-400';
      default: return 'bg-gray-900/30 text-gray-400';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-900/30 text-green-400';
      case 'failed': return 'bg-red-900/30 text-red-400';
      case 'pending': return 'bg-yellow-900/30 text-yellow-400';
      default: return 'bg-gray-900/30 text-gray-400';
    }
  };

  return (
    <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-600">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className={`${lexendBold.className} text-xl font-bold text-white`}>
              Recent Bookings
            </h2>
            <p className={`${lexendSmall.className} text-gray-400 mt-1`}>
              Bookings for {theaterName} • {totalItems} total bookings
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by movie, user ID, or booking ID..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  debouncedSearch(e.target.value);
                }}
                className="w-full pl-10 pr-4 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#e78f03]"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#e78f03]"
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-[#e78f03] animate-spin" />
            <div className="ml-3 text-gray-400">Loading bookings...</div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-500 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No bookings found</h3>
            <p className="text-gray-400">
              {searchTerm 
                ? `No bookings found matching "${searchTerm}"` 
                : "No bookings found for this theater"
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-[#2a2a2a] border border-gray-600 rounded-lg p-4 hover:border-gray-500 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className={`${lexendSmall.className} text-lg font-semibold text-white`}>
                        {booking.movieTitle}
                      </h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(booking.bookingStatus)}`}>
                        {booking.bookingStatus}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getPaymentStatusColor(booking.paymentStatus)}`}>
                        {booking.paymentStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Calendar size={16} className="text-gray-400" />
                        <span className={`${lexendSmall.className} text-sm`}>
                          {new Date(booking.showtime).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <Clock size={16} className="text-gray-400" />
                        <span className={`${lexendSmall.className} text-sm`}>
                          {new Date(booking.showtime).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <Users size={16} className="text-gray-400" />
                        <span className={`${lexendSmall.className} text-sm`}>
                          {booking.seatNumbers.join(', ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <DollarSign size={16} className="text-gray-400" />
                        <span className={`${lexendSmall.className} text-sm font-semibold text-[#e78f03]`}>
                          ₹{booking.totalAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div className="text-sm text-gray-400">
                      <span>Booking ID: {booking._id}</span>
                      <span className="mx-2">•</span>
                      <span>Screen: {booking.screenName}</span>
                      <span className="mx-2">•</span>
                      <span>Booked: {new Date(booking.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsList;

'use client'
import React, { useState, useEffect } from 'react';
import { Calendar, Download, TrendingUp, Users, Film, MapPin } from 'lucide-react';
import { Lexend } from 'next/font/google';
import apiClient from '@/app/others/Utils/apiClient';
import * as XLSX from 'xlsx';
import TheaterRevenueAnalytics from './TheaterRevenue';
import OwnerRevenueAnalytics from './OwnerRevenue';
import MovieSalesAnalytics from './MovieSalesAnalytics';
import DateRangeFilter from './DateRange';
import PerformanceMetrics from './PerformanceMetrics';
import RevenueTrendChart from './RevenueTrend';

const lexend = Lexend({ subsets: ['latin'] });

interface BookingData {
  _id: string;
  bookingId: string;
  userId: string;
  movieId: {
    _id: string;
    title: string;
    genre: string[];
    language: string;
    rating?: string;
    poster?: string;
    duration?: number;
    director?: string;
    releaseDate?: string;
  };
  theaterId: {
    _id: string;
    name: string;
    city: string;
    ownerId: string;
  };
  priceDetails: {
    total: number;
    subtotal: number;
    taxes: number;
    convenienceFee: number;
  };
  bookedAt: string;
  paymentStatus: string;
  bookingStatus: string;
  selectedSeats: string[];
}

const AdminAnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState<BookingData[]>([]);
  const [filteredData, setFilteredData] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  useEffect(() => {
    filterDataByDate();
  }, [dateRange, analyticsData]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/admin/analytics/data/analytics');
      console.log('ok', response.data.data);
      
      setAnalyticsData(response.data.data);
      setFilteredData(response.data.data);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterDataByDate = () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      setFilteredData(analyticsData);
      return;
    }

    const filtered = analyticsData.filter(booking => {
      const bookingDate = new Date(booking.bookedAt);
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      return bookingDate >= start && bookingDate <= end;
    });

    setFilteredData(filtered);
  };

  const exportToExcel = () => {
    const exportData = filteredData.map(booking => ({
      'Booking ID': booking.bookingId,
      'Movie': booking.movieId.title,
      'Theater': booking.theaterId.name,
      'City': booking.theaterId.city,
      'Booked At': new Date(booking.bookedAt).toLocaleDateString(),
      'Total Amount': booking.priceDetails.total,
      'Payment Status': booking.paymentStatus,
      'Booking Status': booking.bookingStatus,
      'Seats Count': booking.selectedSeats.length
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Analytics Data');
    
    const fileName = `analytics_${dateRange.startDate || 'all'}_to_${dateRange.endDate || 'all'}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const totalRevenue = filteredData.reduce((sum, booking) => 
    sum + (booking.paymentStatus === 'completed' ? booking.priceDetails.total : 0), 0
  );

  const totalBookings = filteredData.length;
  const uniqueUsers = new Set(filteredData.map(b => b.userId)).size;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`${lexend.className} text-3xl text-white font-bold mb-2`}>
              Analytics Dashboard
            </h1>
            <p className="text-gray-400">Comprehensive booking analytics and insights</p>
          </div>
          
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-6 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-xl transition-all duration-300"
            style={{ fontFamily: lexend.style.fontFamily }}
          >
            <Download className="w-5 h-5" />
            Export to Excel
          </button>
        </div>

        {/* Date Filter */}
        <div className="mb-8">
          <DateRangeFilter
            dateRange={dateRange} 
            setDateRange={setDateRange}
            lexend={lexend}
          />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800/50 border border-yellow-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className={`${lexend.className} text-lg text-white font-semibold`}>
                  Total Revenue
                </h3>
              </div>
            </div>
            <p className={`${lexend.className} text-3xl text-yellow-400 font-bold`}>
              ₹{totalRevenue.toLocaleString()}
            </p>
          </div>

          <div className="bg-gray-800/50 border border-green-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Film className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className={`${lexend.className} text-lg text-white font-semibold`}>
                  Total Bookings
                </h3>
              </div>
            </div>
            <p className={`${lexend.className} text-3xl text-green-400 font-bold`}>
              {totalBookings.toLocaleString()}
            </p>
          </div>

          <div className="bg-gray-800/50 border border-blue-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className={`${lexend.className} text-lg text-white font-semibold`}>
                  Unique Users
                </h3>
              </div>
            </div>
            <p className={`${lexend.className} text-3xl text-blue-400 font-bold`}>
              {uniqueUsers.toLocaleString()}
            </p>
          </div>
        </div>

        {/* NEW: Revenue Trend and Performance Metrics Row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* <RevenueTrendChart data={filteredData} /> */}
          <PerformanceMetrics data={filteredData} />
        </div>

        {/* Analytics Components */}
        <div className="space-y-8">
          <TheaterRevenueAnalytics data={filteredData} lexend={lexend} />
          <OwnerRevenueAnalytics data={filteredData} lexend={lexend} />
          <MovieSalesAnalytics data={filteredData} lexend={lexend} />
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsDashboard;

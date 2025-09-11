// components/TheaterAnalytics.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { Lexend } from "next/font/google";
import { 
  DollarSign, 
  Users, 
  Ticket, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Loader2, 
  CalendarIcon,
  Filter,
  Building,
  MapPin,
  BarChart3,
} from 'lucide-react';
import toast from 'react-hot-toast';
import BookingsList from './BookingsList';
import RevenueCards from './RevenueCards';
import { getTheaterWiseRevenueApi } from '@/app/others/services/commonServices/analyticServices';

const lexend = Lexend({
  weight: "500",
  subsets: ["latin"],
});

const lexendSmall = Lexend({
  weight: "300",
  subsets: ["latin"],
});

interface Owner {
  _id: string;
  name: string;
}

interface Theater {
  _id: string;
  name: string;
  city: string;
  state: string;
}

interface TheaterAnalyticsProps {
  selectedTheater: Theater;
  selectedOwner: Owner;
}

interface AnalyticsData {
  totalRevenue: number;
  totalBookings: number;
  avgTicketPrice: number;
  marketShare: number;
}

interface CustomDateRange {
  startDate: string;
  endDate: string;
}

const TheaterAnalytics: React.FC<TheaterAnalyticsProps> = ({ selectedTheater, selectedOwner }) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState('month');
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [customDateRange, setCustomDateRange] = useState<CustomDateRange>({
    startDate: '',
    endDate: ''
  });

  const getDateRange = () => {
    const endDate = new Date().toISOString().split('T')[0];
    let startDate = new Date();
    
    if (dateFilter === 'custom') {
      return {
        startDate: customDateRange.startDate,
        endDate: customDateRange.endDate
      };
    }
    
    switch (dateFilter) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 1);
    }

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate
    };
  };

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      
      const { startDate, endDate } = getDateRange();

      // Validate custom date range
      if (dateFilter === 'custom') {
        if (!startDate || !endDate) {
          toast.error("Please select both start and end dates");
          setIsLoading(false);
          return;
        }
        if (new Date(startDate) > new Date(endDate)) {
          toast.error("Start date cannot be later than end date");
          setIsLoading(false);
          return;
        }
      }

      const response = await getTheaterWiseRevenueApi({
        ownerId: selectedOwner.id,
        theaterId: selectedTheater.id,
        startDate: startDate,
        endDate: endDate
      });

      console.log('the response for the getTheaterWiseRevenueApi', response.data);
      
      const theaterData = response.data?.find((theater: any) => theater.theaterId === selectedTheater._id);
      
      if (theaterData) {
        setAnalyticsData({
          totalRevenue: theaterData.totalRevenue,
          totalBookings: theaterData.totalBookings,
          avgTicketPrice: theaterData.avgTicketPrice,
          marketShare: theaterData.marketShare
        });
      } else {
        setAnalyticsData({
          totalRevenue: 0,
          totalBookings: 0,
          avgTicketPrice: 0,
          marketShare: 0
        });
        
        if (response.data?.length === 0) {
          toast.info("No data available for the selected date range");
        }
      }
    } catch (error: any) {
      console.error("Error fetching analytics:", error);
      toast.error("No data available for these time ranges");
      
      setAnalyticsData({
        totalRevenue: 0,
        totalBookings: 0,
        avgTicketPrice: 0,
        marketShare: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomDateRangeApply = () => {
    if (!customDateRange.startDate || !customDateRange.endDate) {
      toast.error("Please select both start and end dates");
      return;
    }
    if (new Date(customDateRange.startDate) > new Date(customDateRange.endDate)) {
      toast.error("Start date cannot be later than end date");
      return;
    }
    
    setDateFilter('custom');
    setShowCustomDatePicker(false);
    fetchAnalytics();
  };

  const handlePresetFilterChange = (period: string) => {
    setDateFilter(period);
    if (period !== 'custom') {
      setShowCustomDatePicker(false);
    }
  };

  const formatDisplayDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getFilterDisplayText = () => {
    if (dateFilter === 'custom' && customDateRange.startDate && customDateRange.endDate) {
      return `${formatDisplayDate(customDateRange.startDate)} - ${formatDisplayDate(customDateRange.endDate)}`;
    }
    return dateFilter.charAt(0).toUpperCase() + dateFilter.slice(1);
  };

  useEffect(() => {
    if (dateFilter !== 'custom') {
      fetchAnalytics();
    }
  }, [selectedTheater._id, selectedOwner._id, dateFilter]);

  if (isLoading) {
    return (
      <div className="bg-gray-900/90 border border-yellow-500/20 rounded-lg shadow-2xl p-12">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-3 border-yellow-500 border-t-transparent"></div>
          <p className="text-gray-300 text-sm">Loading theater analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Theater Info */}
      <div className="bg-gray-900/90 border border-yellow-500/20 rounded-lg shadow-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-500/20 p-3 rounded-lg">
              <Building className="w-8 h-8 text-yellow-400" />
            </div>
            <div>
              <h2 className={`${lexend.className} text-2xl text-yellow-400 font-medium`}>
                {selectedTheater.name}
              </h2>
              <div className="flex items-center gap-2 text-gray-300 mt-1">
                <MapPin size={14} />
                <span className={`${lexendSmall.className} text-sm`}>
                  {selectedTheater.city}, {selectedTheater.state}
                </span>
                <span className="text-gray-500">•</span>
                <span className={`${lexendSmall.className} text-sm`}>
                  Owner: {selectedOwner.name}
                </span>
              </div>
            </div>
          </div>
          
          {/* Date Filter Buttons */}
          <div className="flex gap-2 flex-wrap">
            {['week', 'month', 'quarter', 'year'].map((period) => (
              <button
                key={period}
                onClick={() => handlePresetFilterChange(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  dateFilter === period
                    ? 'bg-yellow-500 hover:bg-yellow-400 text-black'
                    : 'bg-gray-800/50 text-gray-300 border border-yellow-500/30 hover:bg-gray-700/50 hover:border-yellow-500/50'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
            
            <button
              onClick={() => setShowCustomDatePicker(!showCustomDatePicker)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                dateFilter === 'custom'
                  ? 'bg-yellow-500 hover:bg-yellow-400 text-black'
                  : 'bg-gray-800/50 text-gray-300 border border-yellow-500/30 hover:bg-gray-700/50 hover:border-yellow-500/50'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              {dateFilter === 'custom' ? getFilterDisplayText() : 'Custom'}
            </button>
          </div>
        </div>

        {/* Custom Date Range Picker */}
        {showCustomDatePicker && (
          <div className="bg-gray-800/50 border border-yellow-500/20 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Filter className="text-yellow-400" size={20} />
              <h3 className={`${lexend.className} text-lg text-yellow-400 font-medium`}>
                Custom Date Range
              </h3>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className={`${lexendSmall.className} block text-sm font-medium text-gray-300 mb-2`}>
                  From Date
                </label>
                <input
                  type="date"
                  value={customDateRange.startDate}
                  onChange={(e) => setCustomDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-yellow-500/30 rounded-lg text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 transition-all duration-200"
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="flex-1">
                <label className={`${lexendSmall.className} block text-sm font-medium text-gray-300 mb-2`}>
                  To Date
                </label>
                <input
                  type="date"
                  value={customDateRange.endDate}
                  onChange={(e) => setCustomDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-yellow-500/30 rounded-lg text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 transition-all duration-200"
                  min={customDateRange.startDate}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={handleCustomDateRangeApply}
                  className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg font-medium transition-all duration-200"
                >
                  Apply
                </button>
                <button
                  onClick={() => setShowCustomDatePicker(false)}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-gray-700/30 rounded-lg">
              <div className="flex flex-wrap gap-2 items-center">
                <span className={`${lexendSmall.className} text-sm text-gray-400 mr-2`}>Quick select:</span>
                {[
                  { label: 'Last 7 days', days: 7 },
                  { label: 'Last 30 days', days: 30 },
                  { label: 'Last 90 days', days: 90 },
                ].map((preset) => (
                  <button
                    key={preset.days}
                    onClick={() => {
                      const endDate = new Date();
                      const startDate = new Date();
                      startDate.setDate(endDate.getDate() - preset.days);
                      
                      setCustomDateRange({
                        startDate: startDate.toISOString().split('T')[0],
                        endDate: endDate.toISOString().split('T')[0]
                      });
                    }}
                    className="px-3 py-1 text-xs bg-gray-600/50 text-gray-300 rounded border border-yellow-500/20 hover:border-yellow-500/40 hover:bg-gray-600/70 transition-all duration-200"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Analytics Content */}
      <div className="bg-gray-900/90 border border-yellow-500/20 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="text-yellow-400" size={20} />
          <h3 className={`${lexend.className} text-lg text-yellow-400 font-medium`}>
            Revenue Analytics
          </h3>
        </div>
        
        <RevenueCards analyticsData={analyticsData} />
      </div>
    </div>
  );
};

export default TheaterAnalytics;

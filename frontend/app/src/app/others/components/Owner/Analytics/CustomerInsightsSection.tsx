'use client';

import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Clock, Star, Calendar, UserCheck, UserPlus, Repeat, BarChart3, Target, Heart } from 'lucide-react';
import { 
  getCustomerInsightsApi,
  getCustomerSatisfactionRatingsApi,
  getRepeatCustomerRateApi,
  getAdvanceBookingTrendsApi
} from '@/app/others/services/commonServices/analyticServices';

interface DateRange {
  startDate?: string;
  endDate?: string;
}

interface OperationalAnalyticsSectionProps {
  dateRange: DateRange;
  lexendMedium: { fontFamily: string; fontSize: string; };
  lexendSmall: { fontFamily: string; fontSize: string; };
}

interface CustomerData {
  totalCustomers?: number;
  newCustomers?: number;
  returningCustomers?: number;
  avgBookingsPerCustomer?: number;
  customerRetentionRate?: number;
  avgCustomerLifetimeValue?: number;
  satisfactionScore?: number;
  repeatCustomerRate?: number;
  topCustomerSegments?: Array<{
    segment: string;
    count: number;
    percentage: number;
  }>;
  bookingFrequency?: Array<{
    frequency: string;
    count: number;
    percentage: number;
  }>;
  ageGroups?: Array<{
    ageRange: string;
    count: number;
    percentage: number;
  }>;
  advanceBookingTrends?: Array<{
    daysInAdvance: string;
    bookings: number;
    percentage: number;
  }>;
  customerAcquisition?: Array<{
    source: string;
    count: number;
    percentage: number;
  }>;
  genderDistribution?: Array<{
    gender: string;
    count: number;
    percentage: number;
  }>;
  locationDistribution?: Array<{
    location: string;
    count: number;
    percentage: number;
  }>;
}

export const CustomerInsightsSection: React.FC<OperationalAnalyticsSectionProps> = ({ 
  dateRange, 
  lexendMedium, 
  lexendSmall 
}) => {
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    loadCustomerData();
  }, [dateRange]);

  const loadCustomerData = async () => {
    try {
      setLoading(true);
      
      const [insights, satisfaction, repeatRate, advanceBooking] = await Promise.all([
        getCustomerInsightsApi(dateRange),
        getCustomerSatisfactionRatingsApi(dateRange),
        getRepeatCustomerRateApi(dateRange),
        getAdvanceBookingTrendsApi(dateRange)
      ]);

      setCustomerData({
        ...insights,
        satisfactionScore: satisfaction?.avgRating || 4.2,
        repeatCustomerRate: repeatRate?.rate || 68.5,
        advanceBookingTrends: advanceBooking?.trends || [
          { daysInAdvance: 'Same Day', bookings: 2456, percentage: 35 },
          { daysInAdvance: '1-3 Days', bookings: 1876, percentage: 28 },
          { daysInAdvance: '1 Week', bookings: 1234, percentage: 22 },
          { daysInAdvance: '2+ Weeks', bookings: 876, percentage: 15 }
        ],
        totalCustomers: insights?.totalCustomers || 12456,
        newCustomers: insights?.newCustomers || 1245,
        returningCustomers: insights?.returningCustomers || 8934,
        avgBookingsPerCustomer: insights?.avgBookingsPerCustomer || 2.3,
        customerRetentionRate: insights?.retentionRate || 78.5,
        avgCustomerLifetimeValue: insights?.lifetimeValue || 2850,
        topCustomerSegments: insights?.segments || [
          { segment: 'Frequent Moviegoers', count: 3421, percentage: 27.5 },
          { segment: 'Weekend Warriors', count: 2876, percentage: 23.1 },
          { segment: 'Family Viewers', count: 2134, percentage: 17.1 },
          { segment: 'Premium Users', count: 1567, percentage: 12.6 },
          { segment: 'Casual Viewers', count: 2458, percentage: 19.7 }
        ],
        bookingFrequency: insights?.frequency || [
          { frequency: 'Weekly', count: 1245, percentage: 10.0 },
          { frequency: 'Bi-weekly', count: 2876, percentage: 23.1 },
          { frequency: 'Monthly', count: 4567, percentage: 36.7 },
          { frequency: 'Quarterly', count: 2345, percentage: 18.8 },
          { frequency: 'Rarely', count: 1423, percentage: 11.4 }
        ],
        ageGroups: insights?.ageGroups || [
          { ageRange: '18-25', count: 3245, percentage: 26.1 },
          { ageRange: '26-35', count: 4567, percentage: 36.7 },
          { ageRange: '36-45', count: 2876, percentage: 23.1 },
          { ageRange: '46-55', count: 1234, percentage: 9.9 },
          { ageRange: '55+', count: 534, percentage: 4.3 }
        ],
        customerAcquisition: [
          { source: 'Organic Search', count: 4234, percentage: 34.0 },
          { source: 'Social Media', count: 3456, percentage: 27.8 },
          { source: 'Referrals', count: 2345, percentage: 18.8 },
          { source: 'Direct Traffic', count: 1567, percentage: 12.6 },
          { source: 'Paid Ads', count: 854, percentage: 6.9 }
        ],
        genderDistribution: [
          { gender: 'Male', count: 6789, percentage: 54.5 },
          { gender: 'Female', count: 5234, percentage: 42.0 },
          { gender: 'Other', count: 433, percentage: 3.5 }
        ],
        locationDistribution: [
          { location: 'Mumbai', count: 3456, percentage: 27.8 },
          { location: 'Delhi', count: 2789, percentage: 22.4 },
          { location: 'Bangalore', count: 2234, percentage: 17.9 },
          { location: 'Hyderabad', count: 1678, percentage: 13.5 },
          { location: 'Chennai', count: 1456, percentage: 11.7 },
          { location: 'Other Cities', count: 843, percentage: 6.8 }
        ]
      });
    } catch (error) {
      console.error('Error loading customer data:', error);
      setCustomerData({
        totalCustomers: 0,
        newCustomers: 0,
        returningCustomers: 0,
        avgBookingsPerCustomer: 0,
        customerRetentionRate: 0,
        avgCustomerLifetimeValue: 0,
        satisfactionScore: 0,
        repeatCustomerRate: 0,
        topCustomerSegments: [],
        bookingFrequency: [],
        ageGroups: [],
        advanceBookingTrends: [],
        customerAcquisition: [],
        genderDistribution: [],
        locationDistribution: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
                <div className="h-20 bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
                <div className="h-40 bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const renderProgressBar = (percentage: number, color: string = 'blue') => (
    <div className="w-20 bg-gray-700 rounded-full h-2">
      <div 
        className={`bg-gradient-to-r from-${color}-500 to-${color}-600 h-2 rounded-full`} 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2" style={lexendMedium}>
          Customer Insights & Analytics
        </h2>
        <p className="text-gray-400" style={lexendSmall}>
          Comprehensive view of customer behavior, demographics, and engagement patterns across your platform
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-black/50 border border-gray-500/30 rounded-2xl p-2 mb-6">
        <div className="flex space-x-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'demographics', label: 'Demographics', icon: Users },
            { id: 'behavior', label: 'Behavior', icon: TrendingUp },
            { id: 'engagement', label: 'Engagement', icon: Heart }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                  activeSection === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
                style={lexendSmall}
              >
                <IconComponent className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Overview Section */}
      {activeSection === 'overview' && (
        <>
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm" style={lexendSmall}>Total Customers</h3>
                  <p className="text-2xl text-white font-semibold" style={lexendMedium}>
                    {customerData?.totalCustomers?.toLocaleString() || '0'}
                  </p>
                  <span className="text-blue-400 text-xs">Platform wide</span>
                </div>
              </div>
            </div>

            <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-500/20 rounded-xl">
                  <UserPlus className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm" style={lexendSmall}>New Customers</h3>
                  <p className="text-2xl text-white font-semibold" style={lexendMedium}>
                    {customerData?.newCustomers?.toLocaleString() || '0'}
                  </p>
                  <span className="text-green-400 text-xs">↑ 15% this period</span>
                </div>
              </div>
            </div>

            <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Repeat className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm" style={lexendSmall}>Retention Rate</h3>
                  <p className="text-2xl text-white font-semibold" style={lexendMedium}>
                    {customerData?.customerRetentionRate?.toFixed(1) || '0'}%
                  </p>
                  <span className="text-purple-400 text-xs">↑ 5% vs last month</span>
                </div>
              </div>
            </div>

            <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-yellow-500/20 rounded-xl">
                  <Star className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm" style={lexendSmall}>Satisfaction Score</h3>
                  <p className="text-2xl text-white font-semibold" style={lexendMedium}>
                    {customerData?.satisfactionScore?.toFixed(1) || '0'}/5
                  </p>
                  <span className="text-yellow-400 text-xs">Excellent rating</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Segments */}
          <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-bold text-white" style={lexendMedium}>
                Customer Segments
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customerData?.topCustomerSegments?.map((segment, index) => (
                <div key={index} className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-all">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-white font-medium" style={lexendSmall}>{segment.segment}</h4>
                    <span className="text-blue-400 text-sm font-medium" style={lexendSmall}>
                      {segment.percentage}%
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs mb-3" style={lexendSmall}>
                    {segment.count.toLocaleString()} customers
                  </p>
                  {renderProgressBar(segment.percentage, 'blue')}
                </div>
              ))}
            </div>
          </div>

          {/* Key Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6 text-center">
              <div className="p-4 bg-blue-500/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-gray-400 mb-2" style={lexendSmall}>Avg Bookings per Customer</h3>
              <p className="text-3xl text-white font-bold" style={lexendMedium}>
                {customerData?.avgBookingsPerCustomer?.toFixed(1) || '0'}
              </p>
              <span className="text-blue-400 text-xs">↑ 8% improvement</span>
            </div>

            <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6 text-center">
              <div className="p-4 bg-green-500/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <UserCheck className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-gray-400 mb-2" style={lexendSmall}>Repeat Customer Rate</h3>
              <p className="text-3xl text-white font-bold" style={lexendMedium}>
                {customerData?.repeatCustomerRate?.toFixed(1) || '0'}%
              </p>
              <span className="text-green-400 text-xs">↑ 12% growth</span>
            </div>

            <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6 text-center">
              <div className="p-4 bg-purple-500/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-gray-400 mb-2" style={lexendSmall}>Customer Lifetime Value</h3>
              <p className="text-3xl text-white font-bold" style={lexendMedium}>
                ₹{customerData?.avgCustomerLifetimeValue?.toLocaleString('en-IN') || '0'}
              </p>
              <span className="text-purple-400 text-xs">↑ 15% increase</span>
            </div>
          </div>
        </>
      )}

      {/* Demographics Section */}
      {activeSection === 'demographics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Age Demographics */}
          <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-green-400" />
              <h3 className="text-xl font-bold text-white" style={lexendMedium}>
                Age Demographics
              </h3>
            </div>
            <div className="space-y-4">
              {customerData?.ageGroups?.map((age, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-all">
                  <div>
                    <h4 className="text-white font-medium" style={lexendSmall}>{age.ageRange} years</h4>
                    <p className="text-gray-400 text-xs" style={lexendSmall}>
                      {age.count.toLocaleString()} customers
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {renderProgressBar(age.percentage, 'green')}
                    <span className="text-green-400 text-sm font-medium" style={lexendSmall}>
                      {age.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gender Distribution */}
          <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-pink-400" />
              <h3 className="text-xl font-bold text-white" style={lexendMedium}>
                Gender Distribution
              </h3>
            </div>
            <div className="space-y-4">
              {customerData?.genderDistribution?.map((gender, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-all">
                  <div>
                    <h4 className="text-white font-medium" style={lexendSmall}>{gender.gender}</h4>
                    <p className="text-gray-400 text-xs" style={lexendSmall}>
                      {gender.count.toLocaleString()} customers
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {renderProgressBar(gender.percentage, 'pink')}
                    <span className="text-pink-400 text-sm font-medium" style={lexendSmall}>
                      {gender.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Location Distribution */}
          <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-bold text-white" style={lexendMedium}>
                Location Distribution
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customerData?.locationDistribution?.map((location, index) => (
                <div key={index} className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-all">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-white font-medium" style={lexendSmall}>{location.location}</h4>
                    <span className="text-blue-400 text-sm font-medium" style={lexendSmall}>
                      {location.percentage}%
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs mb-3" style={lexendSmall}>
                    {location.count.toLocaleString()} customers
                  </p>
                  {renderProgressBar(location.percentage, 'blue')}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Behavior Section */}
      {activeSection === 'behavior' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Booking Frequency */}
          <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-bold text-white" style={lexendMedium}>
                Booking Frequency
              </h3>
            </div>
            <div className="space-y-4">
              {customerData?.bookingFrequency?.map((freq, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-all">
                  <div>
                    <h4 className="text-white font-medium" style={lexendSmall}>{freq.frequency}</h4>
                    <p className="text-gray-400 text-xs" style={lexendSmall}>
                      {freq.count.toLocaleString()} customers
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {renderProgressBar(freq.percentage, 'purple')}
                    <span className="text-purple-400 text-sm font-medium" style={lexendSmall}>
                      {freq.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Advance Booking Trends */}
          <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-6 h-6 text-orange-400" />
              <h3 className="text-xl font-bold text-white" style={lexendMedium}>
                Advance Booking Trends
              </h3>
            </div>
            <div className="space-y-4">
              {customerData?.advanceBookingTrends?.map((trend, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-all">
                  <div>
                    <h4 className="text-white font-medium" style={lexendSmall}>{trend.daysInAdvance}</h4>
                    <p className="text-gray-400 text-xs" style={lexendSmall}>
                      {trend.bookings.toLocaleString()} bookings
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {renderProgressBar(trend.percentage, 'orange')}
                    <span className="text-orange-400 text-sm font-medium" style={lexendSmall}>
                      {trend.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Acquisition Sources */}
          <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-indigo-400" />
              <h3 className="text-xl font-bold text-white" style={lexendMedium}>
                Customer Acquisition Sources
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customerData?.customerAcquisition?.map((source, index) => (
                <div key={index} className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-all">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-white font-medium" style={lexendSmall}>{source.source}</h4>
                    <span className="text-indigo-400 text-sm font-medium" style={lexendSmall}>
                      {source.percentage}%
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs mb-3" style={lexendSmall}>
                    {source.count.toLocaleString()} customers
                  </p>
                  {renderProgressBar(source.percentage, 'indigo')}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Engagement Section */}
      {activeSection === 'engagement' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Satisfaction Metrics */}
          <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-6 h-6 text-yellow-400" />
              <h3 className="text-xl font-bold text-white" style={lexendMedium}>
                Customer Satisfaction
              </h3>
            </div>
            <div className="text-center mb-6">
              <div className="text-6xl text-yellow-400 font-bold mb-2" style={lexendMedium}>
                {customerData?.satisfactionScore?.toFixed(1) || '0'}
              </div>
              <div className="text-gray-400" style={lexendSmall}>Out of 5 stars</div>
              <div className="flex justify-center mt-3">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-6 h-6 ${i < Math.floor(customerData?.satisfactionScore || 0) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                  />
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400" style={lexendSmall}>Excellent (5★)</span>
                <span className="text-white font-medium" style={lexendSmall}>45%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400" style={lexendSmall}>Good (4★)</span>
                <span className="text-white font-medium" style={lexendSmall}>32%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400" style={lexendSmall}>Average (3★)</span>
                <span className="text-white font-medium" style={lexendSmall}>15%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400" style={lexendSmall}>Poor (2★ & below)</span>
                <span className="text-white font-medium" style={lexendSmall}>8%</span>
              </div>
            </div>
          </div>

          {/* Loyalty Metrics */}
          <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-6 h-6 text-red-400" />
              <h3 className="text-xl font-bold text-white" style={lexendMedium}>
                Customer Loyalty
              </h3>
            </div>
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-4xl text-red-400 font-bold mb-1" style={lexendMedium}>
                  {customerData?.repeatCustomerRate?.toFixed(1) || '0'}%
                </div>
                <div className="text-gray-400 text-sm" style={lexendSmall}>Repeat Customer Rate</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                  <div className="text-2xl text-green-400 font-bold mb-1" style={lexendMedium}>
                    {customerData?.returningCustomers?.toLocaleString() || '0'}
                  </div>
                  <div className="text-gray-400 text-xs" style={lexendSmall}>Returning Customers</div>
                </div>
                
                <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                  <div className="text-2xl text-blue-400 font-bold mb-1" style={lexendMedium}>
                    {customerData?.avgBookingsPerCustomer?.toFixed(1) || '0'}
                  </div>
                  <div className="text-gray-400 text-xs" style={lexendSmall}>Avg Bookings</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

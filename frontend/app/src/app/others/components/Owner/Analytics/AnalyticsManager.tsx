import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown, BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react';
import { getAnalyticsSummaryApi } from '@/app/others/services/commonServices/analyticServices';
import { OperationalAnalyticsSection } from './OperationalAnalyticsSection';
import { RevenueAnalyticsSection } from './RevenueAnalyticsSection';
import { FinancialKPIsSection } from './FinancialKPIsSection';
import { MovieAnalyticsSection } from './MovieAnalyticsSection';
import { PerformanceMetricsSection } from './PerformanceMetricsSection';
import { TimeRangeFilter } from './TimeRangeFilter';
import { FormatPieChart, RevenueAreaChart } from './Charts';
import { CustomerInsightsSection } from './CustomerInsightsSection';


const lexendMedium = { fontFamily: 'Lexend', fontWeight: '500' };
const lexendSmall = { fontFamily: 'Lexend', fontWeight: '400' };

type ActiveTab = 'overview' | 'revenue' | 'performance' | 'movies' | 'customers' | 'financial' | 'operational';

const AnalyticsManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    return date.toISOString().split('T')[0];
  });
  const [timeframe, setTimeframe] = useState<string>('monthly')
  const [summaryData, setSummaryData] = useState<string>(null);

  const dateRange = {
    startDate,
    endDate,
    timeframe
  };

  useEffect(() => {
    fetchSummaryData();
  }, [startDate, endDate]);

  const fetchSummaryData = async () => {
    try {
      const response = await getAnalyticsSummaryApi({ startDate, endDate });
      setSummaryData(response.data);
    } catch (error) {
      console.error('Error fetching summary data:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'revenue', label: 'Revenue', icon: DollarSign },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'movies', label: 'Movies', icon: Users },
    { id: 'financial', label: 'Financial KPIs', icon: DollarSign },
    { id: 'operational', label: 'Operations', icon: BarChart3 },
  ];

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <RevenueAnalyticsSection dateRange={dateRange} lexendMedium={lexendMedium} lexendSmall={lexendSmall} />

          </div>
        );

      case 'revenue':
        return <RevenueAnalyticsSection dateRange={dateRange} lexendMedium={lexendMedium} lexendSmall={lexendSmall} />;
      case 'performance':
        return <PerformanceMetricsSection dateRange={dateRange} lexendMedium={lexendMedium} lexendSmall={lexendSmall} />;
      case 'movies':
        return <MovieAnalyticsSection dateRange={dateRange} lexendMedium={lexendMedium} lexendSmall={lexendSmall} />;
      case 'financial':
        return <FinancialKPIsSection dateRange={dateRange} lexendMedium={lexendMedium} lexendSmall={lexendSmall} />;
      case 'operational':
        return <OperationalAnalyticsSection dateRange={dateRange} lexendMedium={lexendMedium} lexendSmall={lexendSmall} />;
      default:
        return <RevenueAnalyticsSection dateRange={dateRange} lexendMedium={lexendMedium} lexendSmall={lexendSmall} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className={`text-3xl text-white mb-2`} style={lexendMedium}>
            Analytics Dashboard
          </h1>
          <p className={`text-gray-400`} style={lexendSmall}>
            Comprehensive insights into your theater's performance
          </p>
        </div>

        {/* Time Range Filter */}
        <TimeRangeFilter
          startDate={startDate}
          endDate={endDate}
          timeframe={timeframe}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onTimeframeChange={setTimeframe}
          lexendMedium={lexendMedium}
          lexendSmall={lexendSmall}
        />

        {/* Summary Cards */}
        {summaryData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-green-500/20 rounded-xl">
                  <DollarSign className="w-6 h-6 text-green-400" />
                </div>
              </div>
              <h3 className={`text-gray-400 text-sm mb-1`} style={lexendSmall}>Total Revenue</h3>
              <p className={`text-2xl text-white font-semibold`} style={lexendMedium}>
                ₹{summaryData.totalRevenue.toLocaleString('en-IN')}
              </p>
            </div>

            <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <Calendar className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <h3 className={`text-gray-400 text-sm mb-1`} style={lexendSmall}>Total Bookings</h3>
              <p className={`text-2xl text-white font-semibold`} style={lexendMedium}>
                {summaryData.totalBookings.toLocaleString()}
              </p>
            </div>

            <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <h3 className={`text-gray-400 text-sm mb-1`} style={lexendSmall}>Avg Occupancy</h3>
              <p className={`text-2xl text-white font-semibold`} style={lexendMedium}>
                {summaryData.avgOccupancy.toFixed(1)}%
              </p>
            </div>

            <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-yellow-500/20 rounded-xl">
                  <Users className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
              <h3 className={`text-gray-400 text-sm mb-1`} style={lexendSmall}>Top Theater</h3>
              <p className={`text-lg text-white font-semibold`} style={lexendMedium}>
                {summaryData.topPerformingTheater}
              </p>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-2">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ActiveTab)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === tab.id
                      ? 'bg-white/20 text-white border border-white/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className={`text-sm font-medium`} style={lexendMedium}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Section Content */}
        <div className="min-h-[600px]">
          {renderActiveSection()}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsManager;

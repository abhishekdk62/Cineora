// components/admin/analytics/AnalyticsManager.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { AnalyticsDashboardHeader } from './AnalyticsDashboardHeader';
import { DateRangePicker } from './DateRangePicker';
import { FilterPanel } from './FilterPanel';
import { TabNavigation } from './TabNavigation';
import { PerformanceMetricsGrid } from './PerformanceMetricsGrid';
import { RevenueChart } from './RevenueChart';
import { TopPerformersList } from './TopPerformersList';
import { AnalyticsTable } from './AnalyticsTable';
import { QuickStats } from './QuickStats';
import { ExportButton } from './ExportButton';
import { NotificationToast } from './NotificationToast';
import { EmptyState } from './EmptyState';
import { LoadingSkeleton } from './LoadingSkeleton';
import { AnalyticsModal } from './AnalyticsModal';

// Import API functions
import {
  getComprehensiveAnalyticsApi,
  getRevenueAnalyticsApi,
  getMonthlyRevenueTrendsApi,
  getDailyRevenueTrendsApi,
  getTheaterWiseRevenueApi,
  getOwnerWiseRevenueApi,
  getMovieWiseRevenueApi,
  getPerformanceMetricsApi,
  getOccupancyAnalyticsApi,
  getTimeSlotPerformanceApi,
  getCustomerInsightsApi,
  getCustomerSatisfactionApi,
  getMoviePerformanceApi,
  getTopPerformingMoviesApi,
  getMovieFormatAnalyticsApi,
  getFinancialKPIsApi,
  getGrowthRatesApi,
  getOperationalAnalyticsApi
} from '../../../../services/commonServices/adminAnalyticServices';

interface AnalyticsData {
  comprehensive?: any;
  revenue?: any;
  performance?: any;
  movies?: any;
  customers?: any;
  financial?: any;
  operational?: any;
}

interface Filters {
  startDate: string;
  endDate: string;
  ownerId?: string;
  theaterId?: string;
  movieId?: string;
}

interface Notification {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  visible: boolean;
}

export const AnalyticsManager: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<AnalyticsData>({});
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [modalContent, setModalContent] = useState<any>(null);
  const [notification, setNotification] = useState<Notification>({
    type: 'info',
    title: '',
    message: '',
    visible: false
  });

  // Initialize date range (last 30 days)
  const [filters, setFilters] = useState<Filters>(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
  });

  // Tab configuration
  const tabs = [
    { id: 'overview', label: 'Overview', count: undefined },
    { id: 'revenue', label: 'Revenue', count: undefined },
    { id: 'performance', label: 'Performance', count: undefined },
    { id: 'movies', label: 'Movies', count: undefined },
    { id: 'customers', label: 'Customers', count: undefined },
    { id: 'financial', label: 'Financial', count: undefined },
    { id: 'operational', label: 'Operational', count: undefined }
  ];

  // Notification helper
  const showNotification = useCallback((type: Notification['type'], title: string, message: string) => {
    setNotification({ type, title, message, visible: true });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, visible: false }));
  }, []);

  // Data fetching functions
  const fetchComprehensiveData = useCallback(async () => {
    try {
      const response = await getComprehensiveAnalyticsApi({
        startDate: filters.startDate,
        endDate: filters.endDate,
        ownerId: filters.ownerId,
        theaterId: filters.theaterId,
        movieId: filters.movieId
      });
      console.log('🔥 Comprehensive Analytics Response:', response);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching comprehensive analytics:', error);
      throw error;
    }
  }, [filters]);

  const fetchRevenueData = useCallback(async () => {
    try {
      const [revenue, monthly, daily, theaterWise, ownerWise, movieWise] = await Promise.all([
        getRevenueAnalyticsApi(filters),
        getMonthlyRevenueTrendsApi(filters),
        getDailyRevenueTrendsApi(filters),
        getTheaterWiseRevenueApi(filters),
        getOwnerWiseRevenueApi(filters),
        getMovieWiseRevenueApi(filters)
      ]);
      
      return {
        overview: revenue.data,
        monthly: monthly.data,
        daily: daily.data,
        theaterWise: theaterWise.data,
        ownerWise: ownerWise.data,
        movieWise: movieWise.data
      };
    } catch (error) {
      console.error('❌ Error fetching revenue analytics:', error);
      throw error;
    }
  }, [filters]);

  const fetchPerformanceData = useCallback(async () => {
    try {
      const [performance, occupancy, timeSlots] = await Promise.all([
        getPerformanceMetricsApi(filters),
        getOccupancyAnalyticsApi(filters),
        getTimeSlotPerformanceApi(filters)
      ]);
      
      console.log('⚡ Performance Metrics Response:', performance);
      console.log('👥 Occupancy Analytics Response:', occupancy);
      console.log('⏰ Time Slot Performance Response:', timeSlots);
      
      return {
        metrics: performance.data,
        occupancy: occupancy.data,
        timeSlots: timeSlots.data
      };
    } catch (error) {
      console.error('❌ Error fetching performance analytics:', error);
      throw error;
    }
  }, [filters]);

  const fetchMovieData = useCallback(async () => {
    try {
      const [movies, topPerforming, formatAnalytics] = await Promise.all([
        getMoviePerformanceApi(filters),
        getTopPerformingMoviesApi(filters),
        getMovieFormatAnalyticsApi(filters)
      ]);
      
      console.log('🎭 Movie Performance Response:', movies);
      console.log('🏆 Top Performing Movies Response:', topPerforming);
      console.log('📺 Movie Format Analytics Response:', formatAnalytics);
      
      return {
        performance: movies.data,
        topPerforming: topPerforming.data,
        formatAnalytics: formatAnalytics.data
      };
    } catch (error) {
      console.error('❌ Error fetching movie analytics:', error);
      throw error;
    }
  }, [filters]);

  const fetchCustomerData = useCallback(async () => {
    try {
      const [insights, satisfaction] = await Promise.all([
        getCustomerInsightsApi(filters),
        getCustomerSatisfactionApi(filters)
      ]);
      
      console.log('👤 Customer Insights Response:', insights);
      console.log('😊 Customer Satisfaction Response:', satisfaction);
      
      return {
        insights: insights.data,
        satisfaction: satisfaction.data
      };
    } catch (error) {
      console.error('❌ Error fetching customer analytics:', error);
      throw error;
    }
  }, [filters]);

  const fetchFinancialData = useCallback(async () => {
    try {
      const [financial, growth] = await Promise.all([
        getFinancialKPIsApi(filters),
        getGrowthRatesApi(filters)
      ]);
      
      console.log('💳 Financial KPIs Response:', financial);
      console.log('📈 Growth Rates Response:', growth);
      
      return {
        kpis: financial.data,
        growth: growth.data
      };
    } catch (error) {
      console.error('❌ Error fetching financial analytics:', error);
      throw error;
    }
  }, [filters]);

  const fetchOperationalData = useCallback(async () => {
    try {
      const response = await getOperationalAnalyticsApi(filters);
      console.log('⚙️ Operational Analytics Response:', response);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching operational analytics:', error);
      throw error;
    }
  }, [filters]);

  // Main data fetching function
  const fetchData = useCallback(async (tabId?: string) => {
    const targetTab = tabId || activeTab;
    setLoading(true);
    
    try {
      let newData: any = {};
      
      switch (targetTab) {
        case 'overview':
          newData.comprehensive = await fetchComprehensiveData();
          break;
        case 'revenue':
          newData.revenue = await fetchRevenueData();
          break;
        case 'performance':
          newData.performance = await fetchPerformanceData();
          break;
        case 'movies':
          newData.movies = await fetchMovieData();
          break;
        case 'customers':
          newData.customers = await fetchCustomerData();
          break;
        case 'financial':
          newData.financial = await fetchFinancialData();
          break;
        case 'operational':
          newData.operational = await fetchOperationalData();
          break;
        default:
          newData.comprehensive = await fetchComprehensiveData();
      }
      
      setData(prevData => ({ ...prevData, ...newData }));
      showNotification('success', 'Data Updated', 'Analytics data has been refreshed successfully.');
      
    } catch (error) {
      console.error('❌ Error fetching analytics data:', error);
      showNotification('error', 'Error Loading Data', 'Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [activeTab, fetchComprehensiveData, fetchRevenueData, fetchPerformanceData, fetchMovieData, fetchCustomerData, fetchFinancialData, fetchOperationalData, showNotification]);

  // Refresh data
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchData();
    } finally {
      setRefreshing(false);
    }
  }, [fetchData]);

  // Handle export
  const handleExport = useCallback(async (type: string) => {
    try {
      showNotification('info', 'Exporting Data', `Generating ${type.toUpperCase()} export...`);
      
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showNotification('success', 'Export Complete', `Analytics data exported as ${type.toUpperCase()} successfully.`);
    } catch (error) {
      showNotification('error', 'Export Failed', 'Failed to export analytics data. Please try again.');
    }
  }, [showNotification]);

  // Handle tab change
  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
    if (!data[tabId as keyof AnalyticsData]) {
      fetchData(tabId);
    }
  }, [data, fetchData]);

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Apply filters
  const applyFilters = useCallback(() => {
    setShowFilterPanel(false);
    fetchData();
  }, [fetchData]);

  // Initial data load
  useEffect(() => {
    fetchData();
  }, []);

  // Render overview tab content
  const renderOverviewContent = () => {
    const comprehensiveData = data.comprehensive;
    
    if (loading && !comprehensiveData) {
      return <LoadingSkeleton type="card" count={6} />;
    }
    
    if (!comprehensiveData) {
      return (
        <EmptyState
          title="No Analytics Data"
          description="Unable to load analytics overview. Please check your filters and try again."
          actionLabel="Retry"
          onAction={() => fetchData()}
        />
      );
    }

    return (
      <div className="space-y-6">
        {/* Quick Stats */}
        <QuickStats
          stats={[
            {
              label: 'Total Revenue',
              value: comprehensiveData.totalRevenue || 0,
              format: 'currency',
              change: {
                value: comprehensiveData.revenueGrowthRate || 0,
                type: (comprehensiveData.revenueGrowthRate || 0) >= 0 ? 'increase' : 'decrease',
                period: 'vs last month'
              }
            },
            {
              label: 'Total Bookings',
              value: comprehensiveData.totalBookings || 0,
              format: 'number'
            },
            {
              label: 'Avg Occupancy',
              value: comprehensiveData.avgOccupancy || 0,
              format: 'percentage'
            },
            {
              label: 'Customer Satisfaction',
              value: `${(comprehensiveData.platformHealth?.customerSatisfactionScore || 0).toFixed(1)}/5`
            }
          ]}
          loading={loading}
        />

        {/* Performance Metrics Grid */}
        <PerformanceMetricsGrid
          metrics={{
            totalRevenue: comprehensiveData.totalRevenue || 0,
            totalBookings: comprehensiveData.totalBookings || 0,
            averageTicketPrice: 0,
            occupancyRate: comprehensiveData.avgOccupancy || 0,
            customerSatisfaction: comprehensiveData.platformHealth?.customerSatisfactionScore || 0,
            growthRate: comprehensiveData.revenueGrowthRate || 0
          }}
          loading={loading}
        />

        {/* Platform Health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-black p-6 rounded-lg shadow-sm border">
            <h3 className="font-semibold text-white mb-4">Platform Health</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white">Payment Success Rate</span>
                <span className="font-medium text-white">{comprehensiveData.platformHealth?.paymentSuccessRate || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Cancellation Rate</span>
                <span className="font-medium text-white">{comprehensiveData.platformHealth?.cancellationRate || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Customer Satisfaction</span>
                <span className="font-medium text-white">{(comprehensiveData.platformHealth?.customerSatisfactionScore || 0).toFixed(1)}/5</span>
              </div>
            </div>
          </div>
          
          <div className="bg-black p-6 rounded-lg shadow-sm border">
            <h3 className="font-semibold text-white mb-4">Top Performers</h3>
            <div className="space-y-3">
              <div>
                <span className="text-white text-sm">Top Movie</span>
                <p className="font-medium text-white">{comprehensiveData.topPerformingMovie || 'No data'}</p>
              </div>
              <div>
                <span className="text-white text-sm">Top Theater</span>
                <p className="font-medium text-white">{comprehensiveData.topPerformingTheater || 'No data'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render revenue tab content
  const renderRevenueContent = () => {
    const revenueData = data.revenue;
    
    if (loading && !revenueData) {
      return <LoadingSkeleton type="chart" count={2} />;
    }
    
    if (!revenueData) {
      return (
        <EmptyState
          title="No Revenue Data"
          description="Unable to load revenue analytics. Please adjust your filters and try again."
          actionLabel="Retry"
          onAction={() => fetchData()}
        />
      );
    }

    const tableColumns = [
      { key: 'name', label: 'Theater', sortable: true },
      { key: 'revenue', label: 'Revenue', sortable: true, align: 'right' as const, render: (value: number) => `₹${value.toLocaleString()}` },
      { key: 'bookings', label: 'Bookings', sortable: true, align: 'right' as const },
      { key: 'occupancy', label: 'Occupancy', sortable: true, align: 'right' as const, render: (value: number) => `${value.toFixed(1)}%` }
    ];

    const dailyTrends = Array.isArray(revenueData.daily?.trends) ? revenueData.daily.trends : [];
    const monthlyTrends = Array.isArray(revenueData.monthly?.trends) ? revenueData.monthly.trends : [];
    const theaterData = Array.isArray(revenueData.theaterWise?.theaters) ? revenueData.theaterWise.theaters : [];
    const ownerData = Array.isArray(revenueData.ownerWise?.owners) ? revenueData.ownerWise.owners : [];

    return (
      <div className="space-y-6">
        {/* Revenue Stats */}
        <QuickStats
          stats={[
            {
              label: 'Total Revenue',
              value: revenueData.overview?.totalRevenue || 0,
              format: 'currency'
            },
            {
              label: 'Net Revenue',
              value: revenueData.overview?.netRevenue || 0,
              format: 'currency'
            },
            {
              label: 'Platform Commission',
              value: revenueData.overview?.platformCommission || 0,
              format: 'currency'
            },
            {
              label: 'Growth Rate',
              value: revenueData.overview?.growthRate || 0,
              format: 'percentage'
            }
          ]}
          loading={loading}
        />

        {/* Revenue Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart
            data={dailyTrends}
            loading={loading}
            type="daily"
            onRefresh={() => fetchData()}
          />
          <RevenueChart
            data={monthlyTrends}
            loading={loading}
            type="monthly"
            onRefresh={() => fetchData()}
          />
        </div>

        {/* Revenue Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnalyticsTable
            title="Theater-wise Revenue"
            columns={tableColumns}
            data={theaterData}
            loading={loading}
          />
          
          <TopPerformersList
            title="Top Revenue Generating Owners"
            data={ownerData.slice(0, 10).map((owner: any, index: number) => ({
              id: owner.ownerId || index,
              name: owner.email || 'Unknown Owner',
              value: owner.revenue || 0,
              subtitle: `${owner.bookings || 0} bookings • ${owner.theatersCount || 0} theaters`,
              rank: index + 1
            }))}
            type="revenue"
            loading={loading}
          />
        </div>
      </div>
    );
  };

  // Render performance tab content
  const renderPerformanceContent = () => {
    const performanceData = data.performance;
    
    if (loading && !performanceData) {
      return <LoadingSkeleton type="card" count={4} />;
    }
    
    if (!performanceData) {
      return (
        <EmptyState
          title="No Performance Data"
          description="Unable to load performance analytics. Please check your filters and try again."
          actionLabel="Retry"
          onAction={() => fetchData()}
        />
      );
    }

    return (
      <div className="space-y-6">
        {/* Performance Stats */}
        <QuickStats
          stats={[
            {
              label: 'Average Occupancy',
              value: performanceData.metrics?.avgOccupancy || 0,
              format: 'percentage'
            },
            {
              label: 'Screen Efficiency',
              value: performanceData.metrics?.screenEfficiency || 0,
              format: 'percentage'
            },
            {
              label: 'Theater Utilization',
              value: performanceData.metrics?.theaterUtilization || 0,
              format: 'percentage'
            },
            {
              label: 'Average Ticket Price',
              value: performanceData.metrics?.avgTicketPrice || 0,
              format: 'currency'
            }
          ]}
          loading={loading}
        />

        {/* Performance Metrics Grid */}
        <PerformanceMetricsGrid
          metrics={{
            totalRevenue: 0,
            totalBookings: 0,
            averageTicketPrice: performanceData.metrics?.avgTicketPrice || 0,
            occupancyRate: performanceData.metrics?.avgOccupancy || 0,
            customerSatisfaction: 0,
            growthRate: 0
          }}
          loading={loading}
        />

        {/* Weekday vs Weekend Comparison */}
        {performanceData.metrics?.weekdayWeekendComparison && (
          <div className="bg-black p-6 rounded-lg shadow-sm border">
            <h3 className="font-semibold text-white mb-4">Weekday vs Weekend Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Weekday</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white">Bookings</span>
                    <span className="font-medium text-white">{performanceData.metrics.weekdayWeekendComparison.weekday?.bookings || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white">Revenue</span>
                    <span className="font-medium text-white">₹{(performanceData.metrics.weekdayWeekendComparison.weekday?.revenue || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">Weekend</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white">Bookings</span>
                    <span className="font-medium text-white">{performanceData.metrics.weekdayWeekendComparison.weekend?.bookings || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white">Revenue</span>
                    <span className="font-medium text-white">₹{(performanceData.metrics.weekdayWeekendComparison.weekend?.revenue || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render movies tab content
  const renderMoviesContent = () => {
    const moviesData = data.movies;
    
    if (loading && !moviesData) {
      return <LoadingSkeleton type="card" count={4} />;
    }
    
    if (!moviesData) {
      return (
        <EmptyState
          title="No Movies Data"
          description="Unable to load movie analytics. Please check your filters and try again."
          actionLabel="Retry"
          onAction={() => fetchData()}
        />
      );
    }

    const topMovies = Array.isArray(moviesData.topPerforming?.movies) ? moviesData.topPerforming.movies : [];
    const moviePerformance = Array.isArray(moviesData.performance?.topMovies) ? moviesData.performance.topMovies : [];
    const formatPerformance = Array.isArray(moviesData.performance?.formatPerformance) ? moviesData.performance.formatPerformance : [];
    const languagePerformance = Array.isArray(moviesData.performance?.languagePerformance) ? moviesData.performance.languagePerformance : [];

    return (
      <div className="space-y-6">
        {/* Movie Stats */}
        <QuickStats
          stats={[
            {
              label: 'Total Movies',
              value: Math.max(topMovies.length, moviePerformance.length),
              format: 'number'
            },
            {
              label: 'Top Format',
              value: formatPerformance[0]?.format || '2D'
            },
            {
              label: 'Top Language',
              value: languagePerformance[0]?.language === 'en' ? 'English' : 
                     languagePerformance[0]?.language === 'zh' ? 'Chinese' :
                     languagePerformance[0]?.language === 'ta' ? 'Tamil' :
                     languagePerformance[0]?.language === 'ml' ? 'Malayalam' :
                     languagePerformance[0]?.language || 'English'
            },
            {
              label: 'Total Bookings',
              value: formatPerformance.reduce((sum: number, format: any) => sum + (format.bookings || 0), 0),
              format: 'number'
            }
          ]}
          loading={loading}
        />

        {/* Movie Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopPerformersList
            title="Top Performing Movies"
            data={(topMovies.length > 0 ? topMovies : moviePerformance).slice(0, 10).map((movie: any, index: number) => ({
              id: movie._id || movie.movieId || index,
              name: movie.movieName || movie.title || 'Unknown Movie',
              value: movie.revenue || 0,
              subtitle: `${movie.bookings || movie.totalBookings || 0} bookings • ${(movie.avgRating || 0).toFixed(1)}⭐`,
              rank: index + 1
            }))}
            type="revenue"
            loading={loading}
          />

          <TopPerformersList
            title="Language Performance"
            data={languagePerformance.map((lang: any, index: number) => ({
              id: index,
              name: lang.language === 'en' ? 'English' : 
                    lang.language === 'zh' ? 'Chinese' :
                    lang.language === 'ta' ? 'Tamil' :
                    lang.language === 'ml' ? 'Malayalam' :
                    lang.language || 'Unknown',
              value: lang.bookings || 0,
              subtitle: `${(lang.popularity || 0).toFixed(1)}% popularity`,
              rank: index + 1
            }))}
            type="bookings"
            loading={loading}
          />
        </div>

        {/* Format Performance */}
        {formatPerformance.length > 0 && (
          <div className="bg-black p-6 rounded-lg shadow-sm border">
            <h3 className="font-semibold text-white mb-4">Format Performance</h3>
            <div className="space-y-3">
              {formatPerformance.map((format: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">{format.format}</span>
                  <div className="text-right">
                    <div className="font-medium">{format.bookings} bookings</div>
                    <div className="text-sm text-white">{format.avgOccupancy?.toFixed(1)}% occupancy</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render customers tab content
  const renderCustomersContent = () => {
    const customerData = data.customers;
    
    if (loading && !customerData) {
      return <LoadingSkeleton type="card" count={4} />;
    }
    
    if (!customerData) {
      return (
        <EmptyState
          title="No Customer Data"
          description="Unable to load customer analytics. Please check your filters and try again."
          actionLabel="Retry"
          onAction={() => fetchData()}
        />
      );
    }

    return (
      <div className="space-y-6">
        {/* Customer Stats */}
        <QuickStats
          stats={[
            {
              label: 'Total Customers',
              value: customerData.insights?.totalCustomers || 0,
              format: 'number'
            },
            {
              label: 'New Customers',
              value: customerData.insights?.newCustomers || 0,
              format: 'number'
            },
            {
              label: 'Customer Lifetime Value',
              value: customerData.insights?.customerLifetimeValue || 0,
              format: 'currency'
            },
            {
              label: 'Average Rating',
              value: customerData.satisfaction?.avgRating || 0,
              format: 'number'
            }
          ]}
          loading={loading}
        />

        {/* Customer Demographics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopPerformersList
            title="Customer Demographics - Age Groups"
            data={Array.isArray(customerData.insights?.demographics?.ageGroups) ?
              customerData.insights.demographics.ageGroups.map((group: any, index: number) => ({
                id: index,
                name: group.range || 'Unknown',
                value: group.count || 0,
                subtitle: 'customers',
                rank: index + 1
              })) : []
            }
            type="bookings"
            loading={loading}
          />

          <TopPerformersList
            title="Top Cities"
            data={Array.isArray(customerData.insights?.demographics?.locations) ?
              customerData.insights.demographics.locations.map((location: any, index: number) => ({
                id: index,
                name: location.city || 'Unknown',
                value: location.count || 0,
                subtitle: 'customers',
                rank: index + 1
              })) : []
            }
            type="bookings"
            loading={loading}
          />
        </div>

        {/* Customer Satisfaction Rating Distribution */}
        {Array.isArray(customerData.satisfaction?.ratingDistribution) && (
          <div className="bg-black p-6 rounded-lg shadow-sm border">
            <h3 className="font-semibold text-white mb-4">Rating Distribution</h3>
            <div className="space-y-3">
              {customerData.satisfaction.ratingDistribution.map((rating: any, index: number) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="w-12 text-sm font-medium">{rating.rating}⭐</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(rating.count / customerData.satisfaction.totalReviews) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-white">{rating.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render financial tab content
  const renderFinancialContent = () => {
    const financialData = data.financial;
    
    if (loading && !financialData) {
      return <LoadingSkeleton type="card" count={4} />;
    }
    
    if (!financialData) {
      return (
        <EmptyState
          title="No Financial Data"
          description="Unable to load financial analytics. Please check your filters and try again."
          actionLabel="Retry"
          onAction={() => fetchData()}
        />
      );
    }

    return (
      <div className="space-y-6">
        {/* Financial Stats */}
        <QuickStats
          stats={[
            {
              label: 'Total Revenue',
              value: financialData.kpis?.totalRevenue || 0,
              format: 'currency'
            },
            {
              label: 'Net Platform Revenue',
              value: financialData.kpis?.netPlatformRevenue || 0,
              format: 'currency'
            },
            {
              label: 'Platform Commission',
              value: financialData.kpis?.platformCommission || 0,
              format: 'currency'
            },
            {
              label: 'Revenue Growth',
              value: financialData.growth?.revenueGrowth || 0,
              format: 'percentage',
              change: {
                value: financialData.growth?.revenueGrowth || 0,
                type: (financialData.growth?.revenueGrowth || 0) >= 0 ? 'increase' : 'decrease',
                period: 'vs last month'
              }
            }
          ]}
          loading={loading}
        />

        {/* Financial KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-black p-6 rounded-lg shadow-sm border">
            <h4 className="font-medium text-gray-700 mb-3">Revenue Breakdown</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-white">Total Revenue</span>
                <span className="font-medium text-white">₹{(financialData.kpis?.totalRevenue || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Platform Commission</span>
                <span className="font-medium text-white">₹{(financialData.kpis?.platformCommission || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Convenience Fees</span>
                <span className="font-medium text-white">₹{(financialData.kpis?.convenienceFees || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-black p-6 rounded-lg shadow-sm border">
            <h4 className="font-medium text-gray-700 mb-3">Deductions</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-white">Total Refunds</span>
                <span className="font-medium text-white">₹{(financialData.kpis?.totalRefunds || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Taxes</span>
                <span className="font-medium text-white">₹{(financialData.kpis?.taxes || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Discounts</span>
                <span className="font-medium text-white">₹{(financialData.kpis?.totalDiscounts || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-black p-6 rounded-lg shadow-sm border">
            <h4 className="font-medium text-gray-700 mb-3">Growth Metrics</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-white">Revenue Growth</span>
                <span className="font-medium text-white">{(financialData.growth?.revenueGrowth || 0).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Booking Growth</span>
                <span className="font-medium text-white">{(financialData.growth?.bookingGrowth || 0).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Customer Growth</span>
                <span className="font-medium text-white">{(financialData.growth?.customerGrowth || 0).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
        {financialData.growth?.projectedGrowth && (
          <div className="bg-black p-6 rounded-lg shadow-sm border">
            <h3 className="font-semibold text-white mb-4">Projected Growth</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{financialData.growth.projectedGrowth.nextMonth}%</div>
                <div className="text-sm text-white">Next Month</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{financialData.growth.projectedGrowth.nextQuarter}%</div>
                <div className="text-sm text-white">Next Quarter</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render operational tab content
  const renderOperationalContent = () => {
    const operationalData = data.operational;
    
    if (loading && !operationalData) {
      return <LoadingSkeleton type="card" count={4} />;
    }
    
    if (!operationalData) {
      return (
        <EmptyState
          title="No Operational Data"
          description="Unable to load operational analytics. Please check your filters and try again."
          actionLabel="Retry"
          onAction={() => fetchData()}
        />
      );
    }

    return (
      <div className="space-y-6">
        {/* Operational Stats */}
        <QuickStats
          stats={[
            {
              label: 'System Uptime',
              value: operationalData.platformHealth?.systemUptime || 0,
              format: 'percentage'
            },
            {
              label: 'Error Rate',
              value: operationalData.platformHealth?.errorRate || 0,
              format: 'percentage'
            },
            {
              label: 'Payment Success Rate',
              value: operationalData.paymentAnalytics?.successRate || 0,
              format: 'percentage'
            },
            {
              label: 'Avg Response Time',
              value: `${operationalData.platformHealth?.avgResponseTime || 0}ms`
            }
          ]}
          loading={loading}
        />

        {/* Operational Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopPerformersList
            title="Payment Gateway Performance"
            data={Array.isArray(operationalData.paymentAnalytics?.gatewayPerformance) ?
              operationalData.paymentAnalytics.gatewayPerformance.map((gateway: any, index: number) => ({
                id: index,
                name: gateway.gateway || 'Unknown',
                value: gateway.successRate || 0,
                subtitle: `${gateway.transactionCount || 0} transactions`,
                rank: index + 1
              })) : []
            }
            type="occupancy"
            loading={loading}
          />

          <TopPerformersList
            title="Top Cancellation Reasons"
            data={Array.isArray(operationalData.cancellationAnalytics?.topCancellationReasons) ?
              operationalData.cancellationAnalytics.topCancellationReasons.map((reason: any, index: number) => ({
                id: index,
                name: reason.reason || 'Unknown',
                value: reason.count || 0,
                subtitle: 'cancellations',
                rank: index + 1
              })) : []
            }
            type="bookings"
            loading={loading}
          />
        </div>

        {/* Platform Health Details */}
        <div className="bg-black p-6 rounded-lg shadow-sm border">
          <h3 className="font-semibold text-white mb-4">Platform Health Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{operationalData.platformHealth?.systemUptime || 0}%</div>
              <div className="text-sm text-white">System Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{operationalData.platformHealth?.avgResponseTime || 0}ms</div>
              <div className="text-sm text-white">Avg Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{operationalData.platformHealth?.errorRate || 0}%</div>
              <div className="text-sm text-white">Error Rate</div>
            </div>
          </div>
        </div>

        {/* Seasonal Trends */}
        {Array.isArray(operationalData.seasonalTrends) && operationalData.seasonalTrends.length > 0 && (
          <div className="bg-black p-6 rounded-lg shadow-sm border">
            <h3 className="font-semibold text-white mb-4">Seasonal Trends</h3>
            <div className="space-y-3">
              {operationalData.seasonalTrends.map((trend: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">{trend.season || `Season ${index + 1}`}</span>
                  <div className="text-right">
                    <div className="font-medium">{trend.bookings || 0} bookings</div>
                    <div className="text-sm text-white">₹{(trend.revenue || 0).toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewContent();
      case 'revenue':
        return renderRevenueContent();
      case 'performance':
        return renderPerformanceContent();
      case 'movies':
        return renderMoviesContent();
      case 'customers':
        return renderCustomersContent();
      case 'financial':
        return renderFinancialContent();
      case 'operational':
        return renderOperationalContent();
      default:
        return renderOverviewContent();
    }
  };

  // Get active filters display
  const getActiveFiltersDisplay = () => {
    const display: any = {};
    
    if (filters.startDate && filters.endDate) {
      display.dateRange = `${filters.startDate} to ${filters.endDate}`;
    }
    
    return display;
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-black p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <AnalyticsDashboardHeader
            title="Analytics Dashboard"
            subtitle="Comprehensive analytics and insights for your movie ticket booking platform"
            onFilterClick={() => setShowFilterPanel(true)}
            onExportClick={() => handleExport('pdf')}
            onRefreshClick={handleRefresh}
            isRefreshing={refreshing}
            activeFilters={getActiveFiltersDisplay()}
          />

          {/* Date Range Picker */}
          <DateRangePicker
            startDate={filters.startDate}
            endDate={filters.endDate}
            onStartDateChange={(date) => setFilters(prev => ({ ...prev, startDate: date }))}
            onEndDateChange={(date) => setFilters(prev => ({ ...prev, endDate: date }))}
          />

          {/* Tab Navigation */}
          <div className="bg-black rounded-lg shadow-sm border">
            <div className="px-6">
              <TabNavigation
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={handleTabChange}
              />
            </div>
            
            {/* Tab Content */}
            <div className="p-6">
              {renderContent()}
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        <FilterPanel
          isOpen={showFilterPanel}
          onClose={() => setShowFilterPanel(false)}
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />

        {/* Detail Modal */}
        <AnalyticsModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title="Detailed Analytics"
          size="xl"
        >
          {modalContent}
        </AnalyticsModal>

        <NotificationToast
          type={notification.type}
          title={notification.title}
          message={notification.message}
          visible={notification.visible}
          onClose={hideNotification}
        />
      </div>
    </ErrorBoundary>
  );
};

export default AnalyticsManager;

y// @ts-nocheck
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
import { RenderOverviewContent } from './OverviewContent';
import { RenderRevenueContent } from './RevenueContent';
import { RenderPerformanceContent } from './RenderPerformanceContent';
import { RenderCustomersContent } from './RenderCustomersContent';
import { RenderOperationalContent } from './RenderOperationalContent';
import { exportTabsToExcel, TabPayload } from './excelExport';

export interface AnalyticsData {
  comprehensive?: string;
  revenue?: string;
  performance?: string;
  movies?: string;
  customers?: string;
  financial?: string;
  operational?: string;
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
  const [modalContent, setModalContent] = useState<string>(null);
  const [notification, setNotification] = useState<Notification>({
    type: 'info',
    title: '',
    message: '',
    visible: false
  });

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
    { id: 'financial', label: 'Financial', count: undefined },
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
      let newData: string = {};

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


  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
    if (!data[tabId as keyof AnalyticsData]) {
      fetchData(tabId);
    }
  }, [data, fetchData]);

const handleFiltersChange = useCallback((newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const applyFilters = useCallback(() => {
    setShowFilterPanel(false);
    fetchData();
  }, [fetchData]);
const exportCurrentTab = useCallback(() => {
  try {
    const payload: TabPayload[] = [];
    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = `analytics_${activeTab}_${timestamp}.xlsx`;

    switch (activeTab) {
      case 'overview': {
        const c = data.comprehensive;
        if (!c) {
          showNotification('warning', 'No Data', 'No overview data available to export.');
          return;
        }

        payload.push(
          {
            name: 'Quick Stats',
            rows: [{
              totalRevenue: c.totalRevenue || 0,
              totalBookings: c.totalBookings || 0,
              avgOccupancy: c.avgOccupancy || 0,
              custSatisfaction: c.platformHealth?.customerSatisfactionScore || 0,
              revenueGrowthRate: c.revenueGrowthRate || 0
            }]
          },
          {
            name: 'Platform Health',
            rows: [c.platformHealth || {}]
          },
          {
            name: 'Top Performers',
            rows: [{
              topMovie: c.topPerformingMovie || 'No data',
              topTheater: c.topPerformingTheater || 'No data'
            }]
          }
        );
        break;
      }

      case 'revenue': {
        const r = data.revenue;
        if (!r) {
          showNotification('warning', 'No Data', 'No revenue data available to export.');
          return;
        }

        payload.push(
          { name: 'Overview', rows: [r.overview || {}] },
          { name: 'Daily Trends', rows: Array.isArray(r.daily?.trends) ? r.daily.trends : [] },
          { name: 'Monthly Trends', rows: Array.isArray(r.monthly?.trends) ? r.monthly.trends : [] },
          { name: 'Theater Revenue', rows: Array.isArray(r.theaterWise?.theaters) ? r.theaterWise.theaters : [] },
          { name: 'Owner Revenue', rows: Array.isArray(r.ownerWise?.owners) ? r.ownerWise.owners : [] }
        );
        break;
      }

      case 'performance': {
        const p = data.performance;
        if (!p) {
          showNotification('warning', 'No Data', 'No performance data available to export.');
          return;
        }

        payload.push(
          { name: 'Metrics', rows: [p.metrics || {}] },
          { name: 'Occupancy', rows: Array.isArray(p.occupancy) ? p.occupancy : [] },
          { name: 'Time Slots', rows: Array.isArray(p.timeSlots) ? p.timeSlots : [] }
        );
        break;
      }

      case 'customers': {
        const c = data.customers;
        if (!c) {
          showNotification('warning', 'No Data', 'No customer data available to export.');
          return;
        }

        payload.push(
          { name: 'Insights', rows: [c.insights || {}] },
          { name: 'Age Groups', rows: Array.isArray(c.insights?.demographics?.ageGroups) ? c.insights.demographics.ageGroups : [] },
          { name: 'Cities', rows: Array.isArray(c.insights?.demographics?.locations) ? c.insights.demographics.locations : [] },
          { name: 'Rating Distribution', rows: Array.isArray(c.satisfaction?.ratingDistribution) ? c.satisfaction.ratingDistribution : [] }
        );
        break;
      }

      case 'operational': {
        const o = data.operational;
        if (!o) {
          showNotification('warning', 'No Data', 'No operational data available to export.');
          return;
        }

        payload.push(
          { name: 'Platform Health', rows: [o.platformHealth || {}] },
          { name: 'Payment Gateways', rows: Array.isArray(o.paymentAnalytics?.gatewayPerformance) ? o.paymentAnalytics.gatewayPerformance : [] },
          { name: 'Cancellation Reasons', rows: Array.isArray(o.cancellationAnalytics?.topCancellationReasons) ? o.cancellationAnalytics.topCancellationReasons : [] },
          { name: 'Seasonal Trends', rows: Array.isArray(o.seasonalTrends) ? o.seasonalTrends : [] }
        );
        break;
      }

      default:
        showNotification('error', 'Export Error', 'Unknown tab selected for export.');
        return;
    }

    if (payload.length === 0) {
      showNotification('warning', 'No Data', 'No data available to export for the current tab.');
      return;
    }

    exportTabsToExcel(payload, fileName);
    showNotification('success', 'Export Complete', `Analytics data exported successfully as ${fileName}`);

  } catch (error) {
    console.error('❌ Export error:', error);
    showNotification('error', 'Export Failed', 'Failed to export analytics data. Please try again.');
  }
}, [activeTab, data, showNotification]);

const handleExport = useCallback(() => {
  exportCurrentTab();
}, [exportCurrentTab]);

  // ✅ FIXED: renderContent function with proper JSX returns
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <RenderOverviewContent
            data={data}
            loading={loading}
            fetchData={fetchData}
          />
        );
      case 'revenue':
        return (
          <RenderRevenueContent
            data={data}
            loading={loading}
            fetchData={fetchData}
          />
        );
      case 'performance':
        return (
          <RenderPerformanceContent
            data={data}
            loading={loading}
            fetchData={fetchData}
          />
        );
   
  
      default:
        return (
          <RenderOverviewContent
            data={data}
            loading={loading}
            fetchData={fetchData}
          />
        );
    }
  };

  const getActiveFiltersDisplay = () => {
    const display: string = {};

    if (filters.startDate && filters.endDate) {
      display.dateRange = `${filters.startDate} to ${filters.endDate}`;
    }

    return display;
  };

  // Initial data load
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-black p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <AnalyticsDashboardHeader
            title="Analytics Dashboard"
            subtitle="Comprehensive analytics and insights for your movie ticket booking platform"
            onFilterClick={() => setShowFilterPanel(true)}
            onExportClick={handleExport}
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

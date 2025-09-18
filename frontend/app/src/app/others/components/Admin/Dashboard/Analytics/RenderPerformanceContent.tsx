import React from 'react';
import EmptyState from "../../../User/Book/EmptyState";
import { AnalyticsData } from "./AnalyticsManager";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { PerformanceMetricsGrid } from "./PerformanceMetricsGrid";
import { QuickStats } from "./QuickStats";

interface RenderPerformanceContentProps {
  data: AnalyticsData;
  loading: boolean;
  fetchData: () => void;
}

export const RenderPerformanceContent: React.FC<RenderPerformanceContentProps> = ({
  data,
  loading,
  fetchData
}) => {
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
              <h4 className="font-medium text-white mb-2">Weekday</h4>
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

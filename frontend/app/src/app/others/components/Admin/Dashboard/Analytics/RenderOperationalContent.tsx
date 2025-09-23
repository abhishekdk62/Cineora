import React from 'react';
import EmptyState from "../../../User/Book/EmptyState";
import { AnalyticsData } from "./AnalyticsManager";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { QuickStats } from "./QuickStats";
import { TopPerformersList } from "./TopPerformersList";

interface RenderOperationalContentProps {
  data: AnalyticsData;
  loading: boolean;
  fetchData: () => void;
}

export const RenderOperationalContent: React.FC<RenderOperationalContentProps> = ({
  data,
  loading,
  fetchData
}) => {
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
            operationalData.paymentAnalytics.gatewayPerformance.map((gateway: string, index: number) => ({
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
            operationalData.cancellationAnalytics.topCancellationReasons.map((reason: string, index: number) => ({
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
            {operationalData.seasonalTrends.map((trend: string, index: number) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-800 rounded">
                <span className="font-medium text-white">{trend.season || `Season ${index + 1}`}</span>
                <div className="text-right">
                  <div className="font-medium text-white">{trend.bookings || 0} bookings</div>
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

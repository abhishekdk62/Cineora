import React from 'react';
import EmptyState from "../../../User/Book/EmptyState";
import { AnalyticsData } from "./AnalyticsManager";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { QuickStats } from "./QuickStats";
import { TopPerformersList } from "./TopPerformersList";

interface RenderCustomersContentProps {
  data: AnalyticsData;
  loading: boolean;
  fetchData: () => void;
}

export const RenderCustomersContent: React.FC<RenderCustomersContentProps> = ({
  data,
  loading,
  fetchData
}) => {
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
                <span className="w-12 text-sm font-medium text-white">{rating.rating}⭐</span>
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

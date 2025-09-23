import React from 'react';
import EmptyState from "../../../User/Book/EmptyState";
import { AnalyticsData } from "./AnalyticsManager"; 
import { AnalyticsTable } from "./AnalyticsTable";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { QuickStats } from "./QuickStats";
import { RevenueChart } from "./RevenueChart";
import { TopPerformersList } from "./TopPerformersList";

interface RenderRevenueContentProps {
  data: AnalyticsData;
  loading: boolean;
  fetchData: () => void;
}

export const RenderRevenueContent: React.FC<RenderRevenueContentProps> = ({
  data,
  loading,
  fetchData
}) => {
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
    { 
      key: 'revenue', 
      label: 'Revenue', 
      sortable: true, 
      align: 'right' as const, 
      render: (value: unknown) => `₹${(value as number).toLocaleString()}` 
    },
    { key: 'bookings', label: 'Bookings', sortable: true, align: 'right' as const },
    { 
      key: 'occupancy', 
      label: 'Occupancy', 
      sortable: true, 
      align: 'right' as const, 
      render: (value: unknown) => `${(value as number).toFixed(1)}%` 
    }
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
          data={ownerData.slice(0, 10).map((owner: string, index: number) => ({
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

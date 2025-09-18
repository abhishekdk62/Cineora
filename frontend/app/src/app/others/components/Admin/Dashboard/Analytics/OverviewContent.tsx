import EmptyState from "../../../User/Book/EmptyState";

import React from 'react';

import { AnalyticsData } from "./AnalyticsManager";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { PerformanceMetricsGrid } from "./PerformanceMetricsGrid";
import { QuickStats } from "./QuickStats";
interface RenderOverviewContentProps {
    data: AnalyticsData;
    loading: boolean;
    fetchData: () => void;
}


export const RenderOverviewContent: React.FC<RenderOverviewContentProps> = ({
    data,
    loading,
    fetchData
}) => {
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
                onAction={() => fetchData()}  // ✅ Now this will work
            />
        );
    }


    return (
        <div className="space-y-6">
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
// components/analytics/sections/PerformanceMetricsSection.tsx
import React, { useState, useEffect } from 'react';
import { Activity, Layers, DollarSign, Clock, TrendingUp } from 'lucide-react';

import { AnalyticsQueryDto } from '../../../dtos/analytics.dto';
import { getPerformanceMetricsApi } from '@/app/others/services/commonServices/analyticServices';
import { LoadingCard } from './LoadingCard';
import { MetricCard } from './MetricCard';
import { TimeSlotBarChart } from './Charts';

interface PerformanceMetricsSectionProps {
  dateRange: AnalyticsQueryDto;
  lexendMedium: any;
  lexendSmall: any;
}

export const PerformanceMetricsSection: React.FC<PerformanceMetricsSectionProps> = ({
  dateRange,
  lexendMedium,
  lexendSmall
}) => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      fetchPerformanceMetrics();
    }
  }, [dateRange]);

  const fetchPerformanceMetrics = async () => {
    setLoading(true);
    try {
      const response = await getPerformanceMetricsApi(dateRange);
      setMetrics(response.data);
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !metrics) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <LoadingCard key={i} />
          ))}
        </div>
        <LoadingCard />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-2xl text-white mb-2`} style={lexendMedium}>
          Performance Metrics
        </h2>
        <p className={`text-gray-400`} style={lexendSmall}>
          Track key performance indicators across your shows
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Occupancy Rate"
          value={`${metrics.occupancy.occupancyPercentage.toFixed(1)}%`}
          subtitle={`${metrics.occupancy.totalSeatsBooked.toLocaleString()} of ${metrics.occupancy.totalSeatsAvailable.toLocaleString()} seats`}
          icon={Layers}
          color="blue"
          lexendMedium={lexendMedium}
          lexendSmall={lexendSmall}
        />
        
        <MetricCard
          title="Average Ticket Price"
          value={`₹${metrics.avgTicketPrice.toFixed(0)}`}
          subtitle="Per ticket sold"
          icon={DollarSign}
          color="green"
          lexendMedium={lexendMedium}
          lexendSmall={lexendSmall}
        />
        
        <MetricCard
          title="Total Shows"
          value={metrics.revenuePerShow.length}
          subtitle="Active performances"
          icon={Activity}
          color="purple"
          lexendMedium={lexendMedium}
          lexendSmall={lexendSmall}
        />
      </div>
<div className="mt-8">
  <TimeSlotBarChart
    dateRange={dateRange} 
    lexendMedium={lexendMedium} 
    lexendSmall={lexendSmall} 
  />
</div>

      {/* Time Slot Performance */}
      <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
        <h3 className={`text-lg text-white mb-4`} style={lexendMedium}>
          Performance by Time Slot
        </h3>
        <div className="space-y-3">
          {metrics.timeSlotPerformance.map((slot: any) => (
            <div key={slot.timeSlot} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className={`text-white font-medium`} style={lexendMedium}>
                    {slot.timeSlot}
                  </p>
                  <p className={`text-gray-400 text-sm`} style={lexendSmall}>
                    {slot.totalBookings} bookings
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className={`text-white text-sm`} style={lexendMedium}>
                    {slot.avgOccupancy.toFixed(1)}% Occupancy
                  </p>
                  <p className={`text-gray-400 text-xs`} style={lexendSmall}>
                    {slot.performance} performance
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-white text-sm`} style={lexendMedium}>
                    ₹{slot.totalRevenue.toLocaleString('en-IN')}
                  </p>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    <span className={`text-green-400 text-xs`} style={lexendSmall}>
                      Revenue
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

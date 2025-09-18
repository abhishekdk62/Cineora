// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, TrendingUp, Clock } from 'lucide-react';

import { AnalyticsQueryDto } from '../../../dtos/analytics.dto';
import { getOperationalAnalyticsApi } from '@/app/others/services/commonServices/analyticServices';
import { LoadingCard } from './LoadingCard';
import { MetricCard } from './MetricCard';

interface OperationalAnalyticsSectionProps {
  dateRange: AnalyticsQueryDto;
  lexendMedium: string;
  lexendSmall: string;
}

export const OperationalAnalyticsSection: React.FC<OperationalAnalyticsSectionProps> = ({
  dateRange,
  lexendMedium,
  lexendSmall
}) => {
  const [loading, setLoading] = useState(true);
  const [operationalData, setOperationalData] = useState<string>(null);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      fetchOperationalAnalytics();
    }
  }, [dateRange]);

  const fetchOperationalAnalytics = async () => {
    setLoading(true);
    try {
      const response = await getOperationalAnalyticsApi(dateRange);
      setOperationalData(response.data);
    } catch (error) {
      console.error('Error fetching operational analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !operationalData) {
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

  const avgGrowthRate = operationalData.revenueGrowthRate.length > 0 
    ? operationalData.revenueGrowthRate.reduce((sum: number, item: string) => sum + item.growthRate, 0) / operationalData.revenueGrowthRate.length 
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-2xl text-white mb-2`} style={lexendMedium}>
          Operational Analytics
        </h2>
        <p className={`text-gray-400`} style={lexendSmall}>
          Monitor operational efficiency and growth trends
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Show Utilization"
          value={operationalData.showUtilization.length}
          subtitle="Active shows"
          icon={Activity}
          color="blue"
          lexendMedium={lexendMedium}
          lexendSmall={lexendSmall}
        />
        
        <MetricCard
          title="Low Performing Slots"
          value={operationalData.lowPerformingTimeSlots.length}
          subtitle="Need attention"
          icon={AlertTriangle}
          color="red"
          lexendMedium={lexendMedium}
          lexendSmall={lexendSmall}
        />
        
        <MetricCard
          title="Avg Growth Rate"
          value={`${avgGrowthRate.toFixed(1)}%`}
          subtitle="Revenue growth"
          icon={TrendingUp}
          color="green"
          lexendMedium={lexendMedium}
          lexendSmall={lexendSmall}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Performing Time Slots */}
        <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
          <h3 className={`text-lg text-white mb-4 flex items-center gap-2`} style={lexendMedium}>
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Low Performing Time Slots
          </h3>
          <div className="space-y-3">
            {operationalData.lowPerformingTimeSlots.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className={`text-gray-400`} style={lexendMedium}>
                  All time slots performing well!
                </p>
              </div>
            ) : (
              operationalData.lowPerformingTimeSlots.map((slot: string) => (
                <div key={slot.timeSlot} className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500/20 rounded-lg">
                      <Clock className="w-4 h-4 text-red-400" />
                    </div>
                    <div>
                      <p className={`text-white font-medium`} style={lexendMedium}>
                        {slot.timeSlot}
                      </p>
                      <p className={`text-red-400 text-xs`} style={lexendSmall}>
                        {slot.performance} performance
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-white text-sm`} style={lexendMedium}>
                      {slot.avgOccupancy.toFixed(1)}% Occupancy
                    </p>
                    <p className={`text-gray-400 text-xs`} style={lexendSmall}>
                      ₹{slot.totalRevenue.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Revenue Growth Trends */}
        <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
          <h3 className={`text-lg text-white mb-4 flex items-center gap-2`} style={lexendMedium}>
            <TrendingUp className="w-5 h-5 text-green-400" />
            Revenue Growth Trends
          </h3>
          <div className="space-y-3">
            {operationalData.revenueGrowthRate.slice(-6).map((period: string, index: number) => (
              <div key={period.period} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 ${
                    period.trend === 'positive' ? 'bg-green-500/20' : 
                    period.trend === 'negative' ? 'bg-red-500/20' : 
                    'bg-gray-500/20'
                  } rounded-lg flex items-center justify-center`}>
                    <span className={`text-xs font-semibold ${
                      period.trend === 'positive' ? 'text-green-400' : 
                      period.trend === 'negative' ? 'text-red-400' : 
                      'text-gray-400'
                    }`} style={lexendMedium}>
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className={`text-white font-medium`} style={lexendMedium}>
                      {period.period}
                    </p>
                    <p className={`text-gray-400 text-xs capitalize`} style={lexendSmall}>
                      {period.trend} trend
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-white text-sm font-medium`} style={lexendMedium}>
                    ₹{period.totalRevenue.toLocaleString('en-IN')}
                  </p>
                  <p className={`text-xs ${
                    period.growthRate > 0 ? 'text-green-400' : 
                    period.growthRate < 0 ? 'text-red-400' : 
                    'text-gray-400'
                  }`} style={lexendSmall}>
                    {period.growthRate > 0 ? '+' : ''}{period.growthRate.toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

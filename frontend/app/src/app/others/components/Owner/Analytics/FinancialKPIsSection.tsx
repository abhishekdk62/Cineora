import type { NextFontInstance } from '@/app/others/types';
import { TimeSlotDto } from '../../../dtos/analytics.dto';
import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Percent, Target, Calculator, PieChart } from 'lucide-react';

import { AnalyticsQueryDto, FinancialKPIsDto } from '../../../dtos/analytics.dto';
import { getFinancialKPIsApi } from '@/app/others/services/commonServices/analyticServices';
import { MetricCard } from './MetricCard';
import { LoadingCard } from './LoadingCard';

interface FinancialKPIsSectionProps {
  dateRange: AnalyticsQueryDto;
  lexendMedium: NextFontInstance;
  lexendSmall: NextFontInstance;
}

export const FinancialKPIsSection: React.FC<FinancialKPIsSectionProps> = ({
  dateRange,
  lexendMedium,
  lexendSmall
}) => {
  const [loading, setLoading] = useState(true);
  const [financials, setFinancials] = useState<FinancialKPIsDto | null>(null);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      fetchFinancialKPIs();
    }
  }, [dateRange]);

  const fetchFinancialKPIs = async () => {
    setLoading(true);
    try {
      const response = await getFinancialKPIsApi(dateRange);
      setFinancials(response.data ?? null);
    } catch (error) {
      console.error('Error fetching financial KPIs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !financials) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
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
        <h2 className={`text-2xl text-white mb-2`} style={lexendMedium.style}>
          Financial KPIs
        </h2>
        <p className={`text-gray-400`} style={lexendSmall.style}>
          Key financial performance indicators and insights
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Revenue Realization"
          value={`${financials.potentialVsActual.realizationPercentage.toFixed(1)}%`}
          subtitle={`${financials.potentialVsActual.efficiency} efficiency`}
          icon={Target}
          color="green"
          lexendMedium={lexendMedium}
          lexendSmall={lexendSmall}
        />
        
        <MetricCard
          title="Pricing Effectiveness"
          value={financials.dynamicPricingImpact.effectiveness.toUpperCase()}
          subtitle={`${financials.dynamicPricingImpact.pricingImpact.toFixed(1)}% impact`}
          icon={DollarSign}
          color="blue"
          lexendMedium={lexendMedium}
          lexendSmall={lexendSmall}
        />
        
        <MetricCard
          title="Discount Impact"
          value={`${financials.discountImpact.discountPercentage.toFixed(1)}%`}
          subtitle={`ROI: ${financials.discountImpact.roi.toFixed(0)}%`}
          icon={Percent}
          color="yellow"
          lexendMedium={lexendMedium}
          lexendSmall={lexendSmall}
        />
        
        <MetricCard
          title="Peak Hour Revenue"
          value={`₹${financials.peakHourRevenue.reduce((acc: number, cur: TimeSlotDto) => acc + cur.totalRevenue, 0).toLocaleString('en-IN')}`}
          subtitle="High-demand periods"
          icon={TrendingUp}
          color="purple"
          lexendMedium={lexendMedium}
          lexendSmall={lexendSmall}
        />
      </div>

      {/* Financial Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Potential vs Actual Revenue */}
        <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
          <h3 className={`text-lg text-white mb-4 flex items-center gap-2`} style={lexendMedium.style}>
            <Calculator className="w-5 h-5 text-green-400" />
            Revenue Analysis
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className={`text-gray-300`} style={lexendMedium.style}>
                Potential Revenue
              </span>
              <span className={`text-white font-semibold`} style={lexendMedium.style}>
                ₹{financials.potentialVsActual.potentialRevenue.toLocaleString('en-IN')}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className={`text-gray-300`} style={lexendMedium.style}>
                Actual Revenue
              </span>
              <span className={`text-green-400 font-semibold`} style={lexendMedium.style}>
                ₹{financials.potentialVsActual.actualRevenue.toLocaleString('en-IN')}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className={`text-gray-300`} style={lexendMedium.style}>
                Missed Opportunity
              </span>
              <span className={`text-red-400 font-semibold`} style={lexendMedium.style}>
                ₹{financials.potentialVsActual.missedOpportunity.toLocaleString('en-IN')}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm text-gray-400`} style={lexendSmall.style}>
                  Revenue Realization
                </span>
                <span className={`text-sm text-green-400 font-semibold`} style={lexendSmall.style}>
                  {financials.potentialVsActual.realizationPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-green-400 h-3 rounded-full transition-all duration-500" 
                  style={{ width: `${financials.potentialVsActual.realizationPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Discount Analysis */}
        <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
          <h3 className={`text-lg text-white mb-4 flex items-center gap-2`} style={lexendMedium.style}>
            <PieChart className="w-5 h-5 text-yellow-400" />
            Discount Analysis
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className={`text-gray-300`} style={lexendMedium.style}>
                Total Bookings
              </span>
              <span className={`text-white font-semibold`} style={lexendMedium.style}>
                {financials.discountImpact.totalBookings.toLocaleString()}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className={`text-gray-300`} style={lexendMedium.style}>
                Discounted Bookings
              </span>
              <span className={`text-yellow-400 font-semibold`} style={lexendMedium.style}>
                {financials.discountImpact.bookingsWithDiscount.toLocaleString()}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className={`text-gray-300`} style={lexendMedium.style}>
                Total Discount Given
              </span>
              <span className={`text-red-400 font-semibold`} style={lexendMedium.style}>
                ₹{financials.discountImpact.totalDiscount.toLocaleString('en-IN')}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className={`text-gray-300`} style={lexendMedium.style}>
                Discount ROI
              </span>
              <span className={`text-green-400 font-semibold`} style={lexendMedium.style}>
                {financials.discountImpact.roi.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

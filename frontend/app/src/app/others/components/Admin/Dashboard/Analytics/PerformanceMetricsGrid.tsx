// components/admin/analytics/PerformanceMetricsGrid.tsx
import React from 'react';
import { AnalyticsCard } from './AnalyticsCard';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  Target,
  DollarSign,
  Percent
} from 'lucide-react';

interface PerformanceMetrics {
  totalRevenue: number;
  totalBookings: number;
  averageTicketPrice: number;
  occupancyRate: number;
  customerSatisfaction: number;
  growthRate: number;
}

interface PerformanceMetricsGridProps {
  metrics: PerformanceMetrics;
  loading?: boolean;
  className?: string;
}

export const PerformanceMetricsGrid: React.FC<PerformanceMetricsGridProps> = ({
  metrics,
  loading = false,
  className = ""
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const cards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(metrics?.totalRevenue || 0),
      icon: DollarSign,
      iconColor: 'text-green-400',
      trend: metrics?.growthRate ? {
        value: metrics.growthRate,
        isPositive: metrics.growthRate > 0
      } : undefined
    },
    {
      title: 'Total Bookings',
      value: formatNumber(metrics?.totalBookings || 0),
      subtitle: 'tickets sold',
      icon: Calendar,
      iconColor: 'text-blue-400'
    },
    {
      title: 'Avg Ticket Price',
      value: formatCurrency(metrics?.averageTicketPrice || 0),
      icon: Target,
      iconColor: 'text-purple-400'
    },
    {
      title: 'Occupancy Rate',
      value: `${(metrics?.occupancyRate || 0).toFixed(1)}%`,
      icon: Users,
      iconColor: 'text-orange-400'
    },
    {
      title: 'Customer Satisfaction',
      value: `${(metrics?.customerSatisfaction || 0).toFixed(1)}/5`,
      icon: TrendingUp,
      iconColor: 'text-pink-400'
    },
    {
      title: 'Growth Rate',
      value: `${(metrics?.growthRate || 0).toFixed(1)}%`,
      subtitle: 'vs last period',
      icon: Percent,
      iconColor: metrics?.growthRate >= 0 ? 'text-green-400' : 'text-red-400'
    }
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 ${className}`}>
      {cards.map((card, index) => (
        <AnalyticsCard
          key={index}
          title={card.title}
          value={card.value}
          subtitle={card.subtitle}
          icon={card.icon}
          iconColor={card.iconColor}
          trend={card.trend}
          loading={loading}
        />
      ))}
    </div>
  );
};

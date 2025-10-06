import React, { useMemo } from 'react';
import { Users, Clock, Star, Target, Zap, Award } from 'lucide-react';

const PerformanceMetrics = ({ data }) => {
  const metrics = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        totalCustomers: 0,
        avgBookingValue: 0,
        peakHour: 'N/A',
        conversionRate: 0,
        customerRetention: 0,
        topPerformingDay: 'N/A'
      };
    }

    // Calculate unique customers
    const uniqueCustomers = new Set(data.map(booking => booking.userId)).size;
    
    // Calculate average booking value
    const totalRevenue = data.reduce((sum, booking) => sum + (booking.priceDetails?.total || 0), 0);
    const avgBookingValue = totalRevenue / data.length;
    
    // Find peak booking hour
    const hourlyBookings = data.reduce((acc, booking) => {
      const hour = new Date(booking.bookedAt).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {});
    
    const peakHour = Object.entries(hourlyBookings)
      .sort(([,a], [,b]) => b - a)[0]?.[0];
    
    // Calculate conversion rate (confirmed bookings)
    const confirmedBookings = data.filter(booking => booking.bookingStatus === 'confirmed').length;
    const conversionRate = (confirmedBookings / data.length) * 100;
    
    // Calculate customer retention (customers with multiple bookings)
    const customerBookings = data.reduce((acc, booking) => {
      acc[booking.userId] = (acc[booking.userId] || 0) + 1;
      return acc;
    }, {});
    
    const returningCustomers = Object.values(customerBookings).filter(count => count > 1).length;
    const customerRetention = (returningCustomers / uniqueCustomers) * 100;
    
    // Find top performing day
    const dailyBookings = data.reduce((acc, booking) => {
      const date = new Date(booking.bookedAt).toDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
    
    const topPerformingDay = Object.entries(dailyBookings)
      .sort(([,a], [,b]) => b - a)[0]?.[0];

    return {
      totalCustomers: uniqueCustomers,
      avgBookingValue,
      peakHour: peakHour ? `${peakHour}:00` : 'N/A',
      conversionRate,
      customerRetention,
      topPerformingDay: topPerformingDay ? new Date(topPerformingDay).toLocaleDateString() : 'N/A'
    };
  }, [data]);

  const performanceCards = [
    {
      title: 'Total Customers',
      value: metrics.totalCustomers.toLocaleString(),
      icon: Users,
      color: 'blue',
      description: 'Unique customers served'
    },
    {
      title: 'Avg Booking Value',
      value: `₹${Math.round(metrics.avgBookingValue).toLocaleString()}`,
      icon: Target,
      color: 'green',
      description: 'Revenue per booking'
    },
    {
      title: 'Peak Hour',
      value: metrics.peakHour,
      icon: Clock,
      color: 'yellow',
      description: 'Most active booking time'
    },
    {
      title: 'Conversion Rate',
      value: `${metrics.conversionRate.toFixed(1)}%`,
      icon: Zap,
      color: 'purple',
      description: 'Confirmed bookings ratio'
    },
    {
      title: 'Customer Retention',
      value: `${metrics.customerRetention.toFixed(1)}%`,
      icon: Award,
      color: 'pink',
      description: 'Returning customers'
    },
    {
      title: 'Top Day',
      value: metrics.topPerformingDay,
      icon: Star,
      color: 'orange',
      description: 'Highest booking day'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'border-blue-500/20 bg-blue-500/10 text-blue-400',
      green: 'border-green-500/20 bg-green-500/10 text-green-400',
      yellow: 'border-yellow-500/20 bg-yellow-500/10 text-yellow-400',
      purple: 'border-purple-500/20 bg-purple-500/10 text-purple-400',
      pink: 'border-pink-500/20 bg-pink-500/10 text-pink-400',
      orange: 'border-orange-500/20 bg-orange-500/10 text-orange-400'
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="bg-gray-800/50 border border-cyan-500/20 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-cyan-500/20 rounded-lg">
          <Target className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-xl text-white font-semibold">
            Performance Metrics
          </h3>
          <p className="text-gray-400 text-sm">
            Key business performance indicators
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {performanceCards.map((card, index) => {
          const IconComponent = card.icon;
          const colorClasses = getColorClasses(card.color);
          
          return (
            <div
              key={index}
              className={`border rounded-xl p-4 hover:scale-105 transition-all duration-300 ${colorClasses}`}
            >
              {/* Icon and Title */}
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${colorClasses}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">
                    {card.title}
                  </h4>
                </div>
              </div>

              {/* Value */}
              <div className="mb-2">
                <p className="text-2xl font-bold text-white">
                  {card.value}
                </p>
              </div>

              {/* Description */}
              <p className="text-gray-400 text-xs">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Additional Insights */}
      <div className="mt-6 pt-4 border-t border-gray-600/30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Booking Status Breakdown */}
          <div className="bg-gray-700/30 rounded-lg p-4">
            <h4 className="text-white font-semibold text-sm mb-3">Booking Status</h4>
            <div className="space-y-2">
              {['confirmed', 'cancelled', 'pending'].map(status => {
                const count = data.filter(booking => booking.bookingStatus === status).length;
                const percentage = data.length > 0 ? (count / data.length) * 100 : 0;
                
                return (
                  <div key={status} className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm capitalize">{status}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-2 bg-gray-600 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            status === 'confirmed' ? 'bg-green-400' : 
                            status === 'cancelled' ? 'bg-red-400' : 'bg-yellow-400'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-white text-sm font-medium w-8">
                        {count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Revenue Distribution */}
          <div className="bg-gray-700/30 rounded-lg p-4">
            <h4 className="text-white font-semibold text-sm mb-3">Revenue Sources</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Ticket Sales</span>
                <span className="text-green-400 font-medium">
                  ₹{data.reduce((sum, b) => sum + (b.priceDetails?.subtotal || 0), 0).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Convenience Fees</span>
                <span className="text-blue-400 font-medium">
                  ₹{data.reduce((sum, b) => sum + (b.priceDetails?.convenienceFee || 0), 0).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Taxes</span>
                <span className="text-yellow-400 font-medium">
                  ₹{data.reduce((sum, b) => sum + (b.priceDetails?.taxes || 0), 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;

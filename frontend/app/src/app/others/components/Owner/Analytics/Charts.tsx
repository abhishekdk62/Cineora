// components/analytics/charts/Charts.tsx
"use client";

import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { 
  getMonthlyRevenueTrendsApi, 
  getFormatPerformanceApi,
  getTimeSlotPerformanceApi 
} from '../../../services/commonServices/analyticServices';
import { AnalyticsQueryDto } from '../../../dtos/analytics.dto';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a28ce3', '#8dd1e1'];

// Define proper types for chart data
interface RevenueChartData {
  name: string;
  revenue: number;
  bookings: number;
}

interface FormatChartData {
  name: string;
  value: number;
  percentage: number;
}

interface TimeSlotChartData {
  timeSlot: string;
  revenue: number;
  occupancy: number;
}

interface ChartProps {
  dateRange: AnalyticsQueryDto;
  lexendMedium: any;
  lexendSmall: any;
}

// Revenue Area Chart
export const RevenueAreaChart: React.FC<ChartProps> = ({ dateRange, lexendMedium, lexendSmall }) => {
  const [data, setData] = useState<RevenueChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getMonthlyRevenueTrendsApi({months:6});
        if (response?.data) {
          const chartData: RevenueChartData[] = response.data.map((item: any) => ({
            name: `${item.period.month}/${item.period.year}`,
            revenue: item.totalRevenue || 0,
            bookings: item.totalBookings || 0
          }));
          setData(chartData);
        }
      } catch (error) {
        console.error('Error fetching revenue data:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  if (loading) {
    return (
      <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-600 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-600 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
      <h3 className={`text-lg text-white mb-4`} style={lexendMedium}>
        Monthly Revenue Trends
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="name" 
            stroke="#9CA3AF" 
            fontSize={12}
            tick={{ fill: '#9CA3AF' }}
          />
          <YAxis 
            stroke="#9CA3AF" 
            fontSize={12}
            tick={{ fill: '#9CA3AF' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F3F4F6'
            }}
          />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stroke="#8884d8" 
            fillOpacity={1} 
            fill="url(#colorRevenue)" 
            name="Revenue (₹)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const FormatPieChart: React.FC<ChartProps> = ({ dateRange, lexendMedium, lexendSmall }) => {
  const [data, setData] = useState<FormatChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getFormatPerformanceApi(dateRange);
        if (response?.data) {
          const chartData: FormatChartData[] = response.data.map((item: any) => ({
            name: item.format || 'Unknown',
            value: item.totalRevenue || 0,
            percentage: item.marketShare || 0
          }));
          setData(chartData);
        }
      } catch (error) {
        console.error('Error fetching format data:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    if (dateRange.startDate && dateRange.endDate) {
      fetchData();
    }
  }, [dateRange]);

  // FIXED: Create proper label render function
  const renderLabel = (props: any) => {
    const { name, percent } = props; // Use 'percent' not 'percentage'
    if (!name || percent === undefined) return '';
    return `${name}: ${(percent * 100).toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-600 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-600 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
      <h3 className={`text-lg text-white mb-4`} style={lexendMedium}>
        Revenue by Format
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}  // FIXED: Use the proper function reference
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry: FormatChartData, index: number) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F3F4F6'
            }}
            formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// Time Slot Performance Bar Chart
export const TimeSlotBarChart: React.FC<ChartProps> = ({ dateRange, lexendMedium, lexendSmall }) => {
  const [data, setData] = useState<TimeSlotChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getTimeSlotPerformanceApi(dateRange);
        if (response?.data) {
          const chartData: TimeSlotChartData[] = response.data.map((item: any) => ({
            timeSlot: item.timeSlot || '',
            revenue: item.totalRevenue || 0,
            occupancy: item.avgOccupancy || 0
          }));
          setData(chartData);
        }
      } catch (error) {
        console.error('Error fetching time slot data:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    if (dateRange.startDate && dateRange.endDate) {
      fetchData();
    }
  }, [dateRange]);

  if (loading) {
    return (
      <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-600 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-600 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
      <h3 className={`text-lg text-white mb-4`} style={lexendMedium}>
        Performance by Time Slot
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis 
            dataKey="timeSlot" 
            stroke="#9CA3AF"
            fontSize={12}
            tick={{ fill: '#9CA3AF' }}
          />
          <YAxis 
            stroke="#9CA3AF"
            fontSize={12}
            tick={{ fill: '#9CA3AF' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F3F4F6'
            }}
          />
          <Legend />
          <Bar dataKey="revenue" fill="#8884d8" name="Revenue (₹)" />
          <Bar dataKey="occupancy" fill="#82ca9d" name="Avg Occupancy (%)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

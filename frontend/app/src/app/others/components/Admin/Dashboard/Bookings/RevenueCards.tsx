// components/RevenueCards.tsx
"use client";
import React from 'react';
import { DollarSign, Users, Ticket, TrendingUp } from 'lucide-react';
import {  lexendSmall } from '@/app/others/Utils/fonts';

interface AnalyticsData {
  totalRevenue: number;
  totalBookings: number;
  avgTicketPrice: number;
  marketShare: number;
}

interface RevenueCardsProps {
  analyticsData: AnalyticsData | null;
}

const RevenueCards: React.FC<RevenueCardsProps> = ({ analyticsData }) => {
  const cards = [
    {
      title: 'Total Revenue',
      value: analyticsData ? `₹${analyticsData.totalRevenue.toLocaleString('en-IN')}` : '₹0',
      icon: DollarSign,
      color: 'blue',
      description: 'Total earnings from bookings'
    },
    {
      title: 'Total Bookings',
      value: analyticsData ? analyticsData.totalBookings.toLocaleString('en-IN') : '0',
      icon: Users,
      color: 'green',
      description: 'Number of confirmed bookings'
    },
    {
      title: 'Avg Ticket Price',
      value: analyticsData ? `₹${analyticsData.avgTicketPrice.toFixed(2)}` : '₹0',
      icon: Ticket,
      color: 'purple',
      description: 'Average price per ticket'
    },
    {
      title: 'Market Share',
      value: analyticsData ? `${analyticsData.marketShare}%` : '0%',
      icon: TrendingUp,
      color: 'orange',
      description: 'Regional market share'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
      green: { bg: 'bg-green-500/20', text: 'text-green-400' },
      purple: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
      orange: { bg: 'bg-orange-500/20', text: 'text-orange-400' }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const colors = getColorClasses(card.color);
        
        return (
          <div
            key={index}
            className="bg-[#1a1a1a] border border-gray-600 rounded-lg shadow-lg p-6 hover:border-gray-500 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 ${colors.bg} rounded-xl`}>
                <Icon className={`w-6 h-6 ${colors.text}`} />
              </div>
            </div>
            
            <div className="space-y-1">
              <h3 className={`${lexendSmall.className} text-gray-400 text-sm`}>
                {card.title}
              </h3>
              <p className={`${lexendSmall.className} text-2xl text-white font-semibold`}>
                {card.value}
              </p>
              <p className={`${lexendSmall.className} text-gray-500 text-xs`}>
                {card.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RevenueCards;

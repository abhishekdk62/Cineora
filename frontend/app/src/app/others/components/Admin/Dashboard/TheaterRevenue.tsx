'use client'
import React from 'react';
import { MapPin, TrendingUp, Building } from 'lucide-react';

interface TheaterRevenueProps {
  data: any[];
  lexend: any;
}

const TheaterRevenueAnalytics: React.FC<TheaterRevenueProps> = ({ data, lexend }) => {
  // Group by theater and calculate revenue
  const theaterRevenue = data.reduce((acc, booking) => {
    if (booking.paymentStatus !== 'completed') return acc;
    
    const theaterId = booking.theaterId._id;
    const theaterName = booking.theaterId.name;
    const city = booking.theaterId.city;
    const revenue = booking.priceDetails.total;

    if (!acc[theaterId]) {
      acc[theaterId] = {
        id: theaterId,
        name: theaterName,
        city,
        totalRevenue: 0,
        totalBookings: 0,
        averageTicketPrice: 0
      };
    }

    acc[theaterId].totalRevenue += revenue;
    acc[theaterId].totalBookings += 1;
    acc[theaterId].averageTicketPrice = acc[theaterId].totalRevenue / acc[theaterId].totalBookings;

    return acc;
  }, {});

  const sortedTheaters = Object.values(theaterRevenue)
    .sort((a: any, b: any) => b.totalRevenue - a.totalRevenue)
    .slice(0, 10); // Top 10 theaters

  return (
    <div className="bg-gray-800/50 border border-yellow-500/20 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-yellow-500/20 rounded-lg">
          <Building className="w-6 h-6 text-yellow-400" />
        </div>
        <div>
          <h2 className={`${lexend.className} text-2xl text-white font-bold`}>
            Theater Revenue Analytics
          </h2>
          <p className="text-gray-400 text-sm">Top performing theaters by revenue</p>
        </div>
      </div>

      <div className="space-y-4">
        {sortedTheaters.map((theater: any, index: number) => (
          <div 
            key={theater.id}
            className="bg-gray-700/30 border border-gray-600/30 rounded-xl p-4 hover:border-yellow-500/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 bg-yellow-500/20 rounded-lg">
                  <span className={`${lexend.className} text-yellow-400 font-bold`}>
                    #{index + 1}
                  </span>
                </div>
                <div>
                  <h3 className={`${lexend.className} text-lg text-white font-semibold`}>
                    {theater.name}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span style={{ fontFamily: lexend.style.fontFamily }}>
                      {theater.city}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className={`${lexend.className} text-xl text-green-400 font-bold`}>
                    ₹{theater.totalRevenue.toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-4 text-sm text-gray-400">
                  <span style={{ fontFamily: lexend.style.fontFamily }}>
                    {theater.totalBookings} bookings
                  </span>
                  <span style={{ fontFamily: lexend.style.fontFamily }}>
                    Avg: ₹{Math.round(theater.averageTicketPrice)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TheaterRevenueAnalytics;

'use client'
import React from 'react';
import { User, TrendingUp, Crown } from 'lucide-react';

interface OwnerRevenueProps {
  data: any[];
  lexend: any;
}

const OwnerRevenueAnalytics: React.FC<OwnerRevenueProps> = ({ data, lexend }) => {
  // Group by owner and calculate revenue
  const ownerRevenue = data.reduce((acc, booking) => {
    if (booking.paymentStatus !== 'completed') return acc;
    
    const ownerId = booking.theaterId.ownerId;
    const revenue = booking.priceDetails.total;
    const theaterName = booking.theaterId.name;
    const city = booking.theaterId.city;

    if (!acc[ownerId]) {
      acc[ownerId] = {
        id: ownerId,
        totalRevenue: 0,
        totalBookings: 0,
        theaters: new Set(),
        theaterDetails: [],
        cities: new Set()
      };
    }

    acc[ownerId].totalRevenue += revenue;
    acc[ownerId].totalBookings += 1;
    acc[ownerId].theaters.add(theaterName);
    acc[ownerId].cities.add(city);

    // Store theater details
    const existingTheater = acc[ownerId].theaterDetails.find(t => t.name === theaterName);
    if (existingTheater) {
      existingTheater.revenue += revenue;
      existingTheater.bookings += 1;
    } else {
      acc[ownerId].theaterDetails.push({
        name: theaterName,
        city,
        revenue,
        bookings: 1
      });
    }

    return acc;
  }, {});

  const sortedOwners = Object.values(ownerRevenue)
    .map((owner: any) => ({
      ...owner,
      theaterCount: owner.theaters.size,
      cityCount: owner.cities.size,
      averageRevenue: owner.totalRevenue / owner.totalBookings
    }))
    .sort((a: any, b: any) => b.totalRevenue - a.totalRevenue)
    .slice(0, 10);

  return (
    <div className="bg-gray-800/50 border border-purple-500/20 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-500/20 rounded-lg">
          <Crown className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h2 className={`${lexend.className} text-2xl text-white font-bold`}>
            Owner Revenue Analytics
          </h2>
          <p className="text-gray-400 text-sm">Top performing theater owners by revenue</p>
        </div>
      </div>

      <div className="space-y-4">
        {sortedOwners.map((owner: any, index: number) => (
          <div 
            key={owner.id}
            className="bg-gray-700/30 border border-gray-600/30 rounded-xl p-4 hover:border-purple-500/30 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 bg-purple-500/20 rounded-lg">
                  <span className={`${lexend.className} text-purple-400 font-bold`}>
                    #{index + 1}
                  </span>
                </div>
                <div>
                  <h3 className={`${lexend.className} text-lg text-white font-semibold`}>
                    Owner ID: {owner.id.slice(-8)}
                  </h3>
                  <div className="flex items-center gap-4 text-gray-400 text-sm mt-1">
                    <span style={{ fontFamily: lexend.style.fontFamily }}>
                      {owner.theaterCount} theaters
                    </span>
                    <span style={{ fontFamily: lexend.style.fontFamily }}>
                      {owner.cityCount} cities
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className={`${lexend.className} text-xl text-green-400 font-bold`}>
                    ₹{owner.totalRevenue.toLocaleString()}
                  </span>
                </div>
                <div className="text-sm text-gray-400">
                  <span style={{ fontFamily: lexend.style.fontFamily }}>
                    {owner.totalBookings} bookings
                  </span>
                </div>
              </div>
            </div>

            {/* Theater breakdown */}
            <div className="border-t border-gray-600/30 pt-3">
              <h4 className={`${lexend.className} text-sm text-gray-300 font-medium mb-2`}>
                Theater Breakdown:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {owner.theaterDetails.slice(0, 4).map((theater: any, idx: number) => (
                  <div key={idx} className="bg-gray-600/20 rounded-lg p-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white text-sm" style={{ fontFamily: lexend.style.fontFamily }}>
                        {theater.name}
                      </span>
                      <span className="text-green-400 text-sm font-medium">
                        ₹{theater.revenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {theater.city} • {theater.bookings} bookings
                    </div>
                  </div>
                ))}
                {owner.theaterDetails.length > 4 && (
                  <div className="text-gray-500 text-sm">
                    +{owner.theaterDetails.length - 4} more theaters
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OwnerRevenueAnalytics;

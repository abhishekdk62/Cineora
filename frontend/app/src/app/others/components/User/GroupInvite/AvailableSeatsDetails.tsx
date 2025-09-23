import React from "react";
import { Lexend } from "next/font/google";
import { Users } from "lucide-react";

const lexendMedium = Lexend({ weight: "400", subsets: ["latin"] });
const lexendSmall = Lexend({ weight: "200", subsets: ["latin"] });

interface AvailableSeatsDetailsProps {
  availableSeats: Array<{
    seatNumber: string;
    seatType: 'VIP' | 'Premium' | 'Normal';
    price: number;
  }>;
}

export const AvailableSeatsDetails: React.FC<AvailableSeatsDetailsProps> = ({ availableSeats }) => {
  const getSeatTypeColor = (type: string) => {
    switch (type) {
      case 'VIP': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'Premium': return 'text-purple-400 bg-purple-400/10 border-purple-400/30';
      default: return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
    }
  };

  return (
    <div className="pt-6 border-t border-gray-600/30">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-purple-400" />
        <h3 className={`${lexendMedium.className} text-white text-lg`}>
          Available for Others
        </h3>
      </div>

      <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
        <div className="space-y-3">
          {availableSeats.map((seat, index) => (
            <div key={seat.seatNumber} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className={`px-3 py-2 rounded-lg border ${getSeatTypeColor(seat.seatType)}`}>
                  <span className={`${lexendMedium.className} text-sm font-bold`}>
                    {seat.seatNumber}
                  </span>
                </div>
                <span className={`${lexendSmall.className} text-purple-200`}>
                  {seat.seatType} Seat
                </span>
              </div>
              <span className={`${lexendMedium.className} text-purple-200`}>
                ₹{seat.price}
              </span>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-3 border-t border-purple-500/20">
          <p className={`${lexendSmall.className} text-purple-400 text-xs`}>
            {availableSeats.length} seat{availableSeats.length > 1 ? 's' : ''} available for others to join
          </p>
        </div>
      </div>
    </div>
  );
};

// components/User/GroupInvite/HostSeatDetails.tsx
import React from "react";
import { Lexend } from "next/font/google";
import { Crown } from "lucide-react";

const lexendMedium = Lexend({ weight: "400", subsets: ["latin"] });
const lexendSmall = Lexend({ weight: "200", subsets: ["latin"] });

interface HostSeatDetailsProps {
  hostSeat: {
    seatNumber: string;
    seatType: 'VIP' | 'Premium' | 'Normal';
    price: number;
  };
}

export const HostSeatDetails: React.FC<HostSeatDetailsProps> = ({ hostSeat }) => {
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
        <Crown className="w-5 h-5 text-yellow-400" />
        <h3 className={`${lexendMedium.className} text-white text-lg`}>
          Your Seat (Host)
        </h3>
      </div>

      <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`px-3 py-2 rounded-lg border ${getSeatTypeColor(hostSeat.seatType)}`}>
              <span className={`${lexendMedium.className} text-sm font-bold`}>
                {hostSeat.seatNumber}
              </span>
            </div>
            <div>
              <p className={`${lexendMedium.className} text-green-300 text-sm`}>
                {hostSeat.seatType} Seat
              </p>
              <p className={`${lexendSmall.className} text-green-400 text-xs`}>
                You'll pay for this seat when creating the invite
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className={`${lexendMedium.className} text-green-300 text-lg font-bold`}>
              ₹{hostSeat.price}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

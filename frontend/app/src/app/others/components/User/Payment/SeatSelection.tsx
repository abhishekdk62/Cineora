// components/SeatSelection.tsx
import React from "react";
import { Lexend } from "next/font/google";
import { Users } from "lucide-react";

const lexendSmall = Lexend({ weight: "200", subsets: ["latin"] });
const lexendMedium = Lexend({ weight: "400", subsets: ["latin"] });

interface SeatSelectionProps {
  selectedSeats: string[];
  seatBreakdown: Array<{
    type: string;
    displayType?: string;
    price: number;
    count: number;
    total: number;
    seats: string[];
  }>;
}

export const SeatSelection: React.FC<SeatSelectionProps> = ({ 
  selectedSeats, 
  seatBreakdown 
}) => {
  const getSeatTypeColor = (typeString: string) => {
    const lowerType = typeString.toLowerCase();
    
    if (lowerType.includes('vip')) {
      return {
        backgroundColor: '#EAB308',
        borderColor: '#CA8A04'
      };
    } else if (lowerType.includes('premium')) {
      return {
        backgroundColor: '#9333EA',
        borderColor: '#7C3AED'
      };
    } else if (lowerType.includes('normal') || lowerType.includes('regular') || lowerType.includes('standard')) {
      return {
        backgroundColor: '#06B6D4',
        borderColor: '#0891B2'
      };
    } else {
      return {
        backgroundColor: '#6B7280',
        borderColor: '#4B5563'
      };
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-white" />
          <h3 className={`${lexendMedium.className} text-white text-lg`}>
            Selected Seats ({selectedSeats?.length || 0})
          </h3>
        </div>
      </div>
      


{/* Selected Seats Display */}
{selectedSeats && selectedSeats.length > 0 ? (
  <div className="flex flex-wrap gap-2.5 mb-4">
    {selectedSeats.map((seat, index) => (
      <div
        key={`${seat}-${index}`}
        className={`${lexendSmall.className} px-3 py-2 bg-white/15 border border-gray-500/40 rounded-md text-white text-[12px] font-medium`}
      >
        {seat}
      </div>
    ))}
  </div>
) : (
  <div className="text-gray-400 text-[12px] mb-4">No seats selected</div>
)}


{/* Individual Seat Breakdown - NO GROUPING */}
<div className="space-y-3">
  {seatBreakdown && seatBreakdown.length > 0 ? (
    seatBreakdown.map((item, index) => {
      const colors = getSeatTypeColor(item.type);

      return (
        <div 
          key={`${item.seats[0]}-${index}`}
          className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-gray-600/20"
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-3.5 h-3.5 rounded-full border"
              style={{
                backgroundColor: colors.backgroundColor,
                borderColor: colors.borderColor
              }}
            />
            <span className={`${lexendSmall.className} text-white text-[12px]`}>
              {item.displayType || `${item.type} - ${item.seats[0]}`}
            </span>
          </div>
          <span className={`${lexendMedium.className} text-white text-[13px]`}>
            ₹{item.total}
          </span>
        </div>
      );
    })
  ) : (
    <div className="text-gray-400 text-[12px]">No seat breakdown available</div>
  )}
</div>

    </div>
  );
};

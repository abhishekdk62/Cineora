import React, { useState } from "react";
import { ChevronDown, ChevronUp, Eye, Users } from "lucide-react";

interface SelectionSummaryProps {
  selectedSeats: string[];
  totalAmount: number;
  lexendMediumClassName: string;
  lexendSmallClassName: string;
    onCreateGroupInvite?: () => void; 

  lexendBoldClassName: string;
  onProceed: () => void;
  getSeatPrice: (seatId: string) => number;
  getSeatType: (seatId: string) => string;
}

export default function SelectionSummary({
  selectedSeats, 
  totalAmount, 
  lexendMediumClassName, 
  lexendSmallClassName, 
  onCreateGroupInvite,
  lexendBoldClassName, 
  onProceed,
  getSeatPrice,
  getSeatType
}: SelectionSummaryProps) {
  const [showDetails, setShowDetails] = useState(false);

  const getSeatBreakdown = () => {
    const breakdown: Record<string, { seats: string[], price: number, count: number, seatType: string }> = {};
    
    selectedSeats.forEach(seatId => {
      const seatType = getSeatType(seatId) || 'General';
      const price = getSeatPrice(seatId);
      
      const key = `${seatType}-${price}`;
      
      if (!breakdown[key]) {
        breakdown[key] = { 
          seats: [], 
          price, 
          count: 0, 
          seatType 
        };
      }
      
      breakdown[key].seats.push(seatId);
      breakdown[key].count += 1;
    });
    
    return breakdown;
  };

  const seatBreakdown = getSeatBreakdown();

  return (
    <div className="backdrop-blur-sm bg-black/20 rounded-2xl p-6 border border-gray-500/30">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className={`${lexendMediumClassName} text-white text-lg`}>
            {selectedSeats.length} Seat{selectedSeats.length > 1 ? "s" : ""} Selected
          </p>
          <p className={`${lexendSmallClassName} text-gray-300`}>
            {selectedSeats.join(", ")}
          </p>
        </div>
        <div className="text-right">
          <p className={`${lexendBoldClassName} text-white text-xl`}>
            ₹{totalAmount}
          </p>
          <p className={`${lexendSmallClassName} text-gray-300`}>
            Total Amount
          </p>
        </div>
      </div>

      {/* See Details Button */}
      <div className="mb-4">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className={`${lexendSmallClassName} flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-200 text-sm`}
        >
          <Eye className="w-4 h-4" />
          See Details
          {showDetails ? 
            <ChevronUp className="w-4 h-4" /> : 
            <ChevronDown className="w-4 h-4" />
          }
        </button>
      </div>

      {/* Price Breakdown Details */}
      {showDetails && (
        <div className="mb-4 p-4 rounded-xl bg-black/30 border border-gray-600/30">
          <h4 className={`${lexendMediumClassName} text-white text-sm mb-3`}>
            Price Breakdown
          </h4>
          
          {Object.entries(seatBreakdown).map(([key, details]) => (
            <div key={key} className="flex items-center justify-between py-2 border-b border-gray-600/20 last:border-b-0">
              <div className="flex items-center gap-3">
                {/* Color indicator based on seat type */}
                <div 
                  className="w-3 h-3 rounded-full border"
                  style={{
                    backgroundColor: details.seatType === 'VIP' ? '#EAB308' : 
                                   details.seatType === 'Premium' ? '#9333EA' : '#06B6D4',
                    borderColor: details.seatType === 'VIP' ? '#CA8A04' : 
                               details.seatType === 'Premium' ? '#7C3AED' : '#0891B2'
                  }}
                />
                <span className={`${lexendSmallClassName} text-gray-300 text-sm`}>
                  {details.seatType} (₹{details.price})
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`${lexendSmallClassName} text-gray-400 text-sm`}>
                  {details.count} × ₹{details.price}
                </span>
                <span className={`${lexendSmallClassName} text-white text-sm font-medium`}>
                  = ₹{details.count * details.price}
                </span>
              </div>
            </div>
          ))}
          
          {/* Total Line */}
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-500/30">
            <span className={`${lexendMediumClassName} text-white text-base font-semibold`}>
              TOTAL
            </span>
            <span className={`${lexendBoldClassName} text-white text-lg`}>
              ₹{totalAmount}
            </span>
          </div>
        </div>
      )}
        <div className="flex gap-3">
      {onCreateGroupInvite&&selectedSeats.length>1 && (
        <button
          onClick={onCreateGroupInvite}
          className={`${lexendMediumClassName} flex-1 border border-purple-500 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 hover:text-purple-200 font-medium py-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2`}
        >
          <Users className="w-5 h-5" />
          Create Group Invite
        </button>
      )}

      <button
        onClick={onProceed}
        className={`${lexendMediumClassName} ${onCreateGroupInvite ? 'flex-1' : 'w-full'} border bg-white text-black hover:bg-gradient-to-tr hover:from-violet-300 hover:to-yellow-100 font-medium py-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02]`}
      >
        Book Now
      </button>
    </div>

    </div>
  );
}

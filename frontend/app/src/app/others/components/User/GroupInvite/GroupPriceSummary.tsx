// components/User/GroupInvite/GroupPriceSummary.tsx
import React from "react";
import { Lexend } from "next/font/google";
import { Calculator, Info } from "lucide-react";

const lexendSmall = Lexend({ weight: "200", subsets: ["latin"] });
const lexendMedium = Lexend({ weight: "400", subsets: ["latin"] });
const lexendBold = Lexend({ weight: "700", subsets: ["latin"] });

interface GroupPriceSummaryProps {
  data: {
    totalSeats: number;
    totalAmount: number;
    subtotal: number;
    convenienceFee: number;
    taxes: number;
    discount: number;
    finalTotal: number;
    hostAmount: number;
    finalHostAmount: number;
    availableAmount: number;
    finalAvailableAmount: number;
  };
}

export const GroupPriceSummary: React.FC<GroupPriceSummaryProps> = ({ data }) => {
  return (
    <div className="pt-6 border-t border-gray-600/30">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-white" />
        <h3 className={`${lexendMedium.className} text-white text-lg`}>
          Group Summary
        </h3>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className={`${lexendSmall.className} text-gray-400`}>
            Total Seats
          </span>
          <span className={`${lexendMedium.className} text-white`}>
            {data.totalSeats} seats
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className={`${lexendSmall.className} text-gray-400`}>Subtotal</span>
          <div className="text-right">
            {data.discount > 0 && (
              <div className={`${lexendSmall.className} text-gray-400 line-through text-sm`}>
                ₹{data.totalAmount}
              </div>
            )}
            <span className={`${lexendMedium.className} text-white`}>
              ₹{data.subtotal}
            </span>
          </div>
        </div>

        {/* Convenience Fee */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <span className={`${lexendSmall.className} text-gray-400`}>Convenience Fee (5%)</span>
            <Info className="w-3 h-3 text-gray-500" />
          </div>
          <span className={`${lexendMedium.className} text-white`}>₹{data.convenienceFee}</span>
        </div>
        
        {/* Taxes & GST */}
        <div className="flex justify-between items-center">
          <span className={`${lexendSmall.className} text-gray-400`}>Taxes & GST (18%)</span>
          <span className={`${lexendMedium.className} text-white`}>₹{data.taxes}</span>
        </div>

        {/* Coupon Discount */}
        {data.discount > 0 && (
          <div className="flex justify-between items-center">
            <span className={`${lexendSmall.className} text-green-400`}>
              Coupon Discount (All Tickets)
            </span>
            <span className={`${lexendMedium.className} text-green-400 font-bold`}>
              -₹{data.discount}
            </span>
          </div>
        )}
        
        {/* Payment Breakdown */}
        <div className="pt-3 mt-3 border-t border-gray-600/20">
          <div className="flex justify-between items-center">
            <span className={`${lexendSmall.className} text-gray-400`}>
              Your Payment (Host)
            </span>
            <span className={`${lexendMedium.className} text-green-400`}>
              ₹{data.finalHostAmount}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className={`${lexendSmall.className} text-gray-400`}>
              Others Will Pay (Total)
            </span>
            <span className={`${lexendMedium.className} text-purple-400`}>
              ₹{data.finalAvailableAmount}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-gray-500/20 mb-6">
        <span className={`${lexendBold.className} text-white text-xl`}>
          TOTAL AMOUNT
        </span>
        <div className="text-right">
          {data.discount > 0 && (
            <div className={`${lexendSmall.className} text-gray-400 line-through text-sm`}>
              ₹{data.totalAmount + data.convenienceFee + data.taxes}
            </div>
          )}
          <span className={`${lexendBold.className} text-white text-2xl`}>
            ₹{data.finalTotal}
          </span>
        </div>
      </div>
    </div>
  );
};

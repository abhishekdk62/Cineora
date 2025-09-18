import React from "react";
import { Lexend } from "next/font/google";
import { Info, Tag } from "lucide-react";
import { CouponData } from "@/app/others/types";

const lexendSmall = Lexend({ weight: "200", subsets: ["latin"] });
const lexendMedium = Lexend({ weight: "400", subsets: ["latin"] });
const lexendBold = Lexend({ weight: "700", subsets: ["latin"] });

interface PriceSummaryProps {
  data: {
    subtotal: number;
    convenienceFee: number;
    taxes: number;
    discount?: number;
    total: number;
    savings?: number;
    selectedCoupon?: CouponData;
  };
}

export const PriceSummary: React.FC<PriceSummaryProps> = ({ data }) => {
  return (
    <div className="pt-6 border-t border-gray-600/30">
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className={`${lexendSmall.className} text-gray-400`}>Subtotal</span>
          <span className={`${lexendMedium.className} text-white`}>₹{data.subtotal}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <span className={`${lexendSmall.className} text-gray-400`}>Convenience Fee (5%)</span>
            <Info className="w-3 h-3 text-gray-500" />
          </div>
          <span className={`${lexendMedium.className} text-white`}>₹{data.convenienceFee}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className={`${lexendSmall.className} text-gray-400`}>Taxes & GST (18%)</span>
          <span className={`${lexendMedium.className} text-white`}>₹{data.taxes}</span>
        </div>

        {data.discount && data.discount > 0 && (
          <div className="flex justify-between items-center rounded-lg">
            <div className="flex items-center gap-2">
              <div>
                <span className={`${lexendSmall.className} text-green-400`}>
                  Coupon Discount
                </span>
              
              </div>
            </div>
            <span className={`${lexendMedium.className} text-green-400 font-bold`}>
              -₹{data.discount}
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-gray-500/20 mb-6">
        <span className={`${lexendBold.className} text-white text-xl`}>TOTAL AMOUNT</span>
        <div className="text-right">
          {data.discount && data.discount > 0 && (
            <div className={`${lexendSmall.className} text-gray-400 line-through text-sm`}>
              ₹{data.subtotal + data.convenienceFee + data.taxes}
            </div>
          )}
          <span className={`${lexendBold.className} text-white text-2xl`}>
            ₹{data.total}
          </span>
        </div>
      </div>
    </div>
  );
};

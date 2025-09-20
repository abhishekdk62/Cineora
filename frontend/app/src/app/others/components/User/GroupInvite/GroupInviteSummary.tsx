// components/User/GroupInvite/GroupInviteSummary.tsx
import React from "react";
import { Lexend } from "next/font/google";
import { Users } from "lucide-react";
import { GroupMovieDetails } from "./GroupMovieDetails";
import { HostSeatDetails } from "./HostSeatDetails";
import { AvailableSeatsDetails } from "./AvailableSeatsDetails";
import { GroupSettings } from "./GroupSettings";
import { GroupPriceSummary } from "./GroupPriceSummary";
import { GroupCouponDetails } from "../Payment/GroupCouponDetails";

const lexendMedium = Lexend({ weight: "400", subsets: ["latin"] });
const lexendSmall = Lexend({ weight: "200", subsets: ["latin"] });

interface GroupInviteSummaryProps {
  data: any;
  onCreateInvite: () => void;
  onRatingChange: (rating: number | undefined) => void;
  minRating?: number;
  isCreating: boolean;
  // Add coupon props
  selectedCoupon?: any;
  availableCoupons?: any[];
  onSelectCoupon?: (coupon: any) => void;
  onRemoveCoupon?: () => void;
}

export const GroupInviteSummary: React.FC<GroupInviteSummaryProps> = ({ 
  data, 
  onCreateInvite, 
  onRatingChange, 
  minRating,
  isCreating,
  selectedCoupon,
  availableCoupons,
  onSelectCoupon,
  onRemoveCoupon
}) => {
  return (
    <div className="backdrop-blur-sm bg-black/20 rounded-2xl p-8 border border-gray-500/30">
      <div className="space-y-8">
        <GroupMovieDetails data={data} />
        
        <HostSeatDetails hostSeat={data.hostSeat} />
        
        <AvailableSeatsDetails availableSeats={data.availableSeats} />
        
        <GroupSettings 
          onRatingChange={onRatingChange}
          minRating={minRating}
        />
        
        <GroupCouponDetails
          selectedCoupon={selectedCoupon}
          availableCoupons={availableCoupons}
          onSelectCoupon={onSelectCoupon}
          onRemoveCoupon={onRemoveCoupon}
          discount={data.discount || 0}
          totalSeatPrice={data.totalSeatPrice || data.totalAmount || 0}
          totalSeats={data.totalSeats || 0} 
          theaterId={data.theaterId}
        />
        
        <GroupPriceSummary data={data} />
        
        <button
          onClick={onCreateInvite}
          disabled={isCreating}
          className={`${lexendMedium.className} w-full py-4 bg-purple-600 text-white hover:bg-purple-700 font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02] gap-2 text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
        >
          <div className="flex items-center justify-center gap-2">
            {isCreating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Creating Invite...
              </>
            ) : (
              <>
                <Users className="w-5 h-5" />
                Pay ₹{data.finalHostAmount || data.hostAmount} & Create Group Invite
              </>
            )}
          </div>
        </button>
        
        <p className={`${lexendSmall.className} text-gray-500 text-xs text-center mt-3`}>
          You'll pay for your seat now. Others will pay when they join.
        </p>
      </div>
    </div>
  );
};

import React from "react";
import { Lexend } from "next/font/google";
import { Zap } from "lucide-react";
import { SeatSelection } from "./SeatSelection";
import { MovieDetails } from "./MovieDetails";
import { PriceSummary } from "./PriceSummary";
import { setBookingData } from "@/app/others/redux/slices/bookingSlice";
import { useDispatch } from "react-redux";
import { CouponDetails } from "./Coupondetails";
import { CouponData } from "@/app/others/types";
const lexendMedium = Lexend({ weight: "400", subsets: ["latin"] });
const lexendSmall = Lexend({ weight: "200", subsets: ["latin"] });
interface BookingSummaryProps {
  data: any;
  onPayment: () => void;
  selectedCoupon?: CouponData;
  availableCoupons?: CouponData[];
  onSelectCoupon?: (coupon: CouponData) => void;
  onRemoveCoupon?: () => void;
  onShowCouponsModal?: () => void;

}
export const BookingSummary: React.FC<BookingSummaryProps> = ({ data, onPayment, selectedCoupon,
  availableCoupons,
  onSelectCoupon,
  onRemoveCoupon,
  onShowCouponsModal }) => {
  const dispatch = useDispatch()
  return (
    <div className="backdrop-blur-sm bg-black/20 rounded-2xl p-8 border border-gray-500/30">
      <div className="space-y-8">
        <MovieDetails data={data} />

        <SeatSelection
          selectedSeats={data.selectedSeats}
          seatBreakdown={data.seatBreakdown}
        />
        <CouponDetails
          selectedCoupon={selectedCoupon}
          availableCoupons={availableCoupons}
          onSelectCoupon={onSelectCoupon}
          onRemoveCoupon={onRemoveCoupon}
          onShowCouponsModal={onShowCouponsModal}
          discount={data.discount}
        />

        <PriceSummary data={data} />

        <button

          onClick={() => {
            dispatch(setBookingData({ totalAmount: data.total, tax: data.taxes, amount: data.subtotal }))
            onPayment()

          }}
          className={`${lexendMedium.className} w-full py-4 bg-white text-black hover:bg-gradient-to-tr hover:from-violet-300 hover:to-yellow-100 font-medium  rounded-xl transition-all duration-200 transform hover:scale-[1.02] gap-2  text-lg  shadow-lg hover:bg-gray-100`}
        >
          <div className="flex items-center justify-center ">
            Pay ₹{data.total}
          </div>
        </button>

        <p className={`${lexendSmall.className} text-gray-500 text-xs text-center mt-3`}>
          By proceeding, you agree to our <span className="text-cyan-400">Terms & Conditions</span>
        </p>
      </div>
    </div>
  );
};

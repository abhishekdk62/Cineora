import React, { useState } from "react";
import { Lexend } from "next/font/google";
import { Info, X, Tag, ChevronDown, ChevronUp, Ticket } from "lucide-react";
import { checkCoupon } from "@/app/others/services/userServices/couponServices";
import { useSelector } from "react-redux";
import toast from 'react-hot-toast';


const lexendSmall = Lexend({ weight: "200", subsets: ["latin"] });
const lexendMedium = Lexend({ weight: "400", subsets: ["latin"] });
const lexendBold = Lexend({ weight: "700", subsets: ["latin"] });

interface CouponDetailsProps {
  selectedCoupon?: any;
  availableCoupons?: any[];
  onSelectCoupon?: (coupon: any) => void;
  onRemoveCoupon?: () => void;
  onShowCouponsModal?: () => void;
  discount?: number;
}

export const CouponDetails: React.FC<CouponDetailsProps> = ({
  selectedCoupon,
  availableCoupons,
  onSelectCoupon,
  onRemoveCoupon,
  onShowCouponsModal,
  discount = 0
}) => {
  const [showCouponsModal, setShowCouponsModal] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const bookingDatasRedux = useSelector((state: any) => state.booking.bookingData);


const applyCouponByCode = async (code: string) => {
  const loadingToast = toast.loading('Validating coupon...');
  
  try {
    const data = await checkCoupon(bookingDatasRedux.theaterId, code);
    console.log(data);
    
    if (data && data.data) {
      handleSelectCoupon(data.data);
      toast.success('Coupon applied successfully!', { id: loadingToast });
      return { success: true, data: data.data };
    } else {
      toast.error("Coupon doesn't exist or expired", { id: loadingToast });
      return { success: false, message: "Coupon doesn't exist or expired" };
    }
  } catch (error: any) {
    console.log(error);
    
    const errorMessage = error?.response?.data?.message || "Coupon doesn't exist or expired";
    toast.error(errorMessage, { id: loadingToast });
    return { success: false, message: errorMessage };
  }
};



  const handleToggleCoupons = () => {
    setShowCouponsModal(!showCouponsModal);
    onShowCouponsModal?.();
  };

  const handleSelectCoupon = (coupon: any) => {
    onSelectCoupon?.(coupon);
    setShowCouponsModal(false);
    setCouponError("");
    setCouponSuccess("");
  };

const handleApplyCouponCode = async () => {
  if (!couponCode.trim()) {
    setCouponError("Please enter a coupon code");
    return;
  }

  setIsApplying(true);
  setCouponError("");
  setCouponSuccess("");

  try {
    const result = await applyCouponByCode(couponCode.trim());
    
    if (result && result.success) {
      // Success - coupon already applied via handleSelectCoupon in applyCouponByCode
      setCouponSuccess("Coupon applied successfully!");
      setCouponCode("");
      setTimeout(() => setCouponSuccess(""), 3000);
    } else {
      // Error
      setCouponError(result?.message || "Coupon doesn't exist or expired");
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    setCouponError("Failed to apply coupon. Please try again.");
  } finally {
    setIsApplying(false);
  }
};


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApplyCouponCode();
    }
  };

  return (
    <>
      <div className="pt-6 border-t border-gray-600/30">
        {/* Header with Toggle Button */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-white" />
            <h3 className={`${lexendMedium.className} text-white text-lg`}>
              Apply Coupons
            </h3>
          </div>
          
          {/* Toggle Arrow Button */}
          <button
            onClick={handleToggleCoupons}
            className={`${lexendSmall.className} flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-200 text-sm`}
          >
            View Coupons
            {showCouponsModal ? 
              <ChevronUp className="w-4 h-4 transition-transform duration-200" /> : 
              <ChevronDown className="w-4 h-4 transition-transform duration-200" />
            }
          </button>
        </div>

        {/* Coupon Code Input Field */}
        {!selectedCoupon && (
          <div className="mb-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value.toUpperCase());
                    setCouponError("");
                    setCouponSuccess("");
                  }}
                  onKeyPress={handleKeyPress}
                  className={`w-full px-4 py-3 bg-white/5 border ${
                    couponError ? 'border-red-500/50' : 'border-gray-600/30'
                  } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all`}
                  disabled={isApplying}
                />
                <Ticket className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              
              <button
                onClick={handleApplyCouponCode}
                disabled={isApplying || !couponCode.trim()}
                className={`px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-all duration-200 min-w-[100px] disabled:opacity-50 disabled:cursor-not-allowed ${
                  isApplying ? 'cursor-wait' : ''
                }`}
              >
                {isApplying ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  </div>
                ) : (
                  'Apply'
                )}
              </button>
            </div>
            
            {/* Error Message */}
            {couponError && (
              <div className="mt-2 text-red-400 text-sm flex items-center gap-2">
                <X className="w-4 h-4" />
                {couponError}
              </div>
            )}
            
            {/* Success Message */}
            {couponSuccess && (
              <div className="mt-2 text-green-400 text-sm flex items-center gap-2">
                <Tag className="w-4 h-4" />
                {couponSuccess}
              </div>
            )}
          </div>
        )}

        {/* Applied Coupon Display */}
        {selectedCoupon && (
          <div className="mb-4">
            <div className="flex justify-between items-center p-3 bg-white/5 border border-green-500/30 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full border"
                  style={{
                    backgroundColor: 'green',
                    borderColor: 'green'
                  }}
                />
                <div className="flex items-center gap-2 justify-center">
                  <span className={`${lexendSmall.className} text-green-400 block`}>
                    {selectedCoupon.name}
                  </span>
                  <span className={`${lexendSmall.className} text-green-300 text-xs`}>
                    {selectedCoupon.discountPercentage}% OFF
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onRemoveCoupon}
                  className="text-white hover:text-red-300 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Animated Dropdown Content */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          showCouponsModal 
            ? 'max-h-96 opacity-100 mb-6' 
            : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-black/10 border border-gray-600/20 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-600/20">
            <div className="flex items-center justify-between">
              <h2 className={`${lexendBold.className} text-lg text-white`}>
                Available Coupons
              </h2>
              <span className={`${lexendSmall.className} text-gray-400`}>
                {availableCoupons?.length || 0} available
              </span>
            </div>
          </div>

          <div className="p-4 overflow-y-auto max-h-80">
            {availableCoupons && availableCoupons.length > 0 ? (
              <div className="space-y-4">
                {availableCoupons.map((coupon, index) => (
                  <div
                    key={coupon._id}
                    onClick={() => handleSelectCoupon(coupon)}
                    className="p-4 bg-white/5 border border-gray-500/20 rounded-lg cursor-pointer hover:bg-white/10 transition-all duration-200"
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: showCouponsModal ? 'slideInFromTop 0.3s ease-out forwards' : 'none'
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className={`${lexendSmall.className} text-white text-lg`}>
                          {coupon.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="border border-orange-300 text-white px-2 py-1 rounded text-xs font-bold">
                            {coupon.discountPercentage}% OFF
                          </span>
                          <span className={`${lexendSmall.className} text-gray-400`}>
                            Code: {coupon.uniqueId}
                          </span>
                        </div>
                      </div>
                      
                      {selectedCoupon?._id === coupon._id && (
                        <div className="text-green-400">
                          <Tag className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">🎫</div>
                <p className={`${lexendMedium.className} text-gray-400`}>
                  No coupons available for this theater
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

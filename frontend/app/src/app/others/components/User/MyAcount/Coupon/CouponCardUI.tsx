"use client";
import React from "react";
import { Copy, Calendar, Users, CheckCircle } from "lucide-react";

interface CouponCardUIProps {
  // Coupon data
  name: string;
  description?: string;
  discountPercentage: number;
  uniqueId: string;
  expiryDate?: string;
  maxUsageCount: number;
  currentUsageCount?: number; // Add this prop
  isActive: boolean;
  isExpired: boolean;

  // UI state
  copied: boolean;
  expiryStatus: {
    status: string;
    text: string;
    color: string;
  };

  // Event handlers
  onCopyCode: () => void;
  onShowTheaters: () => void;

  index?: number;
}

const CouponCardUI: React.FC<CouponCardUIProps> = ({
  name,
  description,
  discountPercentage,
  uniqueId,
  expiryDate,
  maxUsageCount,
  currentUsageCount = 0, // Default to 0
  isActive,
  isExpired,
  copied,
  expiryStatus,
  onCopyCode,
  onShowTheaters,
  index = 0
}) => {
  // Determine if coupon is truly expired/inactive
  const isCouponInactive = !isActive || isExpired || (currentUsageCount >= maxUsageCount);
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Enhanced Coupon Container - Gray and reduced opacity when inactive */}
      <div className={`relative bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl ${
        isCouponInactive ? 'opacity-50 grayscale' : ''
      }`}>
        
        <div className="flex h-64">
          {/* Left Discount Section - Gray if inactive */}
          <div className={`w-44 flex flex-col items-center justify-center text-white relative ${
            isCouponInactive ? 'bg-gray-500' : 'bg-orange-500'
          }`}>
            {/* Curved cutouts */}
            <div className="absolute top-24 -right-4 w-8 h-6 bg-white rounded-full z-10" />
            <div className="absolute bottom-24 -right-4 w-8 h-6 bg-white rounded-full z-10" />
            
            {/* Film strip perforations */}
            <div className="absolute right-3 top-6 bottom-6 w-1 flex flex-col justify-evenly">
              {[...Array(14)].map((_, i) => (
                <div key={i} className="w-1 h-1 bg-white/50 rounded-full" />
              ))}
            </div>
            
            {/* Discount Display */}
            <div className="text-center z-10">
              <div className="text-6xl font-black mb-3 drop-shadow-lg">
                {discountPercentage}%
              </div>
              <div className="text-xl font-bold tracking-wide drop-shadow-lg">OFF</div>
            </div>
            
            {/* Decorative Cinema Elements */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="w-8 h-8 border-2 border-white/50 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Right Content Section */}
          <div 
            className="flex-1 relative bg-gray-50"
            style={{
              backgroundImage: `url("https://static.vecteezy.com/system/resources/previews/047/490/415/non_2x/popcorn-spilling-from-a-striped-box-isolated-on-a-transparent-background-free-png.png")`,
              backgroundSize: 'contain',
              backgroundPosition: 'left center',
              backgroundRepeat: 'no-repeat',
              transform: 'scaleX(-1)'
            }}
          >
            {/* Overlay for readability */}
            <div className="absolute inset-0 bg-white/40"></div>
            
            {/* Matching curved cutouts */}
            <div className="absolute top-24 -left-4 w-8 h-6 bg-white rounded-full z-10" />
            <div className="absolute bottom-24 -left-4 w-8 h-6 bg-white rounded-full z-10" />
            
            {/* Content with proper padding and flipped back to normal */}
            <div 
              className="relative z-20 p-6 h-full flex flex-col justify-between"
              style={{ transform: 'scaleX(-1)' }}
            >
              {/* Header Section */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1 pr-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                    {name || "Cinema Special Offer"}
                  </h3>
                  {description && (
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {description}
                    </p>
                  )}
                </div>
                
                {/* Status Badge - Updated for usage count */}
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  currentUsageCount >= maxUsageCount 
                    ? 'bg-gray-100 text-gray-700' 
                    : isCouponInactive
                    ? 'bg-red-100 text-red-700'
                    : 'bg-green-100 text-green-700'
                }`}>
                  {currentUsageCount >= maxUsageCount 
                    ? 'FULLY USED' 
                    : isCouponInactive 
                    ? 'EXPIRED' 
                    : 'ACTIVE'
                  }
                </div>
              </div>

              {/* Coupon Code Section - Disabled styling when inactive */}
              <div className="mb-6">
                <div 
                  onClick={isCouponInactive ? undefined : onCopyCode}
                  className={`flex items-center justify-between px-4 py-3 border-2 border-dashed rounded-lg transition-all duration-200 group ${
                    isCouponInactive 
                      ? 'bg-gray-50 border-gray-300 cursor-not-allowed' 
                      : 'bg-orange-50 border-orange-300 cursor-pointer hover:bg-orange-100'
                  }`}>
                  <div>
                    <div className={`text-xs font-medium mb-1 ${
                      isCouponInactive ? 'text-gray-600' : 'text-orange-600'
                    }`}>
                      COUPON CODE
                    </div>
                    <div className={`font-black text-lg tracking-widest ${
                      isCouponInactive ? 'text-gray-800' : 'text-orange-800'
                    }`}>
                      {uniqueId.toUpperCase()}
                    </div>
                  </div>
                  
                  {!isCouponInactive && (
                    <div className="flex items-center gap-2">
                      {copied ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-green-600 font-bold text-sm">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-5 h-5 text-orange-600 group-hover:text-orange-800" />
                          <span className="text-orange-600 group-hover:text-orange-800 font-bold text-sm">
                            Copy
                          </span>
                        </>
                      )}
                    </div>
                  )}
                  
                  {isCouponInactive && (
                    <div className="text-gray-500 text-sm">
                      Not Available
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Section with Better Labels */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                {/* Details with Usage Count */}
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className={`w-4 h-4 ${isCouponInactive ? 'text-gray-400' : 'text-orange-500'}`} />
                    <span>
                      <span className="font-medium">Expires:</span>{' '}
                      {expiryDate 
                        ? new Date(expiryDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })
                        : 'Never'
                      }
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className={`w-4 h-4 ${isCouponInactive ? 'text-gray-400' : 'text-orange-500'}`} />
                    <span>
                      <span className="font-medium">Usage:</span>{' '}
                      {maxUsageCount === 0 
                        ? 'Unlimited uses' 
                        : `${currentUsageCount}/${maxUsageCount} used`
                      }
                    </span>
                  </div>
                </div>

                {/* Action Button - Disabled when inactive */}
                <button
                  onClick={isCouponInactive ? undefined : onShowTheaters}
                  disabled={isCouponInactive}
                  className={`px-6 py-2 font-bold rounded-lg transition-colors duration-200 text-sm ${
                    isCouponInactive 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg'
                  }`}
                >
                  {isCouponInactive ? 'Unavailable' : 'Where to use?'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponCardUI;

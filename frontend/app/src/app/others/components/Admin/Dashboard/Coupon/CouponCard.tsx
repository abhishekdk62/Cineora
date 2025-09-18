// components/admin/CouponCard.tsx
import React from 'react';
import { Eye, Ban, Calendar, Percent, DollarSign, MapPin, CheckCircle2 } from 'lucide-react';

interface Theater {
  _id: string;
  name: string;
}

interface Coupon {
  _id: string;
  name: string;
  uniqueId: string;
  theaterIds: Theater[];
  discountPercentage: number;
  description: string;
  expiryDate: string;
  isActive: boolean;
  isUsed: boolean;
  maxUsageCount: number;
  currentUsageCount: number;
  minAmount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface CouponCardProps {
  coupon: Coupon;
  lexend: any;
  onViewDetails: (coupon: Coupon) => void;
  onToggleStatus: (couponId: string,f:boolean) => void;
  loading: boolean;
}

const CouponCard: React.FC<CouponCardProps> = ({ 
  coupon, 
  lexend, 
  onViewDetails, 
  onToggleStatus, 
  loading 
}) => {
  const isExpired = new Date(coupon.expiryDate) <= new Date();
  const isFullyUsed = coupon.currentUsageCount >= coupon.maxUsageCount;
  const usagePercentage = (coupon.currentUsageCount / coupon.maxUsageCount) * 100;

  const getStatusInfo = (): { text: string; color: string } => {
    if (!coupon.isActive) return { text: 'Disabled', color: 'text-gray-400 bg-gray-400/10' };
    if (isExpired) return { text: 'Expired', color: 'text-red-400 bg-red-400/10' };
    if (isFullyUsed) return { text: 'Fully Used', color: 'text-orange-400 bg-orange-400/10' };
    return { text: 'Active', color: 'text-green-400 bg-green-400/10' };
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="bg-gray-800/50 border border-yellow-500/20 rounded-2xl p-6 hover:border-yellow-500/30 transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-500/20 rounded-lg">
            <Percent className="w-4 h-4 text-yellow-400" />
          </div>
          <div>
            <h3 className={`${lexend.className} text-lg text-white font-semibold line-clamp-1`}>
              {coupon.name}
            </h3>
            <p className="text-gray-400 text-sm font-mono" style={{ fontFamily: lexend.style.fontFamily }}>
              {coupon.uniqueId}
            </p>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-lg text-xs font-medium ${statusInfo.color}`}>
          {statusInfo.text}
        </div>
      </div>

      {/* Discount and Min Amount */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Percent className="w-4 h-4 text-yellow-400" />
            <span className="text-gray-400 text-sm" style={{ fontFamily: lexend.style.fontFamily }}>
              Discount
            </span>
          </div>
          <p className={`${lexend.className} text-xl text-yellow-400 font-bold`}>
            {coupon.discountPercentage}%
          </p>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-green-400" />
            <span className="text-gray-400 text-sm" style={{ fontFamily: lexend.style.fontFamily }}>
              Min Amount
            </span>
          </div>
          <p className={`${lexend.className} text-lg text-green-400 font-semibold`}>
            ₹{coupon.minAmount}
          </p>
        </div>
      </div>

      {/* Usage Progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400 text-sm" style={{ fontFamily: lexend.style.fontFamily }}>
            Usage Progress
          </span>
          <span className="text-gray-400 text-sm" style={{ fontFamily: lexend.style.fontFamily }}>
            {coupon.currentUsageCount}/{coupon.maxUsageCount}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Theater Info */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="text-gray-400 text-sm" style={{ fontFamily: lexend.style.fontFamily }}>
            Valid at {coupon.theaterIds.length} theater(s)
          </span>
        </div>
        <div className="space-y-1">
          {coupon.theaterIds.slice(0, 2).map((theater: Theater, index: number) => (
            <div key={theater._id} className="bg-gray-700/30 rounded-lg p-2">
              <p className="text-white text-sm" style={{ fontFamily: lexend.style.fontFamily }}>
                {theater.name}
              </p>
            </div>
          ))}
          {coupon.theaterIds.length > 2 && (
            <div className="text-gray-500 text-sm" style={{ fontFamily: lexend.style.fontFamily }}>
              +{coupon.theaterIds.length - 2} more theaters
            </div>
          )}
        </div>
      </div>

      {/* Expiry Date */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-gray-400 text-sm" style={{ fontFamily: lexend.style.fontFamily }}>
            Expires: {new Date(coupon.expiryDate).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onViewDetails(coupon)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg transition-all duration-300"
          style={{ fontFamily: lexend.style.fontFamily }}
        >
          <Eye className="w-4 h-4" />
          Details
        </button>
        
        <button
          onClick={() => onToggleStatus(coupon._id,coupon.isActive)}
          disabled={loading}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 disabled:opacity-50 ${
            coupon.isActive 
              ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400' 
              : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
          }`}
          style={{ fontFamily: lexend.style.fontFamily }}
        >
          {coupon.isActive ? <Ban className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          {coupon.isActive ? 'Disable' : 'Enable'}
        </button>
      </div>
    </div>
  );
};

export default CouponCard;

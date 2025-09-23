import React from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Calendar, Percent, DollarSign, MapPin, Clock, 
  Ban, Eye, Users, CheckCircle2, AlertTriangle 
} from 'lucide-react';

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

interface CouponModalProps {
  coupon: Coupon;
  lexend: string;
  onClose: () => void;
  onToggleStatus: (couponId: string) => void;
  loading: boolean;
}

const CouponModal: React.FC<CouponModalProps> = ({ 
  coupon, 
  lexend, 
  onClose, 
  onToggleStatus, 
  loading 
}) => {
  const isExpired = new Date(coupon.expiryDate) <= new Date();
  const isFullyUsed = coupon.currentUsageCount >= coupon.maxUsageCount;
  const usagePercentage = (coupon.currentUsageCount / coupon.maxUsageCount) * 100;

  const getStatusInfo = (): { 
    text: string; 
    color: string; 
    icon: React.ComponentType<{ className?: string }> 
  } => {
    if (!coupon.isActive) return { 
      text: 'Disabled', 
      color: 'text-gray-400 bg-gray-400/10 border-gray-400/20',
      icon: Ban
    };
    if (isExpired) return { 
      text: 'Expired', 
      color: 'text-red-400 bg-red-400/10 border-red-400/20',
      icon: AlertTriangle
    };
    if (isFullyUsed) return { 
      text: 'Fully Used', 
      color: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
      icon: Users
    };
    return { 
      text: 'Active', 
      color: 'text-green-400 bg-green-400/10 border-green-400/20',
      icon: CheckCircle2
    };
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-gray-800 border border-yellow-500/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-yellow-500/20">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-500/20 rounded-xl">
              <Percent className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h2 className={`${lexend.className} text-2xl text-white font-bold`}>
                {coupon.name}
              </h2>
              <p className="text-gray-400 font-mono" style={{ fontFamily: lexend.style.fontFamily }}>
                {coupon.uniqueId}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status and Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`border rounded-xl p-4 ${statusInfo.color}`}>
              <div className="flex items-center gap-2 mb-2">
                <StatusIcon className="w-5 h-5" />
                <span className="font-medium" style={{ fontFamily: lexend.style.fontFamily }}>
                  Status
                </span>
              </div>
              <p className={`${lexend.className} text-xl font-bold`}>
                {statusInfo.text}
              </p>
            </div>
            
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Percent className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-medium" style={{ fontFamily: lexend.style.fontFamily }}>
                  Discount
                </span>
              </div>
              <p className={`${lexend.className} text-3xl text-yellow-400 font-bold`}>
                {coupon.discountPercentage}%
              </p>
            </div>
            
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-medium" style={{ fontFamily: lexend.style.fontFamily }}>
                  Min Amount
                </span>
              </div>
              <p className={`${lexend.className} text-3xl text-green-400 font-bold`}>
                ₹{coupon.minAmount}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-700/30 border border-gray-600/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400 font-medium" style={{ fontFamily: lexend.style.fontFamily }}>
                Description
              </span>
            </div>
            <p className="text-white leading-relaxed" style={{ fontFamily: lexend.style.fontFamily }}>
              {coupon.description || 'No description provided'}
            </p>
          </div>

          {/* Usage Statistics */}
          <div className="bg-gray-700/30 border border-gray-600/50 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-gray-400" />
              <span className="text-gray-400 font-medium text-lg" style={{ fontFamily: lexend.style.fontFamily }}>
                Usage Statistics
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center bg-gray-600/30 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2" style={{ fontFamily: lexend.style.fontFamily }}>
                  Current Usage
                </p>
                <p className={`${lexend.className} text-3xl text-yellow-400 font-bold`}>
                  {coupon.currentUsageCount}
                </p>
              </div>
              <div className="text-center bg-gray-600/30 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2" style={{ fontFamily: lexend.style.fontFamily }}>
                  Max Usage
                </p>
                <p className={`${lexend.className} text-3xl text-white font-bold`}>
                  {coupon.maxUsageCount}
                </p>
              </div>
              <div className="text-center bg-gray-600/30 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2" style={{ fontFamily: lexend.style.fontFamily }}>
                  Usage Rate
                </p>
                <p className={`${lexend.className} text-3xl text-blue-400 font-bold`}>
                  {usagePercentage.toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="w-full bg-gray-600 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-4 rounded-full transition-all duration-500 relative overflow-hidden"
                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-400 mt-2">
                <span>0</span>
                <span className="text-yellow-400 font-semibold">
                  {usagePercentage.toFixed(1)}%
                </span>
                <span>{coupon.maxUsageCount}</span>
              </div>
            </div>
          </div>

          {/* Theater Information */}
          <div className="bg-gray-700/30 border border-gray-600/50 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span className="text-gray-400 font-medium text-lg" style={{ fontFamily: lexend.style.fontFamily }}>
                Valid Theaters ({coupon.theaterIds.length})
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {coupon.theaterIds.map((theater: Theater) => (
                <div key={theater._id} className="bg-gray-600/30 border border-gray-500/30 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-yellow-400" />
                    <p className="text-white font-medium" style={{ fontFamily: lexend.style.fontFamily }}>
                      {theater.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dates Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700/30 border border-gray-600/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400 font-medium" style={{ fontFamily: lexend.style.fontFamily }}>
                  Created Date
                </span>
              </div>
              <p className="text-white text-lg" style={{ fontFamily: lexend.style.fontFamily }}>
                {new Date(coupon.createdAt).toLocaleString()}
              </p>
            </div>
            
            <div className={`border rounded-xl p-4 ${isExpired ? 'bg-red-500/10 border-red-500/20' : 'bg-gray-700/30 border-gray-600/50'}`}>
              <div className="flex items-center gap-2 mb-3">
                <Clock className={`w-4 h-4 ${isExpired ? 'text-red-400' : 'text-gray-400'}`} />
                <span className={`font-medium ${isExpired ? 'text-red-400' : 'text-gray-400'}`} style={{ fontFamily: lexend.style.fontFamily }}>
                  Expiry Date
                </span>
              </div>
              <p className={`text-lg ${isExpired ? 'text-red-400' : 'text-white'}`} style={{ fontFamily: lexend.style.fontFamily }}>
                {new Date(coupon.expiryDate).toLocaleString()}
              </p>
              {isExpired && (
                <p className="text-red-400 text-sm mt-1" style={{ fontFamily: lexend.style.fontFamily }}>
                  This coupon has expired
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-yellow-500/20">
          <button
            onClick={onClose}
            className="px-6 py-3 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all duration-300"
            style={{ fontFamily: lexend.style.fontFamily }}
          >
            Close
          </button>
          
          <button
            onClick={() => onToggleStatus(coupon._id)}
            disabled={loading}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 disabled:opacity-50 ${
              coupon.isActive 
                ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400' 
                : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
            }`}
            style={{ fontFamily: lexend.style.fontFamily }}
          >
            {coupon.isActive ? (
              <>
                <Ban className="w-4 h-4" />
                Disable Coupon
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Enable Coupon
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default CouponModal;

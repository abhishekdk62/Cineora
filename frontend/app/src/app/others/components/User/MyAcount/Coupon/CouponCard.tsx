"use client";
import React, { useState } from "react";
import { CouponResponseDto } from "@/app/others/dtos/coupon.dto";
import CouponCardUI from "./CouponCardUI";
import TheaterModal, { TheaterData } from "./TheaterModal";

interface CouponCardProps {
  coupon: CouponResponseDto;
  index?: number;
  isExpired?: boolean; 
}



const CouponCard: React.FC<CouponCardProps> = ({ 
  coupon, 
  index = 0, 
  isExpired = false 
}) => {
  const [copied, setCopied] = useState(false);
  const [showTheaterModal, setShowTheaterModal] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(coupon.uniqueId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code');
    }
  };

  const handleShowTheaters = () => {
    setShowTheaterModal(true);
  };

  const handleCloseModal = () => {
    setShowTheaterModal(false);
  };

  const getExpiryStatus = () => {
    if (!coupon.expiryDate) return { status: 'no-expiry', text: 'No expiry', color: 'text-green-500' };
    
    const now = new Date();
    const expiry = new Date(coupon.expiryDate);
    const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { status: 'expired', text: 'Expired', color: 'text-red-500' };
    if (diffDays <= 7) return { status: 'expiring', text: `${diffDays} day${diffDays !== 1 ? 's' : ''} left`, color: 'text-orange-500' };
    return { status: 'active', text: `${diffDays} days left`, color: 'text-green-500' };
  };

  const expiryStatus = getExpiryStatus();
  const theaters = (coupon.theaterIds as TheaterData[]) || [];
  const isAllTheaters = theaters.length === 0;

  return (
    <>
      {/* Pure UI Component */}
      <CouponCardUI
        name={coupon.name || ""}
        description={coupon.description}
        discountPercentage={coupon.discountPercentage}
        uniqueId={coupon.uniqueId}
        expiryDate={coupon.expiryDate}
        maxUsageCount={coupon.maxUsageCount}
        currentUsageCount={coupon.currentUsageCount || 0} 
        isActive={coupon.isActive}
        isExpired={isExpired} 

        copied={copied}
        expiryStatus={expiryStatus}

        onCopyCode={handleCopyCode}
        onShowTheaters={handleShowTheaters}

        index={index}
      />

      {/* Modal Component */}
      <TheaterModal
        isOpen={showTheaterModal}
        onClose={handleCloseModal}
        theaters={theaters}
        isAllTheaters={isAllTheaters}
      />
    </>
  );
};

export default CouponCard;

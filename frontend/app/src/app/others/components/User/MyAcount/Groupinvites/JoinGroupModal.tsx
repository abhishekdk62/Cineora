import React from "react";
import { X, Calendar, Clock, MapPin, Users, Star, Crown, Ticket } from "lucide-react";
import { GroupInvite } from "./GroupInvitesManager";
import { calculateJoinerSeatPrice, getOccupiedSeats } from "@/app/others/Utils/inviteCalculations";

const lexendBold = { className: "font-bold" };
const lexendMedium = { className: "font-medium" };
const lexendSmall = { className: "font-normal text-sm" };

interface Props {
  isOpen: boolean;
  onClose: () => void;
  invite: GroupInvite | null;
  onConfirmJoin: (inviteId: string) => void;
}

const JoinGroupModal: React.FC<Props> = ({ isOpen, onClose, invite, onConfirmJoin }) => {
  if (!isOpen || !invite) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  let seatInfo;
  try {
    seatInfo = calculateJoinerSeatPrice(invite);
  } catch (error) {
    console.error('Error calculating seat price:', error);
    return null;
  }

  const occupiedSeats = getOccupiedSeats(invite);
  const joinedCount = invite.totalSlotsRequested - invite.availableSlots;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-white/20 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-white/10 p-4 flex items-center justify-between">
          <h2 className={`${lexendBold.className} text-xl text-white`}>
            Join Group
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Movie Info - Compact */}
          <div className="flex gap-4 mb-6">
            <img
              src={invite.movieId?.poster || 'https://via.placeholder.com/300x400/1f2937/ffffff?text=No+Poster'}
              alt={invite.movieId?.title}
              className="w-16 h-24 object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/300x400/1f2937/ffffff?text=No+Poster';
              }}
            />
            <div className="flex-1 min-w-0">
              <h3 className={`${lexendBold.className} text-lg text-white mb-1 line-clamp-2`}>
                {invite.movieId?.title}
              </h3>
              <div className="space-y-1 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-gray-400" />
                  <span className="truncate">{invite.theaterId?.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Ticket className="w-3 h-3 text-gray-400" />
                  <span>{invite.screenId?.name}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Show Details */}
          <div className="grid grid-cols-2 gap-3 mb-6 p-3 bg-white/5 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>{formatDate(invite.showDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Clock className="w-4 h-4 text-green-400" />
              <span>{formatTime(invite.showTime)}</span>
            </div>
          </div>

          {/* Host Info */}
          <div className="mb-6 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {invite.hostUserId?.username?.charAt(0).toUpperCase() || 'H'}
                </span>
              </div>
              <div>
                <p className="text-purple-300 text-sm font-medium">
                  Hosted by {invite.hostUserId?.username || 'Anonymous'}
                </p>
                <p className="text-purple-400 text-xs">
                  {joinedCount} of {invite.totalSlotsRequested} members joined
                </p>
              </div>
            </div>
          </div>

          {/* Seat Assignment */}
          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-blue-400 text-sm font-medium">Your Seat Assignment</span>
              <span className="text-blue-300 text-xs bg-blue-500/20 px-2 py-1 rounded">
                {seatInfo.nextSeat.seatType}
              </span>
            </div>
            
            <div className="flex items-center gap-2 mb-3">
              <Crown className="w-4 h-4 text-yellow-400" />
              <span className="text-white font-bold">
                Seat {seatInfo.nextSeat.seatNumber}
              </span>
            </div>

            {/* All Seats Visual */}
            <div className="flex flex-wrap gap-1">
              {invite.requestedSeats.map((seat, index) => {
                const isOccupied = occupiedSeats.includes(seat.seatNumber);
                const isNext = index === seatInfo.nextSeatIndex;
                
                return (
                  <div
                    key={seat._id}
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      isOccupied 
                        ? 'bg-gray-600 text-gray-400' 
                        : isNext
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                          : 'bg-blue-500/20 text-blue-400'
                    }`}
                  >
                    {seat.seatNumber}
                    {isNext && ' (You)'}
                    {isOccupied && ' (Taken)'}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Price Breakdown */}
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h4 className={`${lexendMedium.className} text-green-400`}>
                Payment Summary
              </h4>
              {invite.couponUsed && (
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded border border-orange-500/30">
                    {invite.couponUsed.couponCode}
                  </span>
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                    {invite.couponUsed.discountPercentage}% OFF
                  </span>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              {/* Base Price */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-300">
                  Seat {seatInfo.nextSeat.seatNumber} ({seatInfo.nextSeat.seatType})
                </span>
                <span className="text-white font-medium">
                  ₹{seatInfo.priceBreakdown.originalPrice}
                </span>
              </div>
              
              {/* Discount */}
              {invite.couponUsed && (
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">
                      Discount ({invite.couponUsed.discountPercentage}%)
                    </span>
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                      {invite.couponUsed.couponName}
                    </span>
                  </div>
                  <span className="text-green-400 font-medium">
                    -₹{seatInfo.priceBreakdown.discountAmount}
                  </span>
                </div>
              )}
              
              {/* Subtotal after discount */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-300">Subtotal</span>
                <span className="text-white">₹{seatInfo.priceBreakdown.discountedPrice}</span>
              </div>
              
              {/* Convenience Fee */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Convenience Fee (5%)</span>
                <span className="text-gray-300">₹{seatInfo.priceBreakdown.convenienceFee}</span>
              </div>
              
              {/* Tax */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Tax (18%)</span>
                <span className="text-gray-300">₹{seatInfo.priceBreakdown.tax}</span>
              </div>
              
              {/* Divider */}
              <div className="border-t border-green-500/20 my-3"></div>
              
              {/* Total */}
              <div className="flex justify-between items-center">
                <span className={`${lexendMedium.className} text-white text-base`}>
                  Total Amount
                </span>
                <span className={`${lexendBold.className} text-green-400 text-lg`}>
                  ₹{seatInfo.actualPriceForJoiner}
                </span>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="mb-6 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-yellow-300 text-xs">
              <strong>Note:</strong> Payment will be processed once you confirm. 
              Make sure all details are correct before proceeding.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className={`${lexendMedium.className} flex-1 py-3 px-4 rounded-xl border border-white/20 text-white bg-white/10 hover:bg-white/20 transition-colors`}
            >
              Cancel
            </button>
            <button
              onClick={()=>{onConfirmJoin(invite.inviteId)}}
              className={`${lexendMedium.className} flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl`}
            >
              Pay & Confirm Join
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinGroupModal;

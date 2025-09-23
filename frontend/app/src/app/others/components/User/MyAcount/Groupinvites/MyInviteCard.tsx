import React, { useState, useEffect } from "react";
import { Calendar, Clock, Users, Star, Share2, Eye, Trash2, Crown, Ticket, Ban } from "lucide-react";
import { GroupInvite } from "./GroupInvitesManager";
import { CountdownTimer } from "./CountdownTimer";

const lexendBold = { className: "font-bold" };
const lexendMedium = { className: "font-medium" };
const lexendSmall = { className: "font-normal text-sm" };

interface Props {
  invite: GroupInvite;
  onCopyLink: (inviteId: string) => void;
  onRefresh: () => void;
  handleCancel: (inviteId: string) => void;
}

const MyInviteCard: React.FC<Props> = ({ 
  invite, 
  onCopyLink, 
  onRefresh, 
  handleCancel 
}) => {
  const [currentAvailableSlots, setCurrentAvailableSlots] = useState(invite.availableSlots);
  const [currentStatus, setCurrentStatus] = useState(invite.status);
  const [participantCount, setParticipantCount] = useState(invite.participants?.length || 0);

  useEffect(() => {
   
    
    setCurrentAvailableSlots(invite.availableSlots);
    setCurrentStatus(invite.status);
    setParticipantCount(invite.participants?.length || 0);
  }, [invite.availableSlots, invite.status, invite.participants, invite.inviteId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const joinedCount = invite.totalSlotsRequested - currentAvailableSlots;
  const progressPercentage = Math.round((joinedCount / invite.totalSlotsRequested) * 100);
  const pricePerSeat = Math.round(invite.totalAmount / invite.totalSlotsRequested);
  const isCancelled = currentStatus === "cancelled";
  const isCompleted = currentStatus === "completed";

 

  return (
    <div className={`bg-gradient-to-br border rounded-2xl p-6 backdrop-blur-xl transition-all duration-300 ${
      isCancelled 
        ? 'from-gray-800/50 via-gray-900/30 to-gray-800/20 border-gray-600/30 opacity-75' 
        : isCompleted
        ? 'from-green-800/50 via-green-900/30 to-green-800/20 border-green-600/30'
        : 'from-white/10 via-white/5 to-transparent border-white/10'
    }`}>
      <div className="flex gap-6">
        <div className="flex-shrink-0 relative">
          <img
            src={invite.movieId?.poster || 'https://via.placeholder.com/300x400/1f2937/ffffff?text=No+Poster'}
            alt={invite.movieId?.title || 'Movie'}
            className={`w-24 h-36 object-cover rounded-xl transition-all duration-300 ${
              isCancelled ? 'grayscale blur-sm' : ''
            }`}
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/300x400/1f2937/ffffff?text=No+Poster';
            }}
          />
          
          {isCancelled && (
            <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <Ban className="w-8 h-8 text-red-400 mx-auto mb-1" />
                <span className="text-red-300 text-xs font-medium">CANCELLED</span>
              </div>
            </div>
          )}

          {isCompleted && !isCancelled && (
            <div className="absolute inset-0 bg-green-600/60 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <Ticket className="w-8 h-8 text-white mx-auto mb-1" />
                <span className="text-white text-xs font-medium">COMPLETE</span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Header with Host Badge and Countdown */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className={`${lexendBold.className} text-xl ${
                  isCancelled ? 'text-gray-400 line-through' : 'text-white'
                }`}>
                  {invite.movieId?.title || 'Unknown Movie'}
                </h3>
                
                {/* Status Badge */}
                {isCancelled ? (
                  <div className="flex items-center gap-1 px-2 py-1 bg-red-500/20 border border-red-500/30 rounded-lg">
                    <Ban className="w-3 h-3 text-red-400" />
                    <span className="text-red-300 text-xs font-medium">Cancelled</span>
                  </div>
                ) : isCompleted ? (
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-lg">
                    <Ticket className="w-3 h-3 text-green-400" />
                    <span className="text-green-300 text-xs font-medium">Completed</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded-lg">
                    <Crown className="w-3 h-3 text-purple-400" />
                    <span className="text-purple-300 text-xs font-medium">Host</span>
                  </div>
                )}
              </div>
              <p className={`${lexendSmall.className} mb-2 ${
                isCancelled ? 'text-gray-500' : 'text-gray-300'
              }`}>
                {invite.theaterId?.name || 'Unknown Theater'} - {invite.screenId?.name || 'Screen'}
              </p>
            </div>

            {/* Countdown Timer or Status */}
            <div className="ml-4">
              {isCancelled ? (
                <div className="px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Ban className="w-4 h-4 text-red-400" />
                    <span className="text-red-300 text-sm font-medium">Cancelled</span>
                  </div>
                </div>
              ) : isCompleted ? (
                <div className="px-3 py-2 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-green-400" />
                    <span className="text-green-300 text-sm font-medium">Complete</span>
                  </div>
                </div>
              ) : (
                <CountdownTimer 
                  createdAt={invite.createdAt}
                  size="medium"
                  showProgress={true}
                />
              )}
            </div>
          </div>

          {/* Show Details */}
          <div className={`flex items-center gap-6 text-sm mb-4 ${
            isCancelled ? 'text-gray-500' : 'text-gray-400'
          }`}>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(invite.showDate)}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {invite.showTime}
            </div>
            {invite.minRequiredRating && (
              <div className="flex items-center gap-1">
                <Star className={`w-4 h-4 ${isCancelled ? 'text-gray-500' : 'text-yellow-400'}`} />
                {invite.minRequiredRating}+ Rating
              </div>
            )}
          </div>

          {/* Progress - Show real-time updates */}
          {!isCancelled && !isCompleted && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`${lexendMedium.className} text-white text-sm`}>
                  Group Progress
                </span>
                <span className={`${lexendSmall.className} text-gray-300`}>
                  {joinedCount}/{invite.totalSlotsRequested} joined ({progressPercentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    progressPercentage >= 100 ? 'bg-green-500' :
                    progressPercentage >= 50 ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.max(5, progressPercentage)}%` }}
                />
              </div>
              {/* ✅ DEBUG DISPLAY */}
              <div className="text-xs text-yellow-300 mt-1">
                DEBUG: Available={currentAvailableSlots}, Joined={joinedCount}, Progress={progressPercentage}%
              </div>
            </div>
          )}

          {/* Status Notices */}
          {isCancelled && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center gap-2">
                <Ban className="w-4 h-4 text-red-400" />
                <span className="text-red-300 text-sm font-medium">
                  This group invite has been cancelled
                </span>
              </div>
            </div>
          )}

          {isCompleted && !isCancelled && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-green-400" />
                <span className="text-green-300 text-sm font-medium">
                  Group booking is complete! All participants have joined.
                </span>
              </div>
            </div>
          )}

          {/* Info Grid */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className={`rounded-lg p-3 ${
              isCancelled ? 'bg-gray-800/30' : 'bg-white/5'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                <Ticket className={`w-4 h-4 ${isCancelled ? 'text-gray-500' : 'text-blue-400'}`} />
                <span className={`text-xs ${isCancelled ? 'text-gray-500' : 'text-gray-400'}`}>Seats</span>
              </div>
              <p className={`text-sm font-medium ${
                isCancelled ? 'text-gray-500 line-through' : 'text-white'
              }`}>
                {invite.requestedSeats?.map(s => s.seatNumber).join(', ') || 'N/A'}
              </p>
            </div>

            <div className={`rounded-lg p-3 ${
              isCancelled ? 'bg-gray-800/30' : 'bg-white/5'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                <Users className={`w-4 h-4 ${isCancelled ? 'text-gray-500' : 'text-purple-400'}`} />
                <span className={`text-xs ${isCancelled ? 'text-gray-500' : 'text-gray-400'}`}>Available</span>
              </div>
              <p className={`text-sm font-medium ${
                isCancelled ? 'text-gray-500' : 'text-white'
              }`}>
                {isCancelled ? 'N/A' : isCompleted ? 'Complete' : `${currentAvailableSlots} seats left`}
              </p>
            </div>

            <div className={`rounded-lg p-3 ${
              isCancelled ? 'bg-gray-800/30' : 'bg-white/5'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                <Star className={`w-4 h-4 ${isCancelled ? 'text-gray-500' : 'text-yellow-400'}`} />
                <span className={`text-xs ${isCancelled ? 'text-gray-500' : 'text-gray-400'}`}>Price/Person</span>
              </div>
              <div>
                {isCancelled ? (
                  <span className="text-gray-500 text-sm font-medium line-through">₹{pricePerSeat}</span>
                ) : (
                  invite.couponUsed ? (
                    <div className="flex items-center gap-2">
                      <span className="text-green-400 text-sm font-medium">₹{pricePerSeat}</span>
                      <span className="text-xs bg-green-500/20 text-green-400 px-1 py-0.5 rounded">
                        {invite.couponUsed.discountPercentage}% OFF
                      </span>
                    </div>
                  ) : (
                    <span className="text-white text-sm font-medium">₹{pricePerSeat}</span>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {!isCancelled && !isCompleted ? (
              <>
             
               
                {currentAvailableSlots === invite.totalSlotsRequested-1 && (
                  <button 
                    onClick={() => handleCancel(invite.inviteId)} 
                    className={`${lexendMedium.className} flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm`}
                  >
                    <Trash2 className="w-4 h-4" />
                    Cancel
                  </button>
                )}
              </>
            ) : (
              <div className="flex gap-3">
                <button 
                  disabled
                  className={`${lexendMedium.className} flex items-center gap-2 px-4 py-2 bg-gray-600 text-gray-400 rounded-lg cursor-not-allowed text-sm`}
                >
                  <Share2 className="w-4 h-4" />
                  Share Invite
                </button>
                
                <button 
                  className={`${lexendMedium.className} flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm`}
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyInviteCard;

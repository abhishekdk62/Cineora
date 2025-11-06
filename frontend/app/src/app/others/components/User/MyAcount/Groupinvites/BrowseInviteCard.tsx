'use client'
import React, { useState, useEffect } from "react";
import { Calendar, Clock, Users, Star, Ticket, MapPin, UserPlus, Crown } from "lucide-react";
import { GroupInvite } from "./GroupInvitesManager";
import { CountdownTimer } from "./CountdownTimer";
import { calculateJoinerSeatPrice, getOccupiedSeats } from "@/app/others/Utils/inviteCalculations";
import JoinGroupModal from "./JoinGroupModal";
import PaymentFormInvt from "./Invt/PaymentFormInvt";
import { PaymentModalInvt } from "./Invt/PaymentModalInvt";
import { useDispatch } from "react-redux";
import { setBookingData } from "@/app/others/redux/slices/bookingSlice";
import { useSelector } from "react-redux";
import toast from 'react-hot-toast';
import { leaveInviteGroup } from "@/app/others/services/userServices/inviteGroupServices";
import { confirmAction } from "../../../utils/ConfirmDialog";
import { cancelSingleTicket } from "@/app/others/services/userServices/ticketServices";
import { createSystemMessage, getChatRoomByInvite, leaveChatRoom } from "@/app/others/services/userServices/chatServices";
import { RootState } from "@/app/others/redux/store";
import GroupEtiquetteModal from "./GroupEtiquetteModal";

const lexendBold = { className: "font-bold" };
const lexendMedium = { className: "font-medium" };
const lexendSmall = { className: "font-normal text-sm" };

interface Props {
  invite: GroupInvite;
  onJoin: (inviteId: string) => void;
  onRefresh: () => void;
}

const BrowseInviteCard: React.FC<Props> = ({ invite, onJoin, onRefresh }) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [slectedInvite, setSelectedInvite] = useState('');
  const [currentParticipants, setCurrentParticipants] = useState(invite.participants);
  const [currentAvailableSlots, setCurrentAvailableSlots] = useState(invite.availableSlots);
  const [isGroupCompleted, setIsGroupCompleted] = useState(false);
  const [isTimerExpired, setIsTimerExpired] = useState(false);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
const [showEtiquetteModal, setShowEtiquetteModal] = useState(false);

  const isCompleted = invite.status === 'completed' || invite.availableSlots === 0;
  const isExpired = isTimerExpired || new Date() > new Date(invite.expiresAt);
  const isDisabled = isCompleted || isExpired;
  const id = useSelector((state: RootState) => state?.auth?.user?.id)
  const email = useSelector((state: RootState) => state?.auth?.user?.email)

  const handleExitGroup = async () => {
    if (isExpired) {
      toast.error('This group invite has expired!');
      return;
    }

    try {
      const confirmed = await confirmAction({
        title: 'Exit from group Invite?',
        message: 'Are you sure you want to exit from this group invite?',
        confirmText: 'Confirm',
        cancelText: "Cancel",
      });

      if (!confirmed) {
        return;
      }

      const response = await leaveInviteGroup(invite.inviteId);
      console.log('left the shit', response);

      let amount = response.data.removedParticipant.amount;
      let ticketId = response.data.removedParticipant.ticketId;

      if (!ticketId || !amount) {
        console.error(' Missing ticket data:', { ticketId, amount });
        toast.error('Missing ticket information');
        return;
      }

      const res = await cancelSingleTicket([ticketId], amount);
      const dat = await getChatRoomByInvite(invite.inviteId)
      const resp = await leaveChatRoom({ chatRoomId: dat.data.inviteGroupId, userId: id })
      console.log(res);
      console.log(resp);

      const chated = await createSystemMessage({ chatRoomId: dat.data._id, systemMessageType: 'USER_LEFT', content: 'User Left ', systemData: { userId: id, username: email?.split('@')[0] } })
      toast.success('Exited from this group');
      onRefresh();

    } catch (error) {
      toast.error('Something went wrong');
      console.log(error);
    }
  }

  useEffect(() => {
    setCurrentAvailableSlots(invite.availableSlots);
    setIsGroupCompleted(invite.status === 'completed' || invite.availableSlots === 0);
    setCurrentParticipants(invite.participants);
  }, [invite.availableSlots, invite.status, invite.participants]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const joinedCount = invite.totalSlotsRequested - currentAvailableSlots;
  const progressPercentage = Math.round((joinedCount / invite.totalSlotsRequested) * 100);

  const getOccupiedSeatsFromCurrent = (participants: string[]) => {
    return participants
      .filter(p => p.role !== 'host')
      .map(p => p.seatAssigned);
  };

  const occupiedSeats = getOccupiedSeatsFromCurrent(currentParticipants);
  let seatInfo;

  if (isCompleted || currentAvailableSlots === 0) {
    seatInfo = {
      nextSeat: {
        seatNumber: currentAvailableSlots === 0 ? 'Full' : 'Completed',
        seatType: 'N/A',
        seatRow: 'N/A',
        price: 0,
        _id: ''
      },
      nextSeatIndex: -1,
      priceBreakdown: {
        originalPrice: 0,
        discountedPrice: 0,
        convenienceFee: 0,
        tax: 0,
        discountAmount: 0,
        finalAmount: 0
      },
      actualPriceForJoiner: 0
    };
  } else {
    try {
      seatInfo = calculateJoinerSeatPrice(invite);
    } catch (error) {
      console.error('Error calculating seat price:', error);

      seatInfo = {
        nextSeat: {
          seatNumber: 'Unavailable',
          seatType: 'Normal',
          seatRow: 'N/A',
          price: 0,
          _id: ''
        },
        nextSeatIndex: -1,
        priceBreakdown: {
          originalPrice: 0,
          discountedPrice: 0,
          convenienceFee: 0,
          tax: 0,
          discountAmount: 0,
          finalAmount: 0
        },
        actualPriceForJoiner: 0
      };

      setIsGroupCompleted(true);
    }
  }


  const handleJoinClick = () => {
    if (isCompleted) {
      toast.error('This group is already complete!');
      return;
    }

    if (isExpired) {
      toast.error('This group invite has expired!');
      return;
    }
      setShowEtiquetteModal(true);
  }
  const handleEtiquetteAgree = () => {
  setShowEtiquetteModal(false);


    const bookingData = {
      userId: user?.id || user?.userId || user?._id,
      movieId: invite.movieId._id,
      theaterId: invite.theaterId._id,
      screenId: invite.screenId._id,
      showtimeId: invite.showtimeId,

      appliedCoupon: invite.couponUsed ? {
        _id: invite.couponUsed._id,
        discountPercentage: invite.couponUsed.discountPercentage,
        name: invite.couponUsed.couponName,
        uniqueId: invite.couponUsed.couponCode,
      } : undefined,

      paymentStatus: 'pending',
      bookingStatus: 'pending',

      selectedSeats: [seatInfo.nextSeat.seatNumber],
      selectedSeatIds: [],

      seatPricing: [{
        rowId: seatInfo?.nextSeat?._id,
        seatType: seatInfo?.nextSeat?.seatType as "VIP" | "Premium" | "Normal",
        basePrice: seatInfo?.priceBreakdown?.originalPrice,
        finalPrice: seatInfo?.priceBreakdown?.discountedPrice,
        rowLabel: seatInfo?.nextSeat?.seatRow,
      }],

      priceDetails: {
        subtotal: seatInfo.priceBreakdown.discountedPrice,
        convenienceFee: seatInfo.priceBreakdown.convenienceFee,
        taxes: seatInfo.priceBreakdown.tax,
        discount: invite.couponUsed ? seatInfo.priceBreakdown.discountAmount : 0,
        total: seatInfo.priceBreakdown.finalAmount,
      },

      totalAmount: seatInfo.priceBreakdown.finalAmount,
      amount: seatInfo.priceBreakdown.finalAmount,

      showDate: invite.showDate,
      showTime: invite.showTime,

      contactInfo: {
        email: user?.email || "",
      },

      paymentMethod: "",

      movieTitle: invite.movieId.title,
      theaterName: invite.theaterId.name,
    };

    dispatch(setBookingData(bookingData));
    setShowDetailsModal(true);
  };

  const isUserParticipant = currentParticipants.some(participant =>
    participant.userId === user.id ||
    participant.userId === user._id ||
    participant.userId === user.userId
  );

  const handleClose = () => {
    setShowDetailsModal(false);
    setShowPaymentModal(false);
  };

  const handleConfirmJoin = (inviteId: string) => {
    setShowDetailsModal(false);
    setSelectedInvite(inviteId);
    setShowPaymentModal(true);
  };

  return (
    <>
      <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl hover:scale-[1.02] transition-all duration-300">
        <div className="relative h-48 bg-gray-800">
          <img
            src={invite.movieId?.poster || 'https://via.placeholder.com/300x400/1f2937/ffffff?text=No+Poster'}
            alt={invite.movieId?.title || 'Movie'}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/300x400/1f2937/ffffff?text=No+Poster';
            }}
          />

          {isCompleted || isGroupCompleted ? (
            <div className="absolute top-3 right-3 bg-green-600 backdrop-blur-sm px-3 py-1 rounded-full">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3 text-white" />
                <span className="text-white text-xs font-medium">Complete</span>
              </div>
            </div>
          ) : isExpired ? (
            <div className="absolute top-3 right-3 bg-red-600 backdrop-blur-sm px-3 py-1 rounded-full">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-white" />
                <span className="text-white text-xs font-medium">Expired</span>
              </div>
            </div>
          ) : (
            <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3 text-green-400" />
                <span className="text-green-300 text-xs font-medium">
                  {currentAvailableSlots} left
                </span>
              </div>
            </div>
          )}

          {invite.minRequiredRating && (
            <div className="absolute top-3 left-3 bg-yellow-500/20 backdrop-blur-sm px-2 py-1 rounded-full border border-yellow-500/30">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400" />
                <span className="text-yellow-300 text-xs font-medium">
                  {invite.minRequiredRating}+
                </span>
              </div>
            </div>
          )}

          {isCompleted || isGroupCompleted ? (
            <div className="absolute bottom-3 right-3 bg-green-600 backdrop-blur-sm px-3 py-1 rounded-full">
              <div className="flex items-center gap-1">
                <Crown className="w-3 h-3 text-white" />
                <span className="text-white text-xs font-medium">Completed</span>
              </div>
            </div>
          ) : isExpired ? (
            <div className="absolute bottom-3 right-3 bg-red-600 backdrop-blur-sm px-3 py-1 rounded-full">
              <div className="flex items-center gap-1">
                <Crown className="w-3 h-3 text-white" />
                <span className="text-white text-xs font-medium">Time Up</span>
              </div>
            </div>
          ) : (
            <div className="absolute bottom-3 right-3 bg-purple-600 backdrop-blur-sm px-3 py-1 rounded-full">
              <div className="flex items-center gap-1">
                <Crown className="w-3 h-3 text-white" />
                <span className="text-white text-xs font-medium">
                  Next: {seatInfo?.nextSeat?.seatNumber}
                </span>
              </div>
            </div>
          )}

          {(isGroupCompleted || isCompleted || isExpired) && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className={`text-white px-4 py-2 rounded-lg font-medium ${isExpired ? 'bg-red-600' : 'bg-green-600'
                }`}>
                {isExpired ? 'Invite Expired!' : 'Group Complete!'}
              </div>
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="mb-4">
            <h3 className={`${lexendBold.className} text-lg text-white mb-1 line-clamp-1`}>
              {invite.movieId?.title || 'Unknown Movie'}
            </h3>
            <div className="flex items-center gap-1 text-gray-300 mb-2">
              <MapPin className="w-3 h-3" />
              <p className={`${lexendSmall.className} text-sm line-clamp-1`}>
                {invite.theaterId?.name || 'Unknown Theater'}
              </p>

              <div className="ml-auto">
                <p
                  onClick={() => {
                    const url = `https://www.google.com/maps?q=${invite.theaterId?.location?.coordinates[1]},${invite.theaterId?.location?.coordinates[0]}`;
                    window.open(url, "_blank");
                  }}
                  className="text-blue-400 hover:text-blue-300 underline text-xs transition-colors cursor-pointer"
                >
                  View on Google Maps
                </p>
              </div>
            </div>


            <div className="mb-2">
              <CountdownTimer
                createdAt={invite.createdAt}
                size="small"
                showProgress={false}
                onExpiry={() => setIsTimerExpired(true)}
              />
            </div>

            <p className={`${lexendSmall.className} text-gray-400 text-xs`}>
              {invite.screenId?.name || 'Screen'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
            <div className="flex items-center gap-2 text-gray-300">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>{formatDate(invite.showDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Clock className="w-4 h-4 text-green-400" />
              <span>{invite.showTime}</span>
            </div>
          </div>

          {/* ✅ PROGRESS BAR WITH CORRECT CALCULATION */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-xs">Group Status</span>
              <span className="text-white text-xs">{joinedCount}/{invite.totalSlotsRequested}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full transition-all duration-500 ${progressPercentage >= 100 ? 'bg-green-500' :
                  progressPercentage >= 75 ? 'bg-green-500' :
                    progressPercentage >= 50 ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}
                style={{ width: `${Math.max(10, progressPercentage)}%` }}
              />
            </div>
            <div className="text-center mt-1">
              <span className="text-xs text-gray-400">{progressPercentage}% filled</span>
            </div>
          </div>

          <div className="mb-4 p-2 bg-purple-500/10 border border-purple-500/20 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {invite.hostUserId?.username?.charAt(0).toUpperCase() || 'H'}
                </span>
              </div>
              <div>
                <p className="text-purple-300 text-xs font-medium">
                  Hosted by {invite.hostUserId?.username || 'Anonymous'}
                </p>
              </div>
            </div>
          </div>

          {!isCompleted && !isExpired && !isGroupCompleted && (
            <div className="mb-4 p-3 bg-white/5 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-xs">Seat Assignment</span>
                <span className="text-blue-400 text-xs">{seatInfo?.nextSeat?.seatType}</span>
              </div>

              <div className="flex flex-wrap gap-1">
                {invite.requestedSeats.map((seat, index) => {
                  const isOccupied = occupiedSeats.includes(seat.seatNumber);
                  const isNext = index === seatInfo?.nextSeatIndex;

                  return (
                    <div
                      key={seat._id}
                      className={`px-2 py-1 rounded text-xs font-medium ${isOccupied
                        ? 'bg-gray-600 text-gray-400'
                        : isNext
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white animate-pulse'
                          : 'bg-blue-500/20 text-blue-400'
                        }`}
                    >
                      {seat.seatNumber}
                      {!isUserParticipant && isNext && ' (You)'}
                      {isOccupied && ' (Taken)'}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {!isCompleted && !isExpired && !isUserParticipant && !isGroupCompleted && (
            <div className="mb-5 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-400 text-xs font-medium">Your Price</span>
                {invite.couponUsed && (
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                    {invite.couponUsed.discountPercentage}% OFF
                  </span>
                )}
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-gray-300">
                  <span>Seat {seatInfo?.nextSeat?.seatNumber} ({seatInfo?.nextSeat?.seatType})</span>
                  <span>₹{seatInfo?.priceBreakdown?.originalPrice}</span>
                </div>

                {invite.couponUsed && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount ({invite.couponUsed.discountPercentage}%)</span>
                    <span>-₹{seatInfo?.priceBreakdown?.discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-400">
                  <span>Convenience Fee (5%)</span>
                  <span>₹{seatInfo?.priceBreakdown?.convenienceFee}</span>
                </div>

                <div className="flex justify-between text-gray-400">
                  <span>Tax (18%)</span>
                  <span>₹{seatInfo?.priceBreakdown?.tax}</span>
                </div>

                <div className="border-t border-green-500/20 pt-1 mt-2">
                  <div className="flex justify-between text-green-300 font-bold">
                    <span>Total Amount</span>
                    <span>₹{seatInfo?.actualPriceForJoiner}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(isCompleted || isExpired || isGroupCompleted) && (
            <div className="mb-5 p-3 bg-gray-500/10 border border-gray-500/20 rounded-lg">
              <div className="flex items-center justify-center">
                <span className="text-gray-400 text-sm font-medium">
                  {isExpired ? 'This group invite has expired' : 'This group booking has been completed'}
                </span>
              </div>
            </div>
          )}

          <div className="w-full">
            {isUserParticipant ? (
              <button
                onClick={handleExitGroup}
                disabled={isExpired}
                className={`${lexendMedium.className} w-full py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-medium ${isExpired
                  ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-gray-400 cursor-not-allowed border border-gray-600/30 shadow-md'
                  : 'bg-gradient-to-r from-red-400 to-red-500 text-white hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] border border-red-500/20'
                  }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {isExpired ? 'EXPIRED' : 'EXIT GROUP'}
              </button>
            ) : (
              <button
                onClick={handleJoinClick}
                disabled={currentAvailableSlots === 0 || isGroupCompleted || isCompleted || isExpired}
                className={`${lexendMedium.className} w-full py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-medium transform hover:scale-[1.02] active:scale-[0.98] ${currentAvailableSlots === 0 || isGroupCompleted || isCompleted || isExpired
                  ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-gray-400 cursor-not-allowed border border-gray-600/30 shadow-md'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl border border-purple-500/20'
                  }`}
              >
                <UserPlus className="w-4 h-4" />
                <span className="font-semibold">
                  {isExpired ? 'EXPIRED' : isCompleted || isGroupCompleted ? 'Group Complete' : currentAvailableSlots === 0 ? 'Group Full' : `Join for ₹${seatInfo.actualPriceForJoiner}`}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {!isCompleted && !isExpired && !isGroupCompleted && (
        <>
          <JoinGroupModal
            isOpen={showDetailsModal}
            onClose={() => setShowDetailsModal(false)}
            invite={invite}
            onConfirmJoin={handleConfirmJoin}
          />

          {showPaymentModal && (
            <PaymentModalInvt totalAmount={seatInfo?.actualPriceForJoiner} onClose={handleClose} inviteId={slectedInvite} />
          )}
          <GroupEtiquetteModal  // ✅ CORRECT - Inside the condition
  isOpen={showEtiquetteModal}
  onClose={() => setShowEtiquetteModal(false)}
  onProceed={handleEtiquetteAgree}
/>

        </>
      )}
     

    </>
  );
};

export default BrowseInviteCard;

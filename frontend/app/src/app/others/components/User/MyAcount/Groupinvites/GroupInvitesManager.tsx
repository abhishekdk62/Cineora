"use client";

import React, { useState, useEffect } from "react";
import { Users, Crown, Search, Clock } from "lucide-react";
import { getMyInviteGroups, getAvailableInvites, cancelInviteGroup } from "@/app/others/services/userServices/inviteGroupServices";
import toast from 'react-hot-toast';
import BrowseInvitesSection from "./BrowseInvitesSection";
import MyInvitesSection from "./MyInvitesSection";
import { confirmAction } from "../../../utils/ConfirmDialog";
import { useSocket } from "@/app/others/Utils/useSocket";
import { cancelSingleTicket } from "@/app/others/services/userServices/ticketServices";
import { getChatRoomByInvite, leaveChatRoom } from "@/app/others/services/userServices/chatServices";
import { useSelector } from "react-redux";
import { RootState } from "@/app/others/redux/store";
import { Row } from "@/app/book/tickets/[showtimeId]/page";

const lexendBold = { className: "font-bold" };
const lexendMedium = { className: "font-medium" };
const lexendSmall = { className: "font-normal text-sm" };

interface GroupInvite {
  _id: string;
  inviteId: string;
  hostUserId: {
    _id: string;
    username: string;
  };

  movieId: {
    _id: string;
    title: string;
    poster: string;
  };

  theaterId: {
    _id: string;
    name: string;
    location: {
      type: string;
      coordinates: number[];
    };
  };

  screenId: {
    _id: string;
    name: string;
    layout: {
      rows: number;
      seatsPerRow: number;
      advancedLayout: {
        rows: Row[];
        aisles: any;
      };
    };
    features: string[];
  };

  showtimeId: string;

  requestedSeats: Array<{
    seatNumber: string;
    seatRow: string;
    seatType: 'VIP' | 'Premium' | 'Normal';
    price: number;
    isOccupied: boolean;
    _id?: string;
  }>;

  totalSlotsRequested: number;
  availableSlots: number;

  participants: Array<{
    userId: string;
    joinedAt: string;
    seatAssigned: string;
    seatIndex: number;
    paymentStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
    amount?: number;
    role: 'host' | 'member';
    razorpayPaymentId?: string;
    razorpayOrderId?: string;
    paidAt?: string;
    ticketId?: string;
    bookingId?: string;
  }>;

  minRequiredRating?: number;

  couponUsed?: {
    _id: string;
    couponId: string;
    couponCode: string;
    couponName: string;
    discountPercentage: number;
    discountAmount: number;
    appliedAt: string;
  };

  priceBreakdown: {
    _id: string;
    originalAmount: number;
    discountedSubtotal: number;
    convenienceFee: number;
    taxes: number;
    totalDiscount: number;
    finalAmount: number;
  };

  status: 'pending' | 'active' | 'payment_pending' | 'completed' | 'cancelled' | 'expired';
  totalAmount: number;
  paidAmount: number;
  currency: string;
  showDate: string;
  showTime: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;

  nextAvailableSeat?: string;    
  nextSeatPrice?: number;     
}

const GroupInvitesManager: React.FC = () => {
  const [myInvites, setMyInvites] = useState<GroupInvite[]>([]);
  const [availableInvites, setAvailableInvites] = useState<GroupInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'my-requests' | 'browse-invites'>('my-requests');

  const { socket, isConnected } = useSocket();

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    console.log('🔗 Setting up global invite listeners...');

    socket.on('participant_joined', (data) => {
      console.log('👥 Someone joined invite globally:', data.inviteId, 'Available slots:', data.availableSlots);
      updateInviteWithSeatInfo(data.inviteId, {
        availableSlots: data.availableSlots
      });
    });

    socket.on('participant_left', (data) => {
      console.log('👋 Someone left invite globally:', data.inviteId, 'Available slots:', data.availableSlots);
      console.log('💺 Released seat:', data.releasedSeat, 'Price:', data.releasedSeatPrice);
      console.log('🔍 Full socket data on left:', data);

      updateInviteWithSeatInfo(data.inviteId, {
        availableSlots: data.availableSlots,
        releasedSeat: data.releasedSeat,
        releasedSeatPrice: data.releasedSeatPrice
      });

     
      setMyInvites(prev =>
        prev.map(invite =>
          invite.inviteId === data.inviteId
            ? {
              ...invite,
              status: data.availableSlots > 0 ? 'pending' : invite.status
            }
            : invite
        )
      );

      setAvailableInvites(prev =>
        prev.map(invite =>
          invite.inviteId === data.inviteId
            ? {
              ...invite,
              status: data.availableSlots > 0 ? 'pending' : invite.status
            }
            : invite
        )
      );

      if (data.releasedSeat) {
        toast.success(`Seat ${data.releasedSeat} is now available to join!`);
      }
    });

    socket.on('group_completed', (data) => {
      console.log('✅ Group completed globally:', data.inviteId);
      markInviteAsCompleted(data.inviteId);
    });

    socket.on('invite_cancelled', (data) => {
      console.log(' Invite cancelled globally:', data.inviteId);
      removeInviteFromList(data.inviteId);
    });

    return () => {
      console.log('🧹 Cleaning up global invite listeners...');
      socket.off('participant_joined');
      socket.off('participant_left');
      socket.off('group_completed');
      socket.off('invite_cancelled');
    };
  }, [socket, isConnected, activeTab]);
    const id = useSelector((state: RootState) => state?.auth?.user?.id) 

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'my-requests') {
        const response = await getMyInviteGroups({ limit: 50 });
        setMyInvites(response.data || []);
        console.log('my invites', response.data);
      } else {
        const response = await getAvailableInvites({ limit: 50 });
        setAvailableInvites(response.data || []);
        console.log('all invites', response.data);
      }
    } catch (error) {
      console.error('Failed to fetch invites:', error);
      toast.error('Failed to load group invites');
    } finally {
      setLoading(false);
    }
  };

  const updateInviteWithSeatInfo = (
    inviteId: string,
    updateData: {
      availableSlots: number;
      releasedSeat?: string;
      releasedSeatPrice?: number;
    }
  ) => {
    console.log(`🔄 Updating invite ${inviteId} with:`, updateData);

    setAvailableInvites(prev =>
      prev.map(invite =>
        invite.inviteId === inviteId
          ? {
            ...invite,
            availableSlots: updateData.availableSlots,
            nextAvailableSeat: updateData.releasedSeat || invite.nextAvailableSeat,
            nextSeatPrice: updateData.releasedSeatPrice || invite.nextSeatPrice
          }
          : invite
      )
    );

    setMyInvites(prev =>
      prev.map(invite =>
        invite.inviteId === inviteId
          ? {
            ...invite,
            availableSlots: updateData.availableSlots,
            nextAvailableSeat: updateData.releasedSeat || invite.nextAvailableSeat,
            nextSeatPrice: updateData.releasedSeatPrice || invite.nextSeatPrice
          }
          : invite
      )
    );
  };

  const markInviteAsCompleted = (inviteId: string) => {
    setAvailableInvites(prev =>
      prev.map(invite =>
        invite.inviteId === inviteId
          ? { ...invite, status: 'completed', availableSlots: 0 }
          : invite
      )
    );

    setMyInvites(prev =>
      prev.map(invite =>
        invite.inviteId === inviteId
          ? { ...invite, status: 'completed', availableSlots: 0 }
          : invite
      )
    );
  };

  const removeInviteFromList = (inviteId: string) => {
    setAvailableInvites(prev => prev.filter(invite => invite.inviteId !== inviteId));
    setMyInvites(prev => prev.filter(invite => invite.inviteId !== inviteId));
  };

  const handleCancel = async (inviteId: string) => {
    try {
      const confirmed = await confirmAction({
        title: 'Cancel Group Invite?',
        message: 'Are you sure you want to cancel this group invite?',
        confirmText: 'Confirm',
        cancelText: "Cancel",
      });

      if (!confirmed) {
        return;
      }

      const response = await cancelInviteGroup(inviteId);
      console.log('gtrorororo', response);
      let ticket = response.data.participantDetails[0].ticketId
      let amount = response.data.participantDetails[0].amount
      const res = await cancelSingleTicket([ticket], amount)
      console.log(res);
                const dat = await getChatRoomByInvite(inviteId)
      console.log('getChatRoomByInvite',dat);
      
      const resp=await leaveChatRoom({chatRoomId:dat.data.inviteGroupId,userId:id}) 
      console.log(res);
      console.log(resp);
      fetchData();
      toast.success('Cancelled successfully');
    } catch (error) {
      console.log(error);
      toast.error('Failed to cancel');
    }
  };

  const copyInviteLink = (inviteId: string) => {
    const inviteLink = `${window.location.origin}/join-group/${inviteId}`;
    navigator.clipboard.writeText(inviteLink);
    toast.success('Invite link copied! 📋');
  };

  const joinInvite = (inviteId: string) => {
    window.location.href = `/join-group/${inviteId}`;
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse text-white">Loading group invites...</div>
        </div>
      </div>
    );
  }

  const currentInvites = activeTab === 'my-requests' ? myInvites : availableInvites;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className={`${lexendBold.className} text-3xl text-white mb-2`}>
          Group Invites
        </h1>
        <p className={`${lexendSmall.className} text-gray-400`}>
          {activeTab === 'my-requests'
            ? "Track your created group invites (expires in 3 hours)"
            : "Find and join available group bookings"
          }
        </p>
      </div>

      {/* Simple Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('my-requests')}
          className={`${lexendMedium.className} px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 ${activeTab === 'my-requests'
            ? 'bg-purple-600 text-white'
            : 'bg-white/10 text-gray-400 hover:text-white'
            }`}
        >
          <Crown className="w-4 h-4" />
          My Requests ({myInvites.length})
        </button>

        <button
          onClick={() => setActiveTab('browse-invites')}
          className={`${lexendMedium.className} px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 ${activeTab === 'browse-invites'
            ? 'bg-purple-600 text-white'
            : 'bg-white/10 text-gray-400 hover:text-white'
            }`}
        >
          <Search className="w-4 h-4" />
          Browse Invites ({availableInvites.length})
        </button>

        {/* TTL Reminder */}
        <div className="ml-auto flex items-center gap-2 px-3 py-2 bg-orange-500/20 border border-orange-500/30 rounded-xl">
          <Clock className="w-4 h-4 text-orange-400" />
          <span className="text-orange-300 text-sm">Expires in 3hrs</span>
        </div>
      </div>

      {/* Content Sections */}
      {currentInvites.length === 0 ? (
        <div className="text-center py-16">
          <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className={`${lexendMedium.className} text-xl text-white mb-2`}>
            No {activeTab === 'my-requests' ? 'requests created' : 'invites available'}
          </h3>
          <p className={`${lexendSmall.className} text-gray-400`}>
            {activeTab === 'my-requests'
              ? "Create a group invite from the seat selection page"
              : "No group invites are currently available to join"
            }
          </p>
        </div>
      ) : (
        activeTab === 'my-requests' ? (
          <MyInvitesSection
            invites={currentInvites}
            onCopyLink={copyInviteLink}
            onRefresh={fetchData}
            handleCancel={handleCancel}
          />
        ) : (
          <BrowseInvitesSection
            invites={currentInvites}
            onJoin={joinInvite}
            onRefresh={fetchData}
          />
        )
      )}
    </div>
  );
};

export { type GroupInvite };
export default GroupInvitesManager;

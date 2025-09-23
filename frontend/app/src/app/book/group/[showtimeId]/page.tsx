"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Lexend } from "next/font/google";
import { ArrowLeft } from "lucide-react";
import Prism from "@/app/others/components/ReactBits/Prism";
import { NavBar } from "@/app/others/components/Home";
import Loader from "@/app/others/components/utils/Loader";
import { lexendBold } from "@/app/others/Utils/fonts";
import { useSelector, useDispatch } from "react-redux"; 
import { getShowTimeUser } from "@/app/others/services/userServices/showTimeServices";
import RouteGuard from "@/app/others/components/Auth/common/RouteGuard";
import { ShowtimeResponseDto, RowPricingDto } from "@/app/others/dtos";
import { createInviteGroup } from "@/app/others/services/userServices/inviteGroupServices";
import toast from 'react-hot-toast';
import { GroupInviteSummary } from "@/app/others/components/User/GroupInvite/GroupInviteSummary";
import { getCouponsByTheaterId } from "@/app/others/services/userServices/couponServices";
import { PaymentGroupModal } from "@/app/others/components/User/GroupInvite/PaymentGroupModal";
import { applyCoupon, calculateTotalAmount, removeCoupon } from "@/app/others/redux/slices/bookingSlice"; 
import { BookingState } from "@/app/others/types";

const lexendSmall = Lexend({ weight: "200", subsets: ["latin"] });

interface SelectedSeatData {
  seatNumber: string;
  seatType: 'VIP' | 'Premium' | 'Normal';
  price: number;
}

export default function GroupInvitePage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const showtimeId = params?.showtimeId as string;
  
  const user = useSelector((state: string) => state.auth.user);
  const bookingData = useSelector((state: { booking: BookingState }) => state.booking.bookingData);
  
  const [availableCoupons, setAvailableCoupons] = useState<string[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<string>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showTimeData, setShowTimeData] = useState<ShowtimeResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeatData[]>([]);
  const [minRating, setMinRating] = useState<number | undefined>();
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const fetchTheaterCoupons = async () => {
      if (bookingData?.theaterId) {
        try {
          const result = await getCouponsByTheaterId(bookingData.theaterId);
          setAvailableCoupons(result.data || []);
        } catch (error) {
          console.error("Failed to fetch coupons:", error);
          setAvailableCoupons([]);
        }
      }
    };

    fetchTheaterCoupons();
  }, [bookingData?.theaterId]);

  const handleSelectCoupon = useCallback((coupon: string) => {
    setSelectedCoupon(coupon);
    if (bookingData?.priceDetails?.subtotal) {
      const discount = Math.round(bookingData.priceDetails.subtotal * (coupon.discountPercentage / 100));
      dispatch(applyCoupon({
        coupon: coupon,
        discountAmount: discount
      }));
    }
  }, [bookingData?.priceDetails?.subtotal, dispatch]);

  const handleRemoveCoupon = useCallback(() => {
    setSelectedCoupon(null);
    dispatch(removeCoupon());
  }, [dispatch]);

  const handleOpenPaymentModal = useCallback(() => {
    setShowPaymentModal(true);
  }, []);

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
  };

  useEffect(() => {
    const fetchShowTimeData = async () => {
      if (!bookingData?.showtimeId) {
        toast.error("No booking data found");
        router.push(`/book/seats/${showtimeId}`);
        return;
      }

      try {
        const result = await getShowTimeUser(bookingData.showtimeId);
        if (result.data) {
          setShowTimeData(result.data);

          if (bookingData.selectedSeats) {
            const seatsWithDetails = bookingData.selectedSeats.map((seatId: string) => {
              const rowLabel = seatId.charAt(0);
              const rowPricing = result.data.rowPricing.find((rp: RowPricingDto) => rp.rowLabel === rowLabel);

              return {
                seatNumber: seatId,
                seatType: (rowPricing?.seatType || 'Normal') as 'VIP' | 'Premium' | 'Normal',
                price: rowPricing?.showtimePrice || rowPricing?.basePrice || 150
              };
            });
            setSelectedSeats(seatsWithDetails);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
        toast.error("Failed to load showtime data");
      }
    };

    fetchShowTimeData();
  }, [bookingData, showtimeId, router]);

  useEffect(() => {
    if (bookingData?.totalAmount === 0 && bookingData?.amount > 0) {
      dispatch(calculateTotalAmount());
    }
  }, [bookingData?.totalAmount, bookingData?.amount, dispatch]);

  const groupInviteData = useMemo(() => {
    if (!showTimeData || selectedSeats.length === 0 || !bookingData) return null;

    const hostSeat = selectedSeats[0];
    const availableSeats = selectedSeats.slice(1);
    
    const totalAmount = bookingData.priceDetails?.subtotal || 0;
    const convenienceFee = bookingData.priceDetails?.convenienceFee || 0;
    const taxes = bookingData.priceDetails?.taxes || 0;
    const discount = bookingData.priceDetails?.discount || 0;
    const finalTotal = bookingData.priceDetails?.total || 0;

    const discountPerSeat = discount / selectedSeats.length;
    const hostSeatDiscountedPrice = hostSeat.price - discountPerSeat;
    const discountedSubtotal = totalAmount - discount;
    
    const hostPaymentRatio = hostSeatDiscountedPrice / discountedSubtotal;
    const finalHostAmount = Math.round((discountedSubtotal + convenienceFee + taxes) * hostPaymentRatio);
    const finalAvailableAmount = finalTotal - finalHostAmount;

    return {
      movieTitle: bookingData.movieTitle || "Movie Title",
      moviePoster: bookingData.movieDetails?.poster,
      movieRating: bookingData.movieDetails?.rating || "0",
      theaterName: bookingData.theaterName || "Theater Name",
      screenName: bookingData.screenName || "Screen 1",
      showDate: new Date(bookingData.showDate).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }),
      showTime: bookingData.showTime || "Show Time",
      format: bookingData.showDetails?.format || "2D",
      language: bookingData.showDetails?.language || "English",
      
      hostSeat,
      availableSeats,
      totalSeats: selectedSeats.length,
      totalAmount: totalAmount + discount, 
      subtotal: discountedSubtotal,
      convenienceFee,
      taxes,
      discount,
      finalTotal,
      hostAmount: hostSeat.price,
      finalHostAmount,
      availableAmount: (totalAmount + discount) - hostSeat.price,
      finalAvailableAmount,
      minRating,
      selectedSeats,

      showtimeId: bookingData.showtimeId,
      movieId: bookingData.movieId,
      theaterId: bookingData.theaterId,
      screenId: bookingData.screenId,
    };
  }, [showTimeData, selectedSeats, minRating, bookingData]);

  const createHostBookingData = useCallback(() => {
    if (!groupInviteData || !showTimeData || !user || !bookingData) return null;

    const hostSeat = groupInviteData.hostSeat;
    const hostProportion = hostSeat.price / groupInviteData.totalAmount;
    
    return {
      ...bookingData, 
      
      selectedSeats: [hostSeat.seatNumber],
      selectedSeatIds: [hostSeat.seatNumber],
      
      selectedRows: [{
        rowLabel: hostSeat.seatNumber.charAt(0),
        seatsSelected: [parseInt(hostSeat.seatNumber.substring(1))],
        seatType: hostSeat.seatType,
        pricePerSeat: hostSeat.price
      }],
      
      seatPricing: [{
        rowId: showTimeData.rowPricing?.find(rp => rp.rowLabel === hostSeat.seatNumber.charAt(0))?._id || "temp_row_id",
        seatType: hostSeat.seatType,
        basePrice: hostSeat.price,
        finalPrice: hostSeat.price,
        rowLabel: hostSeat.seatNumber.charAt(0)
      }],
      
      priceDetails: {
        subtotal: Math.round((groupInviteData.subtotal) * hostProportion),
        convenienceFee: Math.round(groupInviteData.convenienceFee * hostProportion),
        taxes: Math.round(groupInviteData.taxes * hostProportion),
        discount: Math.round(groupInviteData.discount * hostProportion),
        total: groupInviteData.finalHostAmount
      },
      
      totalAmount: groupInviteData.finalHostAmount,
      amount: groupInviteData.finalHostAmount,
    };
  }, [groupInviteData, showTimeData, user, bookingData]);

  const createInviteData = useCallback(() => {
    if (!groupInviteData || !user) return null;
    
    const generateInviteId = () => {
      return `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    };

    return {
      inviteId: generateInviteId(),
      hostUserId: user._id || user.id || user.userId,
      showtimeId: groupInviteData.showtimeId,
      movieId: groupInviteData.movieId,
      theaterId: groupInviteData.theaterId,
      screenId: groupInviteData.screenId,
      
      requestedSeats: selectedSeats.map(seat => ({
        seatNumber: seat.seatNumber,
        seatRow: seat.seatNumber.charAt(0),
        seatType: seat.seatType,
        price: seat.price,
        isOccupied: false
      })),
      
      totalSlotsRequested: selectedSeats.length,
      availableSlots: selectedSeats.length - 1,
      minRequiredRating: minRating || undefined,
      
      showDate: showTimeData?.showDate ? new Date(showTimeData.showDate) : new Date(),
      showTime: groupInviteData.showTime,
      
      totalAmount: groupInviteData.finalTotal,
      paidAmount: 0,
      currency: "INR",
      
      ...(bookingData.appliedCoupon && {
        couponUsed: {
          couponId: bookingData.appliedCoupon._id,
          couponCode: bookingData.appliedCoupon.uniqueId,
          couponName: bookingData.appliedCoupon.name,
          discountPercentage: bookingData.appliedCoupon.discountPercentage,
          discountAmount: groupInviteData.discount,
          appliedAt: new Date()
        }
      }),
      
      priceBreakdown: {
        originalAmount: groupInviteData.totalAmount,
        discountedSubtotal: groupInviteData.subtotal,
        convenienceFee: groupInviteData.convenienceFee,
        taxes: groupInviteData.taxes,
        totalDiscount: groupInviteData.discount,
        finalAmount: groupInviteData.finalTotal
      },
      
      participants: [{
        userId: user._id || user.id || user.userId,
        joinedAt: new Date(),
        seatAssigned: selectedSeats[0].seatNumber,
        seatIndex: 0,
        paymentStatus: "pending",
        amount: groupInviteData.finalHostAmount,
        role: "host"
      }],
      
      status: "pending"
    };
  }, [groupInviteData, user, selectedSeats, minRating, showTimeData, bookingData?.appliedCoupon]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleRatingChange = useCallback((rating: number | undefined) => {
    setMinRating(rating);
  }, []);

  const handleCreateInvite = useCallback(async () => {
    if (!groupInviteData || !user) {
      toast.error("Missing required data");
      return;
    }

    setIsCreating(true);
    const loadingToast = toast.loading('Creating group invite...');

    try {
      const inviteData = createInviteData();
      await createInviteGroup(inviteData);
      toast.success('Group invite created successfully!', { id: loadingToast });

      setTimeout(() => {
        router.push(`/book/payment/${showtimeId}`);
      }, 1000);

    } catch (error) {
      console.error('Failed to create invite:', error);
      toast.error('Failed to create invite. Please try again.', { id: loadingToast });
    } finally {
      setIsCreating(false);
    }
  }, [groupInviteData, user, selectedSeats, minRating, showtimeId, router, createInviteData]);

  if (loading || !groupInviteData) {
    return <Loader text="Loading group invite details" />;
  }

  return (
    <RouteGuard allowedRoles={['user']}>
      <div className="min-h-screen bg-black relative overflow-hidden">
        <div className="fixed inset-0 z-10 opacity-30">
          <Prism
            animationType="rotate"
            timeScale={0.5}
            height={3.5}
            baseWidth={5.5}
            scale={3.6}
            hueShift={0}
            colorFrequency={1}
            noise={0}
            glow={1.3}
          />
        </div>
        <NavBar />
        <div className="relative z-20 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative pt-12 pb-8">
              <button
                onClick={handleBack}
                className={`${lexendSmall.className} flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-300 absolute left-0 top-12 z-10`}
              >
                <div className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all">
                  <ArrowLeft className="w-5 h-5" />
                </div>
                Back to Seats
              </button>
              <div className="flex justify-center">
                <p className={`${lexendBold.className} text-4xl text-white mb-2`}>
                  Create Group Invite
                </p>
              </div>
            </div>

            <GroupInviteSummary
              data={groupInviteData}
              onCreateInvite={handleOpenPaymentModal}
              onRatingChange={handleRatingChange}
              minRating={minRating}
              isCreating={isCreating}
              selectedCoupon={bookingData.appliedCoupon || selectedCoupon}
              availableCoupons={availableCoupons}
              onSelectCoupon={handleSelectCoupon}
              onRemoveCoupon={handleRemoveCoupon}
            />
          </div>
        </div>
        
        {showPaymentModal && (
          <PaymentGroupModal
            totalAmount={groupInviteData.finalHostAmount}
            onClose={handleClosePaymentModal}
            hostBookingData={createHostBookingData()}
            inviteData={createInviteData()}
            onCreateInvite={createInviteGroup}
          />
        )}
      </div>
    </RouteGuard>
  );
}

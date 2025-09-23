"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Lexend } from "next/font/google";
import { ArrowLeft } from "lucide-react";
import Prism from "@/app/others/components/ReactBits/Prism";
import { NavBar } from "@/app/others/components/Home";
import Loader from "@/app/others/components/utils/Loader";
import { PaymentModal } from "@/app/others/components/User/Payment/PaymentModal";
import { BookingSummary } from "@/app/others/components/User/Payment/BookingSummary";
import { lexendBold } from "@/app/others/Utils/fonts";
import { useSelector, useDispatch } from "react-redux";
import { getShowTimeUser } from "@/app/others/services/userServices/showTimeServices";
import { applyCoupon, calculateTotalAmount, removeCoupon, setBookingData } from "@/app/others/redux/slices/bookingSlice";
import RouteGuard from "@/app/others/components/Auth/common/RouteGuard";
import { getCouponsByTheaterId } from "@/app/others/services/userServices/couponServices";
import { BookingState, CouponData, RowPricing, SeatBreakdownItem, ShowTimeData } from "@/app/others/types";
import { RowPricingDto, ShowtimeResponseDto } from "@/app/others/dtos";
import { CouponResponseDto } from "@/app/others/dtos/coupon.dto";

const lexendSmall = Lexend({ weight: "200", subsets: ["latin"] });

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const showtimeId = params?.showtimeId as string;
  const bookingDatasRedux = useSelector((state: { booking: BookingState }) => state.booking.bookingData);
  const [showTimeData, setShowTimeData] = useState<ShowtimeResponseDto|null>(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [seatIdsUpdated, setSeatIdsUpdated] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState<CouponResponseDto[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<CouponResponseDto|null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [showCouponsModal, setShowCouponsModal] = useState(false);

  useEffect(() => {
    const fetchShowTimeData = async () => {
      if (!bookingDatasRedux?.showtimeId) return;

      try {
        const result = await getShowTimeUser(bookingDatasRedux.showtimeId);
        if(result.data)
        {
          setShowTimeData(result.data);
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchShowTimeData();
  }, [bookingDatasRedux?.showtimeId]);

  useEffect(() => {
    if (bookingDatasRedux?.totalAmount === 0 && bookingDatasRedux?.amount > 0) {
      dispatch(calculateTotalAmount());
    }
  }, [bookingDatasRedux?.totalAmount, bookingDatasRedux?.amount, dispatch]);

  const getSeatPrice = useCallback((seatId: string): { price: number, type: string } => {
    if (!showTimeData?.rowPricing) {
      return { price: 150, type: 'Standard' };
    }

    const rowLabel = seatId.charAt(0);
    const rowPricing = showTimeData.rowPricing.find((rp: RowPricingDto) => rp.rowLabel === rowLabel);

    if (rowPricing) {
      return {
        price: rowPricing.showtimePrice || rowPricing.basePrice || 150,
        type: rowPricing.seatType || 'Standard'
      };
    } else {
      return { price: 150, type: 'Standard' };
    }
  }, [showTimeData?.rowPricing]);

  const getSeatIds = useCallback((seatId: string): { id: string|undefined } => {
    if (!showTimeData?.rowPricing) {
      return { id: 'unknown' };
    }
    const rowLabel = seatId.charAt(0);
    const rowPricing = showTimeData.rowPricing.find((rp: RowPricingDto) => rp.rowLabel === rowLabel);
    return rowPricing ? { id: rowPricing._id } : { id: 'unknown' };
  }, [showTimeData?.rowPricing]);

  const seatBreakdown = useMemo(() => {
    if (!bookingDatasRedux?.selectedSeats || !showTimeData?.rowPricing) {
      return { breakdown: [], selectedRowIds: [] };
    }

    const breakdown: SeatBreakdownItem[] = [];
    const selectedRowIds: string[] = [];

    bookingDatasRedux.selectedSeats.forEach((seatId: string) => {
      const seatInfo = getSeatPrice(seatId);
      const seatIdObj = getSeatIds(seatId);

      breakdown.push({
        type: seatInfo.type,
        displayType: `${seatInfo.type} - ${seatId}`,
        price: seatInfo.price,
        count: 1,
        total: seatInfo.price,
        seats: [seatId],
        seatId: seatId,
      });
if(seatIdObj.id)
{

  selectedRowIds.push(seatIdObj.id);
}
    });

    return { breakdown, selectedRowIds };
  }, [
    bookingDatasRedux?.selectedSeats,
    showTimeData?.rowPricing,
    getSeatPrice,
    getSeatIds
  ]);

  useEffect(() => {
    if (!seatIdsUpdated && seatBreakdown.selectedRowIds.length > 0) {
      dispatch(setBookingData({ selectedRowIds: seatBreakdown.selectedRowIds }));
      setSeatIdsUpdated(true);
    }
  }, [seatBreakdown.selectedRowIds, seatIdsUpdated, dispatch]);
  useEffect(() => {
    const fetchTheaterCoupons = async () => {
      if (bookingDatasRedux?.theaterId) {
        try {
          const result = await getCouponsByTheaterId(bookingDatasRedux.theaterId);
          setAvailableCoupons(result.data || []);
        } catch (error) {
          console.error("Failed to fetch coupons:", error);
          setAvailableCoupons([]);
        }
      }
    };

    fetchTheaterCoupons();
  }, [bookingDatasRedux?.theaterId]);

const paymentData = useMemo(() => {
  if (!bookingDatasRedux || !showTimeData) return null;

  let finalSeatBreakdown = seatBreakdown.breakdown;

  if (finalSeatBreakdown.length === 0 && bookingDatasRedux.selectedSeats) {
    finalSeatBreakdown = bookingDatasRedux.selectedSeats.map((seatId: string) => ({
      type: "Standard",
      displayType: `Standard - ${seatId}`,
      price: Math.round(bookingDatasRedux.amount / bookingDatasRedux.selectedSeats.length),
      count: 1,
      total: Math.round(bookingDatasRedux.amount / bookingDatasRedux.selectedSeats.length),
      seats: [seatId],
      seatId: seatId
    }));
  }

return {
  movieTitle: (typeof showTimeData.movieId === 'object' && showTimeData.movieId?.title) 
    ? showTimeData.movieId.title 
    : "Movie Title",
  
  moviePoster: (typeof showTimeData.movieId === 'object' && showTimeData.movieId?.poster) 
    ? showTimeData.movieId.poster 
    : undefined,
  
  movieRating: (typeof showTimeData.movieId === 'object' && showTimeData.movieId?.rating) 
    ? showTimeData.movieId.rating 
    : "0", 
  
  theaterName: (typeof showTimeData.theaterId === 'object' && showTimeData.theaterId?.name) 
    ? showTimeData.theaterId.name 
    : "Theater Name",
  
  screenName: (() => {
    if (typeof showTimeData.screenId === 'object' && showTimeData.screenId?.name) {
      return `Screen ${showTimeData.screenId.name}`;
    } else if (typeof showTimeData.screenId === 'string') {
      return `Screen ${showTimeData.screenId}`;
    } else {
      return `Screen 1`;
    }
  })(),
  
  showDate: showTimeData.showDate 
    ? new Date(showTimeData.showDate).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      })
    : new Date().toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }),
  
  showTime: showTimeData.showTime || "Show Time",
  format: showTimeData.format || "2D",
  language: showTimeData.language || "English",
  selectedSeats: bookingDatasRedux.selectedSeats,
  seatBreakdown: finalSeatBreakdown,
  
  subtotal: bookingDatasRedux.priceDetails?.subtotal || 0,
  convenienceFee: bookingDatasRedux.priceDetails?.convenienceFee || 0,
  taxes: bookingDatasRedux.priceDetails?.taxes || 0,
  discount: bookingDatasRedux.priceDetails?.discount || 0,
  total: bookingDatasRedux.priceDetails?.total || 0,
  savings: bookingDatasRedux.priceDetails?.discount || 0,
  
  selectedCoupon: bookingDatasRedux.appliedCoupon || selectedCoupon,
  availableCoupons: availableCoupons
};

}, [bookingDatasRedux, showTimeData, seatBreakdown.breakdown, selectedCoupon, availableCoupons]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);
  const handleSelectCoupon = useCallback((coupon: CouponResponseDto) => {
    setSelectedCoupon(coupon);
    if(paymentData)
    {
      
      const discount = Math.round(paymentData.subtotal * (coupon.discountPercentage / 100));
        setCouponDiscount(discount);
          dispatch(applyCoupon({
        coupon: coupon,
        discountAmount: discount
      }));
      
    }

    setShowCouponsModal(false);
  }, [paymentData?.subtotal,dispatch]);

  const handleRemoveCoupon = useCallback(() => {
    setSelectedCoupon(null);
      dispatch(removeCoupon());

    setCouponDiscount(0);
  }, [dispatch]);

  const handleShowCouponsModal = useCallback(() => {
    setShowCouponsModal(true);
  }, []);


  const handleOpenPaymentModal = useCallback(() => {
    setShowPaymentModal(true);
  }, []);

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
  }

  if (loading || !paymentData) {
    return <Loader text="Loading payment details" />;
  }

  return (
    <RouteGuard allowedRoles={['user']} >
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
                  Complete Your Booking
                </p>
              </div>
            </div>
            <BookingSummary
              data={paymentData}
              onPayment={handleOpenPaymentModal}
              selectedCoupon={selectedCoupon}
              availableCoupons={availableCoupons}
              onSelectCoupon={handleSelectCoupon}
              onRemoveCoupon={handleRemoveCoupon}
              onShowCouponsModal={handleShowCouponsModal}
              

            />
          </div>
        </div>
        {showPaymentModal && (
          <PaymentModal
            totalAmount={paymentData.total}
            onClose={handleClosePaymentModal}
          />
        )}
      </div>
    </RouteGuard>
  );
}

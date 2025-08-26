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
import { calculateTotalAmount, setBookingData } from "@/app/others/redux/slices/bookingSlice";

const lexendSmall = Lexend({ weight: "200", subsets: ["latin"] });

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const showtimeId = params?.showtimeId as string;

  const bookingDatasRedux = useSelector((state: any) => state.booking.bookingData);

  const [showTimeData, setShowTimeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [seatIdsUpdated, setSeatIdsUpdated] = useState(false); // Flag to prevent infinite dispatch


  useEffect(() => {
    const fetchShowTimeData = async () => {
      if (!bookingDatasRedux?.showtimeId) return;

      try {
        const result = await getShowTimeUser(bookingDatasRedux.showtimeId);
        setShowTimeData(result.data);
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
    const rowPricing = showTimeData.rowPricing.find((rp: any) => rp.rowLabel === rowLabel);

    if (rowPricing) {
      return {
        price: rowPricing.showtimePrice || rowPricing.basePrice || 150,
        type: rowPricing.seatType || 'Standard'
      };
    } else {
      return { price: 150, type: 'Standard' };
    }
  }, [showTimeData?.rowPricing]);

  const getSeatIds = useCallback((seatId: string): { id: string } => {
    if (!showTimeData?.rowPricing) {
      return { id: 'unknown' };
    }
    const rowLabel = seatId.charAt(0);
    const rowPricing = showTimeData.rowPricing.find((rp: any) => rp.rowLabel === rowLabel);
    return rowPricing ? { id: rowPricing._id } : { id: 'unknown' };
  }, [showTimeData?.rowPricing]);
  const seatBreakdown = useMemo(() => {
    if (!bookingDatasRedux?.selectedSeats || !showTimeData?.rowPricing) {
      return [];
    }
    const breakdown: any[] = [];
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

      selectedRowIds.push(seatIdObj.id);
    });

    if (!seatIdsUpdated && selectedRowIds.length > 0) {
      dispatch(setBookingData({ selectedRowIds }));
      setSeatIdsUpdated(true);
    }

    return breakdown;
  }, [
    bookingDatasRedux?.selectedSeats,
    showTimeData?.rowPricing,
    getSeatPrice,
    getSeatIds,
    seatIdsUpdated,
    dispatch
  ]);

  const paymentData = useMemo(() => {
    if (!bookingDatasRedux || !showTimeData) return null;
    let finalSeatBreakdown = seatBreakdown;
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
    const seatTotal = finalSeatBreakdown.reduce((sum: number, item: any) => sum + item.total, 0);
    const convenienceFee = Math.round(seatTotal * 0.05);
    const taxes = Math.round(seatTotal * 0.18);
    const totalAmount = seatTotal + convenienceFee + taxes;
    return {
      movieTitle: showTimeData.movieId?.title || "Movie Title",
      movieRating: showTimeData.movieId?.rating || 0,
      theaterName: showTimeData.theaterId?.name || "Theater Name",
      screenName: `Screen ${showTimeData.screenId?.name || showTimeData.screenId || 1}`,
      showDate: new Date(showTimeData.date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }),
      showTime: showTimeData.time || "Show Time",
      format: showTimeData.format || "2D",
      language: showTimeData.language || "English",
      selectedSeats: bookingDatasRedux.selectedSeats,
      seatBreakdown: finalSeatBreakdown,
      subtotal: seatTotal,
      convenienceFee: convenienceFee,
      taxes: taxes,
      discount: 0,
      total: totalAmount,
      savings: 0
    };
  }, [bookingDatasRedux, showTimeData, seatBreakdown]);
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);
  const handleOpenPaymentModal = useCallback(() => {
    console.log('payment data suiiii', bookingDatasRedux);
    setShowPaymentModal(true);
  }, [bookingDatasRedux]);

  const handleClosePaymentModal = useCallback(() => {

    setShowPaymentModal(false);
  }, []);

  if (loading || !paymentData) {
    return <Loader text="Loading payment details" />;
  }

  return (
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
  );
}

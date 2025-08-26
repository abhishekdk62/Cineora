"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Lexend } from "next/font/google";
import { ArrowLeft, Calendar, Loader2 } from "lucide-react";
import { getShowTimeUser } from "@/app/others/services/userServices/showTimeServices";
import CurvedScreen from "@/app/others/components/User/Ticket/CurvedScreen";
import SeatLayout from "@/app/others/components/User/Ticket/SeatLayout";
import Legend from "@/app/others/components/User/Ticket/Legend";
import SelectionSummary from "@/app/others/components/User/Ticket/SelectionSummary";
import Prism from "@/app/others/components/ReactBits/Prism";
import { NavBar } from "@/app/others/components/Home";
import Loader from "@/app/others/components/utils/Loader";
import { totalmem } from "os";
import { useDispatch } from "react-redux";
import { setBookingData } from "@/app/others/redux/slices/bookingSlice";
const lexendSmall = Lexend({ weight: "200", subsets: ["latin"] });
const lexendMedium = Lexend({ weight: "400", subsets: ["latin"] });
const lexendBold = Lexend({ weight: "700", subsets: ["latin"] });
export interface Seat {
  col: number;
  id: string;
  type: string;
  price: number;
}
export interface Row {
  rowLabel: string;
  offset: number;
  seats: Seat[];
}
interface ShowtimeData {
  _id: string;
  movieId: any;
  theaterId: any;
  screenId: {
    _id: string;
    name: string;
    layout: {
      rows: number;
      seatsPerRow: number;
      advancedLayout: { rows: Row[] };
    };
  };
  showDate: string;
  showTime: string;
  endTime: string;
  format: string;
  language: string;
  bookedSeats: string[];
  blockedSeats: string[];
  rowPricing: Array<any>;
}
export type SeatStatus = 'available' | 'booked' | 'selected' | 'blocked';
export default function SeatSelectionPage() {
  const params = useParams();
  const router = useRouter();
  const showtimeId = params?.showtimeId as string;
  const [showtimeData, setShowtimeData] = useState<ShowtimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [seatStatuses, setSeatStatuses] = useState<Record<string, SeatStatus>>({});
  const getMaxCols = (rows: Row[]): number => Math.max(...rows.map(row => row.offset + row.seats.length));
  useEffect(() => {
    if (!showtimeId) return;
    const fetchShowtimeData = async () => {
      try {
        setLoading(true);
        const response = await getShowTimeUser(showtimeId);
        let data = response.data;
        console.log('showiemdatas', response.data);

        setShowtimeData(data);

        const statuses: Record<string, SeatStatus> = {};
        data.screenId.layout.advancedLayout.rows.forEach((row: Row) => {
          row.seats.forEach(seat => {
            if (data.bookedSeats.includes(seat.id)) statuses[seat.id] = 'booked';
            else if (data.blockedSeats.includes(seat.id)) statuses[seat.id] = 'blocked';
            else statuses[seat.id] = 'available';
          });
        });
        setSeatStatuses(statuses);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchShowtimeData();
  }, [showtimeId]);
  const handleSeatClick = (seatId: string) => {
    const currentStatus = seatStatuses[seatId];
    if (currentStatus === 'booked' || currentStatus === 'blocked') return;
    if (currentStatus === 'selected') {
      setSelectedSeats(prev => prev.filter(id => id !== seatId));
      setSeatStatuses(prev => ({ ...prev, [seatId]: 'available' }));
    } else {
      if (selectedSeats.length < 6) {
        setSelectedSeats(prev => [...prev, seatId]);
        setSeatStatuses(prev => ({ ...prev, [seatId]: 'selected' }));
      }
    }
  };

  const getSeatPrice = (seatId: string): number => {
    if (!showtimeData) return 0;
    const rowLabel = seatId.charAt(0);
    const rowPricing = showtimeData.rowPricing.find(rp => rp.rowLabel === rowLabel);
    console.log();

    return rowPricing?.showtimePrice || rowPricing?.basePrice || 150;
  };

  const calculateTotalAmount = (): number => {
    return selectedSeats.reduce((total, seatId) => total + getSeatPrice(seatId), 0);
  };

  const getSeatButtonStyle = (status: SeatStatus, seatType?: string) => {
    let baseStyle = "w-8 h-8 rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center text-xs font-medium border-2 ";
    if (seatType === 'VIP') baseStyle += "bg-yellow-500 text-black border-yellow-400 ";
    else if (seatType === 'Premium') baseStyle += "bg-purple-600 text-white border-purple-500 ";
    else baseStyle += "bg-gray-600 text-white border-gray-500 ";

    switch (status) {
      case 'available': return baseStyle + "hover:opacity-80";
      case 'booked':
        return "w-8 h-8 rounded-lg bg-red-500 text-white cursor-not-allowed border-2 border-red-400 flex items-center justify-center text-xs font-medium";
      case 'selected':
        return "w-8 h-8 rounded-lg bg-cyan-400 text-black border-2 border-cyan-300 scale-110 flex items-center justify-center text-xs font-medium transition-all duration-200";
      case 'blocked':
        return "w-8 h-8 rounded-lg bg-gray-800 text-gray-600 cursor-not-allowed border-2 border-gray-700 flex items-center justify-center text-xs font-medium";
      default: return baseStyle;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleBack = () => {
    router.back();
  };
  const dispatch = useDispatch();
  const handleProceedToPayment = () => {
    const bookingData = {
      showtimeId,
      selectedSeats,
      totalAmount: calculateTotalAmount(),
    };
    console.log('The total item is', calculateTotalAmount());
    console.log('The shotime id', showtimeId);
    console.log('The selected seet are ', selectedSeats);
    router.push(`/book/payment/${showtimeId}`);

    dispatch(setBookingData({
      showtimeId: showtimeId,
      selectedSeats: selectedSeats,
      amount: calculateTotalAmount(),
    }))
    sessionStorage.setItem("bookingData", JSON.stringify(bookingData));
  };
  const getSeatType = (seatId: string): string => {
    if (!showtimeData) return 'General';
    const rowLabel = seatId.charAt(0);
    const row = showtimeData.screenId.layout.advancedLayout.rows.find(r => r.rowLabel === rowLabel);
    const seat = row?.seats.find(s => s.id === seatId);
    return seat?.type || 'General';
  };

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

      <div className="relative z-20">
        {loading && (
          <Loader text="Loading seats" />
        )}

        {(error || !showtimeData) && !loading && (
          <div className="pt-20 flex items-center justify-center">
            <div className="text-center">
              <p className={`${lexendMedium.className} text-red-400 mb-4`}>
                {error || "Showtime not found"}
              </p>
              <button
                onClick={handleBack}
                className={`${lexendMedium.className} bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-colors`}
              >
                Go Back
              </button>
            </div>
          </div>
        )}

        {!loading && showtimeData && (
          <div className="pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


              <div className="relative flex items-center pt-12 pb-30">
                <button
                  onClick={handleBack}
                  className={`${lexendSmall.className} flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-300 mb-6 absolute left-5 z-10`}
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Showtimes
                </button>

                <div className="w-full flex justify-center">
                  <p className={`${lexendBold.className} text-4xl text-center text-white`}>
                    Choose Your Seats
                  </p>
                </div>
              </div>


              <CurvedScreen />

              <SeatLayout
                rows={showtimeData.screenId.layout.advancedLayout.rows}
                seatStatuses={seatStatuses}
                onSeatClick={handleSeatClick}
                getSeatButtonStyle={getSeatButtonStyle}
                getSeatPrice={getSeatPrice}
                lexendMediumClassName={lexendMedium.className}
                maxCols={getMaxCols(showtimeData.screenId.layout.advancedLayout.rows)}
              />

              <Legend lexendSmallClassName={lexendSmall.className} />

              {selectedSeats.length > 0 && (
                <SelectionSummary
                  selectedSeats={selectedSeats}
                  totalAmount={calculateTotalAmount()}
                  lexendMediumClassName={lexendMedium.className}
                  lexendSmallClassName={lexendSmall.className}
                  lexendBoldClassName={lexendBold.className}
                  onProceed={handleProceedToPayment}
                  getSeatPrice={getSeatPrice}
                  getSeatType={getSeatType}
                />
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

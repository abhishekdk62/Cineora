
// @ts-nocheck

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
import { useDispatch, useSelector } from "react-redux";
import { setBookingData } from "@/app/others/redux/slices/bookingSlice";
import RouteGuard from "@/app/others/components/Auth/common/RouteGuard";
import { ShowtimeResponseDto } from "@/app/others/dtos";

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

interface MovieDetails {
  _id: string;
  title: string;
  poster: string;
  director: string;
  cast: string[];
  genre: string[];
  duration: number;
  rating: string;
  language: string;
  description: string;
  releaseDate: string;
  tmdbId: string;
  trailer: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface TheaterDetails {
  _id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  screens: number;
  facilities: string[];
  location: {
    type: string;
    coordinates: number[];
  };
  isActive: boolean;
  isVerified: boolean;
  isRejected: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ScreenDetails {
  _id: string;
  name: string;
  theaterId: string;
  totalSeats: number;
  layout: {
    rows: number;
    seatsPerRow: number;
    advancedLayout: {
      rows: Row[]
    };
  };
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface RowPricing {
  _id: string;
  rowLabel: string;
  seatType: "Normal" | "Premium" | "VIP";
  basePrice: number;
  showtimePrice: number;
  totalSeats: number;
  availableSeats: number;
  bookedSeats: string[];
}


export interface ShowtimeData {
  _id: string;
  ownerId: string;

  movieId: MovieDetails;
  theaterId: TheaterDetails;
  screenId: ScreenDetails;

  showDate: string;
  showTime: string;
  endTime: string;

  format: string;
  language: string;
  ageRestriction: string | null;
  isActive: boolean;

  totalSeats: number;
  availableSeats: number;
  bookedSeats: string[];
  blockedSeats: string[];

  rowPricing: RowPricing[];

  createdAt: string;
  updatedAt: string;
  __v: number;
}

export type SeatStatus = 'available' | 'booked' | 'selected' | 'blocked';

export default function SeatSelectionPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const user = useSelector((state: string) => state.auth.user);
  const bookingDatasRedux = useSelector((state: string) => state.booking.bookingData);

  const showtimeId = params?.showtimeId as string;
  const [showtimeData, setShowtimeData] = useState<ShowtimeResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [seatStatuses, setSeatStatuses] = useState<Record<string, SeatStatus>>({});

  // This should match exactly how the owner side calculates it
  const getMaxCols = (rows: Row[], aisles?: string) => {
    if (!rows || rows.length === 0) return 0;

    // Base calculation - same as owner side
    const baseMaxCols = Math.max(...rows.map((row: Row) =>
      (row.offset || 0) + (row.seats?.length || 0)
    ));

    // DON'T add aisle width here - the owner side doesn't do this
    return baseMaxCols; // This should be 16 for your data
  };


  const getSeatPrice = (seatId: string): number => {
    if (!showtimeData) return 0;
    const rowLabel = seatId.charAt(0);
    const rowPricing = showtimeData.rowPricing.find(rp => rp.rowLabel === rowLabel);
    return rowPricing?.showtimePrice || rowPricing?.basePrice || 150;
  };

  const calculateTotalAmount = (): number => {
    return selectedSeats.reduce((total, seatId) => total + getSeatPrice(seatId), 0);
  };

  const getSeatType = (seatId: string): string => {
    if (!showtimeData) return 'General';
    const rowLabel = seatId.charAt(0);
    if(typeof showtimeData.screenId=='object')
    {

      const row = showtimeData.screenId.layout.advancedLayout.rows.find((r:{rowLabel:string}) => r.rowLabel === rowLabel);
      const seat = row?.seats.find((s :{id:string})=> s.id === seatId);
      if(seat?.type)return seat?.type ||  'General';
    }
    return 'General';

  };

  useEffect(() => {
    if (!showtimeId) return;

    const fetchShowtimeData = async () => {
      try {
        setLoading(true);
        const response = await getShowTimeUser(showtimeId);
        const data = response.data;

        console.log('Showtime data:', data);
        if (data) {

          setShowtimeData(data);
        }

        const statuses: Record<string, SeatStatus> = {};
        if (data) {
          if (typeof data.screenId === 'object') {

            data.screenId.layout.advancedLayout.rows.forEach((row) => {
              row.seats.forEach(seat => {
                if (data.bookedSeats && data?.bookedSeats.includes(seat.id)) {
                  statuses[seat.id] = 'booked';
                } else if (typeof data.blockedSeats == 'string' && data.blockedSeats.includes(seat.id)) {
                  statuses[seat.id] = 'blocked';
                } else {
                  statuses[seat.id] = 'available';
                }
              });
            });
          }
        }
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

  const getSeatButtonStyle = (status: SeatStatus, seatType?: string) => {
    let baseStyle = "w-8 h-8 rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center text-xs font-medium border-2 ";

    if (seatType === 'VIP') {
      baseStyle += "bg-yellow-500 text-black border-yellow-400 ";
    } else if (seatType === 'Premium') {
      baseStyle += "bg-purple-600 text-white border-purple-500 ";
    } else {
      baseStyle += "bg-gray-600 text-white border-gray-500 ";
    }

    switch (status) {
      case 'available':
        return baseStyle + "hover:opacity-80";
      case 'booked':
        return "w-8 h-8 rounded-lg bg-red-500 text-white cursor-not-allowed border-2 border-red-400 flex items-center justify-center text-xs font-medium";
      case 'selected':
        return "w-8 h-8 rounded-lg bg-cyan-400 text-black border-2 border-cyan-300 scale-110 flex items-center justify-center text-xs font-medium transition-all duration-200";
      case 'blocked':
        return "w-8 h-8 rounded-lg bg-gray-800 text-gray-600 cursor-not-allowed border-2 border-gray-700 flex items-center justify-center text-xs font-medium";
      default:
        return baseStyle;
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleProceedToPayment = () => {
    if (!showtimeData || !user) return;

    const selectedRowsData = selectedSeats.map(seatId => {
      const rowLabel = seatId.charAt(0);
      const seatNumber = seatId.substring(1);

      const rowPricingInfo = showtimeData.rowPricing.find(rp => rp.rowLabel === rowLabel);

      return {
        seatId,
        rowLabel,
        seatNumber,
        seatType: rowPricingInfo?.seatType || 'Normal',
        basePrice: rowPricingInfo?.basePrice || 150,
        finalPrice: rowPricingInfo?.showtimePrice || rowPricingInfo?.basePrice || 150,
        rowId: rowPricingInfo?._id || '',
      };
    });

    const selectedRowsGrouped = selectedRowsData.reduce((acc, seat) => {
      const existingRow = acc.find(row => row.rowLabel === seat.rowLabel);

      if (existingRow) {
        existingRow.seatsSelected.push(seat.seatNumber);
        existingRow.seatCount += 1;
        existingRow.totalPrice += seat.finalPrice;
      } else {
        acc.push({
          rowId: seat.rowId,
          rowLabel: seat.rowLabel,
          seatsSelected: [seat.seatNumber],
          seatCount: 1,
          seatType: seat.seatType as "VIP" | "Premium" | "Normal",
          pricePerSeat: seat.finalPrice,
          totalPrice: seat.finalPrice,
        });
      }

      return acc;
    }, [] as string[]);

    const totalAmount = calculateTotalAmount();
    const convenienceFee = Math.round(totalAmount * 0.05);
    const taxes = Math.round(totalAmount * 0.18);
    const finalTotal = totalAmount + convenienceFee + taxes;

dispatch(setBookingData({
  showtimeId: showtimeData._id,
  movieId: (showtimeData.movieId as { _id: string })._id,
  theaterId: (showtimeData.theaterId as { _id: string })._id,
  screenId: (showtimeData.screenId as { _id: string })._id,

  userId: user?.id || user?.userId || user?._id,

  movieTitle: (showtimeData.movieId as { title: string }).title,
  movieDetails: {
    title: (showtimeData.movieId as { title: string }).title,
    poster: (showtimeData.movieId as { poster: string }).poster,
    director: (showtimeData.movieId as { director: string }).director,
    cast: (showtimeData.movieId as { cast: string }).cast,
    genre: (showtimeData.movieId as { genre: string }).genre,
    duration: (showtimeData.movieId as { duration: string }).duration,
    rating: (showtimeData.movieId as { rating: string }).rating,
    language: (showtimeData.movieId as { language: string }).language,
    description: (showtimeData.movieId as { description: string }).description,
    releaseDate: (showtimeData.movieId as { releaseDate: string }).releaseDate,
    tmdbId: (showtimeData.movieId as { tmdbId: string }).tmdbId,
    trailer: (showtimeData.movieId as { trailer: string }).trailer,
  },

  theaterName: (showtimeData.theaterId as { name: string }).name,
  theaterDetails: {
    name: (showtimeData.theaterId as { name: string }).name,
    address: (showtimeData.theaterId as { address: string }).address,
    city: (showtimeData.theaterId as { city: string }).city,
    state: (showtimeData.theaterId as { state: string }).state,
    pincode: (showtimeData.theaterId as { pincode: string }).pincode,
    phone: (showtimeData.theaterId as { phone: string }).phone,
    screens: (showtimeData.theaterId as { screens: number }).screens,
    facilities: (showtimeData.theaterId as { facilities: string[] }).facilities,
    location: (showtimeData.theaterId as { location: object }).location,
    isVerified: (showtimeData.theaterId as { isVerified: boolean }).isVerified,
  },

  screenName: (showtimeData.screenId as { name: string }).name,
  screenDetails: {
    name: (showtimeData.screenId as { name: string }).name,
    totalSeats: (showtimeData.screenId as { totalSeats: number }).totalSeats,
    layout: (showtimeData.screenId as { layout: object }).layout,
    features: (showtimeData.screenId as { features: string[] }).features,
    theaterId: (showtimeData.screenId as { theaterId: string }).theaterId,
  },

  showDate: showtimeData.showDate as string,
  showTime: showtimeData.showTime,
  showDetails: {
    endTime: showtimeData.endTime,
    format: showtimeData.format,
    language: showtimeData.language,
    availableSeats: showtimeData.availableSeats,
    totalSeats: showtimeData.totalSeats,
    bookedSeats: showtimeData.bookedSeats,
    blockedSeats: showtimeData.blockedSeats,
    isActive: showtimeData.isActive,
    ageRestriction: showtimeData.ageRestriction,
    ownerId: showtimeData.ownerId,
  },

  allRowPricing: showtimeData.rowPricing,

  contactInfo: {
    email: user?.email || "",
    phone: user?.phone || ""
  },

  selectedRows: selectedRowsGrouped,
  selectedSeats: selectedSeats,

  seatPricing: selectedRowsData.map(seat => ({
    rowId: seat.rowId,
    rowLabel: seat.rowLabel,
    seatType: seat.seatType as "VIP" | "Premium" | "Normal",
    basePrice: seat.basePrice,
    finalPrice: seat.finalPrice,
    seatsSelected: [seat.seatNumber],
    seatCount: 1,
  })),

  priceDetails: {
    subtotal: totalAmount,
    convenienceFee: convenienceFee,
    taxes: taxes,
    discount: 0,
    total: finalTotal,
  },

  amount: totalAmount,
  tax: taxes,
  totalAmount: finalTotal,

  paymentMethod: "",
  paymentGateway: "",
  bookingStatus: "pending",
  paymentStatus: "pending",
}));

const backupBookingData = {
  showtimeId: showtimeData._id,
  selectedSeats,
  selectedRows: selectedRowsGrouped,
  totalAmount: finalTotal,
  movieTitle: (showtimeData.movieId as { title: string }).title,
  theaterName: (showtimeData.theaterId as { name: string }).name,
};

    sessionStorage.setItem("bookingData", JSON.stringify(backupBookingData));
    router.push(`/book/payment/${showtimeId}`);
  };

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

             {typeof showtimeData.screenId === 'object' && (
  <>
    <SeatLayout
      rows={(showtimeData.screenId as {
        _id: string;
        name: string;
        layout: { advancedLayout: { rows: Row[]; aisles?: string } };
        totalSeats: number;
        features: string[];
        theaterId: string;
      }).layout.advancedLayout.rows}
      seatStatuses={seatStatuses}
      onSeatClick={handleSeatClick}
      getSeatButtonStyle={getSeatButtonStyle}
      getSeatPrice={getSeatPrice}
      lexendMediumClassName={lexendMedium.className}
      maxCols={getMaxCols((showtimeData.screenId as {
        _id: string;
        name: string;
        layout: { advancedLayout: { rows: Row[] } };
        totalSeats: number;
        features: string[];
        theaterId: string;
      }).layout.advancedLayout.rows)}
      aisles={(showtimeData.screenId as {
        _id: string;
        name: string;
        layout: { advancedLayout: { rows: Row[]; aisles?: string } };
        totalSeats: number;
        features: string[];
        theaterId: string;
      }).layout.advancedLayout.aisles}
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
  </>
)}

              </div>
            </div>
          )}
        </div>
      </div>
    </RouteGuard>
  );
}

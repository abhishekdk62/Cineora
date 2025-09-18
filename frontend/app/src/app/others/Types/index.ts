import { Movie } from "../components/Admin/Dashboard/Movies/MoviesList";
export interface ITheater {
  _id: string;
  ownerId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  phone: string;
  facilities: string[];
  screens: number;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}
export interface ITheaterModal {
  _id: string;
  ownerId: string | { 
    _id: string;
    ownerName: string;
    email: string;
  };
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  phone: string;
  facilities: string[];
  screens: number;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}


export type ShowTime = {
  movieId: string;
  theaterId: string;
  time: string;
};

export type Suggestion =
  | { type: "movie"; data: Movie }
  | { type: "theater"; data: ITheater };



export interface TheaterFilters {
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
  ownerId?: string;
  status?: "active" | "inactive";
}

export interface TheaterResponse {
  theaters: ITheater[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}
export interface GoogleCredentialResponse {
  credential: string; // JWT token
  select_by?: string; // How the credential was selected
  client_id?: string; // Your Google client ID
}

export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword?: string; // Optional since it might not always be present
  firstName: string;
  lastName: string;
  username?: string; // Optional since it can be derived from email
}
 export interface UnifiedBookingEntity {
  _id: string;
  title?: string;
  poster?: string;
  duration?: number;
  rating?: string;
  genre?: string[];
  name?: string;
  language?: string;
  format?: string;
  showTime?: string;
  theaterName?: string;
  location?: {
    coordinates: [string, string]
  }
  theaterLocation?: { coordinates: [number, number]; type: string };
  distance?: string;
  amenities?: string[];
  city?: string;
  state?: string;
  screens?: number;
  movieId?: {
    _id: string;
    title: string;
    poster: string;
    duration: number;
    rating: string;
    genre: string[];
    language: string;
    description?: string;
    director?: string;
    cast?: string[];
    releaseDate?: string;
    tmdbId?: string;
    trailer?: string;
  };
  screenId?: {
    _id: string;
    name: string;
    screenType?: string;
    totalSeats: number;
    theaterId: string;
    features?: string[];
    layout?: {
      rows: number;
      seatsPerRow: number;
      advancedLayout: {
        rows: {
          rowLabel: string;
          offset: number;
          seats: {
            col: number;
            id: string;
            type: string;
            price: number;
          }[];
        }[];
        aisles?: {
          vertical: {
            id: string;
            position: number;
            width: number;
          }[];
          horizontal: {
            id: string;
            afterRow: number;
            width: number;
          }[];
        };
      };
      seatMap?: Record<string, unknown>; 
    };
  };
  rowPricing?: {
    rowLabel: string;
    seatType: "VIP" | "Premium" | "Normal"; 
    basePrice: number;
    showtimePrice: number;
    totalSeats: number;
    availableSeats: number;
    bookedSeats: string[]; 
    _id: string;
  }[];
  availableSeats?: number;
  totalSeats?: number;
  blockedSeats?: ISeatBlock[];
  bookedSeats?: string[];
  theaterId?: string;
  ownerId?: string;
  showDate?: string;
  endTime?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  showtimes?: {
    _id?: string;
    showtimeId?: string;
    time?: string;
    showTime?: string;
    endTime?: string;
    format?: "2D" | "3D" | "IMAX" | "4DX" | "Dolby Atmos"; // ✅ REPLACED: string with specific union type from IMovieShowtime
    language?: string;
    screenName?: string;
    screenType?: string;
    availableSeats?: number;
    totalSeats?: number;
    price?: number;
    rowPricing?: {
      rowLabel: string;
      seatType: "VIP" | "Premium" | "Normal"; 
      basePrice: number;
      showtimePrice: number;
      totalSeats: number;
      availableSeats: number;
      bookedSeats: string[]; 
      _id: string;
    }[];
  }[];
}

export interface ISeatBlock {
  seatId: string;
  userId: string;
  sessionId: string;
  blockedAt: Date;
  expiresAt: Date;
}
export interface BookingState {
  bookingData: BookingData;
}
interface BookingData {
  totalAmount: number;
  amount: number;
  selectedSeats: string[];
  theaterId: string;
  selectedRowIds?: string[];
  // ✅ ADD: Missing properties
  showtimeId?: string;
  priceDetails?: {
    subtotal: number;
    convenienceFee: number;
    taxes: number;
    discount: number;
    total: number;
  };
  appliedCoupon?: CouponData | null;
}
export interface RowPricing {
  _id?: string;
  rowLabel: string;
  seatType: "VIP" | "Premium" | "Normal";
  basePrice: number;
  showtimePrice: number;
  totalSeats: number;
  availableSeats: number;
  bookedSeats: string[];
}

export interface ShowTimeData {
  _id: string;
  rowPricing: RowPricing[];
  // Add other showtime properties as needed
    movieId?: {
    _id: string;
    title: string;
    poster: string;
    }
  theaterId?: string|{
    name:string;
  };
  screenId?: string;
  showDate?: string;
  showTime?: string;
  endTime?: string;
}

export interface CouponData {
  uniqueId:string;
  name:string;
  _id: string;
  code: string;
  discount: number;
    discountPercentage?: number; // ✅ ADD: If API uses this field

  discountType: 'percentage' | 'fixed';
  minAmount?: number;
  maxDiscount?: number;
  theaterId: string;
  isActive: boolean;
  expiresAt: Date;
  // Add other coupon properties as needed
}

export interface SeatBreakdownItem {
  type: string;
  displayType: string;
  price: number;
  count: number;
  total: number;
  seats: string[];
  seatId: string;
}

export interface SeatBreakdown {
  breakdown: SeatBreakdownItem[];
  selectedRowIds: string[];
}

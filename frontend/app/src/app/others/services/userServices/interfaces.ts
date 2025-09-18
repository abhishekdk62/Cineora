
export interface Theater {
  _id: string;
  name: string;
  city: string;
  state: string;
  location: {
    coordinates: [number, number];
  };
  theaterLocation?: {
    coordinates: [number, number];
  };
  address?:string;
  rating: number;
  facilities: string[];
  distance?: string;
}

export interface TheaterResponse {
  theaters: Theater[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}


export interface GetTheatersFilters {
  search?: string;
  sortBy?: "nearby" | "rating-high" | "rating-low" | "a-z" | "z-a";
  page?: number;
  limit?: number;
  facilities?: string[];
  latitude?: number;
  longitude?: number;
}

export interface CreateOrderData {
  amount: number;
  currency?: string;
}

export interface PaymentVerificationData {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  bookingData?: CreateOrderResponse;
}

export interface CreateOrderResponse {
  id: string;
  data: { id: string };
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export interface PaymentVerificationResponse {
  success: boolean;
  message: string;
}
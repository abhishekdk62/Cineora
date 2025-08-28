import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SeatPricing {
  rowId: string; 
  rowLabel: string; 
  seatType: "VIP" | "Premium" | "Normal";
  basePrice: number;
  finalPrice: number;
  seatsSelected: string[]; 
  seatCount: number; 
}

interface PriceDetails {
  subtotal: number; 
  convenienceFee: number; 
  taxes: number; 
  discount: number; 
  total: number; 
}

interface ContactInfo {
  email: string;
  phone: string;
}

interface SelectedRow {
  rowId: string; 
  rowLabel: string; 
  seatsSelected: string[]; 
  seatCount: number;
  seatType: "VIP" | "Premium" | "Normal";
  pricePerSeat: number;
  totalPrice: number;
}

interface BookingData {
  showtimeId?: string;
  movieId?: string;
  theaterId?: string;
  screenId?: string;
movieDetails?:{};
theaterDetails?:{};
screenDetails?:{};
showDetails?:{};
allRowPricing?:any;
  selectedRows: SelectedRow[];

  selectedSeats: string[]; 
  selectedSeatIds: string[]; 
  seatPricing: SeatPricing[]; 

  priceDetails: PriceDetails;

  totalAmount: number;
  tax: number;
  amount: number;
  selectedRowIds: string[];

  showDate?: string; 
  showTime?: string; 
  movieTitle?: string; 
  theaterName?: string; 
  screenName?: string; 

  paymentMethod?: "upi" | "card" | "netbanking" | "wallet" | "";
  paymentGateway?: "razorpay" | "stripe" | "paytm" | "phonepe " | "";

  userId?: string;
  contactInfo?: ContactInfo;

  bookingId?: string;
  paymentId?: string;
  bookingStatus?: "pending" | "confirmed" | "cancelled";
  paymentStatus?: "pending" | "completed" | "failed";

  couponCode?: string;
  discountApplied?: number;
}

interface BookingState {
  bookingData: BookingData | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  bookingData: null,
  isLoading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setBookingData: (state, action: PayloadAction<Partial<BookingData>>) => {
      if (state.bookingData) {
        state.bookingData = { ...state.bookingData, ...action.payload };
      } else {
        state.bookingData = {
          selectedRows: [],
          selectedSeats: [],
          selectedSeatIds: [],
          seatPricing: [],
          priceDetails: {
            subtotal: 0,
            convenienceFee: 0,
            taxes: 0,
            discount: 0,
            total: 0,
          },
          totalAmount: 0,
          tax: 0,
          amount: 0,
          selectedRowIds: [],
          ...action.payload,
        };
      }
      state.error = null;
    },

    updateSelectedRows: (state, action: PayloadAction<SelectedRow[]>) => {
      if (state.bookingData) {
        state.bookingData.selectedRows = action.payload;

        const flattenedSeats = action.payload.flatMap((row) =>
          row.seatsSelected.map((seatNum) => `${row.rowLabel}${seatNum}`)
        );
        state.bookingData.selectedSeats = flattenedSeats;

        state.bookingData.seatPricing = action.payload.map((row) => ({
          rowId: row.rowId,
          rowLabel: row.rowLabel,
          seatType: row.seatType,
          basePrice: row.pricePerSeat,
          finalPrice: row.pricePerSeat,
          seatsSelected: row.seatsSelected,
          seatCount: row.seatCount,
        }));

        const subtotal = action.payload.reduce(
          (sum, row) => sum + row.totalPrice,
          0
        );
        state.bookingData.priceDetails.subtotal = subtotal;
        state.bookingData.amount = subtotal; 

        const convenienceFee = Math.round(subtotal * 0.05); 
        const taxes = Math.round(subtotal * 0.18); 
        const total =
          subtotal +
          convenienceFee +
          taxes -
          state.bookingData.priceDetails.discount;

        state.bookingData.priceDetails.convenienceFee = convenienceFee;
        state.bookingData.priceDetails.taxes = taxes;
        state.bookingData.priceDetails.total = total;
        state.bookingData.tax = taxes; 
        state.bookingData.totalAmount = total; 
      }
    },

    addSeatToRow: (
      state,
      action: PayloadAction<{
        rowId: string;
        rowLabel: string;
        seatNumber: string;
        seatType: "VIP" | "Premium" | "Normal";
        pricePerSeat: number;
      }>
    ) => {
      if (state.bookingData) {
        const { rowId, rowLabel, seatNumber, seatType, pricePerSeat } =
          action.payload;

        let existingRowIndex = state.bookingData.selectedRows.findIndex(
          (row) => row.rowId === rowId
        );

        if (existingRowIndex >= 0) {
          if (
            !state.bookingData.selectedRows[
              existingRowIndex
            ].seatsSelected.includes(seatNumber)
          ) {
            state.bookingData.selectedRows[existingRowIndex].seatsSelected.push(
              seatNumber
            );
            state.bookingData.selectedRows[existingRowIndex].seatCount += 1;
            state.bookingData.selectedRows[existingRowIndex].totalPrice +=
              pricePerSeat;
          }
        } else {
          state.bookingData.selectedRows.push({
            rowId,
            rowLabel,
            seatsSelected: [seatNumber],
            seatCount: 1,
            seatType,
            pricePerSeat,
            totalPrice: pricePerSeat,
          });
        }

        const flattenedSeats = state.bookingData.selectedRows.flatMap((row) =>
          row.seatsSelected.map((seatNum) => `${row.rowLabel}${seatNum}`)
        );
        state.bookingData.selectedSeats = flattenedSeats;

        const subtotal = state.bookingData.selectedRows.reduce(
          (sum, row) => sum + row.totalPrice,
          0
        );
        state.bookingData.priceDetails.subtotal = subtotal;
        state.bookingData.amount = subtotal;

        const convenienceFee = Math.round(subtotal * 0.05);
        const taxes = Math.round(subtotal * 0.18);
        const total =
          subtotal +
          convenienceFee +
          taxes -
          state.bookingData.priceDetails.discount;

        state.bookingData.priceDetails.convenienceFee = convenienceFee;
        state.bookingData.priceDetails.taxes = taxes;
        state.bookingData.priceDetails.total = total;
        state.bookingData.tax = taxes;
        state.bookingData.totalAmount = total;
      }
    },

    removeSeatFromRow: (
      state,
      action: PayloadAction<{
        rowId: string;
        seatNumber: string;
        pricePerSeat: number;
      }>
    ) => {
      if (state.bookingData) {
        const { rowId, seatNumber, pricePerSeat } = action.payload;

        const rowIndex = state.bookingData.selectedRows.findIndex(
          (row) => row.rowId === rowId
        );

        if (rowIndex >= 0) {
          const row = state.bookingData.selectedRows[rowIndex];
          const seatIndex = row.seatsSelected.indexOf(seatNumber);

          if (seatIndex >= 0) {
            row.seatsSelected.splice(seatIndex, 1);
            row.seatCount -= 1;
            row.totalPrice -= pricePerSeat;

            if (row.seatCount === 0) {
              state.bookingData.selectedRows.splice(rowIndex, 1);
            }

            const flattenedSeats = state.bookingData.selectedRows.flatMap(
              (row) =>
                row.seatsSelected.map((seatNum) => `${row.rowLabel}${seatNum}`)
            );
            state.bookingData.selectedSeats = flattenedSeats;

            const subtotal = state.bookingData.selectedRows.reduce(
              (sum, row) => sum + row.totalPrice,
              0
            );
            state.bookingData.priceDetails.subtotal = subtotal;
            state.bookingData.amount = subtotal;

            const convenienceFee = Math.round(subtotal * 0.05);
            const taxes = Math.round(subtotal * 0.18);
            const total =
              subtotal +
              convenienceFee +
              taxes -
              state.bookingData.priceDetails.discount;

            state.bookingData.priceDetails.convenienceFee = convenienceFee;
            state.bookingData.priceDetails.taxes = taxes;
            state.bookingData.priceDetails.total = total;
            state.bookingData.tax = taxes;
            state.bookingData.totalAmount = total;
          }
        }
      }
    },

    updateSelectedSeats: (state, action: PayloadAction<string[]>) => {
      if (state.bookingData) {
        state.bookingData.selectedSeats = action.payload;
      }
    },

    updateSeatPricing: (state, action: PayloadAction<SeatPricing[]>) => {
      if (state.bookingData) {
        state.bookingData.seatPricing = action.payload;

        const subtotal = action.payload.reduce((sum, seat) => {
          return sum + seat.finalPrice * seat.seatCount;
        }, 0);

        state.bookingData.priceDetails.subtotal = subtotal;
        state.bookingData.amount = subtotal; 

        const convenienceFee = Math.round(subtotal * 0.05); 
        const taxes = Math.round(subtotal * 0.18); 
        const total =
          subtotal +
          convenienceFee +
          taxes -
          state.bookingData.priceDetails.discount;

        state.bookingData.priceDetails.convenienceFee = convenienceFee;
        state.bookingData.priceDetails.taxes = taxes;
        state.bookingData.priceDetails.total = total;
        state.bookingData.tax = taxes; 
        state.bookingData.totalAmount = total; 
      }
    },

    updatePriceDetails: (
      state,
      action: PayloadAction<Partial<PriceDetails>>
    ) => {
      if (state.bookingData) {
        state.bookingData.priceDetails = {
          ...state.bookingData.priceDetails,
          ...action.payload,
        };

        state.bookingData.amount = state.bookingData.priceDetails.subtotal;
        state.bookingData.tax = state.bookingData.priceDetails.taxes;
        state.bookingData.totalAmount = state.bookingData.priceDetails.total;
      }
    },

    updateShowDetails: (
      state,
      action: PayloadAction<{
        showtimeId?: string;
        movieId?: string;
        theaterId?: string;
        screenId?: string;
        showDate?: string;
        showTime?: string;
        movieTitle?: string;
        theaterName?: string;
        screenName?: string;
      }>
    ) => {
      if (state.bookingData) {
        state.bookingData = { ...state.bookingData, ...action.payload };
      }
    },

    updateUserDetails: (
      state,
      action: PayloadAction<{
        userId?: string;
        contactInfo?: ContactInfo;
      }>
    ) => {
      if (state.bookingData) {
        state.bookingData = { ...state.bookingData, ...action.payload };
      }
    },

    updatePaymentDetails: (
      state,
      action: PayloadAction<{
        paymentMethod?: BookingData["paymentMethod"];
        paymentGateway?: BookingData["paymentGateway"];
        paymentId?: string;
        paymentStatus?: BookingData["paymentStatus"];
      }>
    ) => {
      if (state.bookingData) {
        state.bookingData = { ...state.bookingData, ...action.payload };
      }
    },

    updateBookingStatus: (
      state,
      action: PayloadAction<{
        bookingId?: string;
        bookingStatus?: BookingData["bookingStatus"];
      }>
    ) => {
      if (state.bookingData) {
        state.bookingData = { ...state.bookingData, ...action.payload };
      }
    },

    updateAmount: (state, action: PayloadAction<number>) => {
      if (state.bookingData) {
        state.bookingData.amount = action.payload;
        state.bookingData.priceDetails.subtotal = action.payload;
      }
    },

    updateTax: (state, action: PayloadAction<number>) => {
      if (state.bookingData) {
        state.bookingData.tax = action.payload;
        state.bookingData.priceDetails.taxes = action.payload;
      }
    },

    updateTotalAmount: (state, action: PayloadAction<number>) => {
      if (state.bookingData) {
        state.bookingData.totalAmount = action.payload;
        state.bookingData.priceDetails.total = action.payload;
      }
    },

    calculateTotalAmount: (state) => {
      if (state.bookingData) {
        const { subtotal, convenienceFee, taxes, discount } =
          state.bookingData.priceDetails;
        const total = subtotal + convenienceFee + taxes - discount;

        state.bookingData.priceDetails.total = total;
        state.bookingData.totalAmount = total; 
      }
    },

    applyDiscount: (
      state,
      action: PayloadAction<{
        discount: number;
        couponCode?: string;
      }>
    ) => {
      if (state.bookingData) {
        state.bookingData.priceDetails.discount = action.payload.discount;
        if (action.payload.couponCode) {
          state.bookingData.couponCode = action.payload.couponCode;
        }

        const { subtotal, convenienceFee, taxes, discount } =
          state.bookingData.priceDetails;
        const total = subtotal + convenienceFee + taxes - discount;
        state.bookingData.priceDetails.total = total;
        state.bookingData.totalAmount = total; 
      }
    },

    removeDiscount: (state) => {
      if (state.bookingData) {
        state.bookingData.priceDetails.discount = 0;
        state.bookingData.couponCode = undefined;

        const { subtotal, convenienceFee, taxes } =
          state.bookingData.priceDetails;
        const total = subtotal + convenienceFee + taxes;
        state.bookingData.priceDetails.total = total;
        state.bookingData.totalAmount = total;
      }
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    resetBookingData: (state) => {
      state.bookingData = null;
      state.isLoading = false;
      state.error = null;
    },

    clearError: (state) => {
      state.error = null;
    },

    clearSelectedSeats: (state) => {
      if (state.bookingData) {
        state.bookingData.selectedRows = [];
        state.bookingData.selectedSeats = [];
        state.bookingData.seatPricing = [];
        state.bookingData.priceDetails = {
          subtotal: 0,
          convenienceFee: 0,
          taxes: 0,
          discount: 0,
          total: 0,
        };
        state.bookingData.amount = 0;
        state.bookingData.tax = 0;
        state.bookingData.totalAmount = 0;
      }
    },
  },
});

export const {
  setBookingData,
  updateSelectedRows, 
  addSeatToRow, 
  removeSeatFromRow, 
  updateSelectedSeats,
  updateSeatPricing,
  updatePriceDetails,
  updateShowDetails,
  updateUserDetails,
  updatePaymentDetails,
  updateBookingStatus,
  updateAmount, 
  updateTax, 
  updateTotalAmount,
  calculateTotalAmount,
  applyDiscount,
  removeDiscount, 
  setLoading,
  setError,
  resetBookingData,
  clearError,
  clearSelectedSeats, 
} = bookingSlice.actions;

export const selectBookingData = (state: { booking: BookingState }) =>
  state.booking.bookingData;
export const selectSelectedSeats = (state: { booking: BookingState }) =>
  state.booking.bookingData?.selectedSeats || [];
export const selectSelectedRows = (state: { booking: BookingState }) =>
  state.booking.bookingData?.selectedRows || []; 
export const selectPriceDetails = (state: { booking: BookingState }) =>
  state.booking.bookingData?.priceDetails;
export const selectIsLoading = (state: { booking: BookingState }) =>
  state.booking.isLoading;
export const selectError = (state: { booking: BookingState }) =>
  state.booking.error;
export const selectTotalAmount = (state: { booking: BookingState }) =>
  state.booking.bookingData?.priceDetails.total || 0;
export const selectSeatCount = (state: { booking: BookingState }) =>
  state.booking.bookingData?.selectedSeats.length || 0;

export default bookingSlice.reducer;

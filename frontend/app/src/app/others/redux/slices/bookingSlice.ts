import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BookingData {
  showtimeId?: string; 
  selectedSeats: string[];
  totalAmount: number;
  tax: number;
  amount: number;
  selectedRowIds:string[];
}

interface BookingState {
  bookingData: BookingData | null;
}

const initialState: BookingState = {
  bookingData: null,
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
          selectedSeats: [],
          totalAmount: 0,
          tax: 0,
          amount: 0,
          selectedRowIds:[],
          ...action.payload,
        };
      }
    },
    updateSelectedSeats: (state, action: PayloadAction<string[]>) => {
      if (state.bookingData) {
        state.bookingData.selectedSeats = action.payload;
      }
    },
    updateAmount: (state, action: PayloadAction<number>) => {
      if (state.bookingData) {
        state.bookingData.amount = action.payload;
      }
    },
    updateTax: (state, action: PayloadAction<number>) => {
      if (state.bookingData) {
        state.bookingData.tax = action.payload;
      }
    },
    updateTotalAmount: (state, action: PayloadAction<number>) => {
      if (state.bookingData) {
        state.bookingData.totalAmount = action.payload;
      }
    },
    calculateTotalAmount: (state) => {
      if (state.bookingData) {
        state.bookingData.totalAmount = state.bookingData.amount + state.bookingData.tax;
      }
    },

    resetBookingData: (state) => {
      state.bookingData = null;
    },
  },
});

export const { 
  setBookingData, 
  updateSelectedSeats,
  updateAmount,
  updateTax,
  updateTotalAmount,
  calculateTotalAmount,
  resetBookingData 
} = bookingSlice.actions;

export default bookingSlice.reducer;

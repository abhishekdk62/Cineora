import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Row-based seat pricing interface
interface SeatPricing {
  rowId: string;           // Row pricing ID from database
  rowLabel: string;        // "A", "B", "C" etc.
  seatType: "VIP" | "Premium" | "Normal";
  basePrice: number;
  finalPrice: number;
  seatsSelected: string[]; // Array of seat numbers in this row ["1", "2", "3"]
  seatCount: number;       // Number of seats selected in this row
}

// Price breakdown interface
interface PriceDetails {
  subtotal: number;      // Sum of all seat prices
  convenienceFee: number; // 5% of subtotal
  taxes: number;         // 18% GST
  discount: number;      // Any discounts applied
  total: number;         // Final amount to pay
}

// Contact information interface
interface ContactInfo {
  email: string;
  phone: string;
}

// Selected row interface for row-based selection
interface SelectedRow {
  rowId: string;         // Row pricing ID
  rowLabel: string;      // "A", "B", "C"
  seatsSelected: string[]; // ["1", "2", "3"] - seat numbers within the row
  seatCount: number;     // 3
  seatType: "VIP" | "Premium" | "Normal";
  pricePerSeat: number;
  totalPrice: number;
}

// Main booking data interface
interface BookingData {
  // Show Details
  showtimeId?: string;
  movieId?: string;
  theaterId?: string;
  screenId?: string;
  
  // ✅ Row-based seat selection (NEW)
  selectedRows: SelectedRow[];
  
  // Seat Selection (for display and compatibility)
  selectedSeats: string[];        // ["A1", "A2", "A3", "B1", "B2"] - flattened for display
  selectedSeatIds: string[];      // Row pricing IDs for reference
  seatPricing: SeatPricing[];     // Row-based pricing details
  
  // Financial Details
  priceDetails: PriceDetails;
  
  // Legacy fields (keeping for compatibility)
  totalAmount: number;
  tax: number;
  amount: number;
  selectedRowIds: string[];
  
  // Show Information
  showDate?: string;             // "2025-01-26"
  showTime?: string;             // "19:30"
  movieTitle?: string;           // "Avengers: Endgame"
  theaterName?: string;          // "PVR Cinemas"
  screenName?: string;           // "Screen 1"
  
  // Payment Details
  paymentMethod?: "upi" | "card" | "netbanking" | "wallet";
  paymentGateway?: "razorpay" | "stripe" | "paytm" | "phonepe";
  
  // User Details
  userId?: string;
  contactInfo?: ContactInfo;
  
  // Booking Status
  bookingId?: string;
  paymentId?: string;
  bookingStatus?: "pending" | "confirmed" | "cancelled";
  paymentStatus?: "pending" | "completed" | "failed";
  
  // Additional metadata
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
    // Set booking data (merge with existing)
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

    // ✅ NEW: Update selected rows (row-based selection)
    updateSelectedRows: (state, action: PayloadAction<SelectedRow[]>) => {
      if (state.bookingData) {
        state.bookingData.selectedRows = action.payload;
        
        // Auto-generate flattened seat list for display
        const flattenedSeats = action.payload.flatMap(row => 
          row.seatsSelected.map(seatNum => `${row.rowLabel}${seatNum}`)
        );
        state.bookingData.selectedSeats = flattenedSeats;
        
        // Update seat pricing array
        state.bookingData.seatPricing = action.payload.map(row => ({
          rowId: row.rowId,
          rowLabel: row.rowLabel,
          seatType: row.seatType,
          basePrice: row.pricePerSeat,
          finalPrice: row.pricePerSeat,
          seatsSelected: row.seatsSelected,
          seatCount: row.seatCount,
        }));
        
        // Auto-calculate pricing
        const subtotal = action.payload.reduce((sum, row) => sum + row.totalPrice, 0);
        state.bookingData.priceDetails.subtotal = subtotal;
        state.bookingData.amount = subtotal; // Legacy compatibility
        
        // Auto-calculate fees and total
        const convenienceFee = Math.round(subtotal * 0.05); // 5%
        const taxes = Math.round(subtotal * 0.18); // 18% GST
        const total = subtotal + convenienceFee + taxes - state.bookingData.priceDetails.discount;
        
        state.bookingData.priceDetails.convenienceFee = convenienceFee;
        state.bookingData.priceDetails.taxes = taxes;
        state.bookingData.priceDetails.total = total;
        state.bookingData.tax = taxes; // Legacy compatibility
        state.bookingData.totalAmount = total; // Legacy compatibility
      }
    },

    // ✅ NEW: Add seat to a specific row
    addSeatToRow: (state, action: PayloadAction<{
      rowId: string;
      rowLabel: string;
      seatNumber: string;
      seatType: "VIP" | "Premium" | "Normal";
      pricePerSeat: number;
    }>) => {
      if (state.bookingData) {
        const { rowId, rowLabel, seatNumber, seatType, pricePerSeat } = action.payload;
        
        // Find existing row or create new one
        let existingRowIndex = state.bookingData.selectedRows.findIndex(row => row.rowId === rowId);
        
        if (existingRowIndex >= 0) {
          // Add seat to existing row
          if (!state.bookingData.selectedRows[existingRowIndex].seatsSelected.includes(seatNumber)) {
            state.bookingData.selectedRows[existingRowIndex].seatsSelected.push(seatNumber);
            state.bookingData.selectedRows[existingRowIndex].seatCount += 1;
            state.bookingData.selectedRows[existingRowIndex].totalPrice += pricePerSeat;
          }
        } else {
          // Create new row entry
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
        
        // Update flattened seat list
        const flattenedSeats = state.bookingData.selectedRows.flatMap(row => 
          row.seatsSelected.map(seatNum => `${row.rowLabel}${seatNum}`)
        );
        state.bookingData.selectedSeats = flattenedSeats;
        
        // Recalculate pricing
        const subtotal = state.bookingData.selectedRows.reduce((sum, row) => sum + row.totalPrice, 0);
        state.bookingData.priceDetails.subtotal = subtotal;
        state.bookingData.amount = subtotal;
        
        const convenienceFee = Math.round(subtotal * 0.05);
        const taxes = Math.round(subtotal * 0.18);
        const total = subtotal + convenienceFee + taxes - state.bookingData.priceDetails.discount;
        
        state.bookingData.priceDetails.convenienceFee = convenienceFee;
        state.bookingData.priceDetails.taxes = taxes;
        state.bookingData.priceDetails.total = total;
        state.bookingData.tax = taxes;
        state.bookingData.totalAmount = total;
      }
    },

    // ✅ NEW: Remove seat from a specific row
    removeSeatFromRow: (state, action: PayloadAction<{
      rowId: string;
      seatNumber: string;
      pricePerSeat: number;
    }>) => {
      if (state.bookingData) {
        const { rowId, seatNumber, pricePerSeat } = action.payload;
        
        const rowIndex = state.bookingData.selectedRows.findIndex(row => row.rowId === rowId);
        
        if (rowIndex >= 0) {
          const row = state.bookingData.selectedRows[rowIndex];
          const seatIndex = row.seatsSelected.indexOf(seatNumber);
          
          if (seatIndex >= 0) {
            // Remove seat from row
            row.seatsSelected.splice(seatIndex, 1);
            row.seatCount -= 1;
            row.totalPrice -= pricePerSeat;
            
            // Remove row if no seats left
            if (row.seatCount === 0) {
              state.bookingData.selectedRows.splice(rowIndex, 1);
            }
            
            // Update flattened seat list
            const flattenedSeats = state.bookingData.selectedRows.flatMap(row => 
              row.seatsSelected.map(seatNum => `${row.rowLabel}${seatNum}`)
            );
            state.bookingData.selectedSeats = flattenedSeats;
            
            // Recalculate pricing
            const subtotal = state.bookingData.selectedRows.reduce((sum, row) => sum + row.totalPrice, 0);
            state.bookingData.priceDetails.subtotal = subtotal;
            state.bookingData.amount = subtotal;
            
            const convenienceFee = Math.round(subtotal * 0.05);
            const taxes = Math.round(subtotal * 0.18);
            const total = subtotal + convenienceFee + taxes - state.bookingData.priceDetails.discount;
            
            state.bookingData.priceDetails.convenienceFee = convenienceFee;
            state.bookingData.priceDetails.taxes = taxes;
            state.bookingData.priceDetails.total = total;
            state.bookingData.tax = taxes;
            state.bookingData.totalAmount = total;
          }
        }
      }
    },

    // Update selected seats (legacy - for compatibility)
    updateSelectedSeats: (state, action: PayloadAction<string[]>) => {
      if (state.bookingData) {
        state.bookingData.selectedSeats = action.payload;
      }
    },

    // Update seat pricing details
    updateSeatPricing: (state, action: PayloadAction<SeatPricing[]>) => {
      if (state.bookingData) {
        state.bookingData.seatPricing = action.payload;
        
        // Auto-calculate subtotal when seat pricing is updated
        const subtotal = action.payload.reduce((sum, seat) => {
          return sum + (seat.finalPrice * seat.seatCount);
        }, 0);
        
        state.bookingData.priceDetails.subtotal = subtotal;
        state.bookingData.amount = subtotal; // Legacy compatibility
        
        // Auto-calculate fees and total
        const convenienceFee = Math.round(subtotal * 0.05); // 5%
        const taxes = Math.round(subtotal * 0.18); // 18% GST
        const total = subtotal + convenienceFee + taxes - state.bookingData.priceDetails.discount;
        
        state.bookingData.priceDetails.convenienceFee = convenienceFee;
        state.bookingData.priceDetails.taxes = taxes;
        state.bookingData.priceDetails.total = total;
        state.bookingData.tax = taxes; // Legacy compatibility
        state.bookingData.totalAmount = total; // Legacy compatibility
      }
    },

    // Update price details
    updatePriceDetails: (state, action: PayloadAction<Partial<PriceDetails>>) => {
      if (state.bookingData) {
        state.bookingData.priceDetails = { 
          ...state.bookingData.priceDetails, 
          ...action.payload 
        };
        
        // Update legacy fields for compatibility
        state.bookingData.amount = state.bookingData.priceDetails.subtotal;
        state.bookingData.tax = state.bookingData.priceDetails.taxes;
        state.bookingData.totalAmount = state.bookingData.priceDetails.total;
      }
    },

    // Update show details
    updateShowDetails: (state, action: PayloadAction<{
      showtimeId?: string;
      movieId?: string;
      theaterId?: string;
      screenId?: string;
      showDate?: string;
      showTime?: string;
      movieTitle?: string;
      theaterName?: string;
      screenName?: string;
    }>) => {
      if (state.bookingData) {
        state.bookingData = { ...state.bookingData, ...action.payload };
      }
    },

    // Update user and contact details
    updateUserDetails: (state, action: PayloadAction<{
      userId?: string;
      contactInfo?: ContactInfo;
    }>) => {
      if (state.bookingData) {
        state.bookingData = { ...state.bookingData, ...action.payload };
      }
    },

    // Update payment details
    updatePaymentDetails: (state, action: PayloadAction<{
      paymentMethod?: BookingData["paymentMethod"];
      paymentGateway?: BookingData["paymentGateway"];
      paymentId?: string;
      paymentStatus?: BookingData["paymentStatus"];
    }>) => {
      if (state.bookingData) {
        state.bookingData = { ...state.bookingData, ...action.payload };
      }
    },

    // Update booking status
    updateBookingStatus: (state, action: PayloadAction<{
      bookingId?: string;
      bookingStatus?: BookingData["bookingStatus"];
    }>) => {
      if (state.bookingData) {
        state.bookingData = { ...state.bookingData, ...action.payload };
      }
    },

    // Legacy action - update amount
    updateAmount: (state, action: PayloadAction<number>) => {
      if (state.bookingData) {
        state.bookingData.amount = action.payload;
        state.bookingData.priceDetails.subtotal = action.payload;
      }
    },

    // Legacy action - update tax
    updateTax: (state, action: PayloadAction<number>) => {
      if (state.bookingData) {
        state.bookingData.tax = action.payload;
        state.bookingData.priceDetails.taxes = action.payload;
      }
    },

    // Legacy action - update total amount
    updateTotalAmount: (state, action: PayloadAction<number>) => {
      if (state.bookingData) {
        state.bookingData.totalAmount = action.payload;
        state.bookingData.priceDetails.total = action.payload;
      }
    },

    // Calculate total amount (auto-calculation)
    calculateTotalAmount: (state) => {
      if (state.bookingData) {
        const { subtotal, convenienceFee, taxes, discount } = state.bookingData.priceDetails;
        const total = subtotal + convenienceFee + taxes - discount;
        
        state.bookingData.priceDetails.total = total;
        state.bookingData.totalAmount = total; // Legacy compatibility
      }
    },

    // Apply discount/coupon
    applyDiscount: (state, action: PayloadAction<{
      discount: number;
      couponCode?: string;
    }>) => {
      if (state.bookingData) {
        state.bookingData.priceDetails.discount = action.payload.discount;
        if (action.payload.couponCode) {
          state.bookingData.couponCode = action.payload.couponCode;
        }
        
        // Recalculate total
        const { subtotal, convenienceFee, taxes, discount } = state.bookingData.priceDetails;
        const total = subtotal + convenienceFee + taxes - discount;
        state.bookingData.priceDetails.total = total;
        state.bookingData.totalAmount = total; // Legacy compatibility
      }
    },

    // Remove discount
    removeDiscount: (state) => {
      if (state.bookingData) {
        state.bookingData.priceDetails.discount = 0;
        state.bookingData.couponCode = undefined;
        
        // Recalculate total
        const { subtotal, convenienceFee, taxes } = state.bookingData.priceDetails;
        const total = subtotal + convenienceFee + taxes;
        state.bookingData.priceDetails.total = total;
        state.bookingData.totalAmount = total;
      }
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Reset booking data
    resetBookingData: (state) => {
      state.bookingData = null;
      state.isLoading = false;
      state.error = null;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Clear selected seats
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

// Export actions
export const {
  setBookingData,
  updateSelectedRows,        // ✅ NEW
  addSeatToRow,             // ✅ NEW
  removeSeatFromRow,        // ✅ NEW
  updateSelectedSeats,
  updateSeatPricing,
  updatePriceDetails,
  updateShowDetails,
  updateUserDetails,
  updatePaymentDetails,
  updateBookingStatus,
  updateAmount,             // Legacy
  updateTax,                // Legacy
  updateTotalAmount,        // Legacy
  calculateTotalAmount,
  applyDiscount,
  removeDiscount,           // ✅ NEW
  setLoading,
  setError,
  resetBookingData,
  clearError,
  clearSelectedSeats,       // ✅ NEW
} = bookingSlice.actions;

// Selectors for easy data access
export const selectBookingData = (state: { booking: BookingState }) => state.booking.bookingData;
export const selectSelectedSeats = (state: { booking: BookingState }) => state.booking.bookingData?.selectedSeats || [];
export const selectSelectedRows = (state: { booking: BookingState }) => state.booking.bookingData?.selectedRows || []; // ✅ NEW
export const selectPriceDetails = (state: { booking: BookingState }) => state.booking.bookingData?.priceDetails;
export const selectIsLoading = (state: { booking: BookingState }) => state.booking.isLoading;
export const selectError = (state: { booking: BookingState }) => state.booking.error;
export const selectTotalAmount = (state: { booking: BookingState }) => state.booking.bookingData?.priceDetails.total || 0;
export const selectSeatCount = (state: { booking: BookingState }) => state.booking.bookingData?.selectedSeats.length || 0;

export default bookingSlice.reducer;

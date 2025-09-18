// utils/excelExport.ts
import * as XLSX from 'xlsx';

interface BookingData {
  _id: string;
  bookingId: string;
  userId: {
    _id: string;
    email: string;
  };
  movieId: {
    _id: string;
    title: string;
  };
  theaterId: {
    _id: string;
    name: string;
    ownerId: string;
  };
  screenId: {
    _id: string;
    name: string;
  };
  priceDetails: {
    subtotal: number;
    convenienceFee: number;
    taxes: number;
    discount: number;
    total: number;
  };
  seatPricing: Array<{
    rowId: string;
    seatType: 'VIP' | 'Premium' | 'Normal';
    basePrice: number;
    finalPrice: number;
    rowLabel: string;
  }>;
  selectedSeats: string[];
  selectedSeatIds: string[];
  couponUsed?: {
    couponCode: string;
    couponName: string;
    discountAmount: number;
    discountPercentage: number;
    appliedAt: string;
  };
  bookedAt: string;
  showDate: string;
  showTime: string;
  paymentMethod: string;
  paymentStatus: string;
  bookingStatus: string;
}

interface DateRange {
  startDate: string;
  endDate: string;
}

interface ProcessedTheaterData {
  theaterName: string;
  theaterId: string;
  totalRevenue: number;
  totalBookings: number;
  totalTickets: number;
  screens: {
    [screenId: string]: {
      screenName: string;
      totalRevenue: number;
      totalBookings: number;
      totalTickets: number;
      avgTicketPrice: number;
      bookings: Array<{
        bookingId: string;
        movieTitle: string;
        userEmail: string;
        seats: string;
        ticketCount: number;
        subtotal: number;
        taxes: number;
        convenienceFee: number;
        discount: number;
        finalAmount: number;
        couponUsed: string;
        discountPercentage: string;
        bookingDate: string;
        showDate: string;
        showTime: string;
        paymentMethod: string;
      }>;
    }
  };
}

// Filter bookings by date range
const filterBookingsByDateRange = (bookings: BookingData[], dateRange?: DateRange): BookingData[] => {
  if (!dateRange) return bookings;
  
  const startDate = new Date(dateRange.startDate);
  const endDate = new Date(dateRange.endDate);
  // Set end date to end of day
  endDate.setHours(23, 59, 59, 999);
  
  return bookings.filter(booking => {
    const bookingDate = new Date(booking.bookedAt);
    return bookingDate >= startDate && bookingDate <= endDate;
  });
};

// Process bookings data by theater and screen with date filtering
export const processBookingsForExcel = (bookings: BookingData[], dateRange?: DateRange) => {
  // Filter bookings by date range first
  const filteredBookings = filterBookingsByDateRange(bookings, dateRange);
  
  const theaterData: { [theaterId: string]: ProcessedTheaterData } = {};
  
  filteredBookings.forEach(booking => {
    const theaterId = booking.theaterId._id;
    const theaterName = booking.theaterId.name;
    const screenId = booking.screenId._id;
    const screenName = booking.screenId.name;
    
    // Initialize theater if doesn't exist
    if (!theaterData[theaterId]) {
      theaterData[theaterId] = {
        theaterName,
        theaterId,
        totalRevenue: 0,
        totalBookings: 0,
        totalTickets: 0,
        screens: {}
      };
    }
    
    // Initialize screen if doesn't exist
    if (!theaterData[theaterId].screens[screenId]) {
      theaterData[theaterId].screens[screenId] = {
        screenName,
        totalRevenue: 0,
        totalBookings: 0,
        totalTickets: 0,
        avgTicketPrice: 0,
        bookings: []
      };
    }
    
    // Process booking data
    const ticketCount = booking.selectedSeats.length;
    const couponInfo = booking.couponUsed 
      ? `${booking.couponUsed.couponName} (${booking.couponUsed.couponCode})`
      : 'No Coupon';
    const discountInfo = booking.couponUsed 
      ? `${booking.couponUsed.discountPercentage}%`
      : 'N/A';
    
    const bookingDetail = {
      bookingId: booking.bookingId,
      movieTitle: booking.movieId.title,
      userEmail: booking.userId.email,
      seats: booking.selectedSeats.join(', '),
      ticketCount,
      subtotal: booking.priceDetails.subtotal,
      taxes: booking.priceDetails.taxes,
      convenienceFee: booking.priceDetails.convenienceFee,
      discount: booking.priceDetails.discount,
      finalAmount: booking.priceDetails.total,
      couponUsed: couponInfo,
      discountPercentage: discountInfo,
      bookingDate: new Date(booking.bookedAt).toLocaleDateString('en-IN'),
      showDate: new Date(booking.showDate).toLocaleDateString('en-IN'),
      showTime: booking.showTime,
      paymentMethod: booking.paymentMethod
    };
    
    // Add to screen bookings
    theaterData[theaterId].screens[screenId].bookings.push(bookingDetail);
    
    // Update screen totals
    theaterData[theaterId].screens[screenId].totalRevenue += booking.priceDetails.total;
    theaterData[theaterId].screens[screenId].totalBookings += 1;
    theaterData[theaterId].screens[screenId].totalTickets += ticketCount;
    
    // Update theater totals
    theaterData[theaterId].totalRevenue += booking.priceDetails.total;
    theaterData[theaterId].totalBookings += 1;
    theaterData[theaterId].totalTickets += ticketCount;
  });
  
  // Calculate average ticket prices
  Object.values(theaterData).forEach(theater => {
    Object.values(theater.screens).forEach(screen => {
      screen.avgTicketPrice = screen.totalTickets > 0 
        ? screen.totalRevenue / screen.totalTickets 
        : 0;
    });
  });
  
  return {
    processedData: theaterData,
    filteredBookingsCount: filteredBookings.length,
    totalBookingsCount: bookings.length
  };
};

// Format date range for display
const formatDateRangeForDisplay = (dateRange?: DateRange): string => {
  if (!dateRange) return 'All Time';
  
  const startDate = new Date(dateRange.startDate).toLocaleDateString('en-IN');
  const endDate = new Date(dateRange.endDate).toLocaleDateString('en-IN');
  return `${startDate} to ${endDate}`;
};

// Calculate date range duration in days
const calculateDateRangeDuration = (dateRange?: DateRange): number => {
  if (!dateRange) return 0;
  
  const startDate = new Date(dateRange.startDate);
  const endDate = new Date(dateRange.endDate);
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
};

// Export complete revenue report with date filtering
export const exportTheaterRevenueReport = (
  processedDataResult: {
    processedData: { [theaterId: string]: ProcessedTheaterData };
    filteredBookingsCount: number;
    totalBookingsCount: number;
  },
  dateRange?: DateRange
) => {
  const { processedData, filteredBookingsCount, totalBookingsCount } = processedDataResult;
  const workbook = XLSX.utils.book_new();
  
  // Calculate grand totals
  const grandTotals = Object.values(processedData).reduce(
    (acc, theater) => ({
      totalRevenue: acc.totalRevenue + theater.totalRevenue,
      totalBookings: acc.totalBookings + theater.totalBookings,
      totalTickets: acc.totalTickets + theater.totalTickets,
      totalTheaters: acc.totalTheaters + 1,
      totalScreens: acc.totalScreens + Object.keys(theater.screens).length
    }),
    { totalRevenue: 0, totalBookings: 0, totalTickets: 0, totalTheaters: 0, totalScreens: 0 }
  );
  
  const dateRangeText = formatDateRangeForDisplay(dateRange);
  const dateRangeDuration = calculateDateRangeDuration(dateRange);
  
  // Sheet 1: Executive Summary with Date Information
  const summaryData = [
    { 'Metric': '📅 REPORT PERIOD', 'Value': '' },
    { 'Metric': 'Date Range', 'Value': dateRangeText },
    { 'Metric': 'Duration (Days)', 'Value': dateRange ? `${dateRangeDuration} days` : 'All Time' },
    { 'Metric': 'Report Generated On', 'Value': new Date().toLocaleString('en-IN') },
    { 'Metric': '', 'Value': '' }, // Empty row
    
    { 'Metric': '💰 REVENUE METRICS', 'Value': '' },
    { 'Metric': 'Total Revenue', 'Value': `₹${grandTotals.totalRevenue.toLocaleString('en-IN')}` },
    { 'Metric': 'Average Daily Revenue', 'Value': dateRange ? `₹${(grandTotals.totalRevenue / dateRangeDuration).toFixed(2)}` : 'N/A' },
    { 'Metric': 'Average Revenue per Ticket', 'Value': `₹${(grandTotals.totalRevenue / grandTotals.totalTickets).toFixed(2)}` },
    { 'Metric': 'Average Revenue per Theater', 'Value': `₹${(grandTotals.totalRevenue / grandTotals.totalTheaters).toFixed(2)}` },
    { 'Metric': '', 'Value': '' }, // Empty row
    
    { 'Metric': '🎟️ BOOKING METRICS', 'Value': '' },
    { 'Metric': 'Total Bookings (Filtered)', 'Value': filteredBookingsCount.toLocaleString('en-IN') },
    { 'Metric': 'Total Bookings (All Time)', 'Value': totalBookingsCount.toLocaleString('en-IN') },
    { 'Metric': 'Total Tickets Sold', 'Value': grandTotals.totalTickets.toLocaleString('en-IN') },
    { 'Metric': 'Average Daily Bookings', 'Value': dateRange ? `${(filteredBookingsCount / dateRangeDuration).toFixed(1)}` : 'N/A' },
    { 'Metric': 'Average Tickets per Booking', 'Value': `${(grandTotals.totalTickets / grandTotals.totalBookings).toFixed(1)}` },
    { 'Metric': '', 'Value': '' }, // Empty row
    
    { 'Metric': '🏢 INFRASTRUCTURE METRICS', 'Value': '' },
    { 'Metric': 'Total Theaters', 'Value': grandTotals.totalTheaters },
    { 'Metric': 'Total Screens', 'Value': grandTotals.totalScreens },
    { 'Metric': 'Average Screens per Theater', 'Value': `${(grandTotals.totalScreens / grandTotals.totalTheaters).toFixed(1)}` }
  ];
  
  const summarySheet = XLSX.utils.json_to_sheet(summaryData);
  summarySheet['!cols'] = [{ width: 35 }, { width: 30 }];
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Executive Summary');
  
  // Sheet 2: Theater Overview with Date Info
  const theaterOverview = [
    // Header row with date range info
    {
      'S.No': `📅 PERIOD: ${dateRangeText}`,
      'Theater Name': '',
      'Total Revenue (₹)': '',
      'Total Bookings': '',
      'Total Tickets': '',
      'Number of Screens': '',
      'Avg Revenue per Screen (₹)': '',
      'Market Share (%)': '',
      'Daily Avg Revenue (₹)': ''
    },
    {}, // Empty row
    
    // Theater data
    ...Object.values(processedData).map((theater, index) => ({
      'S.No': index + 1,
      'Theater Name': theater.theaterName,
      'Total Revenue (₹)': theater.totalRevenue.toLocaleString('en-IN'),
      'Total Bookings': theater.totalBookings,
      'Total Tickets': theater.totalTickets,
      'Number of Screens': Object.keys(theater.screens).length,
      'Avg Revenue per Screen (₹)': (theater.totalRevenue / Object.keys(theater.screens).length).toFixed(2),
      'Market Share (%)': ((theater.totalRevenue / grandTotals.totalRevenue) * 100).toFixed(2) + '%',
      'Daily Avg Revenue (₹)': dateRange ? (theater.totalRevenue / dateRangeDuration).toFixed(2) : 'N/A'
    }))
  ];
  
  const theaterSheet = XLSX.utils.json_to_sheet(theaterOverview);
  theaterSheet['!cols'] = [
    { width: 8 }, { width: 25 }, { width: 18 }, { width: 15 }, 
    { width: 15 }, { width: 15 }, { width: 20 }, { width: 15 }, { width: 18 }
  ];
  XLSX.utils.book_append_sheet(workbook, theaterSheet, 'Theater Overview');
  
  // Sheet 3: Detailed Bookings Report with Date Filter Info
  const detailedBookings: any[] = [];
  
  // Add date range header
  detailedBookings.push({
    'Theater': `📅 REPORT PERIOD: ${dateRangeText}`,
    'Screen': `Showing ${filteredBookingsCount} of ${totalBookingsCount} total bookings`,
    'Booking ID': '',
    'Movie': '',
    'Customer Email': '',
    'Seats': '',
    'Tickets': '',
    'Subtotal (₹)': '',
    'Taxes (₹)': '',
    'Convenience Fee (₹)': '',
    'Discount (₹)': '',
    'Final Amount (₹)': '',
    'Coupon Used': '',
    'Discount %': '',
    'Booking Date': '',
    'Show Date': '',
    'Show Time': '',
    'Payment Method': ''
  });
  
  detailedBookings.push({}); // Empty row
  
  Object.values(processedData).forEach(theater => {
    // Theater Header
    detailedBookings.push({
      'Theater': `🏢 ${theater.theaterName.toUpperCase()}`,
      'Screen': `Revenue: ₹${theater.totalRevenue.toLocaleString('en-IN')} | Bookings: ${theater.totalBookings} | Tickets: ${theater.totalTickets}`,
      'Booking ID': '',
      'Movie': '',
      'Customer Email': '',
      'Seats': '',
      'Tickets': '',
      'Subtotal (₹)': '',
      'Taxes (₹)': '',
      'Convenience Fee (₹)': '',
      'Discount (₹)': '',
      'Final Amount (₹)': '',
      'Coupon Used': '',
      'Discount %': '',
      'Booking Date': '',
      'Show Date': '',
      'Show Time': '',
      'Payment Method': ''
    });
    
    Object.values(theater.screens).forEach(screen => {
      // Screen Header
      detailedBookings.push({
        'Theater': '',
        'Screen': `📺 ${screen.screenName}`,
        'Booking ID': `Revenue: ₹${screen.totalRevenue.toLocaleString('en-IN')}`,
        'Movie': `Bookings: ${screen.totalBookings}`,
        'Customer Email': `Tickets: ${screen.totalTickets}`,
        'Seats': `Avg/Ticket: ₹${screen.avgTicketPrice.toFixed(2)}`,
        'Tickets': '',
        'Subtotal (₹)': '',
        'Taxes (₹)': '',
        'Convenience Fee (₹)': '',
        'Discount (₹)': '',
        'Final Amount (₹)': '',
        'Coupon Used': '',
        'Discount %': '',
        'Booking Date': '',
        'Show Date': '',
        'Show Time': '',
        'Payment Method': ''
      });
      
      // Screen Bookings
      screen.bookings.forEach(booking => {
        detailedBookings.push({
          'Theater': '',
          'Screen': '',
          'Booking ID': booking.bookingId,
          'Movie': booking.movieTitle,
          'Customer Email': booking.userEmail,
          'Seats': booking.seats,
          'Tickets': booking.ticketCount,
          'Subtotal (₹)': booking.subtotal,
          'Taxes (₹)': booking.taxes,
          'Convenience Fee (₹)': booking.convenienceFee,
          'Discount (₹)': booking.discount,
          'Final Amount (₹)': booking.finalAmount,
          'Coupon Used': booking.couponUsed,
          'Discount %': booking.discountPercentage,
          'Booking Date': booking.bookingDate,
          'Show Date': booking.showDate,
          'Show Time': booking.showTime,
          'Payment Method': booking.paymentMethod
        });
      });
      
      // Screen Total
      detailedBookings.push({
        'Theater': '',
        'Screen': `📊 ${screen.screenName} TOTAL`,
        'Booking ID': '',
        'Movie': '',
        'Customer Email': '',
        'Seats': '',
        'Tickets': screen.totalTickets,
        'Subtotal (₹)': '',
        'Taxes (₹)': '',
        'Convenience Fee (₹)': '',
        'Discount (₹)': '',
        'Final Amount (₹)': `₹${screen.totalRevenue.toLocaleString('en-IN')}`,
        'Coupon Used': '',
        'Discount %': '',
        'Booking Date': '',
        'Show Date': '',
        'Show Time': '',
        'Payment Method': ''
      });
      
      // Empty row
      detailedBookings.push({});
    });
    
    // Theater Total
    detailedBookings.push({
      'Theater': `🏆 ${theater.theaterName.toUpperCase()} TOTAL`,
      'Screen': '',
      'Booking ID': '',
      'Movie': '',
      'Customer Email': '',
      'Seats': '',
      'Tickets': theater.totalTickets,
      'Subtotal (₹)': '',
      'Taxes (₹)': '',
      'Convenience Fee (₹)': '',
      'Discount (₹)': '',
      'Final Amount (₹)': `₹${theater.totalRevenue.toLocaleString('en-IN')}`,
      'Coupon Used': '',
      'Discount %': '',
      'Booking Date': '',
      'Show Date': '',
      'Show Time': '',
      'Payment Method': ''
    });
    
    // Empty rows between theaters
    detailedBookings.push({}, {});
  });
  
  // Grand Total with period info
  detailedBookings.push({
    'Theater': `🎯 GRAND TOTAL - ${dateRangeText}`,
    'Screen': `${filteredBookingsCount} bookings in period`,
    'Booking ID': '',
    'Movie': '',
    'Customer Email': '',
    'Seats': '',
    'Tickets': grandTotals.totalTickets,
    'Subtotal (₹)': '',
    'Taxes (₹)': '',
    'Convenience Fee (₹)': '',
    'Discount (₹)': '',
    'Final Amount (₹)': `₹${grandTotals.totalRevenue.toLocaleString('en-IN')}`,
    'Coupon Used': '',
    'Discount %': '',
    'Booking Date': '',
    'Show Date': '',
    'Show Time': '',
    'Payment Method': ''
  });
  
  const detailedSheet = XLSX.utils.json_to_sheet(detailedBookings);
  detailedSheet['!cols'] = [
    { width: 25 }, { width: 20 }, { width: 18 }, { width: 25 }, 
    { width: 25 }, { width: 15 }, { width: 10 }, { width: 12 }, 
    { width: 10 }, { width: 15 }, { width: 12 }, { width: 15 }, 
    { width: 20 }, { width: 12 }, { width: 15 }, { width: 12 }, 
    { width: 12 }, { width: 15 }
  ];
  XLSX.utils.book_append_sheet(workbook, detailedSheet, 'Detailed Bookings');
  
  // Generate filename with date range
  const timestamp = new Date().toISOString().split('T')[0];
  const dateRangeFileName = dateRange 
    ? `_${dateRange.startDate}_to_${dateRange.endDate}`
    : '_AllTime';
  const filename = `Theater_Revenue_Report${dateRangeFileName}_${timestamp}.xlsx`;
  
  XLSX.writeFile(workbook, filename, { compression: true });
};

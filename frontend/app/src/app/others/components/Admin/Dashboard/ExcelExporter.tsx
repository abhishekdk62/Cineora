import React, { useState } from 'react';
import { Download, FileText, Loader } from 'lucide-react';
import { AnalyticsBookingRecord } from '@/app/others/types/common.types';

interface ExcelExporterProps {
  data: AnalyticsBookingRecord[];
  filename?: string;
}

interface TheaterSummaryStat {
  name?: string;
  city?: string;
  revenue: number;
  bookings: number;
}

interface MovieSummaryStat {
  title?: string;
  language?: string;
  revenue: number;
  bookings: number;
  seats: number;
}

const getMovieDetails = (movieId: AnalyticsBookingRecord['movieId']) =>
  typeof movieId === 'object' && movieId !== null ? movieId : null;

const getTheaterDetails = (theaterId: AnalyticsBookingRecord['theaterId']) =>
  typeof theaterId === 'object' && theaterId !== null ? theaterId : null;

const getScreenDetails = (screenId: AnalyticsBookingRecord['screenId']) =>
  typeof screenId === 'object' && screenId !== null ? screenId : null;

const getShowtimeDetails = (showtimeId: AnalyticsBookingRecord['showtimeId']) =>
  typeof showtimeId === 'object' && showtimeId !== null ? showtimeId : null;

const ExcelExporter: React.FC<ExcelExporterProps> = ({ data, filename = 'analytics-export' }) => {
  const [isExporting, setIsExporting] = useState(false);

  const loadXLSX = async () => {
    try {
      const XLSX = await import('xlsx');
      return XLSX;
    } catch (error) {
      console.error('XLSX library not found. Please install it: npm install xlsx');
      alert('Excel export feature requires the xlsx library. Please install it: npm install xlsx');
      return null;
    }
  };

  const transformDataForExcel = () => {
    return data.map((booking, index) => {
      const movie = getMovieDetails(booking.movieId);
      const theater = getTheaterDetails(booking.theaterId);
      const screen = getScreenDetails(booking.screenId);
      const showtime = getShowtimeDetails(booking.showtimeId);

      return {
        'S.No': index + 1,
        'Booking ID': booking.bookingId || 'N/A',
        'Booking Date': booking.bookedAt ? new Date(booking.bookedAt).toLocaleDateString() : 'N/A',
        'Movie Title': movie?.title || 'N/A',
        'Movie Language': movie?.language || 'N/A',
        'Movie Genre': movie?.genre?.join(', ') || 'N/A',
        'Theater Name': theater?.name || 'N/A',
        'Theater City': theater?.city || 'N/A',
        'Theater State': theater?.state || 'N/A',
        'Theater Phone': theater?.phone || 'N/A',
        'Screen Name': screen?.name || 'N/A',
        'Show Date': booking.showDate ? new Date(booking.showDate).toLocaleDateString() : 'N/A',
        'Show Time': booking.showTime || 'N/A',
        'Selected Seats': booking.selectedSeats?.join(', ') || 'N/A',
        'Number of Seats': booking.selectedSeats?.length || 0,
        'Subtotal': booking.priceDetails?.subtotal || 0,
        'Convenience Fee': booking.priceDetails?.convenienceFee || 0,
        'Taxes': booking.priceDetails?.taxes || 0,
        'Discount': booking.priceDetails?.discount || 0,
        'Total Amount': booking.priceDetails?.total || 0,
        'Payment Status': booking.paymentStatus || 'N/A',
        'Payment Method': booking.paymentMethod || 'N/A',
        'Booking Status': booking.bookingStatus || 'N/A',
        'Customer Email': booking.contactInfo?.email || 'N/A',
        'Owner ID': showtime?.ownerId || 'N/A'
      };
    });
  };

  const generateSummaryData = () => {
    const theaterStats = data.reduce<Record<string, TheaterSummaryStat>>((acc, booking) => {
      const theater = getTheaterDetails(booking.theaterId);
      if (!theater?._id) return acc;

      if (!acc[theater._id]) {
        acc[theater._id] = {
          name: theater.name,
          city: theater.city,
          revenue: 0,
          bookings: 0
        };
      }

      acc[theater._id].revenue += booking.priceDetails?.total || 0;
      acc[theater._id].bookings += 1;
      return acc;
    }, {});

    const movieStats = data.reduce<Record<string, MovieSummaryStat>>((acc, booking) => {
      const movie = getMovieDetails(booking.movieId);
      if (!movie?._id) return acc;

      if (!acc[movie._id]) {
        acc[movie._id] = {
          title: movie.title,
          language: movie.language,
          revenue: 0,
          bookings: 0,
          seats: 0
        };
      }

      acc[movie._id].revenue += booking.priceDetails?.total || 0;
      acc[movie._id].bookings += 1;
      acc[movie._id].seats += booking.selectedSeats?.length || 0;
      return acc;
    }, {});

    return { theaterStats, movieStats };
  };

  const exportToExcel = async () => {
    const XLSX = await loadXLSX();
    if (!XLSX) return;

    setIsExporting(true);

    try {
      const workbook = XLSX.default.utils.book_new();
      const bookingData = transformDataForExcel();
      const { theaterStats, movieStats } = generateSummaryData();

      const bookingSheet = XLSX.default.utils.json_to_sheet(bookingData);
      XLSX.default.utils.book_append_sheet(workbook, bookingSheet, 'Booking Details');

      const theaterSummary = Object.values(theaterStats).map((theater, index) => ({
        'S.No': index + 1,
        'Theater Name': theater.name,
        'City': theater.city,
        'Total Bookings': theater.bookings,
        'Total Revenue': theater.revenue,
        'Average Revenue per Booking': Math.round(theater.revenue / theater.bookings)
      }));
      const theaterSheet = XLSX.default.utils.json_to_sheet(theaterSummary);
      XLSX.default.utils.book_append_sheet(workbook, theaterSheet, 'Theater Summary');

      const movieSummary = Object.values(movieStats).map((movie, index) => ({
        'S.No': index + 1,
        'Movie Title': movie.title,
        'Language': movie.language,
        'Total Bookings': movie.bookings,
        'Total Seats Sold': movie.seats,
        'Total Revenue': movie.revenue,
        'Average Revenue per Booking': Math.round(movie.revenue / movie.bookings)
      }));
      const movieSheet = XLSX.default.utils.json_to_sheet(movieSummary);
      XLSX.default.utils.book_append_sheet(workbook, movieSheet, 'Movie Summary');

      const totalRevenue = data.reduce((sum, booking) => sum + (booking.priceDetails?.total || 0), 0);
      const totalBookings = data.length;
      const uniqueTheaters = new Set(
        data.map((b) => getTheaterDetails(b.theaterId)?._id).filter(Boolean)
      ).size;
      const uniqueMovies = new Set(
        data.map((b) => getMovieDetails(b.movieId)?._id).filter(Boolean)
      ).size;

      const overallSummary = [
        { 'Metric': 'Total Bookings', 'Value': totalBookings },
        { 'Metric': 'Total Revenue', 'Value': totalRevenue },
        { 'Metric': 'Average Revenue per Booking', 'Value': Math.round(totalRevenue / totalBookings) },
        { 'Metric': 'Active Theaters', 'Value': uniqueTheaters },
        { 'Metric': 'Movies Booked', 'Value': uniqueMovies },
        { 'Metric': 'Average Revenue per Theater', 'Value': Math.round(totalRevenue / uniqueTheaters) },
        { 'Metric': 'Average Revenue per Movie', 'Value': Math.round(totalRevenue / uniqueMovies) }
      ];
      const summarySheet = XLSX.default.utils.json_to_sheet(overallSummary);
      XLSX.default.utils.book_append_sheet(workbook, summarySheet, 'Overall Summary');

      const currentDate = new Date().toISOString().split('T')[0];
      const exportFilename = `${filename}_${currentDate}.xlsx`;
      XLSX.default.writeFile(workbook, exportFilename);
      console.log(`Excel file exported successfully: ${exportFilename}`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Error exporting to Excel. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={exportToExcel}
      disabled={isExporting || !data || data.length === 0}
      className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 disabled:bg-gray-600/20 border border-green-500/30 hover:border-green-500/50 disabled:border-gray-600/30 rounded-lg text-green-400 hover:text-green-300 disabled:text-gray-500 transition-all duration-300 disabled:cursor-not-allowed"
    >
      {isExporting ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      <span className="text-sm font-medium">
        {isExporting ? 'Exporting...' : 'Export to Excel'}
      </span>
      <FileText className="w-3 h-3" />
    </button>
  );
};

export default ExcelExporter;

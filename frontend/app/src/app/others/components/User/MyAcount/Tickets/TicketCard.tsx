'use client';

import React, { useState } from 'react';
import Barcode from './Barcode';
import { generateTicketPDF } from '@/app/others/Utils/pdfGenerator';
import { cancelTicket } from '@/app/others/services/userServices/ticketServices';
import { confirmAction, ConfirmDialog } from '../../../utils/ConfirmDialog';
import toast from 'react-hot-toast';
import QRCodeDisplay from './QRCodeDisplay';
import { Star } from 'lucide-react';
import { addReview } from '@/app/others/services/userServices/reviewServices';
import SingleTicketCancellationModal from './SingleTicketCancellationModal';

const lexendBold = { className: "font-bold" };
const lexendMedium = { className: "font-medium" };
const lexendSmall = { className: "font-normal text-sm" };

interface TicketCardProps {
  handleAddReview: (booking: any) => void;
  booking: any;
  activeTab: string;
  onViewDetails: (booking: any) => void;
  getTickets: (pageNumber: number) => void;
}

const TicketCard: React.FC<TicketCardProps> = ({ 
  handleAddReview, 
  booking, 
  onViewDetails, 
  activeTab, 
  getTickets 
}) => {
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [showCancellationModal, setShowCancellationModal] = useState(false);

  const getMovieData = (booking: any) => {
    return booking.movie || booking.movieId || {};
  };

  const getTheaterData = (booking: any) => {
    return booking.theater || booking.theaterId || {};
  };

  const getShowtimeData = (booking: any) => {
    return booking.showtime || booking.showtimeId || {};
  };

  const groupTicketsBySeatType = (tickets: any[]) => {
    if (!tickets || tickets.length === 0) return [];

    const sortedTickets = tickets.sort((a, b) => {
      if (a.seatRow !== b.seatRow) return a.seatRow.localeCompare(b.seatRow);
      return parseInt(a.seatNumber) - parseInt(b.seatNumber);
    });

    const grouped: { [key: string]: any[] } = {};

    sortedTickets.forEach(ticket => {
      if (!grouped[ticket.seatType]) {
        grouped[ticket.seatType] = [];
      }
      grouped[ticket.seatType].push(ticket);
    });

    return Object.entries(grouped).map(([seatType, ticketGroup]) => ({
      seatType,
      seats: ticketGroup.map(t => `${t.seatRow}${t.seatNumber}`),
      count: ticketGroup.length,
      price: ticketGroup[0].price,
      totalPrice: ticketGroup.reduce((sum, t) => {
        const basePrice = t.price;
        const taxAmount = basePrice * 0.18;
        const convenienceAmount = basePrice * 0.05;
        return sum + basePrice + taxAmount + convenienceAmount;
      }, 0)
    }));
  };

  const calculatePricing = () => {
    if (booking.allTickets) {
      const groups = groupTicketsBySeatType(booking.allTickets);
      const totalAmount = groups.reduce((sum, group) => sum + group.totalPrice, 0);
      const totalSeats = groups.reduce((sum, group) => sum + group.count, 0);
      const allSeats = groups.flatMap(group => group.seats);
      return { groups, totalAmount, totalSeats, allSeats };
    } else {
      const basePrice = booking.price;
      const taxAmount = basePrice * 0.18;
      const convenienceAmount = basePrice * 0.05;
      const totalPrice = basePrice + taxAmount + convenienceAmount;
      
      const groups = [{
        seatType: booking.seatType,
        seats: [`${booking.seatRow}${booking.seatNumber}`],
        count: 1,
        price: basePrice,
        totalPrice: totalPrice
      }];
      
      return {
        groups,
        totalAmount: totalPrice,
        totalSeats: 1,
        allSeats: [`${booking.seatRow}${booking.seatNumber}`]
      };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const handleDownloadPdf = async () => {
    try {
      setDownloadingPdf(true);
      const { groups: seatGroups, totalAmount, totalSeats, allSeats } = calculatePricing();

      await generateTicketPDF({
        ticket: booking,
        seatGroups,
        totalAmount,
        totalSeats,
        allSeats,
        formatDate,
        formatTime
      });
    } catch (error) {
      console.error('PDF generation failed:', error);
    } finally {
      setDownloadingPdf(false);
    }
  };

  // Check if this booking has multiple tickets
  const hasMultipleTickets = booking.allTickets && booking.allTickets.length > 1;

  // Handle single ticket cancellation (opens modal for selection)
  const handleSingleTicketCancel = () => {
    setShowCancellationModal(true);
  };

  // Handle full booking cancellation (existing logic)
  const handleFullBookingCancel = async () => {
    try {
      let { totalAmount } = calculatePricing();

      console.log('full booking datas',booking.bookingId, Math.round(totalAmount));
      const confirm = await confirmAction({
        title: 'Cancel entire booking?',
        message: 'This will cancel all tickets in this booking. Do you want to continue?',
        confirmText: 'Yes',
        cancelText: 'No'
      });
      
      if (!confirm) {
        return;
      }
      
      // let { totalAmount } = calculatePricing();
      const data = await cancelTicket(booking.bookingId, Math.round(totalAmount));
      toast.success('Booking cancelled');
      getTickets(1);
    } catch (error) {
      console.log(error);
      toast.error('Failed to cancel booking');
    }
  };

  const movieData = getMovieData(booking);
  const theaterData = getTheaterData(booking);
  const showtimeData = getShowtimeData(booking);
  let { totalAmount } = calculatePricing();

  return (
    <>
      <div className="flex bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl hover:scale-[1.02] transition-transform duration-300 group">
        <div className="w-40 shrink-0 relative bg-gray-800">
          <img
            src={movieData.poster || '/placeholder-movie.jpg'}
            alt={movieData.title || 'Movie'}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-movie.jpg';
            }}
          />
        </div>

        <div className="flex flex-col flex-1 px-7 py-6">
          <div className="flex items-center justify-between text-white mb-2">
            <div className={`${lexendBold.className} text-xl`}>
              {movieData.title || 'Unknown Movie'}
            </div>

            <div className="flex items-center gap-2">
              {booking.status === "confirmed" && !booking.isUsed && activeTab === "history" && (
                <button
                  onClick={() => handleAddReview(booking)}
                  className={`${lexendMedium.className} justify-center items-center flex gap-0.5 px-1.5 py-0.5 rounded-lg bg-yellow-500 text-black hover:bg-yellow-600 transition`}
                >
                  <Star size={13} className="fill-current text-black" />
                  Add Review
                </button>
              )}

              {booking.status === 'cancelled' && (
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-600 border border-red-200">
                  Cancelled
                </span>
              )}
            </div>
          </div>

          <p className={`${lexendSmall.className} text-gray-300 mb-4`}>
            {theaterData.name || 'Unknown Theater'} - Screen: {booking.screen?.name || 'N/A'}
          </p>

          <div className={`${lexendMedium.className} flex items-center gap-8 mt-2 text-base text-white`}>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
              </svg>
              <span>{formatDate(booking.showDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{formatTime(booking.showTime)}</span>
            </div>
          </div>

          <div className="flex gap-4 mt-4 mb-6">
            <span className={`${lexendSmall.className} bg-white/10 text-white px-3 py-1.5 rounded-lg font-medium border border-white/20`}>
              {booking.seatType}
            </span>
            <span className={`${lexendSmall.className} bg-white/10 text-white px-3 py-1.5 rounded-lg font-medium border border-white/20`}>
              {hasMultipleTickets ? 
                `${booking.allTickets.length} Seats` : 
                `Seat: ${booking.seatRow}${booking.seatNumber}`
              }
            </span>
            <span className={`${lexendSmall.className} bg-white/10 text-white px-3 py-1.5 rounded-lg font-medium border border-white/20`}>
              ₹{Math.round(totalAmount)}
            </span>
          </div>

          <div className="mt-auto flex gap-3">
            <button
              onClick={() => onViewDetails(booking)}
              className={`${lexendMedium.className} bg-transparent text-white px-5 py-2.5 rounded-xl border border-white hover:bg-white/10 transition-colors text-sm`}
            >
              View Details
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={downloadingPdf}
              className={`${lexendMedium.className} bg-transparent text-white px-5 py-2.5 rounded-xl border border-white hover:bg-white/10 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {downloadingPdf ? 'Generating...' : 'Download PDF'}
            </button>
            {booking.status === 'confirmed' && !booking.isUsed && activeTab === 'upcoming' && (
              <div className="flex gap-2">
                {/* Single/Selective Ticket Cancellation */}
                <button
                  onClick={handleSingleTicketCancel}
                  className={`${lexendMedium.className} bg-transparent text-white/70 px-5 py-2.5 rounded-xl border border-white/50 hover:bg-orange-900/20 hover:text-orange-400 hover:border-orange-500/30 transition-colors text-sm`}
                >
                  {hasMultipleTickets ? 'Select & Cancel' : 'Cancel Ticket'}
                </button>
                
                {/* Full Booking Cancellation (only show if multiple tickets) */}
                {hasMultipleTickets && (
                  <button
                    onClick={handleFullBookingCancel}
                    className={`${lexendMedium.className} bg-transparent text-white/70 px-5 py-2.5 rounded-xl border border-white/50 hover:bg-red-900/20 hover:text-red-400 hover:border-red-500/30 transition-colors text-sm`}
                  >
                    Cancel All
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-center items-center w-24 bg-white border-l border-white/20 relative">
          <Barcode code={booking.qrCode} />

          <div className={`${lexendSmall.className} absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-gray-700 font-mono`}>
            {booking.ticketId?.slice(0, 7) || 'N/A'}
          </div>
        </div>
      </div>

      <SingleTicketCancellationModal
        isOpen={showCancellationModal}
        onClose={() => setShowCancellationModal(false)}
        booking={booking}
        onSuccess={() => {
          getTickets(1); 
        }}
      />
    </>
  );
};

export default TicketCard;

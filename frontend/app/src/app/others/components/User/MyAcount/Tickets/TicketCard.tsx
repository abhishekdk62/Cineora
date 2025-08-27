// components/tickets/TicketCard.tsx
'use client';

import React, { useState } from 'react';
import Barcode from './Barcode';
import { generateTicketPDF } from '@/app/others/Utils/pdfGenerator';

const lexendBold = { className: "font-bold" };
const lexendMedium = { className: "font-medium" };
const lexendSmall = { className: "font-normal text-sm" };

interface TicketCardProps {
  booking: any;
  onViewDetails: (booking: any) => void;
}

function statusColors(status: string) {
  switch (status) {
    case 'confirmed':
      return 'bg-green-900/20 text-green-400 border-green-500/30';
    case 'cancelled':
      return 'bg-red-900/20 text-red-400 border-red-500/30';
    case 'used':
      return 'bg-blue-900/20 text-blue-400 border-blue-500/30';
    case 'expired':
      return 'bg-gray-700/20 text-gray-400 border-gray-500/30';
    default:
      return 'bg-gray-700/20 text-gray-400 border-gray-500/30';
  }
}

const TicketCard: React.FC<TicketCardProps> = ({ booking, onViewDetails }) => {
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  // Format date function
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format time function
  const formatTime = (timeString: string) => {
    return timeString;
  };

  // Group tickets by seat type - same logic as modal
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
      totalPrice: ticketGroup.reduce((sum, t) => sum + t.price, 0)
    }));
  };

  const handleDownloadPdf = async () => {
    try {
      setDownloadingPdf(true);
      
      // Create the data structure needed for PDF generation
      // Since booking might have different structure than ticket in modal
      const seatGroups = booking.allTickets ? 
        groupTicketsBySeatType(booking.allTickets) : 
        [{
          seatType: booking.seatType,
          seats: booking.seats,
          count: booking.seats.length,
          price: booking.totalPrice / booking.seats.length, // Calculate individual price
          totalPrice: booking.totalPrice
        }];

      const totalAmount = booking.totalPrice;
      const totalSeats = booking.seats.length;
      const allSeats = booking.seats;

      await generateTicketPDF({
        ticket: booking, // Use booking as ticket data
        seatGroups,
        totalAmount,
        totalSeats,
        allSeats,
        formatDate,
        formatTime
      });
    } catch (error) {
      console.error('PDF generation failed:', error);
      // You can show a toast notification here
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <div className="flex bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl hover:scale-[1.02] transition-transform duration-300 group">
      {/* Poster */}
      <div className="w-40 shrink-0 relative bg-gray-800">
        <img
          src={booking.movieId.poster}
          alt={booking.movieId.title}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Info Section */}
      <div className="flex flex-col flex-1 px-7 py-6">
        <h2 className={`${lexendBold.className} text-xl text-white mb-2`}>
          {booking.movieId.title}
        </h2>
        <p className={`${lexendSmall.className} text-gray-300 mb-4`}>
          {booking.theaterId.name} - {booking.screenId.name}
        </p>
        
        <div className={`${lexendMedium.className} flex items-center gap-8 mt-2 text-base text-white`}>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
            Seats: {booking.seats.join(', ')}
          </span>
          <span className={`${lexendSmall.className} bg-white/10 text-white px-3 py-1.5 rounded-lg font-medium border border-white/20`}>
            ₹{booking.totalPrice}
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
          {booking.status === 'confirmed' && !booking.isUsed && (
            <button className={`${lexendMedium.className} bg-transparent text-white/70 px-5 py-2.5 rounded-xl border border-white/50 hover:bg-red-900/20 hover:text-red-400 hover:border-red-500/30 transition-colors text-sm`}>
              Cancel Ticket
            </button>
          )}
        </div>
      </div>
      
      <div className="flex flex-col justify-center items-center w-24 bg-white border-l border-white/20 relative">
        <Barcode code={booking.qrCode} />
        <div className={`${lexendSmall.className} absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-gray-700 font-mono`}>
          #{booking.ticketId.slice(-4)}
        </div>
      </div>
    </div>
  );
};

export default TicketCard;

// components/tickets/TicketDetailsModal.tsx
'use client';

import React, { useState } from 'react';
import { X, Download, Share2, Calendar, Clock, MapPin, Users, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import QRCodeDisplay from './QRCodeDisplay';
import { generateTicketPDF } from '@/app/others/Utils/pdfGenerator';


const lexendBold = { className: "font-bold" };
const lexendMedium = { className: "font-medium" };
const lexendSmall = { className: "font-normal text-sm" };

interface TicketDetailsModalProps {
  ticket: any;
  onClose: () => void;
}

const TicketDetailsModal: React.FC<TicketDetailsModalProps> = ({ ticket, onClose }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  // Group tickets by seat type for proper display
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

  // Get grouped seat information
  const seatGroups = ticket.allTickets ? groupTicketsBySeatType(ticket.allTickets) : [
    {
      seatType: ticket.seatType,
      seats: [`${ticket.seatRow}${ticket.seatNumber}`],
      count: 1,
      price: ticket.price,
      totalPrice: ticket.price
    }
  ];

  const totalAmount = seatGroups.reduce((sum, group) => sum + group.totalPrice, 0);
  const totalSeats = seatGroups.reduce((sum, group) => sum + group.count, 0);
  const allSeats = seatGroups.flatMap(group => group.seats);

  const handleDownloadPdf = async () => {
    try {
      setDownloadingPdf(true);
      await generateTicketPDF({
        ticket,
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="backdrop-blur-sm bg-black/20 border border-gray-500/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-500/30">
          <h2 className={`${lexendBold.className} text-2xl text-white`}>
            Ticket Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Movie Info */}
          <div className="flex gap-6">
            <img
              src={ticket.movieId.poster}
              alt={ticket.movieId.title}
              className="w-32 h-48 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className={`${lexendBold.className} text-xl text-white mb-4`}>
                {ticket.movieId.title}
              </h3>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className={`${lexendMedium.className} text-white`}>
                    {ticket.theaterId.name} - {ticket.screenId.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className={`${lexendMedium.className} text-white`}>
                    {formatDate(ticket.showDate)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className={`${lexendMedium.className} text-white`}>
                    {formatTime(ticket.showTime)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className={`${lexendMedium.className} text-white`}>
                    {totalSeats} Seat{totalSeats > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="backdrop-blur-sm bg-black/20 rounded-2xl p-6 border border-gray-500/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className={`${lexendMedium.className} text-white text-lg`}>
                  {totalSeats} Seat{totalSeats > 1 ? "s" : ""} Selected
                </p>
                <p className={`${lexendSmall.className} text-gray-300`}>
                  {allSeats.join(", ")}
                </p>
              </div>
              <div className="text-right">
                <p className={`${lexendBold.className} text-white text-xl`}>
                  ₹{totalAmount}
                </p>
                <p className={`${lexendSmall.className} text-gray-300`}>
                  Total Amount
                </p>
              </div>
            </div>

            {/* See Details Button */}
            <div className="mb-4">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className={`${lexendSmall.className} flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-200 text-sm`}
              >
                <Eye className="w-4 h-4" />
                See Details
                {showDetails ?
                  <ChevronUp className="w-4 h-4" /> :
                  <ChevronDown className="w-4 h-4" />
                }
              </button>
            </div>

            {/* Price Breakdown Details */}
            {showDetails && (
              <div className="mb-4 p-4 rounded-xl bg-black/30 border border-gray-600/30">
                <h4 className={`${lexendMedium.className} text-white text-sm mb-3`}>
                  Price Breakdown
                </h4>

                {seatGroups.map((group, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-600/20 last:border-b-0">
                    <div className="flex items-center gap-3">
                      {/* Color indicator based on seat type */}
                      <div
                        className="w-3 h-3 rounded-full border"
                        style={{
                          backgroundColor: group.seatType === 'VIP' ? '#EAB308' :
                            group.seatType === 'Premium' ? '#9333EA' : '#06B6D4',
                          borderColor: group.seatType === 'VIP' ? '#CA8A04' :
                            group.seatType === 'Premium' ? '#7C3AED' : '#0891B2'
                        }}
                      />
                      <span className={`${lexendSmall.className} text-gray-300 text-sm`}>
                        {group.seatType} (₹{group.price})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`${lexendSmall.className} text-gray-400 text-sm`}>
                        {group.count} × ₹{group.price}
                      </span>
                      <span className={`${lexendSmall.className} text-white text-sm font-medium`}>
                        = ₹{group.totalPrice}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Total Line */}
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-500/30">
                  <span className={`${lexendMedium.className} text-white text-base font-semibold`}>
                    TOTAL
                  </span>
                  <span className={`${lexendBold.className} text-white text-lg`}>
                    ₹{totalAmount}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Additional Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="backdrop-blur-sm bg-black/20 border border-gray-500/30 rounded-lg p-4">
              <h4 className={`${lexendMedium.className} text-gray-300 text-sm mb-2`}>
                Booking ID
              </h4>
              <p className={`${lexendBold.className} text-white font-mono text-sm`}>
                {ticket.ticketId}
              </p>
            </div>

            <div className="backdrop-blur-sm bg-black/20 border border-gray-500/30 rounded-lg p-4">
              <h4 className={`${lexendMedium.className} text-gray-300 text-sm mb-2`}>
                Status
              </h4>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${ticket.status === 'confirmed' ? 'bg-green-900/30 text-green-400' :
                  ticket.status === 'cancelled' ? 'bg-red-900/30 text-red-400' :
                    'bg-gray-700/30 text-gray-400'
                }`}>
                {ticket.status.toUpperCase()}
              </span>
            </div>

            <div className="backdrop-blur-sm bg-black/20 border border-gray-500/30 rounded-lg p-4 col-span-2">
              <h4 className={`${lexendMedium.className} text-gray-300 text-sm mb-2`}>
                Booked On
              </h4>
              <p className={`${lexendBold.className} text-white text-sm`}>
                {new Date(ticket.createdAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>

          <div className="backdrop-blur-sm bg-black/20 border border-gray-500/30 rounded-lg p-6 text-center">
            <h4 className={`${lexendMedium.className} text-gray-300 mb-4`}>
              QR Code for Entry
            </h4>
            <div className="bg-white p-4 rounded-lg inline-block">
              {ticket.qrCode ? (
                <QRCodeDisplay
                  data={ticket.qrCode}
                  size={128}
                />
              ) : (
                <div className="w-32 h-32 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-xs text-gray-600">No QR Code</span>
                </div>
              )}
            </div>
            <p className={`${lexendSmall.className} text-gray-300 mt-3`}>
              Show this QR code at the theater entrance
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleDownloadPdf}
              disabled={downloadingPdf}
              className={`${lexendMedium.className} flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl hover:bg-gradient-to-tr hover:from-violet-300 hover:to-yellow-100 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
            >
              <Download className="w-4 h-4" />
              {downloadingPdf ? 'Generating PDF...' : 'Download PDF'}
            </button>
            <button className={`${lexendMedium.className} flex items-center gap-2 px-6 py-3 border border-gray-500/30 text-white rounded-xl hover:bg-white/10 transition-colors`}>
              <Share2 className="w-4 h-4" />
              Share Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailsModal;

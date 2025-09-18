//@ts-nocheck
'use client';

import React, { useState } from 'react';
import { X, Download, Share2, Calendar, Clock, MapPin, Users, Eye, ChevronDown, ChevronUp, Tag } from 'lucide-react';
import QRCodeDisplay from './QRCodeDisplay';
import { generateTicketPDF } from '@/app/others/Utils/pdfGenerator';
import { TicketData } from './TicketsList';

const lexendBold = { className: "font-bold" };
const lexendMedium = { className: "font-medium" };
const lexendSmall = { className: "font-normal text-sm" };

interface TicketDetailsModalProps {
  ticket: TicketData;
  activeTab: string;
  onClose: () => void;
}

const TicketDetailsModal: React.FC<TicketDetailsModalProps> = ({ ticket, onClose, activeTab }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const getMovieData = (ticket: TicketData) => {
    return ticket.movie || ticket.movieId || {};
  };

  const getTheaterData = (ticket: TicketData) => {
    return ticket.theater || ticket.theaterId || {};
  };

  const getShowtimeData = (ticket: TicketData) => {
    return ticket.showtime || ticket.showtimeId || {};
  };

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

  const groupTicketsBySeatType = (tickets: TicketData[]) => {
    if (!tickets || tickets.length === 0) return [];

    const sortedTickets = tickets.sort((a, b) => {
      if (a.seatRow !== b.seatRow) return a.seatRow.localeCompare(b.seatRow);
      return parseInt(a.seatNumber) - parseInt(b.seatNumber);
    });

    const grouped: { [key: string]: TicketData[] } = {};

    sortedTickets.forEach(ticket => {
      if (!grouped[ticket.seatType]) {
        grouped[ticket.seatType] = [];
      }
      grouped[ticket.seatType].push(ticket);
    });

    return Object.entries(grouped).map(([seatType, ticketGroup]) => {
      // Calculate base price for this seat type
      const basePrice = ticketGroup.reduce((sum, t) => sum + t.price, 0);
      
      // Apply coupon discount if available (discount is applied before tax)
      const discountPercentage = ticket.coupon?.discountPercentage || 0;
      const discountAmount = (basePrice * discountPercentage) / 100;
      const discountedPrice = basePrice - discountAmount;
      
      // Apply tax and convenience fee on the discounted amount
      const taxAmount = basePrice * 0.18;
      const convenienceAmount = basePrice * 0.05;
      const totalPrice = discountedPrice + taxAmount + convenienceAmount;

      return {
        seatType,
        seats: ticketGroup.map(t => `${t.seatRow}${t.seatNumber}`),
        count: ticketGroup.length,
        price: ticketGroup.price,
        basePrice: basePrice,
        discountAmount: discountAmount,
        discountedPrice: discountedPrice,
        taxAmount: taxAmount,
        convenienceAmount: convenienceAmount,
        totalPrice: totalPrice
      };
    });
  };

  const calculatePricing = () => {
    if (ticket.allTickets) {
      const groups = groupTicketsBySeatType(ticket.allTickets);
      const totalAmount = groups.reduce((sum, group) => sum + group.totalPrice, 0);
      const totalSeats = groups.reduce((sum, group) => sum + group.count, 0);
      const allSeats = groups.flatMap(group => group.seats);
      const totalDiscount = groups.reduce((sum, group) => sum + group.discountAmount, 0);
      const totalBasePrice = groups.reduce((sum, group) => sum + group.basePrice, 0);
      
      return { 
        groups, 
        totalAmount, 
        totalSeats, 
        allSeats, 
        totalDiscount,
        totalBasePrice,
        totalTax: groups.reduce((sum, group) => sum + group.taxAmount, 0),
        totalConvenience: groups.reduce((sum, group) => sum + group.convenienceAmount, 0)
      };
    } else {
      const basePrice = ticket.price;
      
      // Apply coupon discount if available
      const discountPercentage = ticket.coupon?.discountPercentage || 0;
      const discountAmount = (basePrice * discountPercentage) / 100;
      const discountedPrice = basePrice - discountAmount;
      
      // Apply tax and convenience fee on the discounted amount
      const taxAmount = discountedPrice * 0.18;
      const convenienceAmount = discountedPrice * 0.05;
      const totalPrice = discountedPrice + taxAmount + convenienceAmount;
      
      const groups = [{
        seatType: ticket.seatType,
        seats: [`${ticket.seatRow}${ticket.seatNumber}`],
        count: 1,
        price: basePrice,
        basePrice: basePrice,
        discountAmount: discountAmount,
        discountedPrice: discountedPrice,
        taxAmount: taxAmount,
        convenienceAmount: convenienceAmount,
        totalPrice: totalPrice
      }];
      
      return {
        groups,
        totalAmount: totalPrice,
        totalSeats: 1,
        allSeats: [`${ticket.seatRow}${ticket.seatNumber}`],
        totalDiscount: discountAmount,
        totalBasePrice: basePrice,
        totalTax: taxAmount,
        totalConvenience: convenienceAmount
      };
    }
  };

  const { 
    groups: seatGroups, 
    totalAmount, 
    totalSeats, 
    allSeats, 
    totalDiscount, 
    totalBasePrice, 
    totalTax, 
    totalConvenience 
  } = calculatePricing();
  
  const movieData = getMovieData(ticket);
  const theaterData = getTheaterData(ticket);
  const showtimeData = getShowtimeData(ticket);

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
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="backdrop-blur-sm bg-black/20 border border-gray-500/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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

        <div className="p-6 space-y-6">
          <div className="flex gap-6">
            <img
              src={movieData.poster || '/placeholder-movie.jpg'}
              alt={movieData.title || 'Movie'}
              className="w-32 h-48 rounded-lg object-cover"
              onError={(e) => {
                e.currentTarget.src = '/placeholder-movie.jpg';
              }}
            />
            <div className="flex-1">
              <h3 className={`${lexendBold.className} text-xl text-white mb-4`}>
                {movieData.title || 'Unknown Movie'}
              </h3>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className={`${lexendMedium.className} text-white`}>
                    {theaterData.name || 'Unknown Theater'} - Screen: {ticket.screen?.name || 'N/A'}
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
                {/* Coupon Information */}
                {ticket.coupon && (
                  <div className="flex items-center gap-3">
                    <Tag className="w-4 h-4 text-green-400" />
                    <span className={`${lexendMedium.className} text-green-400`}>
                      {ticket.coupon.name} ({ticket.coupon.discountPercentage}% OFF)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="backdrop-blur-sm bg-black/20 rounded-2xl p-6 border border-gray-500/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className={`${lexendMedium.className} text-white text-lg`}>
                  {totalSeats} Seat{totalSeats > 1 ? "s" : ""} Selected
                </p>
                <p className={`${lexendSmall.className} text-gray-300`}>
                  {allSeats.join(", ")}
                </p>
                {/* Display coupon info if applied */}
                {ticket.coupon && totalDiscount > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs border border-green-400/20">
                      {ticket.coupon.uniqueId}
                    </div>
                    <span className={`${lexendSmall.className} text-green-400`}>
                      ₹{Math.round(totalDiscount)} saved
                    </span>
                  </div>
                )}
              </div>
              <div className="text-right">
                {totalDiscount > 0 ? (
                  <div>
                    <p className={`${lexendSmall.className} text-gray-400 line-through`}>
                      ₹{Math.round(totalBasePrice + totalTax + totalConvenience)}
                    </p>
                    <p className={`${lexendBold.className} text-green-400 text-xl`}>
                      ₹{Math.round(totalAmount)}
                    </p>
                  </div>
                ) : (
                  <p className={`${lexendBold.className} text-white text-xl`}>
                    ₹{Math.round(totalAmount)}
                  </p>
                )}
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
                  <div key={index} className="mb-4 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
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
                          {group.seatType} × {group.count}
                        </span>
                      </div>
                      <span className={`${lexendSmall.className} text-white text-sm font-medium`}>
                        ₹{Math.round(group.totalPrice)}
                      </span>
                    </div>

                    {/* Individual price breakdown */}
                    <div className="ml-6 space-y-1 text-xs text-gray-400">
                      <div className="flex justify-between">
                        <span>Base Price: ₹{group.price} × {group.count}</span>
                        <span>₹{Math.round(group.basePrice)}</span>
                      </div>
                      {group.discountAmount > 0 && (
                        <div className="flex justify-between text-green-400">
                          <span>Coupon Discount ({ticket.coupon?.discountPercentage}%)</span>
                          <span>-₹{Math.round(group.discountAmount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>After Discount</span>
                        <span>₹{Math.round(group.discountedPrice)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax (18%)</span>
                        <span>₹{Math.round(group.taxAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Convenience Fee (5%)</span>
                        <span>₹{Math.round(group.convenienceAmount)}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Summary section */}
                <div className="border-t border-gray-500/30 pt-3 mt-3 space-y-2">
                  <div className="flex justify-between text-sm text-gray-300">
                    <span>Subtotal</span>
                    <span>₹{Math.round(totalBasePrice)}</span>
                  </div>
                  {totalDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-400">
                      <span>Coupon Discount</span>
                      <span>-₹{Math.round(totalDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-gray-300">
                    <span>Tax</span>
                    <span>₹{Math.round(totalTax)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-300">
                    <span>Convenience Fee</span>
                    <span>₹{Math.round(totalConvenience)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-500/30">
                    <span className={`${lexendMedium.className} text-white text-base font-semibold`}>
                      TOTAL
                    </span>
                    <span className={`${lexendBold.className} text-white text-lg`}>
                      ₹{Math.round(totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Coupon Information Card - if coupon was used */}
          {ticket.coupon && (
            <div className="backdrop-blur-sm bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Tag className="w-5 h-5 text-green-400" />
                <h4 className={`${lexendMedium.className} text-green-400 text-lg`}>
                  Coupon Applied
                </h4>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className={`${lexendSmall.className} text-gray-300`}>Coupon Name:</span>
                  <p className={`${lexendMedium.className} text-white`}>{ticket.coupon.name}</p>
                </div>
                <div>
                  <span className={`${lexendSmall.className} text-gray-300`}>Coupon Code:</span>
                  <p className={`${lexendMedium.className} text-white font-mono`}>{ticket.coupon.uniqueId}</p>
                </div>
                <div>
                  <span className={`${lexendSmall.className} text-gray-300`}>Discount:</span>
                  <p className={`${lexendMedium.className} text-green-400`}>{ticket.coupon.discountPercentage}% OFF</p>
                </div>
                <div>
                  <span className={`${lexendSmall.className} text-gray-300`}>You Saved:</span>
                  <p className={`${lexendMedium.className} text-green-400`}>₹{Math.round(totalDiscount)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Additional Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="backdrop-blur-sm bg-black/20 border border-gray-500/30 rounded-lg p-4">
              <h4 className={`${lexendMedium.className} text-gray-300 text-sm mb-2`}>
                Ticket ID
              </h4>
              <p className={`${lexendBold.className} text-white font-mono text-sm`}>
                {ticket.ticketId || 'N/A'}
              </p>
            </div>

            <div className="backdrop-blur-sm bg-black/20 border border-gray-500/30 rounded-lg p-4">
              <h4 className={`${lexendMedium.className} text-gray-300 text-sm mb-2`}>
                Status
              </h4>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                ticket.status === 'confirmed' ? 'bg-green-900/30 text-green-400' :
                ticket.status === 'cancelled' ? 'bg-red-900/30 text-red-400' :
                'bg-gray-700/30 text-gray-400'
              }`}>
                {ticket.status?.toUpperCase() || 'UNKNOWN'}
              </span>
            </div>

            <div className="backdrop-blur-sm bg-black/20 border border-gray-500/30 rounded-lg p-4 col-span-2">
              <h4 className={`${lexendMedium.className} text-gray-300 text-sm mb-2`}>
                Booked On
              </h4>
              <p className={`${lexendBold.className} text-white text-sm`}>
                {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : 'N/A'}
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

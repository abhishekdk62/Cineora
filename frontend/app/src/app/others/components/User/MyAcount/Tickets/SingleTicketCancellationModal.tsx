'use client';

import React, { useState } from 'react';
import { cancelSingleTicket } from '@/app/others/services/userServices/ticketServices';
import toast from 'react-hot-toast';
import { TicketData } from './TicketsList';

const lexendMedium = { className: "font-medium" };
const lexendSmall = { className: "font-normal text-sm" };

interface SingleTicketCancellationModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  onSuccess: () => void;
}

const SingleTicketCancellationModal: React.FC<SingleTicketCancellationModalProps> = ({
  isOpen,
  onClose,
  booking,
  onSuccess
}) => {
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [cancelling, setCancelling] = useState(false);

  if (!isOpen) return null;

  // Get all tickets for this booking
  const allTickets = booking.allTickets || [booking];

  const calculateSelectedAmount = () => {
    return selectedTickets.reduce((total, ticketId) => {
      const ticket = allTickets.find((t: TicketData) => t._id === ticketId);
      if (ticket) {
        let basePrice = ticket.price;
        if (ticket.coupon && ticket.coupon.discountPercentage) {
          const discountAmount = (basePrice * ticket.coupon.discountPercentage) / 100;
          basePrice = basePrice - discountAmount;
        }
        const tax = ticket.price * 0.18;
        const convenience = ticket.price * 0.05;
        const totalTicketPrice = basePrice + tax + convenience;
        return total + totalTicketPrice;
      }
      return total;
    }, 0);
  };

  const handleTicketToggle = (ticketId: string) => {
    setSelectedTickets(prev =>
      prev.includes(ticketId)
        ? prev.filter(id => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTickets.length === allTickets.length) {
      setSelectedTickets([]);
    } else {
      setSelectedTickets(allTickets.map((t: TicketData) => t._id));
    }
  };

  const handleCancel = async () => {
    const totalAmount = calculateSelectedAmount();

    console.log('single cancel datas', selectedTickets, totalAmount);
    if (selectedTickets.length === 0) {
      toast.error('Please select at least one ticket to cancel');
      return;
    }

    try {
      setCancelling(true);
      const totalAmount = calculateSelectedAmount();

      await cancelSingleTicket(selectedTickets, totalAmount);

      toast.success(`${selectedTickets.length} ticket(s) cancelled successfully`);
      onSuccess();
      onClose();
    } catch (error: unknown) {
      console.error('Cancellation failed:', error);
      toast.error('Failed to cancel tickets');
    } finally {
      setCancelling(false);
    }
  };

  const selectedAmount = calculateSelectedAmount();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md flex flex-col max-h-[90vh]">
        {/* Header - Fixed */}
        <div className="p-6 border-b flex-shrink-0">
          <h2 className={`${lexendMedium.className} text-xl font-bold text-gray-900 mb-2`}>
            Cancel Tickets
          </h2>
          <p className={`${lexendSmall.className} text-gray-600`}>
            Select tickets you want to cancel
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Select All Option */}
            {allTickets.length > 1 && (
              <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                <span className={`${lexendMedium.className} text-gray-700`}>
                  Select All Tickets ({allTickets.length})
                </span>
                <input
                  type="checkbox"
                  checked={selectedTickets.length === allTickets.length && allTickets.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </div>
            )}

            {/* Individual Tickets */}
            <div className="space-y-3">
              {allTickets.map((ticket: TicketData) => {
                let basePrice = ticket.price;

                if (ticket.coupon && ticket.coupon.discountPercentage) {
                  const discountAmount = (basePrice * ticket.coupon.discountPercentage) / 100;
                  basePrice=basePrice-discountAmount

                }
                const tax = ticket.price * 0.18;
                const convenience = ticket.price * 0.05;
                const totalPrice = basePrice + tax + convenience;

                return (
                  <div
                    key={ticket._id}
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${selectedTickets.includes(ticket._id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                    onClick={() => handleTicketToggle(ticket._id)}
                  >
                    <div className="flex-1">
                      <div className={`${lexendMedium.className} text-gray-900`}>
                        Seat {ticket.seatRow}{ticket.seatNumber}
                      </div>
                      <div className={`${lexendSmall.className} text-gray-600`}>
                        {ticket.seatType} • ₹{Math.round(totalPrice)}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedTickets.includes(ticket._id)}
                      onChange={() => handleTicketToggle(ticket._id)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="p-6 border-t bg-gray-50 flex-shrink-0">
          {selectedTickets.length > 0 && (
            <div className="mb-4 p-3 bg-white rounded-lg border">
              <div className={`${lexendSmall.className} text-gray-600`}>
                Cancellation Summary:
              </div>
              <div className={`${lexendMedium.className} text-gray-900`}>
                {selectedTickets.length} ticket(s) - ₹{Math.round(selectedAmount)}
              </div>
              <div className={`${lexendSmall.className} text-gray-500 mt-1`}>
                Refund amount depends on cancellation time
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className={`${lexendMedium.className} flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors`}
            >
              Cancel
            </button>
            <button
              onClick={handleCancel}
              disabled={selectedTickets.length === 0 || cancelling}
              className={`${lexendMedium.className} flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {cancelling
                ? 'Cancelling...'
                : `Cancel ${selectedTickets.length || ''} Ticket${selectedTickets.length !== 1 ? 's' : ''}`
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleTicketCancellationModal;

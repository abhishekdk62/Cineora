// components/GroupInviteModal.tsx
import React, { useState } from "react";
import { X, Users, Clock, MapPin, Calendar } from "lucide-react";

interface GroupInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSeats: string[];
  showtimeData: any;
  getSeatPrice: (seatId: string) => number;
  getSeatType: (seatId: string) => string;
  totalAmount: number;
  onCreateInvite: (inviteData: any) => void;
  lexendMediumClassName: string;
  lexendSmallClassName: string;
  lexendBoldClassName: string;
}// Updated GroupInviteModal.tsx - Much simpler!
export default function GroupInviteModal({
  isOpen,
  onClose,
  selectedSeats,
  showtimeData,
  getSeatPrice,
  getSeatType,
  totalAmount,
  onCreateInvite,
  lexendMediumClassName,
  lexendSmallClassName,
  lexendBoldClassName
}: GroupInviteModalProps) {
  const [minRating, setMinRating] = useState<number | undefined>();

  // Host will pay for FIRST seat only
  const hostSeat = selectedSeats[0];
  const hostSeatPrice = getSeatPrice(hostSeat);
  const availableSeats = selectedSeats.slice(1); // Remaining seats for others

  const handleCreateInvite = () => {
    const selectedSeatsWithDetails = selectedSeats.map(seatId => ({
      seatNumber: seatId,
      seatType: getSeatType(seatId) as 'VIP' | 'Premium' | 'Normal',
      price: getSeatPrice(seatId)
    }));

    const inviteData = {
      showtimeId: showtimeData._id,
      movieId: showtimeData.movieId._id,
      theaterId: showtimeData.theaterId._id,
      screenId: showtimeData.screenId._id,
      selectedSeats: selectedSeatsWithDetails,
      totalSlotsRequested: selectedSeats.length, // Total seats
      minRequiredRating: minRating
    };

    onCreateInvite(inviteData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl border border-gray-600/30 max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className={`${lexendBoldClassName} text-white text-xl`}>
            Create Group Invite
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Movie Info */}
        <div className="mb-6 p-4 rounded-xl bg-black/30 border border-gray-600/20">
          <p className={`${lexendMediumClassName} text-white text-sm mb-1`}>
            {showtimeData.movieId.title}
          </p>
          <p className={`${lexendSmallClassName} text-gray-300 text-sm`}>
            {showtimeData.theaterId.name} • {showtimeData.showTime}
          </p>
        </div>

        {/* Host Payment Info */}
        <div className="mb-4 p-4 rounded-xl bg-green-500/10 border border-green-500/30">
          <p className={`${lexendMediumClassName} text-green-300 text-sm mb-2`}>
            Your Seat & Payment
          </p>
          <div className="flex items-center justify-between">
            <span className={`${lexendSmallClassName} text-green-200`}>
              Seat {hostSeat} ({getSeatType(hostSeat)})
            </span>
            <span className={`${lexendMediumClassName} text-green-200`}>
              ₹{hostSeatPrice}
            </span>
          </div>
          <p className={`${lexendSmallClassName} text-green-400 text-xs mt-1`}>
            You'll pay for this seat when creating the invite
          </p>
        </div>

        {/* Available Seats for Others */}
        <div className="mb-6 p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
          <p className={`${lexendMediumClassName} text-purple-300 text-sm mb-2`}>
            Available for Others
          </p>
          <div className="space-y-1">
            {availableSeats.map((seatId, index) => (
              <div key={seatId} className="flex items-center justify-between">
                <span className={`${lexendSmallClassName} text-purple-200`}>
                  Seat {seatId} ({getSeatType(seatId)})
                </span>
                <span className={`${lexendSmallClassName} text-purple-200`}>
                  ₹{getSeatPrice(seatId)}
                </span>
              </div>
            ))}
          </div>
          <p className={`${lexendSmallClassName} text-purple-400 text-xs mt-2`}>
            {availableSeats.length} seat{availableSeats.length > 1 ? 's' : ''} available for others to join
          </p>
        </div>

        {/* Optional Rating Filter */}
        <div className="mb-6">
          <label className={`${lexendMediumClassName} text-white text-sm block mb-2`}>
            Minimum Rating Required (Optional)
          </label>
          <select
            value={minRating || ''}
            onChange={(e) => setMinRating(e.target.value ? Number(e.target.value) : undefined)}
            className="w-full bg-black/30 border border-gray-600/30 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
          >
            <option value="">Anyone can join</option>
            <option value="3">3.0+ Stars</option>
            <option value="3.5">3.5+ Stars</option>
            <option value="4">4.0+ Stars</option>
            <option value="4.5">4.5+ Stars</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className={`${lexendMediumClassName} flex-1 border border-gray-600 text-gray-300 hover:bg-gray-800 py-3 rounded-xl transition-all duration-200`}
          >
            Cancel
          </button>
          <button
            onClick={handleCreateInvite}
            className={`${lexendMediumClassName} flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2`}
          >
            <Users className="w-5 h-5" />
            Pay ₹{hostSeatPrice} & Create
          </button>
        </div>
      </div>
    </div>
  );
}

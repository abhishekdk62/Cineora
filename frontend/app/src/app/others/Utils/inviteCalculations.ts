// utils/inviteCalculations.ts

interface SeatInfo {
  nextSeatIndex: number;
  nextSeat: any;
  actualPriceForJoiner: number;
  priceBreakdown: {
    originalPrice: number;
    discountAmount: number;
    discountedPrice: number;
    convenienceFee: number;
    tax: number;
    finalAmount: number;
  };
}

export const calculateJoinerSeatPrice = (invite: GroupInvite): SeatInfo => {
  // Find the next available seat index
  const participantsCount = invite.participants.length;
  const nextSeatIndex = participantsCount; // Next seat to be assigned
  const nextSeat = invite.requestedSeats[nextSeatIndex];

  if (!nextSeat) {
    throw new Error('No available seats');
  }

  // Get the original price for this specific seat
  const originalPrice = nextSeat.price;

  // Calculate discount if coupon is applied
  let discountAmount = 0;
  let discountedPrice = originalPrice;

  if (invite.couponUsed) {
    discountAmount = Math.round((originalPrice * invite.couponUsed.discountPercentage) / 100);
    discountedPrice = originalPrice - discountAmount;
  }

  // Calculate fees on original price (not discounted)
  const convenienceFee = Math.round((originalPrice * 5) / 100); // 5% of original
  const tax = Math.round((originalPrice * 18) / 100); // 15% of original

  // Final amount = discounted price + fees
  const finalAmount = discountedPrice + convenienceFee + tax;

  return {
    nextSeatIndex,
    nextSeat,
    actualPriceForJoiner: finalAmount,
    priceBreakdown: {
      originalPrice,
      discountAmount,
      discountedPrice,
      convenienceFee,
      tax,
      finalAmount
    }
  };
};

export const getOccupiedSeats = (invite: GroupInvite): string[] => {
  return invite.participants.map(participant => participant.seatAssigned);
};

export const getAvailableSeats = (invite: GroupInvite): any[] => {
  const occupiedSeats = getOccupiedSeats(invite);
  return invite.requestedSeats.filter(seat => !occupiedSeats.includes(seat.seatNumber));
};

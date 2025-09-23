
interface SeatInfo {
  nextSeatIndex: number;
  nextSeat: string | null;
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
  const availableSeats = getAvailableSeats(invite);

  if (availableSeats.length === 0) {
      if (availableSeats.length === 0) {
    return {
      nextSeatIndex: -1,
      nextSeat: null,
      actualPriceForJoiner: 0,
      priceBreakdown: {
        originalPrice: 0,
        discountAmount: 0,
        discountedPrice: 0,
        convenienceFee: 0,
        tax: 0,
        finalAmount: 0,
      },
    };
  }

  }

  const nextSeat = availableSeats[0];
  const nextSeatIndex = invite.requestedSeats.findIndex(
    seat => seat.seatNumber === nextSeat.seatNumber
  );

  const originalPrice = nextSeat.price;

  let discountAmount = 0;
  let discountedPrice = originalPrice;

  if (invite.couponUsed) {
    discountAmount = Math.round(
      (originalPrice * invite.couponUsed.discountPercentage) / 100
    );
    discountedPrice = originalPrice - discountAmount;
  }

  const convenienceFee = Math.round((originalPrice * 5) / 100); 
  const tax = Math.round((originalPrice * 18) / 100); 

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
      finalAmount,
    },
  };
};

export const getOccupiedSeats = (invite: GroupInvite): string[] => {
  return invite.participants.map((participant) => participant.seatAssigned);
};

export const getAvailableSeats = (invite: GroupInvite): GroupInvite[] => {
  const occupiedSeats = getOccupiedSeats(invite);
  return invite.requestedSeats.filter(
    (seat) => !occupiedSeats.includes(seat.seatNumber)
  );
};

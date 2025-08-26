import { SeatStatus } from "@/app/book/tickets/[showtimeId]/page";
import React from "react";
interface Seat {
  col: number;
  id: string;
  type: string;
  price: number;
}
interface SeatButtonProps {
  seat: Seat;
  status: SeatStatus;
  style: string;
  price: number;
  onClick: (id: string) => void;
}
export default function SeatButton({ seat, status, style, price, onClick }: SeatButtonProps) {
  return (
    <button
      type="button"
      className={style}
      disabled={status === "booked" || status === "blocked"}
      title={`${seat.id} - ${seat.type} - ₹${price}`}
      onClick={() => onClick(seat.id)}
    >
      {seat.id.slice(-1)}
    </button>
  );
}

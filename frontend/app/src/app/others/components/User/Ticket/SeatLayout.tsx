import React from "react";
import SeatRow from "./SeatRow";
import { Row, SeatStatus } from "@/app/book/tickets/[showtimeId]/page";

interface SeatLayoutProps {
  rows: Row[];
  seatStatuses: Record<string, SeatStatus>;
  onSeatClick: (id: string) => void;
  getSeatButtonStyle: (status: SeatStatus, seatType?: string) => string;
  getSeatPrice: (id: string) => number;
  lexendMediumClassName: string;
  maxCols: number;
}

export default function SeatLayout({
  rows, seatStatuses, onSeatClick, getSeatButtonStyle, getSeatPrice, lexendMediumClassName, maxCols,
}: SeatLayoutProps) {
  return (
    <div className="mb-8 overflow-x-auto">
      <div className="flex flex-col items-center space-y-2">
        {rows.map(row => (
          <SeatRow
            key={row.rowLabel}
            row={row}
            seatStatuses={seatStatuses}
            onSeatClick={onSeatClick}
            getSeatButtonStyle={getSeatButtonStyle}
            getSeatPrice={getSeatPrice}
            lexendMediumClassName={lexendMediumClassName}
            maxCols={maxCols}
          />
        ))}
      </div>
    </div>
  );
}

import React from "react";
import { Row, SeatStatus } from "@/app/book/tickets/[showtimeId]/page";

interface SeatRowProps {
  row: Row;
  seatStatuses: Record<string, SeatStatus>;
  onSeatClick: (id: string) => void;
  getSeatButtonStyle: (status: SeatStatus, seatType?: string) => string;
  getSeatPrice: (id: string) => number;
  lexendMediumClassName: string;
  maxCols: number;
  verticalAisles?: Array<{ position: number; width: number }>;
}

const SeatBox = ({ 
  status, 
  seatType, 
  onClick, 
  disabled = false 
}: {
  status: SeatStatus;
  seatType?: string;
  onClick?: () => void;
  disabled?: boolean;
}) => {
  const getBoxColor = () => {
    switch (status) {
      case 'booked':
        return '#595959'; 
      case 'selected':
        if (seatType === 'VIP') return '#EAB308'; 
        if (seatType === 'Premium') return '#9333EA'; 
        return '#06B6D4'; 
      case 'available':
        return '#F1F5F9'; 
      case 'blocked':
        return '#374151'; 
      default:
        return '#64748B';
    }
  };

  const getBorderColor = () => {
    switch (status) {
      case 'booked':
        return '#404040'; 
      case 'selected':
        if (seatType === 'VIP') return '#CA8A04'; 
        if (seatType === 'Premium') return '#7C3AED';
        return '#0891B2'; 
      case 'available':
        if (seatType === 'VIP') return '#CA8A04'; 
        if (seatType === 'Premium') return '#7C3AED';
        return '#0891B2';  
      case 'blocked':
        return '#1F2937';
      default:
        return '#475569';
    }
  };

  return (
    <div 
      className="w-6 h-6 rounded cursor-pointer transition-all duration-150 hover:scale-105 border"
      onClick={!disabled ? onClick : undefined}
      style={{ 
        backgroundColor: getBoxColor(),
        borderColor: getBorderColor(),
        opacity: disabled ? 0.7 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        borderWidth: '1px',
      }}
    />
  );
};

// CORRECTED: Vertical aisle logic - position 14 means aisle at column 14
const isVerticalAisle = (col: number, verticalAisles: Array<{ position: number; width: number }>) => {
  if (!verticalAisles || verticalAisles.length === 0) return false;
  return verticalAisles.some((aisle) => 
    col >= aisle.position && col < aisle.position + aisle.width
  );
};

export default function SeatRow({
  row, 
  seatStatuses, 
  onSeatClick, 
  getSeatButtonStyle, 
  getSeatPrice, 
  lexendMediumClassName, 
  maxCols,
  verticalAisles = []
}: SeatRowProps) {

  return (
    <div className="flex items-center gap-1 py-0.5">
      {/* Row Label - Left */}
      <div 
        className={`${lexendMediumClassName} text-white/70 text-xs w-4 h-4 rounded-sm flex items-center justify-center`}
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          fontSize: '10px',
        }}
      >
        {row.rowLabel}
      </div>

      {/* Seats Grid */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${maxCols}, 24px)`,
          gap: "3px",
        }}
      >
        {Array.from({ length: maxCols }).map((_, colIndex) => {
          // Check if this column is a vertical aisle (position 14)
          if (isVerticalAisle(colIndex, verticalAisles)) {
            return (
              <div
                key={`aisle-${colIndex}`}
                className="w-6 h-6"
                // Empty space for vertical aisle
              />
            );
          }

          // Empty space for offset
          if (colIndex < (row.offset || 0)) {
            return <div key={`offset-${colIndex}`} className="w-6 h-6" />;
          }

          // Find the seat at this position
          const seatIndex = colIndex - (row.offset || 0);
          const seat = row.seats[seatIndex];
          
          if (seat) {
            const status = seatStatuses[seat.id] || "available";
            const isDisabled = status === 'booked' || status === 'blocked';
            
            return (
              <SeatBox
                key={seat.id}
                status={status}
                seatType={seat.type}
                onClick={() => !isDisabled && onSeatClick(seat.id)}
                disabled={isDisabled}
              />
            );
          }
          
          // Empty space for remaining columns
          return <div key={`empty-${colIndex}`} className="w-6 h-6" />;
        })}
      </div>

      <div 
        className={`${lexendMediumClassName} text-white/70 text-xs w-4 h-4 rounded-sm flex items-center justify-center`}
        style={{
          background: 'rgba(255, 255, 2023-09-13T06:49:26.471Z)',
          fontSize: '10px',
        }}
      >
        {row.rowLabel}
      </div>
    </div>
  );
}

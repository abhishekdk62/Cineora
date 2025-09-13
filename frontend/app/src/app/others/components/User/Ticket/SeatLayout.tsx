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
  aisles?: {
    vertical?: Array<{ position: number; width: number }>;
    horizontal?: Array<{ afterRow: number; width: number }>;
  };
}

export default function SeatLayout({
  rows, 
  seatStatuses, 
  onSeatClick, 
  getSeatButtonStyle, 
  getSeatPrice, 
  lexendMediumClassName, 
  maxCols,
  aisles
}: SeatLayoutProps) {
  
  const renderRowsWithHorizontalAisles = (): React.ReactNode[] => {
    const result: React.ReactNode[] = [];
    const horizontalAisles = aisles?.horizontal || [];
    
    rows.forEach((row, index) => {
      // Add the regular seat row
      result.push(
        <SeatRow
          key={row.rowLabel}
          row={row}
          seatStatuses={seatStatuses}
          onSeatClick={onSeatClick}
          getSeatButtonStyle={getSeatButtonStyle}
          getSeatPrice={getSeatPrice}
          lexendMediumClassName={lexendMediumClassName}
          maxCols={maxCols}
          verticalAisles={aisles?.vertical}
        />
      );
      
      // Check if there's a horizontal aisle after this row (afterRow is 1-based)
      const horizontalAisle = horizontalAisles.find(aisle => aisle.afterRow === (index + 1));
      if (horizontalAisle) {
        // Add MINIMAL horizontal aisle - just empty space, same height as space-y-2 gap
        for (let i = 0; i < horizontalAisle.width; i++) {
          result.push(
            <div 
              key={`h-aisle-${row.rowLabel}-${i}`} 
              style={{ 
                height: '8px', // Same as space-y-2 gap (0.5rem = 8px)
                width: '100%'
              }}
            />
          );
        }
      }
    });
    
    return result;
  };

  return (
    <div className="mb-8 overflow-x-auto">
      <div className="flex flex-col items-center space-y-2">
        {renderRowsWithHorizontalAisles()}
      </div>
    </div>
  );
}

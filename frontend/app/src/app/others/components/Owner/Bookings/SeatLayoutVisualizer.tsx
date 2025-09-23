
"use client";

import React from "react";
import { Lexend } from "next/font/google";

const lexendMedium = Lexend({ weight: "500", subsets: ["latin"] });

interface SeatLayoutVisualizerProps {
  totalSeats: number;
  bookedSeats: string[];
  lexendSmall: string;
  showtime?: string; 
}

const SeatLayoutVisualizer: React.FC<SeatLayoutVisualizerProps> = ({
  totalSeats,
  bookedSeats,
  lexendSmall,
  showtime,
}) => {
  const getActualSeatLayout = () => {
    if (showtime?.screenId?.layout?.advancedLayout?.rows) {
      const layout = showtime.screenId.layout.advancedLayout;
      
      const maxCols = Math.max(...layout.rows.map((row: string) => 
        (row.offset || 0) + (row.seats?.length || 0) + 2 
      ));
      
      return {
        rows: layout.rows.map((row: string) => ({
          rowLabel: row.rowLabel,
          offset: row.offset || 0,
          seats: row.seats.map((seat: string) => ({
            id: seat.id,
            type: seat.type,
            price: seat.price,
            col: seat.col, 
            isBooked: bookedSeats.includes(seat.id),
            isBlocked: showtime.blockedSeats?.includes(seat.id) || false
          }))
        })),
        maxCols
      };
    }
    
    return generateSeatLayout();
  };

  const generateSeatLayout = () => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seatsPerRow = Math.ceil(totalSeats / rows.length);
    const maxCols = seatsPerRow + 2;
    const layout = { rows: [], maxCols };

    for (let i = 0; i < rows.length; i++) {
      const rowSeats = [];
      const seatsInThisRow = Math.min(seatsPerRow, totalSeats - (i * seatsPerRow));
      
      if (seatsInThisRow <= 0) break;
      
      for (let j = 1; j <= seatsInThisRow; j++) {
        const seatId = `${rows[i]}${j}`;
        const isBooked = bookedSeats.includes(seatId);
        
        let seatType = 'Normal';
        let price = 150;
        
        if (i >= 0 && i <= 2) {
          seatType = 'Premium';
          price = 200;
        }
        if (i >= 6) {
          seatType = 'VIP'; 
          price = 300;
        }

        rowSeats.push({
          id: seatId,
          type: seatType,
          price: price,
          col: j, 
          isBooked: isBooked,
          isBlocked: false
        });
      }

      if (rowSeats.length > 0) {
        layout.rows.push({
          rowLabel: rows[i],
          offset: 1,
          seats: rowSeats
        });
      }
    }

    return layout;
  };

  const seatLayout = getActualSeatLayout();

  const getSeatBackgroundColor = (seat: string) => {
    if (seat.isBlocked) return '#dc2626'; 
    if (seat.isBooked) return '#dc2626';  
    
    switch (seat.type) {
      case 'VIP':
        return '#ffd700';  
      case 'Premium':
        return '#9333ea'; 
      case 'Normal':
      default:
        return '#6b7280'; 
    }
  };

  const getSeatTextColor = (seat: string) => {
    if (seat.isBlocked || seat.isBooked) return '#ffffff';
    return seat.type === 'VIP' ? '#1f2937' : '#ffffff';
  };

  const getSeatNumber = (seat: string) => {
    if (seat.col) return seat.col.toString();
    
    const match = seat.id.match(/\d+$/);
    return match ? match[0] : seat.id.slice(-1);
  };

  return (
    <div className="space-y-3">
      <h3 className={`${lexendMedium.className} text-sm text-gray-300`}>
        Seat Layout
      </h3>
      <div className="bg-white/5 border border-gray-500/30 rounded-xl p-6">
        {/* Screen */}
        <div className="text-center mb-4">
          <div className="inline-block px-8 py-2 bg-white/10 rounded text-gray-300 text-sm font-medium">
            SCREEN
          </div>
        </div>
        
        {/* Seat Grid with Proper Row Alignment */}
        <div className="flex flex-col items-center space-y-1">
          {seatLayout.rows.map((row: string) => (
            <div
              key={row.rowLabel}
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${seatLayout.maxCols}, 32px)`,
                gap: '4px',
              }}
            >
              {/* Offset spacing */}
              {Array.from({ length: row.offset }).map((_, idx) => (
                <div key={`offset-${row.rowLabel}-${idx}`} />
              ))}
              
              {/* Seats */}
              {row.seats.map((seat: string) => (
                <div
                  key={seat.id}
                  style={{
                    width: 28,
                    height: 28,
                    backgroundColor: getSeatBackgroundColor(seat),
                    color: getSeatTextColor(seat),
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: seat.col && seat.col >= 10 ? 8 : 10, 
                    fontWeight: 'bold',
                  }}
                  title={`${seat.id}: ${seat.type} @ Rs.${seat.price} ${
                    seat.isBlocked ? '(Blocked)' : seat.isBooked ? '(Booked)' : '(Available)'
                  }`}
                >
                  {getSeatNumber(seat)}
                </div>
              ))}
              
              {/* Row Label */}
              <div className="flex items-center justify-center text-gray-400 text-xs font-medium">
                {row.rowLabel}
              </div>
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="flex justify-center gap-6 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-500 rounded"></div>
            <span className="text-gray-400">Normal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-600 rounded"></div>
            <span className="text-gray-400">Premium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-gray-400">VIP</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 rounded"></div>
            <span className="text-gray-400">Booked/Blocked</span>
          </div>
        </div>

        {/* Stats */}
        <div className="text-center pt-4 border-t border-gray-500/30">
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div>
              <p className={`${lexendSmall.className} text-gray-400 text-sm`}>Total</p>
              <p className={`${lexendSmall.className} text-white font-medium`}>{totalSeats}</p>
            </div>
            <div>
              <p className={`${lexendSmall.className} text-gray-400 text-sm`}>Booked</p>
              <p className={`${lexendSmall.className} text-red-400 font-medium`}>{bookedSeats.length}</p>
            </div>
            <div>
              <p className={`${lexendSmall.className} text-gray-400 text-sm`}>Available</p>
              <p className={`${lexendSmall.className} text-green-400 font-medium`}>{totalSeats - bookedSeats.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatLayoutVisualizer;

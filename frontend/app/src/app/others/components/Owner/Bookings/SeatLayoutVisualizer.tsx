"use client";

import React from "react";
import { Lexend } from "next/font/google";
import type { Row, Seat } from "@/app/others/dtos/showtime.dto";
import type { NextFontInstance, OwnerShowtimeBooking } from "@/app/others/types";
import { isPopulatedRef } from "@/app/others/types";

const lexendMedium = Lexend({ weight: "500", subsets: ["latin"] });

interface ProcessedSeat extends Seat {
  isBooked: boolean;
  isBlocked: boolean;
}

interface ProcessedRow {
  rowLabel: string;
  offset: number;
  seats: ProcessedSeat[];
}

interface SeatLayout {
  rows: ProcessedRow[];
  maxCols: number;
}

interface SeatLayoutVisualizerProps {
  totalSeats: number;
  bookedSeats: string[];
  lexendSmall: NextFontInstance;
  showtime?: OwnerShowtimeBooking;
}

const SeatLayoutVisualizer: React.FC<SeatLayoutVisualizerProps> = ({
  totalSeats,
  bookedSeats,
  lexendSmall,
  showtime,
}) => {
  const getActualSeatLayout = (): SeatLayout | null => {
    const screenId = showtime?.screenId;
    if (!isPopulatedRef(screenId) || !screenId.layout?.advancedLayout?.rows) {
      return null;
    }

    const layout = screenId.layout.advancedLayout;

    const maxCols = Math.max(
      ...layout.rows.map(
        (row: Row) => (row.offset || 0) + (row.seats?.length || 0) + 2
      )
    );

    return {
      rows: layout.rows.map((row: Row) => ({
        rowLabel: row.rowLabel,
        offset: row.offset || 0,
        seats: row.seats.map((seat: Seat) => ({
          id: seat.id,
          type: seat.type,
          price: seat.price,
          col: seat.col,
          isBooked: bookedSeats.includes(seat.id),
          isBlocked: Array.isArray(showtime?.blockedSeats)
            ? showtime.blockedSeats.some((b) => (typeof b === 'string' ? b : b.seatId) === seat.id)
            : typeof showtime?.blockedSeats === 'string'
              ? showtime.blockedSeats.includes(seat.id)
              : false,
        })),
      })),
      maxCols,
    };
  };

  const generateSeatLayout = (): SeatLayout => {
    const rowLabels = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const seatsPerRow = Math.ceil(totalSeats / rowLabels.length);
    const maxCols = seatsPerRow + 2;
    const rows: ProcessedRow[] = [];

    for (let i = 0; i < rowLabels.length; i++) {
      const rowSeats: ProcessedSeat[] = [];
      const seatsInThisRow = Math.min(seatsPerRow, totalSeats - i * seatsPerRow);

      if (seatsInThisRow <= 0) break;

      for (let j = 1; j <= seatsInThisRow; j++) {
        const seatId = `${rowLabels[i]}${j}`;
        const isBooked = bookedSeats.includes(seatId);

        let seatType = "Normal";
        let price = 150;

        if (i >= 0 && i <= 2) {
          seatType = "Premium";
          price = 200;
        }
        if (i >= 6) {
          seatType = "VIP";
          price = 300;
        }

        rowSeats.push({
          id: seatId,
          type: seatType,
          price,
          col: j,
          isBooked,
          isBlocked: false,
        });
      }

      if (rowSeats.length > 0) {
        rows.push({
          rowLabel: rowLabels[i],
          offset: 1,
          seats: rowSeats,
        });
      }
    }

    return { rows, maxCols };
  };

  const seatLayout = getActualSeatLayout() ?? generateSeatLayout();

  const getSeatBackgroundColor = (seat: ProcessedSeat) => {
    if (seat.isBlocked) return "#dc2626";
    if (seat.isBooked) return "#dc2626";

    switch (seat.type) {
      case "VIP":
        return "#ffd700";
      case "Premium":
        return "#9333ea";
      case "Normal":
      default:
        return "#6b7280";
    }
  };

  const getSeatTextColor = (seat: ProcessedSeat) => {
    if (seat.isBlocked || seat.isBooked) return "#ffffff";
    return seat.type === "VIP" ? "#1f2937" : "#ffffff";
  };

  const getSeatNumber = (seat: ProcessedSeat) => {
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
        <div className="text-center mb-4">
          <div className="inline-block px-8 py-2 bg-white/10 rounded text-gray-300 text-sm font-medium">
            SCREEN
          </div>
        </div>

        <div className="flex flex-col items-center space-y-1">
          {seatLayout.rows.map((row: ProcessedRow) => (
            <div
              key={row.rowLabel}
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${seatLayout.maxCols}, 32px)`,
                gap: "4px",
              }}
            >
              {Array.from({ length: row.offset }).map((_, idx) => (
                <div key={`offset-${row.rowLabel}-${idx}`} />
              ))}

              {row.seats.map((seat: ProcessedSeat) => (
                <div
                  key={seat.id}
                  style={{
                    width: 28,
                    height: 28,
                    backgroundColor: getSeatBackgroundColor(seat),
                    color: getSeatTextColor(seat),
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: seat.col && seat.col >= 10 ? 8 : 10,
                    fontWeight: "bold",
                  }}
                  title={`${seat.id}: ${seat.type} @ Rs.${seat.price} ${
                    seat.isBlocked
                      ? "(Blocked)"
                      : seat.isBooked
                        ? "(Booked)"
                        : "(Available)"
                  }`}
                >
                  {getSeatNumber(seat)}
                </div>
              ))}

              <div className="flex items-center justify-center text-gray-400 text-xs font-medium">
                {row.rowLabel}
              </div>
            </div>
          ))}
        </div>

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
              <p className={`${lexendSmall.className} text-green-400 font-medium`}>
                {totalSeats - bookedSeats.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatLayoutVisualizer;

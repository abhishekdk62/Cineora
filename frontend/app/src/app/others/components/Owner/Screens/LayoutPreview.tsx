import React from 'react';
import { Lexend } from "next/font/google";

const lexendMedium = Lexend({ weight: "500", subsets: ["latin"] });

interface LayoutPreviewProps {
  advancedLayoutJSON: any;
  maxCols: number;
}

export const LayoutPreview: React.FC<LayoutPreviewProps> = ({
  advancedLayoutJSON,
  maxCols
}) => {
  return (
    <div className="space-y-3">
      <h3 className={`${lexendMedium.className} text-sm text-gray-300`}>
        Layout Preview
      </h3>
      <div className="bg-white/5 border border-gray-500/30 rounded-xl p-6">
        <div className="text-center mb-4">
          <div className="inline-block px-8 py-2 bg-white/10 rounded text-gray-300 text-sm font-medium">
            SCREEN
          </div>
        </div>
        
        {/* Fixed Preview with Proper Row Alignment */}
        <div className="flex flex-col items-center space-y-1">
          {advancedLayoutJSON.rows.map((row: any) => (
            <div
              key={row.rowLabel}
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${maxCols}, 32px)`,
                gap: '4px',
              }}
            >
              {/* Offset spacing */}
              {Array.from({ length: row.offset }).map((_, idx) => (
                <div key={`offset-${row.rowLabel}-${idx}`} />
              ))}
              {/* Seats */}
              {row.seats.map((seat: any) => (
                <div
                  key={seat.id}
                  style={{
                    width: 28,
                    height: 28,
                    backgroundColor:
                      seat.type === 'VIP'
                        ? '#ffd700'
                        : seat.type === 'Premium'
                        ? '#9333ea'
                        : '#6b7280',
                    color: seat.type === 'VIP' ? '#1f2937' : '#ffffff',
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10,
                    fontWeight: 'bold',
                  }}
                  title={`${seat.id}: ${seat.type} @ ₹${seat.price}`}
                >
                  {seat.id}
                </div>
              ))}
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
        </div>
      </div>
    </div>
  );
};

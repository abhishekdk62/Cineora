import React from 'react';
import { Lexend } from "next/font/google";

const lexendMedium = Lexend({ weight: "500", subsets: ["latin"] });

interface LayoutPreviewProps {
  advancedLayoutJSON: string;
  maxCols: number;
  showAisles?: boolean;
}

export const LayoutPreview: React.FC<LayoutPreviewProps> = ({
  advancedLayoutJSON,
  maxCols,
  showAisles = false
}) => {
  const aisles = advancedLayoutJSON.aisles || { vertical: [], horizontal: [] };

  const isVerticalAisle = (col: number) => {
    if (!showAisles || !aisles.vertical) return false;
    return aisles.vertical.some((aisle: string) => 
      col >= aisle.position && col < aisle.position + aisle.width
    );
  };

  // Create expanded rows list including horizontal aisles
  const createExpandedRows = () => {
    const expandedRows: string[] = [];
    
    advancedLayoutJSON.rows.forEach((row: string, rowIndex: number) => {
      // Add the regular seat row
      expandedRows.push({
        type: 'seats',
        data: row,
        originalIndex: rowIndex
      });
      
      // Check if we need to add horizontal aisle after this row
      if (showAisles && aisles.horizontal) {
        const horizontalAisle = aisles.horizontal.find((aisle: string) => 
          aisle.afterRow === rowIndex
        );
        
        if (horizontalAisle) {
          // Add horizontal aisle row(s) based on width
          for (let i = 0; i < horizontalAisle.width; i++) {
            expandedRows.push({
              type: 'horizontal-aisle',
              data: horizontalAisle,
              aisleRowIndex: i
            });
          }
        }
      }
    });
    
    return expandedRows;
  };

  const expandedRows = createExpandedRows();

  return (
    <div className="space-y-3">
      <h3 className={`${lexendMedium.className} text-sm text-gray-300`}>
        Layout Preview {showAisles && '(with Aisles)'}
      </h3>
      <div className="bg-white/5 border border-gray-500/30 rounded-xl p-6">
        <div className="text-center mb-4">
          <div className="inline-block px-8 py-2 bg-white/10 rounded text-gray-300 text-sm font-medium">
            SCREEN
          </div>
        </div>
        
        <div className="flex flex-col items-center space-y-1">
          {expandedRows.map((expandedRow, expandedIndex) => (
            <div key={`expanded-${expandedIndex}`}>
              {expandedRow.type === 'horizontal-aisle' ? (
                // SIMPLIFIED: All horizontal aisles are red
                <div 
                  className="w-full rounded bg-red-500"
                  style={{ 
                    width: `${maxCols * 32 + (maxCols - 1) * 4}px`,
                    height: '3px'
                  }}
                  title={`Horizontal aisle: ${expandedRow.data.label || 'Walkway'}`}
                />
              ) : (
                // Regular seat row
                <div
                  className="grid"
                  style={{
                    gridTemplateColumns: `repeat(${maxCols}, 32px)`,
                    gap: '4px',
                  }}
                >
                  {Array.from({ length: maxCols }).map((_, colIndex) => {
                    if (showAisles && isVerticalAisle(colIndex)) {
                      return (
                        <div
                          key={`aisle-${colIndex}`}
                          style={{ 
                            width: 28, 
                            height: 28,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Vertical Aisle"
                        >
                          {/* Vertical red line */}
                          <div 
                            className="rounded bg-red-500"
                            style={{
                              width: '3px',
                              height: '24px'
                            }}
                          />
                        </div>
                      );
                    }

                    // Empty space for offset
                    if (colIndex < expandedRow.data.offset) {
                      return <div key={`offset-${colIndex}`} style={{ width: 28, height: 28 }} />;
                    }

                    // Find the seat at this position
                    const seatIndex = colIndex - expandedRow.data.offset;
                    const seat = expandedRow.data.seats[seatIndex];
                    
                    if (seat) {
                      return (
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
                          {seat.col}
                        </div>
                      );
                    }
                    
                    return <div key={`empty-${colIndex}`} style={{ width: 28, height: 28 }} />;
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* SIMPLIFIED: Legend */}
        <div className="flex justify-center gap-4 mt-4 text-xs flex-wrap">
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
          {showAisles && (aisles.vertical.length > 0 || aisles.horizontal.length > 0) && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-red-500 rounded"></div>
              <span className="text-gray-400">Aisle</span>
            </div>
          )}
        </div>

        {/* Aisle Summary */}
        {showAisles && (aisles.vertical.length > 0 || aisles.horizontal.length > 0) && (
          <div className="mt-4 pt-3 border-t border-gray-500/30">
            <div className="text-center">
              <h4 className={`${lexendMedium.className} text-white text-sm mb-2`}>Configured Aisles</h4>
              <div className="flex justify-center gap-6 text-xs">
                {aisles.vertical.length > 0 && (
                  <div className="text-red-300">
                    <span className="font-medium">{aisles.vertical.length}</span> Vertical Aisles
                  </div>
                )}
                {aisles.horizontal.length > 0 && (
                  <div className="text-red-300">
                    <span className="font-medium">{aisles.horizontal.length}</span> Horizontal Aisles
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

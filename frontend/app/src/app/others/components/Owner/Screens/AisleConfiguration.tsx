import React from 'react';
import { Plus, Trash2, ArrowRight } from 'lucide-react';
import { Lexend } from "next/font/google";

const lexendMedium = Lexend({ weight: "500", subsets: ["latin"] });
const lexendSmall = Lexend({ weight: "400", subsets: ["latin"] });

interface VerticalAisle {
  id: string;
  position: number;
  width: number;
}

interface HorizontalAisle {
  id: string;
  afterRow: number;
  width: number;
}

interface AisleConfigurationProps {
  verticalAisles: VerticalAisle[];
  horizontalAisles: HorizontalAisle[];
  setVerticalAisles: React.Dispatch<React.SetStateAction<VerticalAisle[]>>;
  setHorizontalAisles: React.Dispatch<React.SetStateAction<HorizontalAisle[]>>;
  maxSeatsPerRow: number;
  maxRows: number;
}

export const AisleConfiguration: React.FC<AisleConfigurationProps> = ({
  verticalAisles,
  horizontalAisles,
  setVerticalAisles,
  setHorizontalAisles,
  maxSeatsPerRow,
  maxRows
}) => {
  const addVerticalAisle = () => {
    const newAisle: VerticalAisle = {
      id: `v-aisle-${Date.now()}`,
      position: Math.floor(maxSeatsPerRow / 2),
      width: 1
    };
    setVerticalAisles([...verticalAisles, newAisle]);
  };

  const addHorizontalAisle = () => {
    const newAisle: HorizontalAisle = {
      id: `h-aisle-${Date.now()}`,
      afterRow: Math.floor(maxRows / 2),
      width: 1
    };
    setHorizontalAisles([...horizontalAisles, newAisle]);
  };

  const updateVerticalAisle = (index: number, field: keyof VerticalAisle, value: string) => {
    const updated = [...verticalAisles];
    updated[index] = { ...updated[index], [field]: value };
    setVerticalAisles(updated);
  };

  const updateHorizontalAisle = (index: number, field: keyof HorizontalAisle, value: string) => {
    const updated = [...horizontalAisles];
    updated[index] = { ...updated[index], [field]: value };
    setHorizontalAisles(updated);
  };

  const removeVerticalAisle = (index: number) => {
    setVerticalAisles(verticalAisles.filter((_, i) => i !== index));
  };

  const removeHorizontalAisle = (index: number) => {
    setHorizontalAisles(horizontalAisles.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <h3 className={`${lexendMedium.className} text-lg text-white flex items-center gap-2`}>
        <ArrowRight className="w-5 h-5 text-red-500" />
        Aisle Configuration
      </h3>

      {/* Vertical Aisles */}
      <div className="bg-white/5 rounded-xl p-4 border border-gray-500/20">
        <div className="flex items-center justify-between mb-3">
          <h4 className={`${lexendSmall.className} text-white`}>
            Vertical Aisles
          </h4>
          <button
            type="button"
            onClick={addVerticalAisle}
            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm transition-colors flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            Add
          </button>
        </div>
        
        <div className="space-y-2">
          {verticalAisles.map((aisle, index) => (
            <div key={aisle.id} className="bg-white/10 rounded p-3">
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <label className="text-gray-400 text-xs">Position</label>
                  <input
                    type="number"
                    min="1"
                    max={maxSeatsPerRow}
                    value={aisle.position}
                    onChange={(e) => updateVerticalAisle(index, 'position', parseInt(e.target.value))}
                    className="w-full mt-1 px-2 py-1 bg-white/10 border border-gray-500/30 rounded text-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs">Width</label>
                  <select
                    value={aisle.width}
                    onChange={(e) => updateVerticalAisle(index, 'width', parseInt(e.target.value))}
                    className="w-full mt-1 px-2 py-1 bg-white/10 border border-gray-500/30 rounded text-white text-sm"
                  >
                    <option value={1}>1 Unit</option>
                    <option value={2}>2 Units</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removeVerticalAisle(index)}
                    className="w-full px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm transition-colors"
                  >
                    <Trash2 className="w-3 h-3 mx-auto" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {verticalAisles.length === 0 && (
            <p className={`${lexendSmall.className} text-gray-400 text-center py-4`}>
              No vertical aisles configured
            </p>
          )}
        </div>
      </div>

      {/* Horizontal Aisles */}
      <div className="bg-white/5 rounded-xl p-4 border border-gray-500/20">
        <div className="flex items-center justify-between mb-3">
          <h4 className={`${lexendSmall.className} text-white`}>
            Horizontal Aisles
          </h4>
          <button
            type="button"
            onClick={addHorizontalAisle}
            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm transition-colors flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            Add
          </button>
        </div>
        
        <div className="space-y-2">
          {horizontalAisles.map((aisle, index) => (
            <div key={aisle.id} className="bg-white/10 rounded p-3">
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <label className="text-gray-400 text-xs">After Row</label>
                  <input
                    type="number"
                    min="1"
                    max={maxRows}
                    value={aisle.afterRow}
                    onChange={(e) => updateHorizontalAisle(index, 'afterRow', parseInt(e.target.value))}
                    className="w-full mt-1 px-2 py-1 bg-white/10 border border-gray-500/30 rounded text-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs">Width</label>
                  <select
                    value={aisle.width}
                    onChange={(e) => updateHorizontalAisle(index, 'width', parseInt(e.target.value))}
                    className="w-full mt-1 px-2 py-1 bg-white/10 border border-gray-500/30 rounded text-white text-sm"
                  >
                    <option value={1}>1 Unit</option>
                    <option value={2}>2 Units</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removeHorizontalAisle(index)}
                    className="w-full px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm transition-colors"
                  >
                    <Trash2 className="w-3 h-3 mx-auto" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {horizontalAisles.length === 0 && (
            <p className={`${lexendSmall.className} text-gray-400 text-center py-4`}>
              No horizontal aisles configured
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

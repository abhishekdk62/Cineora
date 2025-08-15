import React from 'react';
import { Trash2 } from 'lucide-react';
import { Lexend } from "next/font/google";
import { RowDef } from './types';

const lexendSmall = Lexend({ weight: "400", subsets: ["latin"] });

interface RowConfigurationProps {
  rowsDefs: RowDef[];
  setRowsDefs: React.Dispatch<React.SetStateAction<RowDef[]>>;
}

export const RowConfiguration: React.FC<RowConfigurationProps> = ({
  rowsDefs,
  setRowsDefs
}) => {
  const updateRow = (i: number, key: keyof RowDef, val: any) => {
    setRowsDefs(defs => {
      const copy = [...defs];
      copy[i] = { ...copy[i], [key]: val };
      return copy;
    });
  };

  const addRow = () => {
    const nextLabel = String.fromCharCode(65 + rowsDefs.length);
    setRowsDefs(defs => [...defs, { 
      rowLabel: nextLabel, 
      seatCount: 10, 
      offset: 0, 
      type: 'Normal', 
      price: 150 
    }]);
  };

  const removeRow = (i: number) => {
    setRowsDefs(defs => defs.filter((_, idx) => idx !== i));
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-[80px_80px_80px_100px_100px_50px] gap-2 text-xs text-gray-400 font-medium">
        <span>Row</span>
        <span>Offset</span>
        <span>Seats</span>
        <span>Type</span>
        <span>Price (₹)</span>
        <span>Del</span>
      </div>
      
      {rowsDefs.map((def, i) => (
        <div key={i} className="grid grid-cols-[80px_80px_80px_100px_100px_50px] gap-2 items-center">
          <input
            value={def.rowLabel}
            onChange={e => updateRow(i, 'rowLabel', e.target.value)}
            className={`${lexendSmall.className} px-2 py-2 bg-white/10 border border-gray-500/30 rounded text-center text-white focus:outline-none focus:border-white/50`}
            maxLength={2}
          />
          <input
            type="number"
            min={0}
            value={def.offset}
            onChange={e => updateRow(i, 'offset', Number(e.target.value))}
            className={`${lexendSmall.className} px-2 py-2 bg-white/10 border border-gray-500/30 rounded text-center text-white focus:outline-none focus:border-white/50`}
          />
          <input
            type="number"
            min={1}
            value={def.seatCount}
            onChange={e => updateRow(i, 'seatCount', Number(e.target.value))}
            className={`${lexendSmall.className} px-2 py-2 bg-white/10 border border-gray-500/30 rounded text-center text-white focus:outline-none focus:border-white/50`}
          />
          <select
            value={def.type}
            onChange={e => updateRow(i, 'type', e.target.value)}
            className={`${lexendSmall.className} px-2 py-2 bg-white/10 border border-gray-500/30 rounded text-white focus:outline-none focus:border-white/50`}
          >
            <option value="Normal">Normal</option>
            <option value="Premium">Premium</option>
            <option value="VIP">VIP</option>
          </select>
          <input
            type="number"
            min={0}
            value={def.price}
            onChange={e => updateRow(i, 'price', Number(e.target.value))}
            className={`${lexendSmall.className} px-2 py-2 bg-white/10 border border-gray-500/30 rounded text-center text-white focus:outline-none focus:border-white/50`}
          />
          <button
            type="button"
            onClick={() => removeRow(i)}
            className="text-red-400 hover:text-red-300 text-xs"
            title="Remove Row"
          >
            <Trash2 />
          </button>
        </div>
      ))}
      
      <button
        type="button"
        onClick={addRow}
        className={`${lexendSmall.className} px-4 py-2 bg-white/10 hover:bg-white/20 border border-gray-500/30 rounded-xl text-white transition-all duration-300`}
      >
        + Add Row
      </button>
    </div>
  );
};

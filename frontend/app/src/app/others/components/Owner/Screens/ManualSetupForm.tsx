import React from 'react';
import { X, Grid, Zap, Plus, Trash2 } from 'lucide-react';
import { Lexend } from "next/font/google";
import { LayoutPreview } from './LayoutPreview';
import { RowConfiguration } from './RowConfiguration';
import { AisleConfiguration } from './AisleConfiguration';
import { FormData, ManualSetupFormProps, RowDef } from './types';

const lexendMedium = Lexend({ weight: "500", subsets: ["latin"] });
const lexendSmall = Lexend({ weight: "400", subsets: ["latin"] });

interface VerticalAisle {
  id: string;
  position: number;
  width: number;
  type: 'main' | 'side' | 'emergency';
  label?: string;
}

interface HorizontalAisle {
  id: string;
  afterRow: number;
  width: number;
  type: 'cross' | 'emergency';
  label?: string;
}



export const ManualSetupForm: React.FC<ManualSetupFormProps> = ({
  formData,
  errors,
  rowsDefs,
  setRowsDefs,
  maxCols,
  advancedLayoutJSON,
  handleInputChange,
  handleSubmit,
  isLoading,
  isFormValid,
  onClose,
  mode,
  setSetupMode,
  verticalAisles,
  horizontalAisles,
  setVerticalAisles,
  setHorizontalAisles
}) => {
  const addFeature = () => {
    const currentFeatures = formData.features || [];
    handleInputChange('features', [...currentFeatures, '']);
  };

  const updateFeature = (index: number, value: string) => {
    const currentFeatures = formData.features || [];
    const updatedFeatures = [...currentFeatures];
    updatedFeatures[index] = value;
    handleInputChange('features', updatedFeatures);
  };

  const removeFeature = (index: number) => {
    const currentFeatures = formData.features || [];
    const updatedFeatures = currentFeatures.filter((_, i) => i !== index);
    handleInputChange('features', updatedFeatures);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className={`${lexendMedium.className} text-lg text-white flex items-center gap-2`}>
          Basic Information
        </h3>
        
        <div>
          <label className={`${lexendSmall.className} text-sm text-gray-300 mb-2 block`}>
            Screen Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`${lexendSmall.className} w-full px-4 py-3 bg-white/10 border border-gray-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all duration-300`}
            placeholder="e.g., Screen 1, IMAX Hall, Premium Theater"
            maxLength={50}
          />
          {errors.name && (
            <p className="text-red-400 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className={`${lexendSmall.className} text-sm text-gray-300 mb-2 block`}>
            Screen Type
          </label>
          <select
            value={formData.screenType || ''}
            onChange={(e) => handleInputChange('screenType', e.target.value)}
            className={`${lexendSmall.className} w-full px-4 py-3 bg-white/10 border border-gray-500/30 rounded-xl text-white focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all duration-300`}
          >
            <option value="">Select Screen Type</option>
            <option value="Standard">Standard</option>
            <option value="IMAX">IMAX</option>
            <option value="4DX">4DX</option>
            <option value="Dolby Cinema">Dolby Cinema</option>
            <option value="IMAX 3D">IMAX 3D</option>
            <option value="Premium">Premium</option>
            <option value="VIP">VIP</option>
          </select>
        </div>

        <div>
          <label className={`${lexendSmall.className} text-sm text-gray-300 mb-2 block`}>
            Screen Features
          </label>
          <div className="space-y-2">
            {(formData.features || []).map((feature, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  className={`${lexendSmall.className} flex-1 px-3 py-2 bg-white/10 border border-gray-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/50`}
                  placeholder="e.g., Dolby Atmos, 3D, Recliner Seats"
                />
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addFeature}
              className={`${lexendSmall.className} flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 border border-gray-500/30 rounded-lg text-white transition-all duration-300`}
            >
              <Plus className="w-4 h-4" />
              Add Feature
            </button>
          </div>
        </div>
      </div>

      {/* Layout Configuration */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className={`${lexendMedium.className} text-lg text-white flex items-center gap-2`}>
            <Grid className="w-5 h-5" />
            Seating Layout Configuration
          </h3>
          {mode === 'create' && (
            <button
              type="button"
              onClick={() => setSetupMode('quickstart')}
              className={`${lexendSmall.className} px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-blue-400 transition-all duration-300 flex items-center gap-1`}
            >
              <Zap className="w-3 h-3" />
              Use Presets
            </button>
          )}
        </div>

        <RowConfiguration
          rowsDefs={rowsDefs} 
          setRowsDefs={setRowsDefs} 
        />

        <AisleConfiguration
          verticalAisles={verticalAisles}
          horizontalAisles={horizontalAisles}
          setVerticalAisles={setVerticalAisles}
          setHorizontalAisles={setHorizontalAisles}
          maxSeatsPerRow={formData.layout.seatsPerRow}
          maxRows={formData.layout.rows}
        />

        <LayoutPreview
          advancedLayoutJSON={advancedLayoutJSON} 
          maxCols={maxCols}
          showAisles={true} 
        />
      </div>

      {/* Layout Summary - SAME AS BEFORE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white/5 border border-gray-500/30 rounded-xl">
          <div className="text-center">
            <span className={`${lexendSmall.className} text-gray-300 block`}>
              Total Seats
            </span>
            <span className={`${lexendMedium.className} text-2xl text-white font-bold`}>
              {formData.totalSeats}
            </span>
          </div>
        </div>

        <div className="p-4 bg-white/5 border border-gray-500/30 rounded-xl">
          <div className="text-center">
            <span className={`${lexendSmall.className} text-gray-300 block`}>
              Total Rows
            </span>
            <span className={`${lexendMedium.className} text-2xl text-white font-bold`}>
              {formData.layout.rows}
            </span>
          </div>
        </div>

        <div className="p-4 bg-white/5 border border-gray-500/30 rounded-xl">
          <div className="text-center">
            <span className={`${lexendSmall.className} text-gray-300 block`}>
              Max Seats/Row
            </span>
            <span className={`${lexendMedium.className} text-2xl text-white font-bold`}>
              {formData.layout.seatsPerRow}
            </span>
          </div>
        </div>
      </div>

      {/* Seat Type Summary - SAME AS BEFORE */}
      <div className="p-4 bg-white/5 border border-gray-500/30 rounded-xl">
        <h4 className={`${lexendMedium.className} text-white mb-3`}>Seat Distribution</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          {['Normal', 'Premium', 'VIP'].map(type => {
            const count = rowsDefs
              .filter(row => row.type === type)
              .reduce((sum, row) => sum + row.seatCount, 0);
            
            const percentage = formData.totalSeats > 0 
              ? ((count / formData.totalSeats) * 100).toFixed(1)
              : '0';

            return (
              <div key={type} className="flex justify-between items-center">
                <span className={`${lexendSmall.className} text-gray-300`}>
                  {type} Seats:
                </span>
                <span className={`${lexendSmall.className} text-white font-medium`}>
                  {count} ({percentage}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Error Message - SAME AS BEFORE */}
      {errors.submit && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <p className="text-red-400 text-sm flex items-center gap-2">
            <X className="w-4 h-4" />
            {errors.submit}
          </p>
        </div>
      )}
    </form>
  );
};

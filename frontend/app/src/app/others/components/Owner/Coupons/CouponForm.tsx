"use client";
import React, { useState, useEffect } from "react";
import { DollarSign, Calendar, Tag, Info, Percent, MapPin, X, Save } from "lucide-react";

interface CouponFormProps {
  initialData?: any;
  theaterOptions: { id: string; name: string }[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
  saving: boolean;
  isEditing?: boolean;
}

const CouponForm: React.FC<CouponFormProps> = ({
  initialData,
  theaterOptions,
  onSubmit,
  onCancel,
  saving,
  isEditing = false,
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [uniqueId, setUniqueId] = useState(initialData?.uniqueId || "");
  const [theaterIds, setTheaterIds] = useState<string[]>(initialData?.theaterIds || []);
  const [discountPercentage, setDiscountPercentage] = useState(initialData?.discountPercentage || 10);
  const [description, setDescription] = useState(initialData?.description || "");
  const [expiryDate, setExpiryDate] = useState(() => {
    if (initialData?.expiryDate) {
      return initialData.expiryDate;
    }
    const future = new Date();
    future.setDate(future.getDate() + 30);
    return future.toISOString().substring(0, 10);
  });
  const [maxUsageCount, setMaxUsageCount] = useState(initialData?.maxUsageCount || 1);

  const [isFormValid, setIsFormValid] = useState(false);

  const toggleTheaterSelection = (id: string) => {
    if (theaterIds.includes(id)) {
      setTheaterIds(theaterIds.filter((tid) => tid !== id));
    } else {
      setTheaterIds([...theaterIds, id]);
    }
  };

  // Validate form fields to enable/disable submit button
  useEffect(() => {
    const valid =
      name.trim().length > 0 &&
      uniqueId.trim().length > 0 &&
      expiryDate.length > 0 &&
      theaterIds.length > 0 &&
      discountPercentage >= 1 &&
      discountPercentage <= 100 &&
      maxUsageCount >= 1 &&
      description.trim().length > 0;
    setIsFormValid(valid);
  }, [name, uniqueId, expiryDate, theaterIds, discountPercentage, maxUsageCount, description]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return; // safeguard

    onSubmit({
      name: name.trim(),
      uniqueId: uniqueId.trim().toUpperCase(),
      theaterIds,
      discountPercentage,
      description: description.trim(),
      expiryDate: new Date(expiryDate).toISOString(),
      maxUsageCount,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-white/20 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
              <Tag className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {isEditing ? "Edit Coupon" : "Create New Coupon"}
            </h3>
          </div>
          <button
            onClick={onCancel}
            disabled={saving}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-gray-300 font-medium flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-400" />
                Coupon Name*
              </label>
              <input
                type="text"
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Summer Special Discount"
                className="w-full p-4 rounded-xl bg-white/5 border border-white/20 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-white placeholder-gray-500 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-gray-300 font-medium flex items-center gap-2">
                <Tag className="w-4 h-4 text-blue-400" />
                Unique Code*
              </label>
              <input
                type="text"
                maxLength={20}
                value={uniqueId}
                onChange={(e) => setUniqueId(e.target.value.toUpperCase())}
                placeholder="SUMMER2024"
                className="w-full p-4 rounded-xl bg-white/5 border border-white/20 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-white placeholder-gray-500 transition-all uppercase font-mono"
              />
            </div>
          </div>

          {/* Discount and Usage */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-gray-300 font-medium flex items-center gap-2">
                <Percent className="w-4 h-4 text-green-400" />
                Discount %*
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                className="w-full p-4 rounded-xl bg-white/5 border border-white/20 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-white transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-gray-300 font-medium flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-yellow-400" />
                Max Usage Count
              </label>
              <input
                type="number"
                min={1}
                value={maxUsageCount}
                onChange={(e) => setMaxUsageCount(Number(e.target.value))}
                className="w-full p-4 rounded-xl bg-white/5 border border-white/20 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-white transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-gray-300 font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                Expiry Date*
              </label>
              <input
                type="date"
                value={expiryDate}
                min={new Date().toISOString().substring(0, 10)}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full p-4 rounded-xl bg-white/5 border border-white/20 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-white transition-all"
              />
            </div>
          </div>

          {/* Theaters Selection */}
          <div className="space-y-3">
            <label className="text-gray-300 font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-400" />
              Select Theaters* ({theaterIds.length} selected)
            </label>
            <div className="bg-white/5 border border-white/20 rounded-xl p-4 max-h-48 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {theaterOptions.map((theater) => (
                  <label
                    key={theater.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group"
                  >
                    <input
                      type="checkbox"
                      checked={theaterIds.includes(theater._id)}
                      onChange={() => toggleTheaterSelection(theater._id)}
                      className="h-4 w-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-gray-300 group-hover:text-white transition-colors">
                      {theater.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-gray-300 font-medium flex items-center gap-2">
              <Info className="w-4 h-4 text-gray-400" />
              Description*
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              placeholder="Add a detailed description of this coupon offer..."
              className="w-full p-4 rounded-xl bg-white/5 border border-white/20 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-white placeholder-gray-500 transition-all resize-none"
            />
            <div className="text-right text-xs text-gray-500">{description.length}/500 characters</div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="px-6 py-3 rounded-xl border border-white/20 text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !isFormValid}
              className={`px-8 py-3 rounded-xl border text-white font-semibold transition-all duration-300 flex items-center gap-2 ${
                isFormValid
                  ? "border-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  : "border-white/30 bg-white/10 cursor-not-allowed"
              } disabled:opacity-70`}
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {isEditing ? "Update Coupon" : "Create Coupon"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CouponForm;

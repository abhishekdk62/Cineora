"use client";

import React, { useState, useEffect, useMemo } from "react";
import { X, Monitor, Loader2 } from "lucide-react";
import { ITheater } from "@/app/others/types";
import { IScreen } from "@/app/others/types/screen.types";
import { Lexend } from "next/font/google";
import toast from "react-hot-toast";
import {
  ScreenFormModalProps,
  FormData,
  RowDef,
  ValidationErrors,
  VerticalAisle,
  HorizontalAisle,
} from "./types";
import { SetupModeToggle } from "./SetupModeToggle";
import { QuickStartTemplates } from "./QuickStartTemplates";
import { ManualSetupForm } from "./ManualSetupForm";
import { screenTemplates } from "./templateData";
import {
  createScreen,
  editScreenOwner,
} from "@/app/others/services/ownerServices/screenServices";
import { screenSchema } from "@/app/others/Utils/zodSchemas";

const lexendBold = Lexend({ weight: "700", subsets: ["latin"] });
const lexendMedium = Lexend({ weight: "500", subsets: ["latin"] });
const lexendSmall = Lexend({ weight: "400", subsets: ["latin"] });

const ScreenFormModal: React.FC<ScreenFormModalProps> = ({
  theater,
  onClose,
  onSuccess,
  mode,
  initialData,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    totalSeats: 0,
    features: [],
    screenType: "",
    layout: {
      rows: 0,
      seatsPerRow: 0,
      advancedLayout: {
        rows: [],
      },
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [setupMode, setSetupMode] = useState<"quickstart" | "manual">(
    "quickstart"
  );
  const [rowsDefs, setRowsDefs] = useState<RowDef[]>([
    { rowLabel: "A", seatCount: 10, offset: 0, type: "Normal", price: 150 },
    { rowLabel: "B", seatCount: 12, offset: 0, type: "Normal", price: 150 },
    { rowLabel: "C", seatCount: 14, offset: 0, type: "Premium", price: 200 },
    { rowLabel: "D", seatCount: 14, offset: 0, type: "Premium", price: 200 },
    { rowLabel: "E", seatCount: 16, offset: 0, type: "VIP", price: 300 },
  ]);

  const [verticalAisles, setVerticalAisles] = useState<VerticalAisle[]>([]);
  const [horizontalAisles, setHorizontalAisles] = useState<HorizontalAisle[]>([]);

  const maxCols = useMemo(() => {
    if (rowsDefs.length === 0) return 0;
    return Math.max(...rowsDefs.map((d) => d.offset + d.seatCount));
  }, [rowsDefs]);

  const advancedLayoutJSON = useMemo(
    () => ({
      rows: rowsDefs.map((def) => ({
        rowLabel: def.rowLabel,
        offset: def.offset,
        seats: Array.from({ length: def.seatCount }, (_, idx) => ({
          col: idx + 1,
          id: `${def.rowLabel}${idx + 1}`,
          type: def.type,
          price: def.price,
        })),
      })),
      aisles: {
        vertical: verticalAisles,
        horizontal: horizontalAisles,
      },
    }),
    [rowsDefs, verticalAisles, horizontalAisles]
  );

  const totalSeats = useMemo(() => {
    return rowsDefs.reduce((total, row) => total + row.seatCount, 0);
  }, [rowsDefs]);

  const convertScreenLayoutToRowsDefs = (screen: IScreen): RowDef[] => {
    if (!screen.layout?.advancedLayout?.rows) return [];

    return screen.layout.advancedLayout.rows.map((row: string, index: number) => {
      const seats = Array.isArray(row.seats) ? row.seats : [];

      let seatType = "Normal";
      let seatPrice = 150;

      if (seats.length > 0) {
        const firstSeat = seats;
        if (firstSeat && typeof firstSeat === 'object') {
          seatType = firstSeat.type || "Normal";
          seatPrice = firstSeat.price || 150;
        }
      }

      if (seatType === "Normal" && row.type) {
        seatType = row.type;
      }
      if (seatPrice === 150 && row.price) {
        seatPrice = row.price;
      }

      return {
        rowLabel: row.rowLabel || String.fromCharCode(65 + index),
        seatCount: seats.length,
        offset: row.offset || 0,
        type: seatType,
        price: seatPrice,
      };
    });
  };


  useEffect(() => {
    if (mode === "edit" && initialData) {
      const existingRowsDefs = convertScreenLayoutToRowsDefs(initialData);
      setRowsDefs(existingRowsDefs);

      const existingAisles = initialData.layout?.advancedLayout?.aisles;
      if (existingAisles) {
        setVerticalAisles(existingAisles.vertical);
        setHorizontalAisles(existingAisles.horizontal);
      } else {
        setVerticalAisles([]);
        setHorizontalAisles([]);
      }

      const baseAdvancedLayout = initialData.layout?.advancedLayout || { rows: [] };

      setFormData({
        name: initialData.name || "",
        features: initialData.features || [],
        screenType: initialData.screenType || "Standard",
        totalSeats: initialData.totalSeats || 0,
        layout: {
          rows: initialData.layout?.rows || 0,
          seatsPerRow: initialData.layout?.seatsPerRow || 0,
          advancedLayout: {
            ...baseAdvancedLayout,
            aisles: baseAdvancedLayout.aisles || {
              vertical: [],
              horizontal: []
            }
          },
        },
      });
      setSetupMode("manual");
    }
  }, [mode, initialData]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      totalSeats: totalSeats,
      layout: {
        ...prev.layout,
        rows: rowsDefs.length,
        seatsPerRow: rowsDefs.length > 0 ? Math.max(...rowsDefs.map((r) => r.seatCount)) : 0,
        advancedLayout: advancedLayoutJSON,
      },
    }));
  }, [totalSeats, rowsDefs, advancedLayoutJSON]);

  const handleInputChange = (
    field: string,
    value: string | number | string[]
  ) => {
    setFormData((prev: FormData) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev: ValidationErrors) => ({ ...prev, [field]: "" }));
    }
  };

  const applyTemplate = (templateIndex: number) => {
    const template = screenTemplates[templateIndex];
    setRowsDefs(template.layout);

    if (template.aisles) {
      setVerticalAisles(template.aisles.vertical || []);
      setHorizontalAisles(template.aisles.horizontal || []);
    } else {
      setVerticalAisles([]);
      setHorizontalAisles([]);
    }

    setSetupMode("manual");

    if (!formData.name.trim()) {
      setFormData((prev) => ({
        ...prev,
        name: `${template.name} Hall`,
      }));
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Simple manual validation
  if (!formData.name.trim()) {
    toast.error("Screen name is required");
    return;
  }

  if (!formData.screenType.trim()) {
    toast.error("Screen type is required");
    return;
  }

  if (formData.totalSeats === 0 || rowsDefs.length === 0) {
    toast.error("Please configure screen layout");
    return;
  }

  // Validation passed - proceed with API call
  setIsLoading(true);

  try {
    if (mode === "create") {
      await createScreen({ ...formData, theater });
      onSuccess();
      toast.success("Screen created successfully");
      onClose(); // ✅ Close only on success
    } else if (mode === "edit" && initialData?._id) {
      await editScreenOwner(initialData._id, {
        name: formData.name,
        totalSeats: formData.totalSeats,
        features: formData.features,
        screenType: formData.screenType,
        layout: formData.layout,
      });
      onSuccess();
      toast.success("Screen updated successfully");
      onClose(); // ✅ Close only on success
    }
  } catch (error: any) {
    console.error("Error saving screen:", error);
    
    const errorMessage =
      error?.response?.data?.message || 
      error?.message || 
      "Network error. Please try again.";
    
    toast.error(errorMessage);
    // Modal stays open for retry
  } finally {
    setIsLoading(false);
  }
};


  const isFormValid = () => {
    return (
      formData.name.trim().length > 0 &&
      formData.totalSeats > 0 &&
      rowsDefs.length > 0
    );
  };

  return (
    <div className="fixed inset-0 z-999 flex items-start justify-center pt-10 pb-10">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full pb-5 max-w-6xl mx-4 h-[90vh] max-h-[900px] min-h-[700px]">
        <div className="backdrop-blur-sm bg-black/90 rounded-3xl border border-gray-500/30 shadow-2xl h-full flex flex-col">
          {/* Header */}
          <div className="flex-shrink-0 p-6 pb-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <Monitor className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className={`${lexendBold.className} text-2xl text-white`}>
                    {mode === "create" ? "Create New Screen" : "Edit Screen"}
                  </h2>
                  <p className={`${lexendSmall.className} text-gray-400`}>
                    {theater?.name} • {theater?.city}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto px-6">
            {mode === "create" && (
              <SetupModeToggle
                setupMode={setupMode}
                setSetupMode={setSetupMode}
              />
            )}

            {setupMode === "quickstart" && mode === "create" ? (
              <QuickStartTemplates onApplyTemplate={applyTemplate} />
            ) : (
              <ManualSetupForm
                formData={formData}
                errors={errors}
                rowsDefs={rowsDefs}
                setRowsDefs={setRowsDefs}
                maxCols={maxCols}
                advancedLayoutJSON={advancedLayoutJSON}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
                isFormValid={isFormValid}
                onClose={onClose}
                mode={mode}
                setSetupMode={setSetupMode}
                verticalAisles={verticalAisles}
                horizontalAisles={horizontalAisles}
                setVerticalAisles={setVerticalAisles}
                setHorizontalAisles={setHorizontalAisles}
              />
            )}
          </div>

          {setupMode === "manual" && (
            <div className="flex-shrink-0 p-6 pt-4 border-t border-gray-500/30">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className={`${lexendMedium.className} flex-1 py-3 rounded-xl border border-gray-500/30 text-gray-300 hover:bg-white/10 transition-all duration-300 font-medium`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !isFormValid()}
                  className={`${lexendMedium.className} flex-1 bg-white text-black py-3 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {mode === "create"
                        ? "Creating Screen..."
                        : "Saving Changes..."}
                    </>
                  ) : mode === "create" ? (
                    "Create Screen"
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScreenFormModal;

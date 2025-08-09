"use client";

import React, { useEffect, useState } from "react";
import { Lexend } from "next/font/google";
import { X, Loader2 } from "lucide-react";
import BasicInfoFields from "./BasicInfoFields";
import LocationFields from "./LocationFields";
import FacilitiesFields from "./FacilitiesFields";
import {
  createTheater,
  updateTheaterOwner,
} from "@/app/others/services/ownerServices/theaterServices";
import toast from "react-hot-toast";

const lexendBold = Lexend({ weight: "700", subsets: ["latin"] });
const lexendMedium = Lexend({ weight: "500", subsets: ["latin"] });

interface Theater {
  _id: string;
  ownerId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  phone: string;
  facilities: string[];
  screens: number;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreateTheaterModalProps {
  onClose: () => void;
  onSuccess: (theater: Theater) => void;
  mode: "create" | "edit";
  initialData?: Theater;
}

interface ValidationErrors {
  [key: string]: string;
}

const TheaterFormModal: React.FC<CreateTheaterModalProps> = ({
  onClose,
  onSuccess,
  mode,
  initialData,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    facilities: [] as string[],
    location: {
      type: "Point" as const,
      coordinates: [0, 0] as [number, number],
    },
  });
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData(initialData);
    }
  }, [mode, initialData]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.name.trim()) newErrors.name = "Theater name is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Phone number must be 10 digits";
    }
    if (
      formData.location.coordinates[0] === 0 &&
      formData.location.coordinates[1] === 0
    ) {
      newErrors.location = "Location coordinates are required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const clearError = (field: string) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      let result;
      if (mode == "create") {
        result = await createTheater(formData);
      } else if (mode == "edit"&&initialData) {
        result = await updateTheaterOwner(initialData._id, formData);
      }

      if (result.success) {
        onSuccess(result.data);
        toast.success(`Succesfully ${mode}ed`)
      } else {
        console.log(result.message);
        

      }
    } catch (error) {
      console.error("Error creating theater:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.name.trim() &&
      formData.address.trim() &&
      formData.city.trim() &&
      formData.state.trim() &&
      formData.pincode.trim() &&
      formData.phone.trim() &&
      (formData.location.coordinates[0] !== 0 ||
        formData.location.coordinates[1] !== 0)
    );
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-10 pb-10">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl mx-4 h-[90vh] max-h-[800px] min-h-[600px]">
        <div className="backdrop-blur-sm bg-black/90 rounded-3xl border border-gray-500/30 shadow-2xl h-full flex flex-col">
          {/* Header */}
          <div className="flex-shrink-0 p-6 pb-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`${lexendBold.className} text-2xl text-white`}>
                {mode === "create" ? "Add New Theater" : "Edit Theater"}
              </h2>
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
            <form onSubmit={handleSubmit} className="space-y-6">
              <BasicInfoFields
                formData={formData}
                errors={errors}
                onChange={handleInputChange}
              />

              <LocationFields
                formData={formData}
                errors={errors}
                updateFormData={updateFormData}
                clearError={clearError}
              />

              <FacilitiesFields
                facilities={formData.facilities}
                updateFacilities={(facilities) =>
                  updateFormData({ facilities })
                }
              />
            </form>
          </div>

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
                      ? "Creating Theater..."
                      : "Saving Changes..."}
                  </>
                ) : mode === "create" ? (
                  "Create Theater"
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TheaterFormModal;

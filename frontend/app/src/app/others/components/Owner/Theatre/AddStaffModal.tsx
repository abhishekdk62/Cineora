"use client";

import React, { useState } from "react";
import { Lexend } from "next/font/google";
import { X, Loader2, User, Mail, Lock, Building2 } from "lucide-react";
import toast from "react-hot-toast";
import { createStaff } from "@/app/others/services/ownerServices/staffServices";

const lexendBold = Lexend({ weight: "700", subsets: ["latin"] });
const lexendMedium = Lexend({ weight: "500", subsets: ["latin"] });
const lexendRegular = Lexend({ weight: "400", subsets: ["latin"] });

interface Theater {
  _id: string;
  name: string;
  address: string;
  city: string;
  state: string;
}

interface Staff {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  ownerId: string;
  theaterId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AddStaffModalProps {
  onClose: () => void;
  onSuccess: (staff: Staff) => void;
  selectedTheater: Theater; 
}

interface ValidationErrors {
  [key: string]: string;
}

const AddStaffModal: React.FC<AddStaffModalProps> = ({
  onClose,
  onSuccess,
  selectedTheater,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    theaterId: selectedTheater._id, 
  });

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const result = await createStaff(formData)
      console.log(result);
      toast.success('Staff created succusfully')
      onSuccess(result.data.staff)
    } catch (error) {
      console.error("Error adding staff:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      onClose()
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      formData.email.trim() &&
      formData.password.trim()
    );
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-10 pb-10">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg mx-4 h-fit max-h-[90vh]">
        <div className="backdrop-blur-sm bg-black/90 rounded-3xl border border-gray-500/30 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex-shrink-0 p-6 pb-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className={`${lexendBold.className} text-2xl text-white`}>
                  Add Staff Member
                </h2>
                <p className={`${lexendRegular.className} text-sm text-gray-400 mt-1`}>
                  Adding staff to {selectedTheater.name}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Selected Theater Info */}
            <div className="bg-white/5 border border-gray-500/30 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className={`${lexendMedium.className} text-white text-sm`}>
                    {selectedTheater.name}
                  </h3>
                  <p className={`${lexendRegular.className} text-xs text-gray-400`}>
                    {selectedTheater.city}, {selectedTheater.state}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto px-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label className={`${lexendRegular.className} block text-sm text-gray-300 mb-2`}>
                    First Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`${lexendRegular.className} w-full pl-11 pr-4 py-3 bg-white/5 border ${errors.firstName ? 'border-red-500' : 'border-gray-500/30'
                        } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/50 transition-all duration-300`}
                      placeholder="First name"
                    />
                  </div>
                  {errors.firstName && (
                    <p className={`${lexendRegular.className} text-red-400 text-sm mt-1`}>
                      {errors.firstName}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className={`${lexendRegular.className} block text-sm text-gray-300 mb-2`}>
                    Last Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`${lexendRegular.className} w-full pl-11 pr-4 py-3 bg-white/5 border ${errors.lastName ? 'border-red-500' : 'border-gray-500/30'
                        } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/50 transition-all duration-300`}
                      placeholder="Last name"
                    />
                  </div>
                  {errors.lastName && (
                    <p className={`${lexendRegular.className} text-red-400 text-sm mt-1`}>
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className={`${lexendRegular.className} block text-sm text-gray-300 mb-2`}>
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`${lexendRegular.className} w-full pl-11 pr-4 py-3 bg-white/5 border ${errors.email ? 'border-red-500' : 'border-gray-500/30'
                      } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/50 transition-all duration-300`}
                    placeholder="staff@example.com"
                  />
                </div>
                {errors.email && (
                  <p className={`${lexendRegular.className} text-red-400 text-sm mt-1`}>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className={`${lexendRegular.className} block text-sm text-gray-300 mb-2`}>
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`${lexendRegular.className} w-full pl-11 pr-4 py-3 bg-white/5 border ${errors.password ? 'border-red-500' : 'border-gray-500/30'
                      } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/50 transition-all duration-300`}
                    placeholder="Enter password"
                  />
                </div>
                {errors.password && (
                  <p className={`${lexendRegular.className} text-red-400 text-sm mt-1`}>
                    {errors.password}
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* Footer */}
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
                    Adding Staff...
                  </>
                ) : (
                  "Add Staff Member"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStaffModal;

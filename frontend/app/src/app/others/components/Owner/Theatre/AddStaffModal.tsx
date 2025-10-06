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

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  theaterId: string;
}

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  general?: string;
}

const AddStaffModal: React.FC<AddStaffModalProps> = ({
  onClose,
  onSuccess,
  selectedTheater,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<keyof FormData, boolean>>({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    theaterId: false,
  });

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    theaterId: selectedTheater._id,
  });

  // Validation rules
  const validateField = (name: keyof FormData, value: string): string | undefined => {
    switch (name) {
      case 'firstName':
        if (!value.trim()) {
          return "First name is required";
        }
        if (value.trim().length < 2) {
          return "First name must be at least 2 characters";
        }
        if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
          return "First name can only contain letters and spaces";
        }
        break;

      case 'lastName':
        if (!value.trim()) {
          return "Last name is required";
        }
        if (value.trim().length < 2) {
          return "Last name must be at least 2 characters";
        }
        if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
          return "Last name can only contain letters and spaces";
        }
        break;

      case 'email':
        if (!value.trim()) {
          return "Email is required";
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(value.trim())) {
          return "Please enter a valid email address";
        }
        break;

      case 'password':
        if (!value.trim()) {
          return "Password is required";
        }
        if (value.length < 6) {
          return "Password must be at least 6 characters long";
        }
       
        break;

      default:
        return undefined;
    }
    return undefined;
  };

  // Validate entire form
  const validateForm = (): ValidationErrors => {
    const newErrors: ValidationErrors = {};
    
    (Object.keys(formData) as Array<keyof FormData>).forEach((key) => {
      if (key !== 'theaterId') {
        const error = validateField(key, formData[key]);
        if (error) {
          newErrors[key] = error;
        }
      }
    });

    return newErrors;
  };

  // Handle input change with real-time validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof FormData;

    // Update form data
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    // Real-time validation only if field has been touched
    if (touched[fieldName]) {
      const fieldError = validateField(fieldName, value);
      setErrors((prev) => ({
        ...prev,
        [fieldName]: fieldError,
        general: undefined, // Clear general error when user starts typing
      }));
    }
  };

  // Handle field blur (when user leaves field)
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof FormData;

    // Mark field as touched
    setTouched((prev) => ({
      ...prev,
      [fieldName]: true,
    }));

    // Validate the field
    const fieldError = validateField(fieldName, value);
    setErrors((prev) => ({
      ...prev,
      [fieldName]: fieldError,
    }));
  };

  // Enhanced form submission with comprehensive error handling
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      theaterId: true,
    });

    // Validate entire form
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      toast.error("Please fix the validation errors before submitting");
      return;
    }

    // Clear any existing errors
    setErrors({});
    setIsLoading(true);

    try {
      const result = await createStaff(formData);
      
      if (result && result.data && result.data.staff) {
        toast.success("Staff member created successfully!");
        onSuccess(result.data.staff);
        onClose();
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      console.error("Error creating staff:", error);
      
      // Handle specific error cases
      if (error?.status === 409 || error?.response?.status === 409) {
        setErrors({ email: "This email is already in use" });
        toast.error("Email already in use");
      } else if (error?.status === 400 || error?.response?.status === 400) {
        // Handle validation errors from server
        if (error?.response?.data?.message) {
          setErrors({ general: error.response.data.message });
          toast.error(error.response.data.message);
        } else {
          setErrors({ general: "Invalid form data. Please check your inputs." });
          toast.error("Invalid form data. Please check your inputs.");
        }
      } else if (error?.status === 500 || error?.response?.status === 500) {
        setErrors({ general: "Server error. Please try again later." });
        toast.error("Server error. Please try again later.");
      } else if (error?.message) {
        setErrors({ general: error.message });
        toast.error(error.message);
      } else {
        setErrors({ general: "Something went wrong. Please try again." });
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Check if form is valid
  const isFormValid = (): boolean => {
    const formErrors = validateForm();
    return Object.keys(formErrors).length === 0 && 
           formData.firstName.trim() !== "" &&
           formData.lastName.trim() !== "" &&
           formData.email.trim() !== "" &&
           formData.password.trim() !== "";
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

            {/* General Error Message */}
            {errors.general && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4">
                <p className={`${lexendRegular.className} text-red-400 text-sm`}>
                  {errors.general}
                </p>
              </div>
            )}
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto px-6">
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
                      onBlur={handleBlur}
                      className={`${lexendRegular.className} w-full pl-11 pr-4 py-3 bg-white/5 border ${
                        errors.firstName ? 'border-red-500' : 'border-gray-500/30'
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
                      onBlur={handleBlur}
                      className={`${lexendRegular.className} w-full pl-11 pr-4 py-3 bg-white/5 border ${
                        errors.lastName ? 'border-red-500' : 'border-gray-500/30'
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
                    onBlur={handleBlur}
                    className={`${lexendRegular.className} w-full pl-11 pr-4 py-3 bg-white/5 border ${
                      errors.email ? 'border-red-500' : 'border-gray-500/30'
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
                    onBlur={handleBlur}
                    className={`${lexendRegular.className} w-full pl-11 pr-4 py-3 bg-white/5 border ${
                      errors.password ? 'border-red-500' : 'border-gray-500/30'
                    } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/50 transition-all duration-300`}
                    placeholder="Enter password"
                  />
                </div>
                {errors.password && (
                  <p className={`${lexendRegular.className} text-red-400 text-sm mt-1`}>
                    {errors.password}
                  </p>
                )}
                <p className={`${lexendRegular.className} text-xs text-gray-500 mt-1`}>
                  Password must be at least 8 characters 
                </p>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 p-6 pt-4 border-t border-gray-500/30">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className={`${lexendMedium.className} flex-1 py-3 rounded-xl border border-gray-500/30 text-gray-300 hover:bg-white/10 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
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
                    Creating Staff...
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

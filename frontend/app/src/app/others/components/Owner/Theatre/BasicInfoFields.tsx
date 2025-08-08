// components/BasicInfoFields.tsx
import React from "react";
import { Lexend } from "next/font/google";
import { Building, MapPin, Phone, Hash, AlertCircle } from "lucide-react";
const lexendMedium = Lexend({ weight: "500", subsets: ["latin"] });
const lexendSmall = Lexend({ weight: "300", subsets: ["latin"] });

interface BasicInfoFieldsProps {
  formData: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  errors: { [key: string]: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({
  formData,
  errors,
  onChange,
}) => {
  return (
    <>
      <div>
        <label className={`${lexendMedium.className} block text-white text-sm mb-2`}>
          Theater Name *
        </label>
        <div className="relative">
          <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onChange}
            placeholder="Enter theater name"
            className={`${lexendMedium.className} w-full pl-12 pr-4 py-3 bg-white/10 border ${
              errors.name ? 'border-red-500' : 'border-gray-500/30'
            } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all duration-300`}
          />
          {errors.name && (
            <p className={`${lexendSmall.className} text-red-400 text-xs mt-1 flex items-center gap-1`}>
              <AlertCircle className="w-3 h-3" />
              {errors.name}
            </p>
          )}
        </div>
      </div>

      {/* Address */}
      <div>
        <label className={`${lexendMedium.className} block text-white text-sm mb-2`}>
          Address *
        </label>
        <div className="relative">
          <MapPin className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
          <textarea
            name="address"
            value={formData.address}
            onChange={onChange}
            placeholder="Enter full address"
            rows={3}
            className={`${lexendMedium.className} w-full pl-12 pr-4 py-3 bg-white/10 border ${
              errors.address ? 'border-red-500' : 'border-gray-500/30'
            } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all duration-300 resize-none`}
          />
          {errors.address && (
            <p className={`${lexendSmall.className} text-red-400 text-xs mt-1 flex items-center gap-1`}>
              <AlertCircle className="w-3 h-3" />
              {errors.address}
            </p>
          )}
        </div>
      </div>

      {/* City, State, Pincode */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={`${lexendMedium.className} block text-white text-sm mb-2`}>
            City *
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={onChange}
            placeholder="Enter city"
            className={`${lexendMedium.className} w-full px-4 py-3 bg-white/10 border ${
              errors.city ? 'border-red-500' : 'border-gray-500/30'
            } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all duration-300`}
          />
          {errors.city && (
            <p className={`${lexendSmall.className} text-red-400 text-xs mt-1`}>
              {errors.city}
            </p>
          )}
        </div>
        <div>
          <label className={`${lexendMedium.className} block text-white text-sm mb-2`}>
            State *
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={onChange}
            placeholder="Enter state"
            className={`${lexendMedium.className} w-full px-4 py-3 bg-white/10 border ${
              errors.state ? 'border-red-500' : 'border-gray-500/30'
            } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all duration-300`}
          />
          {errors.state && (
            <p className={`${lexendSmall.className} text-red-400 text-xs mt-1`}>
              {errors.state}
            </p>
          )}
        </div>
        <div>
          <label className={`${lexendMedium.className} block text-white text-sm mb-2`}>
            Pincode *
          </label>
          <div className="relative">
            <Hash className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={onChange}
              placeholder="000000"
              maxLength={6}
              className={`${lexendMedium.className} w-full pl-12 pr-4 py-3 bg-white/10 border ${
                errors.pincode ? 'border-red-500' : 'border-gray-500/30'
              } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all duration-300`}
            />
            {errors.pincode && (
              <p className={`${lexendSmall.className} text-red-400 text-xs mt-1`}>
                {errors.pincode}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={`${lexendMedium.className} block text-white text-sm mb-2`}>
            Phone Number *
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={onChange}
              placeholder="Enter phone number"
              className={`${lexendMedium.className} w-full pl-12 pr-4 py-3 bg-white/10 border ${
                errors.phone ? 'border-red-500' : 'border-gray-500/30'
              } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all duration-300`}
            />
            {errors.phone && (
              <p className={`${lexendSmall.className} text-red-400 text-xs mt-1`}>
                {errors.phone}
              </p>
            )}
          </div>
        </div>
      
      </div>
    </>
  );
};

export default BasicInfoFields;

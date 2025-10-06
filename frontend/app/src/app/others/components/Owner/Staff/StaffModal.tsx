"use client";
import React from 'react';
import { X, User, Mail, Calendar, Building, Shield, Power, PowerOff, MapPin, Phone } from 'lucide-react';

interface StaffMember {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  theaterId?: {
    _id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    pincode?: string;
    phone?: string;
    screens?: number;
    facilities?: string[];
    isVerified?: boolean;
  };
  createdAt?: string;
  updatedAt?: string;
}

interface OwnerStaffModalProps {
  staff: StaffMember;
  isOpen: boolean;
  onClose: () => void;
  onToggleStatus: (staffId: string) => void;
  lexendMedium: any;
  lexendSmall: any;
}

const OwnerStaffModal: React.FC<OwnerStaffModalProps> = ({
  staff,
  isOpen,
  onClose,
  onToggleStatus,
  lexendMedium,
  lexendSmall
}) => {
  if (!isOpen) return null;

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50">
      <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-500/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-xl">
              <User className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className={`${lexendMedium.className} text-2xl text-white`}>
                {staff.firstName} {staff.lastName}
              </h2>
              <p className={`${lexendSmall.className} text-gray-400 text-sm`}>
                Complete staff member profile and information
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className={`${lexendMedium.className} text-lg text-white flex items-center gap-2`}>
              <User className="w-5 h-5 text-blue-400" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-xl p-4">
                <label className={`${lexendSmall.className} text-gray-400 text-sm`}>
                  First Name
                </label>
                <p className={`${lexendMedium.className} text-white text-lg mt-1`}>{staff.firstName}</p>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4">
                <label className={`${lexendSmall.className} text-gray-400 text-sm`}>
                  Last Name
                </label>
                <p className={`${lexendMedium.className} text-white text-lg mt-1`}>{staff.lastName}</p>
              </div>

              <div className="bg-white/5 rounded-xl p-4">
                <label className={`${lexendSmall.className} text-gray-400 text-sm`}>
                  Role
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <p className={`${lexendMedium.className} text-white text-lg capitalize`}>{staff.role}</p>
                </div>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4 md:col-span-2">
                <label className={`${lexendSmall.className} text-gray-400 text-sm`}>
                  Email Address
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <p className={`${lexendMedium.className} text-white text-lg`}>{staff.email}</p>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4">
                <label className={`${lexendSmall.className} text-gray-400 text-sm`}>
                  Current Status
                </label>
                <div className={`inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                  staff.isActive 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {staff.isActive ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
                  {staff.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
            </div>
          </div>

          {/* Theater Information */}
          {staff.theaterId && (
            <div className="space-y-4">
              <h3 className={`${lexendMedium.className} text-lg text-white flex items-center gap-2`}>
                <Building className="w-5 h-5 text-blue-400" />
                Assigned Theater
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <label className={`${lexendSmall.className} text-gray-400 text-sm`}>
                    Theater Name
                  </label>
                  <p className={`${lexendMedium.className} text-white text-lg mt-1`}>
                    {staff.theaterId.name}
                  </p>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <label className={`${lexendSmall.className} text-gray-400 text-sm`}>
                    Contact Number
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <p className={`${lexendMedium.className} text-white`}>
                      {staff.theaterId.phone || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 md:col-span-2">
                  <label className={`${lexendSmall.className} text-gray-400 text-sm`}>
                    Theater Address
                  </label>
                  <div className="flex items-start gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className={`${lexendMedium.className} text-white`}>
                        {staff.theaterId.address}
                      </p>
                      <p className={`${lexendSmall.className} text-gray-400`}>
                        {staff.theaterId.city}, {staff.theaterId.state}
                        {staff.theaterId.pincode && ` - ${staff.theaterId.pincode}`}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <label className={`${lexendSmall.className} text-gray-400 text-sm`}>
                    Total Screens
                  </label>
                  <p className={`${lexendMedium.className} text-blue-400 text-2xl mt-1 font-bold`}>
                    {staff.theaterId.screens || 0}
                  </p>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <label className={`${lexendSmall.className} text-gray-400 text-sm`}>
                    Theater Status
                  </label>
                  <div className={`inline-flex items-center gap-1 mt-2 px-2 py-1 rounded-full text-xs ${
                    staff.theaterId.isVerified 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-orange-500/20 text-orange-400'
                  }`}>
                    {staff.theaterId.isVerified ? '✓ Verified' : '⚠ Unverified'}
                  </div>
                </div>

                {staff.theaterId.facilities && staff.theaterId.facilities.length > 0 && (
                  <div className="bg-white/5 rounded-xl p-4 md:col-span-2">
                    <label className={`${lexendSmall.className} text-gray-400 text-sm`}>
                      Theater Facilities
                    </label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {staff.theaterId.facilities.map((facility, index) => (
                        <span
                          key={index}
                          className={`${lexendSmall.className} px-2 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-sm border border-purple-500/30`}
                        >
                          {facility}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timeline Information */}
          <div className="space-y-4">
            <h3 className={`${lexendMedium.className} text-lg text-white flex items-center gap-2`}>
              <Calendar className="w-5 h-5 text-blue-400" />
              Timeline & Activity
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-4">
                <label className={`${lexendSmall.className} text-gray-400 text-sm`}>
                  Staff Member Since
                </label>
                <p className={`${lexendMedium.className} text-white mt-1`}>{formatDate(staff.createdAt)}</p>
                <p className={`${lexendSmall.className} text-gray-400 text-sm`}>{formatTime(staff.createdAt)}</p>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4">
                <label className={`${lexendSmall.className} text-gray-400 text-sm`}>
                  Last Profile Update
                </label>
                <p className={`${lexendMedium.className} text-white mt-1`}>{formatDate(staff.updatedAt)}</p>
                <p className={`${lexendSmall.className} text-gray-400 text-sm`}>{formatTime(staff.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-gray-500/30">
          <button
            onClick={onClose}
            className={`${lexendSmall.className} px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors border border-gray-500/30`}
          >
            Close
          </button>

          <button
            onClick={() => {
              onToggleStatus(staff._id);
              onClose();
            }}
            className={`${lexendSmall.className} flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
              staff.isActive
                ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 hover:border-red-500/50'
                : 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 hover:border-green-500/50'
            }`}
          >
            {staff.isActive ? (
              <>
                <PowerOff className="w-4 h-4" />
                Disable Staff
              </>
            ) : (
              <>
                <Power className="w-4 h-4" />
                Enable Staff
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnerStaffModal;

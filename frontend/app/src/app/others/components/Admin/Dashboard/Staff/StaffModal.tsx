import React from 'react';
import { X, User, Mail, Calendar, Building, Shield, Power, PowerOff, Crown, MapPin, Phone } from 'lucide-react';
import { Lexend } from 'next/font/google';

const lexend = Lexend({ subsets: ['latin'] });

interface StaffMember {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  ownerId?: {
    ownerName?: string;
    email?: string;
    phone?: string;
    bankName?: string;
    accountHolder?: string;
    isVerified?: boolean;
    lastLogin?: string;
    createdAt?: string;
  };
  theaterId?: {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    phone?: string;
    screens?: number;
    facilities?: string[];
    isVerified?: boolean;
    createdAt?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

interface StaffModalProps {
  staff: StaffMember;
  isOpen: boolean;
  onClose: () => void;
  onToggleStatus: (staffId: string) => void;
}

const StaffModal: React.FC<StaffModalProps> = ({ staff, isOpen, onClose, onToggleStatus }) => {
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
      <div className="bg-gray-800 rounded-2xl border border-yellow-500/20 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-xl">
              <User className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h2 className={`${lexend.className} text-2xl text-white font-medium`}>
                {staff.firstName} {staff.lastName}
              </h2>
              <p className="text-gray-400 text-sm" style={{ fontFamily: lexend.style.fontFamily }}>
                Complete staff member profile and information
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-gray-700/50 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className={`${lexend.className} text-lg text-white font-medium flex items-center gap-2`}>
              <User className="w-5 h-5 text-yellow-400" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-700/30 rounded-xl p-4">
                <label className="text-gray-400 text-sm" style={{ fontFamily: lexend.style.fontFamily }}>
                  First Name
                </label>
                <p className={`${lexend.className} text-white text-lg mt-1`}>{staff.firstName}</p>
              </div>
              
              <div className="bg-gray-700/30 rounded-xl p-4">
                <label className="text-gray-400 text-sm" style={{ fontFamily: lexend.style.fontFamily }}>
                  Last Name
                </label>
                <p className={`${lexend.className} text-white text-lg mt-1`}>{staff.lastName}</p>
              </div>

              <div className="bg-gray-700/30 rounded-xl p-4">
                <label className="text-gray-400 text-sm" style={{ fontFamily: lexend.style.fontFamily }}>
                  Role
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <p className={`${lexend.className} text-white text-lg capitalize`}>{staff.role}</p>
                </div>
              </div>
              
              <div className="bg-gray-700/30 rounded-xl p-4 md:col-span-2">
                <label className="text-gray-400 text-sm" style={{ fontFamily: lexend.style.fontFamily }}>
                  Email Address
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <p className={`${lexend.className} text-white text-lg`}>{staff.email}</p>
                </div>
              </div>

              <div className="bg-gray-700/30 rounded-xl p-4">
                <label className="text-gray-400 text-sm" style={{ fontFamily: lexend.style.fontFamily }}>
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

          {/* Owner Information */}
          {staff.ownerId && (
            <div className="space-y-4">
              <h3 className={`${lexend.className} text-lg text-white font-medium flex items-center gap-2`}>
                <Crown className="w-5 h-5 text-yellow-400" />
                Owner Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-700/30 rounded-xl p-4">
                  <label className="text-gray-400 text-sm" style={{ fontFamily: lexend.style.fontFamily }}>
                    Owner Name
                  </label>
                  <p className={`${lexend.className} text-white text-lg mt-1`}>
                    {staff.ownerId.ownerName || 'N/A'}
                  </p>
                </div>

                <div className="bg-gray-700/30 rounded-xl p-4">
                  <label className="text-gray-400 text-sm" style={{ fontFamily: lexend.style.fontFamily }}>
                    Owner Email
                  </label>
                  <p className={`${lexend.className} text-white mt-1`}>
                    {staff.ownerId.email || 'N/A'}
                  </p>
                </div>

                <div className="bg-gray-700/30 rounded-xl p-4">
                  <label className="text-gray-400 text-sm" style={{ fontFamily: lexend.style.fontFamily }}>
                    Phone Number
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <p className={`${lexend.className} text-white`}>
                      {staff.ownerId.phone || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-700/30 rounded-xl p-4">
                  <label className="text-gray-400 text-sm" style={{ fontFamily: lexend.style.fontFamily }}>
                    Verification Status
                  </label>
                  <div className={`inline-flex items-center gap-1 mt-2 px-2 py-1 rounded-full text-xs ${
                    staff.ownerId.isVerified 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-orange-500/20 text-orange-400'
                  }`}>
                    {staff.ownerId.isVerified ? '✓ Verified' : '⚠ Unverified'}
                  </div>
                </div>

                <div className="bg-gray-700/30 rounded-xl p-4">
                  <label className="text-gray-400 text-sm" style={{ fontFamily: lexend.style.fontFamily }}>
                    Bank Details
                  </label>
                  <p className={`${lexend.className} text-white mt-1`}>
                    {staff.ownerId.bankName || 'N/A'}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {staff.ownerId.accountHolder || 'N/A'}
                  </p>
                </div>

                <div className="bg-gray-700/30 rounded-xl p-4">
                  <label className="text-gray-400 text-sm" style={{ fontFamily: lexend.style.fontFamily }}>
                    Last Login
                  </label>
                  <p className={`${lexend.className} text-white mt-1`}>
                    {staff.ownerId.lastLogin ? formatDate(staff.ownerId.lastLogin) : 'N/A'}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {staff.ownerId.lastLogin ? formatTime(staff.ownerId.lastLogin) : ''}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Theater Information */}
          {staff.theaterId && (
            <div className="space-y-4">
              <h3 className={`${lexend.className} text-lg text-white font-medium flex items-center gap-2`}>
                <Building className="w-5 h-5 text-yellow-400" />
                Theater Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700/30 rounded-xl p-4">
                  <label className="text-gray-400 text-sm" style={{ fontFamily: lexend.style.fontFamily }}>
                    Theater Name
                  </label>
                  <p className={`${lexend.className} text-white text-lg mt-1`}>
                    {staff.theaterId.name || 'N/A'}
                  </p>
                </div>

                <div className="bg-gray-700/30 rounded-xl p-4">
                  <label className="text-gray-400 text-sm" style={{ fontFamily: lexend.style.fontFamily }}>
                    Contact Number
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <p className={`${lexend.className} text-white`}>
                      {staff.theaterId.phone || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-700/30 rounded-xl p-4 md:col-span-2">
                  <label className="text-gray-400 text-sm" style={{ fontFamily: lexend.style.fontFamily }}>
                    Address
                  </label>
                  <div className="flex items-start gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className={`${lexend.className} text-white`}>
                        {staff.theaterId.address || 'N/A'}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {staff.theaterId.city && staff.theaterId.state 
                          ? `${staff.theaterId.city}, ${staff.theaterId.state} - ${staff.theaterId.pincode || ''}` 
                          : 'Location not available'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-700/30 rounded-xl p-4">
                  <label className="text-gray-400 text-sm" style={{ fontFamily: lexend.style.fontFamily }}>
                    Total Screens
                  </label>
                  <p className={`${lexend.className} text-white text-2xl mt-1 font-bold text-yellow-400`}>
                    {staff.theaterId.screens || 0}
                  </p>
                </div>

                <div className="bg-gray-700/30 rounded-xl p-4">
                  <label className="text-gray-400 text-sm" style={{ fontFamily: lexend.style.fontFamily }}>
                    Verification Status
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
                  <div className="bg-gray-700/30 rounded-xl p-4 md:col-span-2">
                    <label className="text-gray-400 text-sm" style={{ fontFamily: lexend.style.fontFamily }}>
                      Facilities
                    </label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {staff.theaterId.facilities.map((facility, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm border border-blue-500/30"
                          style={{ fontFamily: lexend.style.fontFamily }}
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
            <h3 className={`${lexend.className} text-lg text-white font-medium flex items-center gap-2`}>
              <Calendar className="w-5 h-5 text-yellow-400" />
              Timeline & Activity
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-700/30 rounded-xl p-4">
                <label className="text-gray-400 text-sm" style={{ fontFamily: lexend.style.fontFamily }}>
                  Staff Member Since
                </label>
                <p className={`${lexend.className} text-white mt-1`}>{formatDate(staff.createdAt)}</p>
                <p className="text-gray-400 text-sm">{formatTime(staff.createdAt)}</p>
              </div>
              
              <div className="bg-gray-700/30 rounded-xl p-4">
                <label className="text-gray-400 text-sm" style={{ fontFamily: lexend.style.fontFamily }}>
                  Last Profile Update
                </label>
                <p className={`${lexend.className} text-white mt-1`}>{formatDate(staff.updatedAt)}</p>
                <p className="text-gray-400 text-sm">{formatTime(staff.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white transition-colors"
            style={{ fontFamily: lexend.style.fontFamily }}
          >
            Close
          </button>

          <button
            onClick={() => {
              onToggleStatus(staff._id);
              onClose();
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
              staff.isActive
                ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 hover:border-red-500/50'
                : 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 hover:border-green-500/50'
            }`}
            style={{ fontFamily: lexend.style.fontFamily }}
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

export default StaffModal;

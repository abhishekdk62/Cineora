"use client";
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Lexend } from 'next/font/google';
import { User, Mail, Shield, Calendar, Building, MapPin, Phone, Users } from 'lucide-react';
import { getStaffDetails } from '../../services/ownerServices/staffServices';

const lexendBold = Lexend({ weight: "700", subsets: ["latin"] });
const lexendMedium = Lexend({ weight: "500", subsets: ["latin"] });
const lexendRegular = Lexend({ weight: "400", subsets: ["latin"] });

interface StaffData {
  staff: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    theaterId: {
      _id: string;
      name: string;
      address: string;
      city: string;
      state: string;
      phone: string;
      screens: number;
      location: {
        coordinates: [number, number];
      };
      ownerId: {
        ownerName: string;
        phone: string;
      };
    };
  };
}

const StaffAccount = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [staffData, setStaffData] = useState<StaffData | null>(null);
  const [loading, setLoading] = useState(true);

  const getStaffDetailsFunc = async () => {
    try {
      const data = await getStaffDetails();
      console.log('staff datas', data.staff);
      setStaffData(data.staff);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStaffDetailsFunc();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-white">Loading account information...</div>
      </div>
    );
  }

  if (!user || !staffData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-white">Unable to load account information</div>
      </div>
    );
  }

  const staff = staffData;
  const theater = staffData?.theaterId;
  const owner = staffData?.ownerId;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className={`${lexendBold.className} text-3xl text-white mb-2`}>
          My Account
        </h1>
        <p className={`${lexendRegular.className} text-gray-400`}>
          Staff profile and information
        </p>
      </div>

      {/* Profile Header */}
      <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className={`${lexendBold.className} text-white text-2xl`}>
              {staff?.firstName?.charAt(0).toUpperCase()}
              {staff?.lastName?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className={`${lexendBold.className} text-2xl text-white`}>
              {staff?.firstName} {staff?.lastName}
            </h2>
            <p className={`${lexendMedium.className} text-gray-400 mt-1`}>
              {staff?.email}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <span className={`${lexendMedium.className} inline-block px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full`}>
                {staff?.role.charAt(0).toUpperCase() + staff?.role.slice(1)} Member
              </span>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${staff?.isActive ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className={`${lexendRegular.className} text-xs ${staff?.isActive ? 'text-green-400' : 'text-red-400'}`}>
                  {staff?.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className={`${lexendMedium.className} text-lg text-white mb-4`}>
              Personal Information
            </h3>

            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className={`${lexendRegular.className} text-gray-400 text-sm`}>
                  Full Name
                </p>
                <p className={`${lexendMedium.className} text-white`}>
                  {staff?.firstName} {staff?.lastName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className={`${lexendRegular.className} text-gray-400 text-sm`}>
                  Email Address
                </p>
                <p className={`${lexendMedium.className} text-white`}>
                  {staff?.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
              <Shield className="w-5 h-5 text-gray-400" />
              <div>
                <p className={`${lexendRegular.className} text-gray-400 text-sm`}>
                  Role
                </p>
                <p className={`${lexendMedium.className} text-white`}>
                  {staff?.role.charAt(0).toUpperCase() + staff?.role.slice(1)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className={`${lexendRegular.className} text-gray-400 text-sm`}>
                  Joined
                </p>
                <p className={`${lexendMedium.className} text-white`}>
                  {new Date(staff?.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Theater Information */}
          <div className="space-y-4">
            <h3 className={`${lexendMedium.className} text-lg text-white mb-4`}>
              Theater Information
            </h3>

            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
              <Building className="w-5 h-5 text-gray-400" />
              <div>
                <p className={`${lexendRegular.className} text-gray-400 text-sm`}>
                  Theater Name
                </p>
                <p className={`${lexendMedium.className} text-white`}>
                  {theater?.name || 'Not Assigned'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className={`${lexendRegular.className} text-gray-400 text-sm`}>
                  Location
                </p>
                <p className={`${lexendMedium.className} text-white`}>
                  {theater ? `${theater?.city}, ${theater?.state}` : 'Not Available'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className={`${lexendRegular.className} text-gray-400 text-sm`}>
                  Theater Phone
                </p>
                <p className={`${lexendMedium.className} text-white`}>
                  {theater?.phone || 'Not Available'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
              <Users className="w-5 h-5 text-gray-400" />
              <div>
                <p className={`${lexendRegular.className} text-gray-400 text-sm`}>
                  Total Screens
                </p>
                <p className={`${lexendMedium.className} text-white`}>
                  {theater?.screens || 0} Screens
                </p>
              </div>
            </div>
          </div>

          {/* Owner Information */}
          <div className="space-y-4">
            <h3 className={`${lexendMedium.className} text-lg text-white mb-4`}>
              Owner Information
            </h3>

            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className={`${lexendRegular.className} text-gray-400 text-sm`}>
                  Owner Name
                </p>
                <p className={`${lexendMedium.className} text-white`}>
                  {owner?.ownerName || 'Not Available'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className={`${lexendRegular.className} text-gray-400 text-sm`}>
                  Owner Phone
                </p>
                <p className={`${lexendMedium.className} text-white`}>
                  {owner?.phone || 'Not Available'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
              <Building className="w-5 h-5 text-gray-400" />
              <div>
                <p className={`${lexendRegular.className} text-gray-400 text-sm`}>
                  Staff ID
                </p>
                <p className={`${lexendMedium.className} text-white font-mono`}>
                  {staff?._id.slice(-8).toUpperCase()}
                </p>
              </div>
            </div>

            {theater?.location && (
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
                <MapPin className="w-5 h-5 text-gray-400" />


                <button
                  onClick={() => {
                    const url = `https://www.google.com/maps?q=${theater.location.coordinates[1]},${theater.location.coordinates[0]}`;
                    window.open(url, "_blank");
                  }}
                  className="text-blue-400 hover:text-blue-300 underline text-sm transition-colors"
                >
                  View on Google Maps
                </button>

              </div>
            )}
          </div>
        </div>

        {/* Theater Address */}
        {theater?.address && (
          <div className="mt-6 p-4 bg-white/5 rounded-xl">
            <h4 className={`${lexendMedium.className} text-white mb-2`}>
              Theater Address
            </h4>
            <p className={`${lexendRegular.className} text-gray-300`}>
              {theater.address}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 pt-6 border-t border-gray-500/30">
          <div className="flex gap-4">
            <button className={`${lexendMedium.className} px-6 py-3 bg-white text-black rounded-xl hover:bg-gray-200 transition-colors`}>
              Edit Profile
            </button>
            <button className={`${lexendMedium.className} px-6 py-3 border border-gray-500/30 text-gray-300 rounded-xl hover:bg-white/10 transition-colors`}>
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffAccount;

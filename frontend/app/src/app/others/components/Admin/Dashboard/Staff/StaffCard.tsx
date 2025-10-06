import React from 'react';
import { User, Mail, Calendar, Eye, Power, PowerOff, Building, Crown } from 'lucide-react';
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
    // other owner properties...
  };
  theaterId?: {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    // other theater properties...
  };
  createdAt?: string;
  updatedAt?: string;
}

interface StaffCardProps {
  staff: StaffMember;
  onViewDetails: (staff: StaffMember) => void;
  onToggleStatus: (staffId: string) => void;
}

const StaffCard: React.FC<StaffCardProps> = ({ staff, onViewDetails, onToggleStatus }) => {
  // Format ISO date string to readable date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 hover:border-yellow-500/30 transition-all duration-300">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Staff Info */}
        <div className="flex items-center gap-4">
          <div className="p-3 bg-yellow-500/20 rounded-xl">
            <User className="w-6 h-6 text-yellow-400" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className={`${lexend.className} text-xl text-white font-medium`}>
                {staff.firstName} {staff.lastName}
              </h3>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                staff.isActive 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {staff.isActive ? 'Active' : 'Inactive'}
              </div>
            </div>
            
            <div className="space-y-1">
              {/* Email */}
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span style={{ fontFamily: lexend.style.fontFamily }}>{staff.email}</span>
              </div>
              
              {/* Owner Info */}
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Crown className="w-4 h-4 flex-shrink-0" />
                <span style={{ fontFamily: lexend.style.fontFamily }}>
                  Owner: {staff.ownerId?.ownerName || 'N/A'}
                </span>
              </div>

              {/* Theater Info */}
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Building className="w-4 h-4 flex-shrink-0" />
                <span style={{ fontFamily: lexend.style.fontFamily }}>
                  Theater: {staff.theaterId?.name || 'N/A'}
                </span>
              </div>


            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => onViewDetails(staff)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-700/50 hover:bg-gray-700 text-gray-300 hover:text-white transition-all duration-300 border border-gray-600 hover:border-gray-500"
            style={{ fontFamily: lexend.style.fontFamily }}
          >
            <Eye className="w-4 h-4" />
            View Details
          </button>

          <button
            onClick={() => {
              console.log(staff);
              
              onToggleStatus(staff._id)}}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 font-medium ${
              staff.isActive
                ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 hover:border-red-500/50'
                : 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 hover:border-green-500/50'
            }`}
            style={{ fontFamily: lexend.style.fontFamily }}
          >
            {staff.isActive ? (
              <>
                <PowerOff className="w-4 h-4" />
                Disable
              </>
            ) : (
              <>
                <Power className="w-4 h-4" />
                Enable
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffCard;

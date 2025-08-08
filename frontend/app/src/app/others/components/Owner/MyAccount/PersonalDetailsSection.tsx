import React from "react";
import { Lexend } from "next/font/google";
import { User, Mail, Phone, Edit3 } from "lucide-react";
import { UserProfile } from "./MyAccount";

const lexendBold = Lexend({
  weight: "700",
  subsets: ["latin"],
});

const lexendMedium = Lexend({
  weight: "500",
  subsets: ["latin"],
});

const lexendSmall = Lexend({
  weight: "300",
  subsets: ["latin"],
});

interface PersonalDetailsSectionProps {
  profile: UserProfile;
  onEdit: () => void;
  saving: boolean;
}

const PersonalDetailsSection: React.FC<PersonalDetailsSectionProps> = ({
  profile,
  onEdit,
  saving,
}) => {
  return (
    <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
            <User className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className={`${lexendBold.className} text-xl text-white`}>
              Personal Details
            </h3>
            <p className={`${lexendSmall.className} text-gray-400`}>
              Your personal information
            </p>
          </div>
        </div>
        <button
          onClick={onEdit}
          disabled={saving}
          className={`${lexendMedium.className} bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-all duration-300 flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <Edit3 className="w-4 h-4" />
          Edit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
          <User className="w-5 h-5 text-gray-400" />
          <div>
            <p className={`${lexendSmall.className} text-gray-400 text-xs`}>
              Name
            </p>
            <p className={`${lexendMedium.className} text-white`}>
              {profile.ownerName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
          <Mail className="w-5 h-5 text-gray-400" />
          <div>
            <p className={`${lexendSmall.className} text-gray-400 text-xs`}>
              Email
            </p>
            <p className={`${lexendMedium.className} text-white`}>
              {profile.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
          <Phone className="w-5 h-5 text-gray-400" />
          <div>
            <p className={`${lexendSmall.className} text-gray-400 text-xs`}>
              Phone
            </p>
            <p className={`${lexendMedium.className} text-white`}>
              {profile.phone}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
          <User className="w-5 h-5 text-gray-400" />
          <div>
            <p className={`${lexendSmall.className} text-gray-400 text-xs`}>
              Account Holder
            </p>
            <p className={`${lexendMedium.className} text-white`}>
              {profile.accountHolder}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetailsSection;

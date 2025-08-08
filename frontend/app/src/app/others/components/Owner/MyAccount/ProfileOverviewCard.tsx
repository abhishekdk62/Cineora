import React from "react";
import { Lexend } from "next/font/google";
import { User } from "lucide-react";
import { formatDate, UserProfile } from "./MyAccount";

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

interface ProfileOverviewCardProps {
  profile: UserProfile;
}

const ProfileOverviewCard: React.FC<ProfileOverviewCardProps> = ({ profile }) => {
  return (
    <div className="lg:col-span-1">
      <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
        <div className="text-center">
          {/* Avatar */}
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-gray-600 rounded-full mx-auto flex items-center justify-center overflow-hidden">
              {profile.ownerPhotoUrl ? (
                <img
                  src={profile.ownerPhotoUrl}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-gray-400" />
              )}
            </div>
          </div>

          <h2 className={`${lexendBold.className} text-xl text-white mb-2`}>
            {profile.ownerName}
          </h2>
          <p className={`${lexendSmall.className} text-gray-400 mb-1`}>
            Theater Owner
          </p>
          <p className={`${lexendSmall.className} text-gray-400 mb-4`}>
            Member since {formatDate(profile.createdAt)}
          </p>

          <div className="space-y-2">
            <div
              className={`px-4 py-2 rounded-lg ${
                profile.isVerified ? "bg-green-500/20" : "bg-orange-500/20"
              }`}
            >
              <p
                className={`${lexendSmall.className} ${
                  profile.isVerified ? "text-green-400" : "text-orange-400"
                } text-sm`}
              >
                Account Status
              </p>
              <p className={`${lexendMedium.className} text-white`}>
                {profile.isVerified ? "Verified" : "Pending Verification"}
              </p>
            </div>

            <div className="bg-blue-500/20 px-4 py-2 rounded-lg">
              <p className={`${lexendSmall.className} text-blue-400 text-sm`}>
                Last Login
              </p>
              <p className={`${lexendMedium.className} text-white text-sm`}>
                {formatDate(profile.lastLogin)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverviewCard;

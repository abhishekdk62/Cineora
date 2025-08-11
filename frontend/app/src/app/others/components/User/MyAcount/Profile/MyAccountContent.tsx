
"use client";

import { useState } from "react";
import {
  Calendar,
  Edit3,
  Mail,
  User,
  Globe,
  Shield,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  Key,
  MapPin,
  Phone,
} from "lucide-react";

import EditProfileModal from "./EditProfileModal";
import ChangePasswordModal from "./ChangePasswordModal";
import ChangeEmailModal from "./ChangeEmailModal";

const lexendBold   = { className: "font-bold" };
const lexendMedium = { className: "font-medium" };
const lexendSmall  = { className: "font-normal text-sm" };

export interface IUser {
  _id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  language?: string;
  gender?: "male" | "female" | "other";
  phone?: string;
  profilePicture?: string;
  locationCity?: string;
  locationState?: string;
  coordinates?: [number, number];
  isVerified: boolean;
  xpPoints: number;
  joinedAt: Date;
  lastActive: Date;
  isActive: boolean;
}

interface MyAccountContentProps {
  userData: IUser | null;          
}

type InfoRowProps = { label: string; icon: React.ReactNode; value: string };
const InfoRow = ({ label, icon, value }: InfoRowProps) => (
  <div>
    <label className={`${lexendSmall.className} block text-sm font-medium text-gray-300 mb-3`}>
      {icon}
      {label}
    </label>
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
      <p className={`${lexendMedium.className} text-white`}>{value}</p>
    </div>
  </div>
);

type StatCardProps = { icon: React.ReactNode; label: string; value: string; sub?: string };
const StatCard = ({ icon, label, value, sub }: StatCardProps) => (
  <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mx-auto mb-2">
      {icon}
    </div>
    <p className={`${lexendSmall.className} text-gray-400 text-xs mb-1`}>{label}</p>
    <p className={`${lexendBold.className} text-white text-lg`}>{value}</p>
    {sub && <p className={`${lexendSmall.className} text-gray-500 text-xs`}>{sub}</p>}
  </div>
);

/* ---------- main component ---------- */
const MyAccountContent = ({ userData }: MyAccountContentProps) => {
  const [isEditing, setIsEditing]       = useState(false);
  const [showPwd, setShowPwd]           = useState(false);
  const [showEmail, setShowEmail]       = useState(false);

  if (!userData) return <div className="text-white">Loading…</div>;

  const membershipLevel =
    userData.xpPoints >= 5_000 ? "Premium"
    : userData.xpPoints >= 2_000 ? "Gold"
    : userData.xpPoints >=   500 ? "Silver"
    : "Bronze";

  const nextLevelPoints =
    userData.xpPoints >= 5_000 ? 0
    : userData.xpPoints >= 2_000 ? 5_000 - userData.xpPoints
    : userData.xpPoints >=   500 ? 2_000 - userData.xpPoints
    : 500 - userData.xpPoints;

  const progressPct = (() => {
    const tiers = { Bronze: 500, Silver: 1_500, Gold: 3_000, Premium: 1 }; 
    const tierLimit = tiers[membershipLevel as keyof typeof tiers];
    const pointsIntoTier =
      membershipLevel === "Premium" ? tierLimit : userData.xpPoints % tierLimit;
    return Math.min(100, (pointsIntoTier / tierLimit) * 100);
  })();

  /* ---------- render ---------- */
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* ───── header ───── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className={`${lexendBold.className} text-4xl text-white mb-2`}>
            Profile &amp; Settings
          </h1>
          <p className={`${lexendSmall.className} text-gray-400`}>
            Manage your account information and preferences
          </p>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className={`${lexendMedium.className} flex items-center gap-2 px-6 py-3 bg-white text-black hover:bg-white/5 hover:border hover:text-white hover:border-gray-400  rounded-xl `}
        >
          Edit Profile
        </button>
      </div>

      {/* ───── overview card ───── */}
      <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
          {/* avatar */}
          <div className="relative">
            <img
              src={userData.profilePicture || "/api/placeholder/150/150"}
              alt={userData.username}
              className="w-32 h-32 rounded-2xl object-cover border-4 border-white/20 shadow-lg"
            />
            {userData.isVerified && (
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            )}
            {/* badge */}
            <div className="mt-4 text-center">
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  membershipLevel === "Premium"
                    ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30"
                    : membershipLevel === "Gold"
                    ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border border-yellow-500/30"
                    : membershipLevel === "Silver"
                    ? "bg-gradient-to-r from-gray-400/20 to-gray-500/20 text-gray-300 border border-gray-400/30"
                    : "bg-gradient-to-r from-amber-600/20 to-amber-700/20 text-amber-300 border border-amber-600/30"
                }`}
              >
                <Award className="w-3 h-3 mr-1" />
                {membershipLevel} Member
              </div>
            </div>
          </div>

          {/* basic info + stats */}
          <div className="flex-1 w-full">
            {/* name / verified */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
              <div>
                <h2 className={`${lexendBold.className} text-3xl text-white mb-2`}>
                  {userData.firstName && userData.lastName
                    ? `${userData.firstName} ${userData.lastName}`
                    : userData.username}
                </h2>
                <p className={`${lexendMedium.className} text-gray-300 mb-4 flex items-center gap-2`}>
                  <User className="w-4 h-4" />@{userData.username}
                </p>
              </div>
              {userData.isVerified && (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className={`${lexendSmall.className} text-green-400 font-medium`}>
                    Verified Account
                  </span>
                </div>
              )}
            </div>

            {/* stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard
                icon={<span className="text-yellow-400 text-lg">✨</span>}
                label="XP Points"
                value={userData.xpPoints.toLocaleString()}
                sub={nextLevelPoints > 0 ? `${nextLevelPoints} to next level` : ""}
              />
              <StatCard
                icon={<Calendar className="w-4 h-4 text-blue-400" />}
                label="Member Since"
                value={userData.joinedAt.toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              />
              <StatCard
                icon={<Clock className="w-4 h-4 text-green-400" />}
                label="Last Active"
                value={userData.lastActive.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              />
              <StatCard
                icon={<Globe className="w-4 h-4 text-purple-400" />}
                label="Language"
                value={userData.language === "en" ? "English" : userData.language ?? "—"}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ───── personal info card ───── */}
      <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-white text-black  hover:border-gray-400 rounded-xl flex items-center justify-center">
            <User className="w-5 h-5 bg-white text-black  hover:border-gray-400" />
          </div>
          <h3 className={`${lexendBold.className} text-xl text-white`}>Personal Information</h3>
        </div>

        <div className="space-y-5">
          <InfoRow
            label="Email Address"
            icon={<Mail className="w-4 h-4 inline mr-2" />}
            value={userData.email}
          />
          <InfoRow
            label="Username"
            icon={<User className="w-4 h-4 inline mr-2" />}
            value={`@${userData.username}`}
          />
          <InfoRow
            label="Preferred Language"
            icon={<Globe className="w-4 h-4 inline mr-2" />}
            value={userData.language === "en" ? "English" : userData.language ?? "—"}
          />

          {userData.phone && (
            <InfoRow
              label="Phone"
              icon={<Phone className="w-4 h-4 inline mr-2" />}
              value={userData.phone}
            />
          )}

          {(userData.locationCity || userData.locationState) && (
            <InfoRow
              label="Location"
              icon={<MapPin className="w-4 h-4 inline mr-2" />}
              value={`${userData.locationCity ?? ""}${
                userData.locationCity && userData.locationState ? ", " : ""
              }${userData.locationState ?? ""}`}
            />
          )}

          {userData.dateOfBirth && (
            <InfoRow
              label="Date of Birth"
              icon={<Calendar className="w-4 h-4 inline mr-2" />}
              value={new Date(userData.dateOfBirth).toLocaleDateString()}
            />
          )}

          {userData.gender && (
            <InfoRow
              label="Gender"
              icon={<User className="w-4 h-4 inline mr-2" />}
              value={userData.gender.charAt(0).toUpperCase() + userData.gender.slice(1)}
            />
          )}
        </div>
      </div>

      {/* ───── security & status card ───── */}
      <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-white text-black  rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-black" />
          </div>
          <h3 className={`${lexendBold.className} text-xl text-white`}>Security &amp; Status</h3>
        </div>

        <div className="space-y-4">
          <SecurityRow
            iconBg="bg-white"
            icon={<Key className="w-4 h-4 text-black" />}
            label="Password"
            actionLabel="Change"
            onAction={() => setShowPwd(true)}
          />
          <SecurityRow
            iconBg="bg-white"
            icon={<Mail className="w-4 h-4 text-black" />}
            label="Email"
            actionLabel="Change"
            onAction={() => setShowEmail(true)}
          />

          <SecurityRow
            iconBg="bg-white"
            icon={<CheckCircle className="w-4 h-4 text-black" />}
            label="Account Status"
            statusChip="Active"
            statusChipStyle="bg-green-500/20 text-green-400 border-green-500/30"
          />


          {/* last login */}
          <SecurityRow
            iconBg="bg-white"
            icon={<Clock className="w-4 h-4 text-black" />}
            label="Last Login"
            rightText={userData.lastActive.toLocaleDateString()}
          />

          {/* membership progress */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <Award className="w-4 h-4 text-black" />
                </div>
                <span className={`${lexendMedium.className} text-gray-200`}>Membership Level</span>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  membershipLevel === "Premium"
                    ? "bg-white text-black border"
                    : membershipLevel === "Gold"
                    ? "bg-white text-black border"
                    : membershipLevel === "Silver"
                    ? "bg-white text-black border"
                    : "bg-white text-black border"
                }`}
              >
                {membershipLevel}
              </span>
            </div>
            {nextLevelPoints > 0 && (
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-white to-purple-600 h-2 rounded-full transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ───── footer ───── */}
      <div className="text-center bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Shield className="w-5 h-5 text-green-400" />
          <span className={`${lexendMedium.className} text-green-400`}>
            Your data is secure and encrypted
          </span>
        </div>
        <p className={`${lexendSmall.className} text-gray-400`}>
          Need help with your account? Contact our support team anytime.
        </p>
      </div>

      {/* ───── modals ───── */}
      {isEditing && (
        <EditProfileModal user={userData} onClose={() => setIsEditing(false)} />
      )}
      {showPwd && <ChangePasswordModal onClose={() => setShowPwd(false)} />}
      {showEmail && (
        <ChangeEmailModal
          currentEmail={userData.email}
          onClose={() => setShowEmail(false)}
        />
      )}
    </div>
  );
};

type SecRowProps = {
  iconBg: string;
  icon: React.ReactNode;
  label: string;
  actionLabel?: string;
  onAction?: () => void;
  statusChip?: string;
  statusChipStyle?: string;
  rightText?: string;
};
const SecurityRow = ({
  iconBg,
  icon,
  label,
  actionLabel,
  onAction,
  statusChip,
  statusChipStyle,
  rightText,
}: SecRowProps) => (
  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 ${iconBg} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
        <span className={`${lexendMedium.className} text-gray-200`}>{label}</span>
      </div>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-3 py-1 bg-white text-black hover:bg-white/5 hover:border hover:text-white hover:border-gray-400 rounded-full text-sm font-medium border transition-colors"
        >
          {actionLabel}
        </button>
      )}

      {statusChip && (
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusChipStyle}`}>
          {statusChip}
        </span>
      )}

      {rightText && <span className={`${lexendMedium.className} text-white`}>{rightText}</span>}
    </div>
  </div>
);

export default MyAccountContent;

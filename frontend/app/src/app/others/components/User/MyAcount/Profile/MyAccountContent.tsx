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
  Gamepad2,
} from "lucide-react";

import EditProfileModal from "./EditProfileModal";
import ChangePasswordModal from "./ChangePasswordModal";
import ChangeEmailModal from "./ChangeEmailModal";
import LocationFields from "../../../Owner/Theatre/LocationFields";
import MapLocationPicker from "@/app/others/components/Leaflet/MapLocationPicker";
import Loader from "../../../utils/Loader";

const lexendBold = { className: "font-bold" };
const lexendMedium = { className: "font-medium" };
const lexendSmall = { className: "font-normal text-sm" };

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
  location?: {
    type: "Point";
    coordinates: [number, number];
  };

  isVerified: boolean;
  xpPoints: number;
  joinedAt: Date;
  lastActive: Date;
  isActive: boolean;
}

interface MyAccountContentProps {
  userData: IUser | null;
  getUeserDetails(): void;
}

type InfoRowProps = { label: string; icon: React.ReactNode; value: string };
const InfoRow = ({ label, icon, value }: InfoRowProps) => (
  <div>
    <label
      className={`${lexendSmall.className} block text-sm font-medium text-gray-300 mb-3`}
    >
      {icon}
      {label}
    </label>
    <div className="bg-black/10 backdrop-blur-md border border-white/10 rounded-xl p-4">
      <p className={`${lexendMedium.className} text-white`}>{value}</p>
    </div>
  </div>
);

type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
};
const StatCard = ({ icon, label, value, sub }: StatCardProps) => (
  <div className="bg-black/10 backdrop-blur-md border border-white/10 rounded-xl p-5 text-center">
    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mx-auto mb-3">
      {icon}
    </div>
    <p className={`${lexendSmall.className} text-gray-400 text-xs mb-1`}>
      {label}
    </p>
    <p className={`${lexendBold.className} text-white text-lg`}>{value}</p>
    {sub && (
      <p className={`${lexendSmall.className} text-gray-500 text-xs`}>{sub}</p>
    )}
  </div>
);

const MyAccountContent = ({
  getUeserDetails,
  userData,
}: MyAccountContentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  if (!userData) return <div className="text-white "><Loader text="Loading Profile" /></div>;

  const membershipLevel =
    userData.xpPoints >= 5_000
      ? "Premium"
      : userData.xpPoints >= 2_000
        ? "Gold"
        : userData.xpPoints >= 500
          ? "Silver"
          : "Bronze";

  const nextLevelPoints =
    userData.xpPoints >= 5_000
      ? 0
      : userData.xpPoints >= 2_000
        ? 5_000 - userData.xpPoints
        : userData.xpPoints >= 500
          ? 2_000 - userData.xpPoints
          : 500 - userData.xpPoints;

  const progressPct = (() => {
    const tiers = { Bronze: 500, Silver: 1_500, Gold: 3_000, Premium: 1 };
    const tierLimit = tiers[membershipLevel as keyof typeof tiers];
    const pointsIntoTier =
      membershipLevel === "Premium" ? tierLimit : userData.xpPoints % tierLimit;
    return Math.min(100, (pointsIntoTier / tierLimit) * 100);
  })();

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
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
          className={`${lexendMedium.className} flex items-center gap-2 px-6 py-3 bg-white/90 text-black hover:bg-white hover:shadow-lg rounded-xl transition-all duration-200`}
        >
          {/* <Edit3 className="w-4 h-4" /> */}
          Edit Profile
        </button>
      </div>
<div className="mb-4 p-8 rounded-xl bg-black/30 border border-gray-600/30">
  <div className="flex flex-col items-center text-center">
    {/* Centered round avatar */}
    <div className="relative mb-6">
      <img
        src={userData.profilePicture || "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"}
        alt={userData.username}
        className="w-32 h-32 rounded-full object-cover border-4 border-gray-600/30 shadow-lg"
      />
    </div>

    {/* Name and username centered */}
    <div className="mb-6">
      <h2 className={`${lexendBold} text-white text-2xl mb-2`}>
        {userData.firstName && userData.lastName
          ? `${userData.firstName} ${userData.lastName}`
          : userData.username}
      </h2>
      <p className={`${lexendMedium} text-gray-300 text-sm mb-3 flex items-center justify-center gap-2`}>
        @{userData.username}
      </p>
      
      {/* Membership level */}
      <div className={`${lexendSmall} bg-black/20 px-3 py-1 rounded-lg border border-gray-600/20 flex justify-center items-center text-gray-300 text-sm`}>
        <Award className="w-3 h-3 mr-1" />
        {membershipLevel} Member
      </div>
    </div>

    {/* Stats grid */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      <div className="p-4 rounded-lg bg-black/20 border border-gray-600/20 text-center">
        <div className="flex justify-center mb-2">
          <Gamepad2 className="w-5 h-5 text-white" />
        </div>
        <div className={`${lexendBold} text-white text-lg mb-1`}>
          {userData.xpPoints.toLocaleString()}
        </div>
        <div className={`${lexendSmall} text-gray-400 text-xs`}>
          XP Points
        </div>
        {nextLevelPoints > 0 && (
          <div className={`${lexendSmall} text-gray-500 text-xs mt-1`}>
            {nextLevelPoints} to next level
          </div>
        )}
      </div>

      <div className="p-4 rounded-lg bg-black/20 border border-gray-600/20 text-center">
        <div className="flex justify-center mb-2">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <div className={`${lexendBold} text-white text-lg mb-1`}>
          {userData.joinedAt.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })}
        </div>
        <div className={`${lexendSmall} text-gray-400 text-xs`}>
          Member Since
        </div>
      </div>

      <div className="p-4 rounded-lg bg-black/20 border border-gray-600/20 text-center">
        <div className="flex justify-center mb-2">
          <Clock className="w-5 h-5 text-white" />
        </div>
        <div className={`${lexendBold} text-white text-lg mb-1`}>
          {userData.lastActive.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </div>
        <div className={`${lexendSmall} text-gray-400 text-xs`}>
          Last Active
        </div>
      </div>

      <div className="p-4 rounded-lg bg-black/20 border border-gray-600/20 text-center">
        <div className="flex justify-center mb-2">
          <Globe className="w-5 h-5 text-white" />
        </div>
        <div className={`${lexendBold} text-white text-lg mb-1`}>
          {userData.language === "en" ? "English" : userData.language ?? "—"}
        </div>
        <div className={`${lexendSmall} text-gray-400 text-xs`}>
          Language
        </div>
      </div>
    </div>
  </div>
</div>

      <div className="bg-black/10 backdrop-blur-md border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-white/90 text-black rounded-xl flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <h3 className={`${lexendBold.className} text-xl text-white`}>
            Personal Information
          </h3>
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
            value={
              userData.language === "en" ? "English" : userData.language ?? "—"
            }
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
              value={`${userData.locationCity ?? ""}${userData.locationCity && userData.locationState ? ", " : ""
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
              value={
                userData.gender.charAt(0).toUpperCase() +
                userData.gender.slice(1)
              }
            />
          )}

          {userData.location && (
            <div>
              <div className="flex items-center gap-3 p-3">
                <h4 className={`${lexendMedium.className} text-white`}>Your location</h4>
                <button
                  onClick={() => {
                    const url = `https://www.google.com/maps?q=${userData?.location?.coordinates[1]},${userData?.location?.coordinates[0]}`;
                    window.open(url, "_blank");
                  }}
                  className="text-blue-400 hover:text-blue-300 underline text-sm transition-colors"
                >
                  View on Google Maps
                </button>
              </div>
              <MapLocationPicker
                readOnly={true}
                initialPosition={[
                  userData.location.coordinates[1] || 28.7041,
                  userData.location.coordinates[0] || 77.1025
                ]}
              />
            </div>
          )}
        </div>
      </div>

      <div className="bg-black/10 backdrop-blur-md border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-white/90 text-black rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className={`${lexendBold.className} text-xl text-white`}>
            Security &amp; Status
          </h3>
        </div>

        <div className="space-y-4">
          <SecurityRow
            iconBg="bg-white/90"
            icon={<Key className="w-4 h-4 text-black" />}
            label="Password"
            actionLabel="Change"
            onAction={() => setShowPwd(true)}
          />
          <SecurityRow
            iconBg="bg-white/90"
            icon={<Mail className="w-4 h-4 text-black" />}
            label="Email"
            actionLabel="Change"
            onAction={() => setShowEmail(true)}
          />

          <SecurityRow
            iconBg="bg-white/90"
            icon={<Clock className="w-4 h-4 text-black" />}
            label="Last Login"
            rightText={userData.lastActive.toLocaleDateString()}
          />

          {/* membership progress */}
          <div className="bg-black/10 backdrop-blur-md border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center">
                  <Award className="w-4 h-4 text-black" />
                </div>
                <span className={`${lexendMedium.className} text-gray-200`}>
                  Membership Level
                </span>
              </div>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/90 text-black border">
                {membershipLevel}
              </span>
            </div>
            {nextLevelPoints > 0 && (
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-white/80 to-white/60 h-2 rounded-full transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ───── footer ───── */}
      <div className="text-center bg-black/10 backdrop-blur-md border border-white/10 rounded-2xl p-6">
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
        <EditProfileModal
          user={userData}
          onClose={() => {
            getUeserDetails();
            setIsEditing(false);
          }}
        />
      )}
      {showPwd && (
        <ChangePasswordModal
          onClose={() => {
            setShowPwd(false);
          }}
        />
      )}
      {showEmail && (
        <ChangeEmailModal
          currentEmail={userData.email}
          onClose={() => {
            setShowEmail(false);
          }}
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
  <div className="bg-black/10 backdrop-blur-md border border-white/10 rounded-xl p-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 ${iconBg} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
        <span className={`${lexendMedium.className} text-gray-200`}>
          {label}
        </span>
      </div>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-white/90 text-black hover:bg-white hover:shadow-lg rounded-lg text-sm font-medium transition-all duration-200"
        >
          {actionLabel}
        </button>
      )}

      {statusChip && (
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusChipStyle}`}>
          {statusChip}
        </span>
      )}

      {rightText && (
        <span className={`${lexendMedium.className} text-white`}>
          {rightText}
        </span>
      )}
    </div>
  </div>
);

export default MyAccountContent;

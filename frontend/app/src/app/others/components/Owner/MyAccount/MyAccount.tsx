"use client";

import React, { useEffect, useState } from "react";
import { Lexend } from "next/font/google";
import {
  getOwnerProfile,
} from "@/app/others/services/ownerServices/ownerServices";
import toast from "react-hot-toast";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import PersonalDetailsSection from "./PersonalDetailsSection";
import ProfileOverviewCard from "./ProfileOverviewCard";
import BankDetailsSection from "./BankDetailsSection";
import KYCDocumentsSection from "./KYCDocumentsSection";
import PersonalDetailsModal from "./PersonalDetailsModal";
import BankDetailsModal from "./BankDetailsModal";
import KYCModal from "./KYCModal";

const lexendBold = Lexend({
  weight: "700",
  subsets: ["latin"],
});

const lexendSmall = Lexend({
  weight: "300",
  subsets: ["latin"],
});

export interface UserProfile {
  _id: string;
  ownerName: string;
  phone: string;
  email: string;
  aadhaar: string;
  pan: string;
  accountHolder: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
  aadhaarUrl: string;
  panUrl: string;
  ownerPhotoUrl: string;
  isActive: boolean;
  isVerified: boolean;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

export interface PersonalDetails {
  ownerName: string;
  phone: string;
  email: string;
  accountHolder: string;
}

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  ifsc: string;
}

export const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const maskSensitiveData = (
  data: string | undefined,
  visibleChars: number = 4
) => {
  if (!data) return "Not provided";
  if (data.length <= visibleChars) return data;
  return data.slice(0, visibleChars) + "*".repeat(data.length - visibleChars);
};

const MyAccount: React.FC = () => {
  const [showPersonalModal, setShowPersonalModal] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [showKYCModal, setShowKYCModal] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>({
    ownerName: "",
    phone: "",
    email: "",
    accountHolder: "",
  });
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    bankName: "",
    accountNumber: "",
    ifsc: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function getOwnerDetails() {
    try {
      setLoading(true);
      const data = await getOwnerProfile();
      let result = data.data;
      setProfile(result);

      setBankDetails({
        bankName: result.bankName || "",
        accountNumber: result.accountNumber || "",
        ifsc: result.ifsc || "",
      });

      setPersonalDetails({
        ownerName: result.ownerName || "",
        phone: result.phone || "",
        email: result.email || "",
        accountHolder: result.accountHolder || "",
      });
    } catch (error) {
      console.error("Error fetching owner profile:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getOwnerDetails();
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  if (!profile) {
    return <ErrorState onRetry={getOwnerDetails} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className={`${lexendBold.className} text-3xl text-white mb-2`}>
            My Account
          </h1>
          <p className={`${lexendSmall.className} text-gray-400`}>
            Manage your profile and account settings
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ProfileOverviewCard profile={profile} />

        <div className="lg:col-span-2 space-y-6">
          <PersonalDetailsSection
            profile={profile}
            onEdit={() => setShowPersonalModal(true)}
            saving={saving}
          />

          <BankDetailsSection
            profile={profile}
            onEdit={() => setShowBankModal(true)}
            saving={saving}
          />

          <KYCDocumentsSection
            profile={profile}
            onView={() => setShowKYCModal(true)}
          />
        </div>
      </div>

      {/* Modals */}
      <PersonalDetailsModal
        show={showPersonalModal}
        onClose={() => setShowPersonalModal(false)}
        personalDetails={personalDetails}
        setPersonalDetails={setPersonalDetails}
        profile={profile}
        setProfile={setProfile}
        saving={saving}
        setSaving={setSaving}
      />

      <BankDetailsModal
        show={showBankModal}
        onClose={() => setShowBankModal(false)}
        bankDetails={bankDetails}
        setBankDetails={setBankDetails}
        profile={profile}
        setProfile={setProfile}
        saving={saving}
        setSaving={setSaving}
      />

      <KYCModal
        show={showKYCModal}
        onClose={() => setShowKYCModal(false)}
        profile={profile}
      />
    </div>
  );
};

export default MyAccount;

import React, { useState } from "react";
import { Lexend } from "next/font/google";
import { X, Save } from "lucide-react";
import { updateOwnerProfile } from "@/app/others/services/ownerServices/ownerServices";
import toast from "react-hot-toast";
import { PersonalDetails, UserProfile } from "./MyAccount";
import ChangeEmailModal from "./ChangeEmailModal";
import ChangePasswordModal from "./ChangePasswordModal";

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

interface PersonalDetailsModalProps {
  show: boolean;
  onClose: () => void;
  personalDetails: PersonalDetails;
  setPersonalDetails: React.Dispatch<React.SetStateAction<PersonalDetails>>;
  profile: UserProfile | null;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  saving: boolean;
  setSaving: React.Dispatch<React.SetStateAction<boolean>>;
}

const PersonalDetailsModal: React.FC<PersonalDetailsModalProps> = ({
  show,
  onClose,
  personalDetails,
  setPersonalDetails,
  profile,
  setProfile,
  saving,
  setSaving,
}) => {
  const [showChangeEmailModal, setShowChangeEmailModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const handlePersonalSave = async () => {
    if (!profile) return;

    if (
      !personalDetails.ownerName.trim() ||
      !personalDetails.email.trim() ||
      !personalDetails.phone.trim() ||
      !personalDetails.accountHolder.trim()
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(personalDetails.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (personalDetails.phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    try {
      setSaving(true);
      const result = await updateOwnerProfile(personalDetails);

      if (result.success) {
        setProfile((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            ...personalDetails,
          };
        });

        toast.success("Personal details updated successfully");
        onClose();
      } else {
        toast.error(result.message || "Failed to update personal details");
      }
    } catch (error) {
      console.error("Error updating personal details:", error);
      toast.error("Failed to update personal details");
    } finally {
      setSaving(false);
    }
  };

  const handleEmailChangeSuccess = (newEmail: string) => {
    setPersonalDetails((prev) => ({
      ...prev,
      email: newEmail,
    }));

    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        email: newEmail,
      };
    });

    setShowChangeEmailModal(false);
  };

  if (!show) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-black/95 border border-gray-500/30 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`${lexendBold.className} text-2xl text-white`}>
              Edit Personal Details
            </h2>
            <button
              onClick={onClose}
              disabled={saving}
              className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label
                className={`${lexendSmall.className} text-gray-400 text-sm block mb-2`}
              >
                Full Name *
              </label>
              <input
                type="text"
                value={personalDetails.ownerName}
                onChange={(e) =>
                  setPersonalDetails((prev) => ({
                    ...prev,
                    ownerName: e.target.value,
                  }))
                }
                disabled={saving}
                className={`${lexendMedium.className} w-full px-4 py-3 bg-white/10 border border-gray-500/30 rounded-xl text-white focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all duration-300 disabled:opacity-50`}
              />
            </div>

            <div className="flex justify-between items-end gap-4">
              <div className="flex-1">
                <label
                  className={`${lexendSmall.className} text-gray-400 text-sm block mb-2`}
                >
                  Email Address 
                </label>
                <input
                  type="email"
                  value={personalDetails.email}
                  disabled={true}
                  className={`${lexendMedium.className} w-full px-4 py-3 bg-white/10 border border-gray-500/30 rounded-xl text-white focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all duration-300 disabled:opacity-50`}
                />
              </div>
              <button
                type="button"
                onClick={() => setShowChangeEmailModal(true)}
                disabled={saving}
                className={`${lexendMedium.className} bg-green-600 hover:bg-green-500 disabled:bg-green-600/50 disabled:cursor-not-allowed rounded-xl text-white text-sm px-4 py-3 h-12 transition-all duration-300`}
              >
                Change
              </button>
            </div>

            <div>
              <label
                className={`${lexendSmall.className} text-gray-400 text-sm block mb-2`}
              >
                Phone Number *
              </label>
              <input
                type="tel"
                value={personalDetails.phone}
                onChange={(e) =>
                  setPersonalDetails((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
                disabled={saving}
                className={`${lexendMedium.className} w-full px-4 py-3 bg-white/10 border border-gray-500/30 rounded-xl text-white focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all duration-300 disabled:opacity-50`}
              />
            </div>

            <div>
              <label
                className={`${lexendSmall.className} text-gray-400 text-sm block mb-2`}
              >
                Account Holder Name
              </label>
              <input
                type="text"
                value={personalDetails.accountHolder}
                onChange={(e) =>
                  setPersonalDetails((prev) => ({
                    ...prev,
                    accountHolder: e.target.value,
                  }))
                }
                disabled={saving}
                className={`${lexendMedium.className} w-full px-4 py-3 bg-white/10 border border-gray-500/30 rounded-xl text-white focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all duration-300 disabled:opacity-50`}
              />
            </div>
          <div className="flex justify-between items-end gap-4">
              <div className="flex-1">
                <label
                  className={`${lexendSmall.className} text-gray-400 text-sm block mb-2`}
                >
                  Password
                </label>
                <input
                type="text"
                  value='********'
                  disabled={true}
                  className={`${lexendMedium.className} w-full px-4 py-3 bg-white/10 border border-gray-500/30 rounded-xl text-white focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all duration-300 disabled:opacity-50`}
                />
              </div>
              <button
                type="button"
                onClick={() => setShowChangePasswordModal(true)}
                disabled={saving}
                className={`${lexendMedium.className} bg-green-600 hover:bg-green-500 disabled:bg-green-600/50 disabled:cursor-not-allowed rounded-xl text-white text-sm px-4 py-3 h-12 transition-all duration-300`}
              >
                Change
              </button>
            </div>
          </div>

          <div className="flex gap-3 mt-6 justify-end">
            <button
              onClick={onClose}
              disabled={saving}
              className={`${lexendMedium.className} bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Cancel
            </button>
            <button
              onClick={handlePersonalSave}
              disabled={saving}
              className={`${lexendMedium.className} bg-white text-black px-6 py-3 rounded-xl hover:bg-gray-200 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Save className="w-5 h-5" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
{showChangePasswordModal&&(
  <ChangePasswordModal onClose={()=>setShowChangePasswordModal(false)} />
)}
      {/* Change Email Modal */}
      {showChangeEmailModal && (
        <ChangeEmailModal
          currentEmail={personalDetails.email}
          onClose={() => setShowChangeEmailModal(false)}
          onEmailChanged={handleEmailChangeSuccess}
        />
      )}
    </>
  );
};

export default PersonalDetailsModal;

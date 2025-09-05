import React, { useEffect } from "react";
import { Lexend } from "next/font/google";
import { X, Save } from "lucide-react";
import { updateOwnerProfile } from "@/app/others/services/ownerServices/ownerServices";
import toast from "react-hot-toast";
import { BankDetails, UserProfile } from "./MyAccount";

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

interface BankDetailsModalProps {
  show: boolean;
  onClose: () => void;
  bankDetails: BankDetails;
  setBankDetails: React.Dispatch<React.SetStateAction<BankDetails>>;
  profile: UserProfile | null;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  saving: boolean;
  setSaving: React.Dispatch<React.SetStateAction<boolean>>;
  
}

const BankDetailsModal: React.FC<BankDetailsModalProps> = ({
  show,
  onClose,
  bankDetails,
  setBankDetails,
  profile,
  setProfile,
  saving,
  setSaving,
}) => {
  // Prefill bank details when modal opens and profile data is available
  useEffect(() => {
    if (show && profile) {
      setBankDetails({
        bankName: profile.bankName || "",
        accountNumber: profile.accountNumber || "",
        ifsc: profile.ifsc || "",
        accountHolder: profile.accountHolder || profile.ownerName || "",
      });
    }
  }, [show, profile, setBankDetails]);

  const handleBankSave = async () => {
    if (!profile) return;
    
    if (
      !bankDetails.bankName.trim() ||
      !bankDetails.accountNumber.trim() ||
      !bankDetails.ifsc.trim() ||
      !bankDetails.accountHolder.trim()
    ) {
      toast.error("Please fill all bank details fields");
      return;
    }

    if (bankDetails.ifsc.length !== 11) {
      toast.error("IFSC code must be 11 characters long");
      return;
    }

    if (
      bankDetails.accountNumber.length < 9 ||
      bankDetails.accountNumber.length > 18
    ) {
      toast.error("Please enter a valid account number");
      return;
    }

    try {
      setSaving(true);
      const result = await updateOwnerProfile(bankDetails);

      if (result.success) {
        setProfile((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            bankName: bankDetails.bankName,
            accountNumber: bankDetails.accountNumber,
            ifsc: bankDetails.ifsc,
            accountHolder: bankDetails.accountHolder,
          };
        });

        toast.success("Bank details updated successfully");
        onClose();
      } else {
        toast.error(result.message || "Failed to update bank details");
      }
    } catch (error) {
      console.error("Error updating bank details:", error);
      toast.error("Failed to update bank details");
    } finally {
      setSaving(false);
    }
  };

  // Reset form when modal closes
  const handleClose = () => {
    if (!saving) {
      // Reset to original values when closing without saving
      if (profile) {
        setBankDetails({
          bankName: profile.bankName || "",
          accountNumber: profile.accountNumber || "",
          ifsc: profile.ifsc || "",
          accountHolder: profile.accountHolder || profile.ownerName || "",
        });
      }
      onClose();
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black/95 border border-gray-500/30 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className={`${lexendBold.className} text-2xl text-white`}>
            {profile?.bankName ? "Edit" : "Add"} Bank Details
          </h2>
          <button
            onClick={handleClose}
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
              Account Holder Name *
            </label>
            <input
              type="text"
              value={bankDetails.accountHolder}
              onChange={(e) =>
                setBankDetails((prev) => ({
                  ...prev,
                  accountHolder: e.target.value,
                }))
              }
              disabled={saving}
              placeholder="Enter account holder name"
              className={`${lexendMedium.className} w-full px-4 py-3 bg-white/10 border border-gray-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all duration-300 disabled:opacity-50`}
            />
          </div>

          <div>
            <label
              className={`${lexendSmall.className} text-gray-400 text-sm block mb-2`}
            >
              Bank Name *
            </label>
            <input
              type="text"
              value={bankDetails.bankName}
              onChange={(e) =>
                setBankDetails((prev) => ({
                  ...prev,
                  bankName: e.target.value,
                }))
              }
              disabled={saving}
              placeholder="Enter your bank name"
              className={`${lexendMedium.className} w-full px-4 py-3 bg-white/10 border border-gray-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all duration-300 disabled:opacity-50`}
            />
          </div>

          <div>
            <label
              className={`${lexendSmall.className} text-gray-400 text-sm block mb-2`}
            >
              Account Number *
            </label>
            <input
              type="text"
              value={bankDetails.accountNumber}
              onChange={(e) =>
                setBankDetails((prev) => ({
                  ...prev,
                  accountNumber: e.target.value,
                }))
              }
              disabled={saving}
              placeholder="Enter your account number"
              className={`${lexendMedium.className} w-full px-4 py-3 bg-white/10 border border-gray-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all duration-300 disabled:opacity-50`}
            />
          </div>

          <div>
            <label
              className={`${lexendSmall.className} text-gray-400 text-sm block mb-2`}
            >
              IFSC Code *
            </label>
            <input
              type="text"
              value={bankDetails.ifsc}
              onChange={(e) =>
                setBankDetails((prev) => ({
                  ...prev,
                  ifsc: e.target.value.toUpperCase(),
                }))
              }
              disabled={saving}
              placeholder="Enter IFSC code"
              maxLength={11}
              className={`${lexendMedium.className} w-full px-4 py-3 bg-white/10 border border-gray-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all duration-300 disabled:opacity-50`}
            />
            <p className={`${lexendSmall.className} text-gray-500 text-xs mt-1`}>
              Current: {bankDetails.ifsc.length}/11 characters
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6 justify-end">
          <button
            onClick={handleClose}
            disabled={saving}
            className={`${lexendMedium.className} bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Cancel
          </button>
          <button
            onClick={handleBankSave}
            disabled={saving}
            className={`${lexendMedium.className} bg-white text-black px-6 py-3 rounded-xl hover:bg-gray-200 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Save className="w-5 h-5" />
            {saving
              ? "Saving..."
              : (profile?.bankName ? "Update" : "Add") + " Details"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BankDetailsModal;

import React from "react";
import { Lexend } from "next/font/google";
import { Building2, Edit3, CreditCard, Banknote } from "lucide-react";
import { maskSensitiveData, UserProfile } from "./MyAccount";

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

interface BankDetailsSectionProps {
  profile: UserProfile;
  onEdit: () => void;
  saving: boolean;
}

const BankDetailsSection: React.FC<BankDetailsSectionProps> = ({
  profile,
  onEdit,
  saving,
}) => {
  return (
    <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
            <Banknote className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className={`${lexendBold.className} text-xl text-white`}>
              Bank Details
            </h3>
            <p className={`${lexendSmall.className} text-gray-400`}>
              Your banking information for payments
            </p>
          </div>
        </div>
        <button
          onClick={onEdit}
          disabled={saving}
          className={`${lexendMedium.className} bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-all duration-300 flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <Edit3 className="w-4 h-4" />
          {profile.bankName ? "Edit" : "Add Details"}
        </button>
      </div>

      {profile.bankName ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
            <Building2 className="w-5 h-5 text-gray-400" />
            <div>
              <p className={`${lexendSmall.className} text-gray-400 text-xs`}>
                Bank Name
              </p>
              <p className={`${lexendMedium.className} text-white`}>
                {profile.bankName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
            <CreditCard className="w-5 h-5 text-gray-400" />
            <div>
              <p className={`${lexendSmall.className} text-gray-400 text-xs`}>
                Account Number
              </p>
              <p className={`${lexendMedium.className} text-white`}>
                {maskSensitiveData(profile.accountNumber)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
            <Building2 className="w-5 h-5 text-gray-400" />
            <div>
              <p className={`${lexendSmall.className} text-gray-400 text-xs`}>
                IFSC Code
              </p>
              <p className={`${lexendMedium.className} text-white`}>
                {profile.ifsc}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <Banknote className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className={`${lexendMedium.className} text-gray-400`}>
            Please provide your bank details to receive payments
          </p>
        </div>
      )}
    </div>
  );
};

export default BankDetailsSection;

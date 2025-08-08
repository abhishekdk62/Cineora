import React from "react";
import { Lexend } from "next/font/google";
import { IdCard, FileText, Eye } from "lucide-react";
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

interface KYCDocumentsSectionProps {
  profile: UserProfile;
  onView: () => void;
}

const KYCDocumentsSection: React.FC<KYCDocumentsSectionProps> = ({
  profile,
  onView,
}) => {
  return (
    <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
            <IdCard className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className={`${lexendBold.className} text-xl text-white`}>
              KYC Documents
            </h3>
            <p className={`${lexendSmall.className} text-gray-400`}>
              Your identity verification documents (View only)
            </p>
          </div>
        </div>
        <button
          onClick={onView}
          className={`${lexendMedium.className} bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all duration-300 flex items-center gap-2 text-sm`}
        >
          <Eye className="w-4 h-4" />
          View
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
          <IdCard className="w-5 h-5 text-gray-400" />
          <div>
            <p className={`${lexendSmall.className} text-gray-400 text-xs`}>
              Aadhaar Number
            </p>
            <p className={`${lexendMedium.className} text-white`}>
              {maskSensitiveData(profile.aadhaar, 4)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
          <FileText className="w-5 h-5 text-gray-400" />
          <div>
            <p className={`${lexendSmall.className} text-gray-400 text-xs`}>
              PAN Number
            </p>
            <p className={`${lexendMedium.className} text-white`}>
              {maskSensitiveData(profile.pan, 4)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYCDocumentsSection;

//@ts-nocheck
import React from "react";
import { Lexend } from "next/font/google";
import { X, IdCard, FileText, User } from "lucide-react";
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

interface KYCModalProps {
  show: boolean;
  onClose: () => void;
  profile: UserProfile;
  docs:string
}

const KYCModal: React.FC<KYCModalProps> = ({ show, onClose, profile,docs }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black/95 border border-gray-500/30 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className={`${lexendBold.className} text-2xl text-white`}>
            KYC Documents
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Aadhaar */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <IdCard className="w-5 h-5 text-blue-400" />
              <h3 className={`${lexendMedium.className} text-white`}>
                Aadhaar Card
              </h3>
            </div>
            <p className={`${lexendSmall.className} text-gray-400`}>
              Number: {profile.aadhaar}
            </p>
            <div className="bg-white/5 rounded-xl p-4 aspect-video flex items-center justify-center">
              {profile.aadhaarUrl ? (
                <img
                  src={docs.aadhaarUrl}
                  alt="Aadhaar Document"
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              ) : (
                <div className="text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className={`${lexendSmall.className} text-gray-400`}>
                    No document
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* PAN */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-green-400" />
              <h3 className={`${lexendMedium.className} text-white`}>
                PAN Card
              </h3>
            </div>
            <p className={`${lexendSmall.className} text-gray-400`}>
              Number: {profile.pan}
            </p>
            <div className="bg-white/5 rounded-xl p-4 aspect-video flex items-center justify-center">
              {profile.panUrl ? (
                <img
                  src={docs.panUrl}
                  alt="PAN Document"
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              ) : (
                <div className="text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className={`${lexendSmall.className} text-gray-400`}>
                    No document
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Owner Photo */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-purple-400" />
              <h3 className={`${lexendMedium.className} text-white`}>
                Owner Photo
              </h3>
            </div>
            <p className={`${lexendSmall.className} text-gray-400`}>
              Profile Picture
            </p>
            <div className="bg-white/5 rounded-xl p-4 aspect-video flex items-center justify-center">
              {profile.ownerPhotoUrl ? (
                <img
                  src={docs.ownerPhotoUrl}
                  alt="Owner Photo"
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              ) : (
                <div className="text-center">
                  <User className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className={`${lexendSmall.className} text-gray-400`}>
                    No photo
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className={`${lexendMedium.className} bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition-all duration-300`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default KYCModal;

"use client";

import { useState } from "react";
import { X, Key, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import { resetPassword } from "@/app/others/services/userServices/authServices";
import toast from "react-hot-toast";

const lexendBold = { className: "font-bold" };
const lexendMedium = { className: "font-medium" };
const lexendSmall = { className: "font-normal text-sm" };

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordModalProps {
  onClose: () => void;
}

const ChangePasswordModal = ({ onClose }: ChangePasswordModalProps) => {
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPasswordError("");
  };

  const handlePasswordSubmit = async () => {
    setPasswordError("");
    setPasswordSuccess("");
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setPasswordError("All fields are required");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      setPasswordError("New password must be different from current password");
      return;
    }

    setPasswordLoading(true);
    try {
      console.log("Changing password:", passwordData);
      const result = await resetPassword(
        passwordData.newPassword,
        passwordData.currentPassword
      );
      console.log(result);
      onClose();
      toast.success("Password changed successfully");
    } catch (error) {
      console.log(error);

      setPasswordError(
        "Failed to change password. Please check your current password."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/10 rounded-2xl backdrop-blur-xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white  rounded-xl flex items-center justify-center">
              <Key className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 className={`${lexendBold.className} text-xl text-white`}>
                Change Password
              </h2>
              <p className={`${lexendSmall.className} text-gray-400`}>
                Update your account password
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4">
          {passwordError && (
            <div className=" rounded-lg p-3">
              <p className={`${lexendSmall.className} text-red-400 text-sm`}>
                {passwordError}
              </p>
            </div>
          )}

          {passwordSuccess && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              <p
                className={`${lexendSmall.className} text-green-400 text-sm flex items-center gap-2`}
              >
                <CheckCircle className="w-4 h-4" />
                {passwordSuccess}
              </p>
            </div>
          )}

          <div>
            <label
              className={`${lexendSmall.className} block text-sm font-medium text-gray-200 mb-2`}
            >
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className={`${lexendMedium.className} w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm`}
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showCurrentPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label
              className={`${lexendSmall.className} block text-sm font-medium text-gray-200 mb-2`}
            >
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className={`${lexendMedium.className} w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm`}
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showNewPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {passwordData.newPassword &&
              passwordData.newPassword.length < 6 && (
                <p
                  className={`${lexendSmall.className} text-yellow-400 text-xs mt-1`}
                >
                  Password must be at least 6 characters
                </p>
              )}
          </div>

          <div>
            <label
              className={`${lexendSmall.className} block text-sm font-medium text-gray-200 mb-2`}
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className={`${lexendMedium.className} w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm`}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {passwordData.confirmPassword &&
              passwordData.newPassword !== passwordData.confirmPassword && (
                <p
                  className={`${lexendSmall.className} text-red-400 text-xs mt-1`}
                >
                  Passwords do not match
                </p>
              )}
          </div>

          {/* Password Requirements */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-3">
            <p
              className={`${lexendSmall.className} text-gray-300 text-xs mb-2`}
            >
              Password requirements:
            </p>
            <ul
              className={`${lexendSmall.className} text-gray-400 text-xs space-y-1`}
            >
              <li
                className={
                  passwordData.newPassword.length >= 6
                    ? "text-green-400"
                    : "text-gray-400"
                }
              >
                • At least 6 characters long
              </li>
              <li
                className={
                  passwordData.newPassword !== passwordData.currentPassword &&
                  passwordData.newPassword
                    ? "text-green-400"
                    : "text-gray-400"
                }
              >
                • Different from current password
              </li>
              <li
                className={
                  passwordData.newPassword === passwordData.confirmPassword &&
                  passwordData.confirmPassword
                    ? "text-green-400"
                    : "text-gray-400"
                }
              >
                • Passwords match
              </li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-4 p-6 border-t border-white/10">
          <button
            onClick={onClose}
            className={`${lexendMedium.className} px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-all duration-200`}
          >
            Cancel
          </button>
          <button
            onClick={handlePasswordSubmit}
            disabled={
              passwordLoading ||
              !passwordData.currentPassword ||
              !passwordData.newPassword ||
              !passwordData.confirmPassword ||
              passwordData.newPassword !== passwordData.confirmPassword
            }
            className={`${lexendMedium.className} px-6 py-2 bg-gradient-to-r  text-black bg-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
          >
            {passwordLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Changing...
              </>
            ) : (
              "Change Password"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;

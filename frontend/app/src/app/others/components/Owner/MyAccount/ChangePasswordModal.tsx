"use client";

import { useState } from "react";
import { X, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { resetPassword } from "@/app/others/services/ownerServices/ownerServices";

const lexendBold = { className: "font-bold" };
const lexendMedium = { className: "font-medium" };
const lexendSmall = { className: "font-normal text-sm" };

interface PasswordChangeData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordModalProps {
  onClose: () => void;
  onPasswordChanged?: () => void;
}

const ChangePasswordModal = ({ onClose, onPasswordChanged }: ChangePasswordModalProps) => {
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPasswordError("");
  };

  const handleChangePassword = async () => {
    if (!passwordData.oldPassword) {
      setPasswordError("Please enter your old password");
      return;
    }

    if (!passwordData.newPassword) {
      setPasswordError("Please enter a new password");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long");
      return;
    }

    if (passwordData.oldPassword === passwordData.newPassword) {
      setPasswordError("New password cannot be the same as old password");
      return;
    }

    if (!passwordData.confirmPassword) {
      setPasswordError("Please confirm your new password");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New password and confirm password do not match");
      return;
    }

    setPasswordLoading(true);
    try {
      const result = await resetPassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      if (result.success) {
        toast.success("Password changed successfully");
        onPasswordChanged?.();
        handleClose();
      } else {
        setPasswordError(result.message || "Failed to change password");
      }
    } catch (error: any) {
      console.error("Change password error:", error);
      setPasswordError(
        error.response?.data?.message || "Failed to change password"
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleClose = () => {
    setPasswordData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordError("");
    setShowOldPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleChangePassword();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-md bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/10 rounded-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <Lock className="w-5 h-5 text-black" />
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
            onClick={handleClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
          {passwordError && (
            <div className="rounded-lg p-3">
              <p
                className={`${lexendSmall.className} text-center text-red-400 text-sm`}
              >
                {passwordError}
              </p>
            </div>
          )}

          {/* Old Password */}
          <div>
            <label
              className={`${lexendSmall.className} block text-sm font-medium text-gray-200 mb-2`}
            >
              Old Password
            </label>
            <div className="relative">
              <input
                type={showOldPassword ? "text" : "password"}
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={handleInputChange}
                className={`${lexendMedium.className} w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm`}
                placeholder="Enter your old password"
                required
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showOldPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
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
                onChange={handleInputChange}
                className={`${lexendMedium.className} w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm`}
                placeholder="Enter your new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showNewPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              className={`${lexendSmall.className} block text-sm font-medium text-gray-200 mb-2`}
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handleInputChange}
                className={`${lexendMedium.className} w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm`}
                placeholder="Confirm your new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={
              passwordLoading || 
              !passwordData.oldPassword || 
              !passwordData.newPassword || 
              !passwordData.confirmPassword
            }
            className={`${lexendMedium.className} w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
          >
            {passwordLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Changing Password...
              </>
            ) : (
              "Change Password"
            )}
          </button>
        </form>

        <div className="flex items-center justify-end gap-4 p-6 border-t border-white/10">
          <button
            onClick={handleClose}
            className={`${lexendMedium.className} px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-all duration-200`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;

"use client";

import { useState, useEffect, useRef } from "react";
import { X, Mail, Loader2, Eye, EyeOff } from "lucide-react";

import toast from "react-hot-toast";
import { sendEmailChangeOtp, verifyEmailChangeOtp } from "@/app/others/services/ownerServices/ownerServices";

const lexendBold = { className: "font-bold" };
const lexendMedium = { className: "font-medium" };
const lexendSmall = { className: "font-normal text-sm" };
const lexend = { className: "font-normal" };

interface EmailChangeData {
  newEmail: string;
  password: string;
  otp: string[];
}

interface ChangeEmailModalProps {
  currentEmail: string;
  onClose: () => void;
  onEmailChanged?: (newEmail: string) => void;
}

const ChangeEmailModal = ({ currentEmail, onClose, onEmailChanged }: ChangeEmailModalProps) => {
  const [emailLoading, setEmailLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [emailError, setEmailError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const [emailData, setEmailData] = useState<EmailChangeData>({
    newEmail: "",
    password: "",
    otp: [],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmailData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setEmailError("");
  };

  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value.replace(/\D/g, "");

    if (value.length > 1) return;

    const newOtp = [...emailData.otp];
    newOtp[index] = value;

    setEmailData((prev) => ({
      ...prev,
      otp: newOtp,
    }));

    setEmailError("");

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !emailData.otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleSendOTP = async () => {
    if (!emailData.newEmail ) {
      setEmailError("Please enter a valid new email address");
      return;
    }
    if(emailData.newEmail === currentEmail)
    {
      setEmailError('New email cant be as current email')
      return
    }

    if (!emailData.password) {
      setEmailError("Please enter your current password");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailData.newEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setEmailLoading(true);
    try {
      const result = await sendEmailChangeOtp({
        newEmail: emailData.newEmail,
        password: emailData.password,
      });

      if (result.success) {
        setOtpSent(true);
        setOtpTimer(300);
        setEmailError("");

        setEmailData((prev) => ({
          ...prev,
          otp: [],
        }));

        setTimeout(() => {
          inputs.current[0]?.focus();
        }, 100);
      } else {
        setEmailError(
          result.message || "Failed to send OTP. Please try again."
        );
      }
    } catch (error: any) {
      console.error("Send OTP error:", error);
      setEmailError(
        error.response?.data?.message || "Failed to send OTP. Please try again."
      );
    } finally {
      setEmailLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    try {
      const result = await sendEmailChangeOtp({
        newEmail: emailData.newEmail,
        password: emailData.password,
      });

      if (result.success) {
        setOtpTimer(300);
        setEmailError("");

        setEmailData((prev) => ({
          ...prev,
          otp: [],
        }));

        inputs.current[0]?.focus();
      } else {
        setEmailError(
          result.message || "Failed to resend OTP. Please try again."
        );
      }
    } catch (error: any) {
      console.error("Resend OTP error:", error);
      setEmailError(
        error?.message || "Failed to resend OTP. Please try again."
      );
    } finally {
      setResendLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = emailData.otp.join("");
    if (otpString.length !== 6) {
      setEmailError("Please enter a valid 6-digit OTP");
      return;
    }

    setEmailLoading(true);
    try {
      const result = await verifyEmailChangeOtp({
        email: emailData.newEmail,
        otp: otpString,
      });

      if (result.success) {
        toast.success("Email changed successfully");
        onEmailChanged?.(emailData.newEmail);
        handleClose();
      } else {
        setEmailError(result.message || "Invalid OTP. Please try again.");
        setEmailData((prev) => ({
          ...prev,
          otp: [],
        }));
        inputs.current[0]?.focus();
      }
    } catch (error: any) {
      console.error("Verify OTP error:", error);
      setEmailError(
        error?.response?.data?.message || "Invalid OTP. Please try again."
      );
      setEmailData((prev) => ({
        ...prev,
        otp: [],
      }));
      inputs.current[0]?.focus();
    } finally {
      setEmailLoading(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const canResend = otpTimer === 0 && !resendLoading;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const handleClose = () => {
    setEmailData({ newEmail: "", password: "", otp: [] });
    setOtpSent(false);
    setOtpTimer(0);
    setEmailError("");
    setShowPassword(false);
    onClose();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpSent) {
      handleVerifyOTP();
    } else {
      handleSendOTP();
    }
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
              <Mail className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 className={`${lexendBold.className} text-xl text-white`}>
                {otpSent ? "Verify Your Email" : "Change Email"}
              </h2>
              <p className={`${lexendSmall.className} text-gray-400`}>
                {otpSent
                  ? `OTP sent to ${emailData.newEmail}`
                  : "Update your email address"}
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
          {emailError && (
            <div className="rounded-lg p-3">
              <p
                className={`${lexendSmall.className} text-center text-red-400 text-sm`}
              >
                {emailError}
              </p>
            </div>
          )}

          {!otpSent ? (
            <>
              <div>
                <label
                  className={`${lexendSmall.className} block text-sm font-medium text-gray-200 mb-2`}
                >
                  Current Email
                </label>
                <div className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-400 backdrop-blur-sm">
                  {currentEmail}
                </div>
              </div>

              <div>
                <label
                  className={`${lexendSmall.className} block text-sm font-medium text-gray-200 mb-2`}
                >
                  New Email Address
                </label>
                <input
                  name="newEmail"
                  value={emailData.newEmail}
                  onChange={handleInputChange}
                  className={`${lexendMedium.className} w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm`}
                  placeholder="Enter new email address"
                  required
                />
              </div>

              <div>
                <label
                  className={`${lexendSmall.className} block text-sm font-medium text-gray-200 mb-2`}
                >
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={emailData.password}
                    onChange={handleInputChange}
                    className={`${lexendMedium.className} w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm`}
                    placeholder="Enter your current password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? (
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
                  emailLoading || !emailData.newEmail || !emailData.password
                }
                className={`${lexendMedium.className} w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
              >
                {emailLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  "Send OTP"
                )}
              </button>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <h3 className={`${lexend.className} text-lg text-white mb-2`}>
                  Enter Verification Code
                </h3>
                <p className={`${lexendSmall.className} text-gray-300`}>
                  We've sent a 6-digit code to{" "}
                  <span className="text-blue-400">{emailData.newEmail}</span>
                </p>
              </div>

              <div className="flex justify-center space-x-3 mb-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <input
                    key={i}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="w-12 h-12 text-center text-white bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-lg font-medium"
                    value={emailData.otp[i] || ""}
                    onChange={(e) => handleOtpChange(e, i)}
                    onKeyDown={(e) => handleOtpKeyDown(e, i)}
                    ref={(el) => {
                      if (el) inputs.current[i] = el;
                    }}
                    disabled={emailLoading}
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={emailLoading || emailData.otp.join("").length !== 6}
                className={`${lexendMedium.className} w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
              >
                {emailLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify & Change Email"
                )}
              </button>

              <div className="text-center">
                {resendLoading ? (
                  <span
                    className={`${lexendSmall.className} flex items-center justify-center text-gray-400`}
                  >
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Sending...
                  </span>
                ) : canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className={`${lexendSmall.className} text-blue-400 hover:text-blue-300 transition-colors`}
                  >
                    Resend OTP
                  </button>
                ) : (
                  <p className={`${lexendSmall.className} text-gray-400`}>
                    Resend OTP in {formatTimer(otpTimer)}
                  </p>
                )}
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                <p
                  className={`${lexendSmall.className} text-gray-300 text-xs mb-2`}
                >
                  OTP Guidelines:
                </p>
                <ul
                  className={`${lexendSmall.className} text-gray-400 text-xs space-y-1`}
                >
                  <li>• Check your email inbox and spam folder</li>
                  <li>• OTP is valid for 5 minutes</li>
                  <li>• Enter the 6-digit code exactly as received</li>
                </ul>
              </div>
            </>
          )}
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

export default ChangeEmailModal;


"use client";

import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Lexend } from "next/font/google";
import FileUploadInput from "./FileInput";
import {
  OwnerRequestData,
  submitOwnerRequest,
  sendOwnerOTP,
  verifyOwnerOTP,
} from "../../../services/ownerServices/ownerServices";
import { useRouter } from "next/navigation";

const lexendSmall = Lexend({
  weight: "200",
  subsets: ["latin"],
});

export default function OwnerKYCForm() {
  const [formData, setFormData] = useState({
    ownerName: "",
    phone: "",
    email: "",
    aadhaar: "",
    pan: "",
    accountHolder: "",
    bankName: "",
    accountNumber: "",
    ifsc: "",
    declaration: false,
    agree: false,
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const [uploadedFiles, setUploadedFiles] = useState({
    aadhaarUrl: "",
    panUrl: "",
    ownerPhotoUrl: "",
  });

  const [uploadStatus, setUploadStatus] = useState({
    aadhaarUploading: false,
    panUploading: false,
    photoUploading: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [resendTimer]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value, type, checked } = e.target as string;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }

  const handleAadhaarUpload = (url: string) => {
    setUploadedFiles((prev) => ({ ...prev, aadhaarUrl: url }));
    setUploadStatus((prev) => ({ ...prev, aadhaarUploading: false }));
  };

  const handlePanUpload = (url: string) => {
    setUploadedFiles((prev) => ({ ...prev, panUrl: url }));
    setUploadStatus((prev) => ({ ...prev, panUploading: false }));
  };

  const handlePhotoUpload = (url: string) => {
    setUploadedFiles((prev) => ({ ...prev, ownerPhotoUrl: url }));
    setUploadStatus((prev) => ({ ...prev, photoUploading: false }));
  };

  const handleUploadStart = (type: "aadhaar" | "pan" | "photo") => {
    setUploadStatus((prev) => ({
      ...prev,
      [`${type}Uploading`]: true,
    }));
  };

  const handleUploadError = (error: string) => {
    console.error("Upload error:", error);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ""));
  };

  const validateAadhaar = (aadhaar: string): boolean => {
    const aadhaarRegex = /^\d{4}\s?\d{4}\s?\d{4}$/;
    return aadhaarRegex.test(aadhaar.replace(/\s+/g, ""));
  };

  const validatePAN = (pan: string): boolean => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan.toUpperCase().replace(/\s+/g, ""));
  };
  const router = useRouter();

  const validateIFSC = (ifsc: string): boolean => {
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    return ifscRegex.test(ifsc.toUpperCase().replace(/\s+/g, ""));
  };

  const validateAccountNumber = (accountNumber: string): boolean => {
    const accountRegex = /^\d{9,18}$/;
    return accountRegex.test(accountNumber.replace(/\s+/g, ""));
  };

  const validateName = (name: string): boolean => {
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    return nameRegex.test(name.trim());
  };

  const handleSendOTP = async () => {
    setOtpLoading(true);
    setError("");

    try {
      if (!validateEmail(formData.email)) {
        setError("Please enter a valid email address");
        setOtpLoading(false);
        return;
      }

      const result = await sendOwnerOTP(formData.email);

      if (result.success) {
        setOtpSent(true);
        setError("");
        setResendTimer(120);
        setCanResend(false);

        setOtpSent(true);
        setError("");
      } else {
        setError(result.message || "Failed to send OTP");
      }
    } catch (error: string) {
      setError(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setOtpLoading(true);
    setError("");

    try {
      if (!otp || otp.length !== 6) {
        setError("Please enter a valid 6-digit OTP");
        setOtpLoading(false);
        return;
      }

      const result = await verifyOwnerOTP(formData.email, otp);

      if (result.success) {
        setOtpVerified(true);
        setError("");
      } else {
        setError(result.message || "Invalid OTP");
      }
    } catch (error: string) {
      setError(error.response?.data?.message || "Invalid OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      if (!otpVerified) {
        setError("Please verify your email with OTP first");
        setLoading(false);
        return;
      }

      const requiredFields = {
        ownerName: "Owner name",
        phone: "Phone number",
        email: "Email address",
        aadhaar: "Aadhaar number",
        pan: "PAN number",
      };

      for (const [field, label] of Object.entries(requiredFields)) {
        if (
          !formData[field as keyof typeof formData] ||
          String(formData[field as keyof typeof formData]).trim() === ""
        ) {
          setError(`${label} is required`);
          setLoading(false);
          return;
        }
      }

      if (!formData.declaration || !formData.agree) {
        setError("You must agree to the declaration and Terms & Conditions.");
        setLoading(false);
        return;
      }

      if (!uploadedFiles.aadhaarUrl || !uploadedFiles.panUrl) {
        setError("Please upload both Aadhaar and PAN documents.");
        setLoading(false);
        return;
      }

      if (!validatePhone(formData.phone)) {
        setError("Please enter a valid 10-digit phone number");
        setLoading(false);
        return;
      }

      if (!validateEmail(formData.email)) {
        setError("Please enter a valid email address");
        setLoading(false);
        return;
      }

      if (!validateAadhaar(formData.aadhaar)) {
        setError(
          "Please enter a valid 12-digit Aadhaar number (format: 1234 5678 9012)"
        );
        setLoading(false);
        return;
      }

      if (!validatePAN(formData.pan)) {
        setError("Please enter a valid PAN number (format: ABCDE1234F)");
        setLoading(false);
        return;
      }

      if (!validateName(formData.ownerName)) {
        setError(
          "Owner name should only contain letters and spaces (2-50 characters)"
        );
        setLoading(false);
        return;
      }

      const submissionData: OwnerRequestData = {
        ownerName: formData.ownerName.trim(),
        phone: formData.phone.replace(/\s+/g, ""),
        email: formData.email.trim().toLowerCase(),
        otp: otp,
        aadhaar: formData.aadhaar.replace(/\s+/g, ""),
        pan: formData.pan.toUpperCase().replace(/\s+/g, ""),

        accountHolder: formData.ownerName.trim(),
        bankName: "",
        accountNumber: "",
        ifsc: "",

        declaration: formData.declaration,
        agree: formData.agree,
        aadhaarUrl: uploadedFiles.aadhaarUrl,
        panUrl: uploadedFiles.panUrl,
        ownerPhotoUrl: uploadedFiles.ownerPhotoUrl || null,
      };

      const result = await submitOwnerRequest(submissionData);

      if (result.success) {
        setSuccess(true);
        setRequestId(result.data?.requestId || result.requestId || "N/A");
        setError("");
      } else {
        throw new Error(result.message || "Submission failed");
      }
    } catch (error:string) {
      console.error("Submission error:", error);
      let errorMessage = "Submission failed. Please try again.";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const axiosError = error as string;
        errorMessage =
          axiosError.response?.data?.message ||
          axiosError.message ||
          errorMessage;
      }

      setError(error.response?.data?.message);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const isAnyUploading = Object.values(uploadStatus).some((status) => status);

  if (success) {
    return (
      <div className="max-w-2xl border rounded-4xl mx-auto p-6">
        <div className="text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              KYC Submitted Successfully!
            </h2>
            <p className={`${lexendSmall.className} text-gray-300 mb-4`}>
              Your KYC request has been submitted for review
            </p>
          </div>

          <div className="bg-white/10 border border-white/20 rounded-lg p-4 mb-6">
            <p className={`${lexendSmall.className} text-gray-200 mb-2`}>
              Request ID:
            </p>
            <p className="text-white font-mono text-lg">{"OWN-REQ"+requestId.slice(0,5)}</p>
          </div>

          <div
            className={`${lexendSmall.className} text-gray-300 text-sm space-y-2`}
          >
            <p>• Your documents will be reviewed within 24-48 hours</p>
            <p>• You will be notified once the review is complete</p>
            <p>• Keep your Request ID for future reference</p>
          </div>

          <button
            onClick={() => {
              setSuccess(false);
              setRequestId("");
              setOtpSent(false);
              setOtpVerified(false);
              setOtp("");
            }}
            className="mt-6 px-6 py-2 bg-white text-black rounded-full hover:bg-gray-100 transition-colors"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl border rounded-4xl mx-auto p-6">
    
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center mb-8">
            <button
        onClick={() => router.push("/login")}
        className="py-2 px-2 mt-2 border border-gray-400 text-white rounded-4xl"
      >
        Back to sign in 
      </button>
          <h2 className="text-3xl font-bold text-white mb-2">
            Become a Theatre Owner
          </h2>
          <p className={`${lexendSmall.className} text-gray-300`}>
            Complete your KYC verification to get started
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
            Personal Details
          </h3>

          {/* Owner Name */}
          <div>
            <label
              htmlFor="ownerName"
              className={`${lexendSmall.className} block text-sm font-medium text-gray-200 mb-2`}
            >
              Full Name (Owner's name) <span className="text-red-400">*</span>
            </label>
            <input
              id="ownerName"
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              className={`${lexendSmall.className} w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent backdrop-blur-sm`}
              placeholder="Enter your full name"
            />
          </div>

          {/* Phone & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="phone"
                className={`${lexendSmall.className} block text-sm font-medium text-gray-200 mb-2`}
              >
                Phone Number <span className="text-red-400">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`${lexendSmall.className} w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent backdrop-blur-sm`}
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className={`${lexendSmall.className} block text-sm font-medium text-gray-200 mb-2`}
              >
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`${lexendSmall.className} w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent backdrop-blur-sm`}
                placeholder="Enter your email address"
                disabled={otpVerified}
              />
            </div>
          </div>

          {/* Email OTP Verification */}
          {!otpVerified && (
            <div className="bg-white/5 border border-white/20 rounded-lg p-4">
              <h4
                className={`${lexendSmall.className} text-white font-semibold mb-3`}
              >
                Email Verification Required
              </h4>

              {!otpSent ? (
                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={otpLoading || !formData.email}
                  className={`px-4 py-2 ${
                    otpLoading || !formData.email
                      ? "bg-gray-500"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white rounded-lg transition-colors disabled:cursor-not-allowed`}
                >
                  {otpLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending OTP...
                    </div>
                  ) : (
                    "Send OTP to Email"
                  )}
                </button>
              ) : (
                <div className="space-y-3">
                  <p
                    className={`${lexendSmall.className} text-gray-300 text-sm`}
                  >
                    OTP sent to{" "}
                    <span className="text-white">{formData.email}</span>
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      className={`${lexendSmall.className} flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOTP}
                      disabled={otpLoading || otp.length !== 6}
                      className={`px-4 py-2 ${
                        otpLoading || otp.length !== 6
                          ? "bg-gray-500"
                          : "bg-green-600 hover:bg-green-700"
                      } text-white rounded-lg transition-colors disabled:cursor-not-allowed`}
                    >
                      {otpLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Verify"
                      )}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={otpLoading || !canResend}
                    className={`${lexendSmall.className} ${
                      canResend
                        ? "text-blue-400 hover:text-blue-300"
                        : "text-gray-500 cursor-not-allowed"
                    } text-sm disabled:text-gray-500`}
                  >
                    {canResend
                      ? "Resend OTP"
                      : `Resend OTP in ${Math.floor(resendTimer / 60)}:${(
                          resendTimer % 60
                        )
                          .toString()
                          .padStart(2, "0")}`}
                  </button>
                </div>
              )}
            </div>
          )}

          {otpVerified && (
            <div className="bg-green-900/20 border border-green-500/20 rounded-lg p-3">
              <p
                className={`${lexendSmall.className} text-green-400 text-sm flex items-center`}
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Email verified successfully!
              </p>
            </div>
          )}

          {/* Rest of your form fields... only show if OTP verified */}
          {otpVerified && (
            <>
              {/* Aadhaar and PAN */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="aadhaar"
                    className={`${lexendSmall.className} block text-sm font-medium text-gray-200 mb-2`}
                  >
                    Aadhaar Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="aadhaar"
                    type="text"
                    name="aadhaar"
                    value={formData.aadhaar}
                    onChange={handleChange}
                    className={`${lexendSmall.className} w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent backdrop-blur-sm`}
                    placeholder="1234 5678 9012"
                  />
                </div>
                <div>
                  <label
                    htmlFor="pan"
                    className={`${lexendSmall.className} block text-sm font-medium text-gray-200 mb-2`}
                  >
                    PAN Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="pan"
                    type="text"
                    name="pan"
                    value={formData.pan}
                    onChange={handleChange}
                    className={`${lexendSmall.className} w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent backdrop-blur-sm`}
                    placeholder="ABCDE1234F"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Document Upload Section - Only show if OTP verified */}
        {otpVerified && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
              Document Upload
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FileUploadInput
                label="Aadhaar Upload"
                folder="kyc/aadhaar"
                onUploadComplete={handleAadhaarUpload}
                onUploadStart={() => handleUploadStart("aadhaar")}
                onUploadError={handleUploadError}
                className={lexendSmall.className}
              />
              <FileUploadInput
                label="PAN Upload"
                folder="kyc/pan"
                onUploadComplete={handlePanUpload}
                onUploadStart={() => handleUploadStart("pan")}
                onUploadError={handleUploadError}
                className={lexendSmall.className}
              />
            </div>

            <FileUploadInput
              label="Owner Photo / Selfie"
              folder="kyc/photos"
              accept="image/*"
              onUploadComplete={handlePhotoUpload}
              onUploadStart={() => handleUploadStart("photo")}
              onUploadError={handleUploadError}
              className={lexendSmall.className}
            />
          </div>
        )}

        {/* Bank Details & Declarations - Only show if OTP verified */}
        {otpVerified && (
          <>
            {/* Your existing bank details section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
                Bank Details (for payouts)
              </h3>
              {/* Add all your bank detail fields here */}
            </div>

            {/* Declarations */}
            <div className="space-y-3">
              <label
                className={`${lexendSmall.className} flex items-start text-gray-200 cursor-pointer`}
              >
                <input
                  type="checkbox"
                  name="declaration"
                  checked={formData.declaration}
                  onChange={handleChange}
                  className="mt-1 mr-3 accent-blue-400"
                />
                <span className="text-sm">
                  I hereby declare that the above information is true and
                  accurate to the best of my knowledge.
                </span>
              </label>

              <label
                className={`${lexendSmall.className} flex items-start text-gray-200 cursor-pointer`}
              >
                <input
                  type="checkbox"
                  name="agree"
                  checked={formData.agree}
                  onChange={handleChange}
                  className="mt-1 mr-3 accent-blue-400"
                />
                <span className="text-sm">
                  I agree to the{" "}
                  <span className="text-blue-400 hover:text-blue-300 cursor-pointer">
                    Terms & Conditions
                  </span>
                  .
                </span>
              </label>
            </div>
          </>
        )}

        {error && (
          <div className="text-red-400 text-sm text-center rounded-lg p-3">
            {error}
          </div>
        )}

        {otpVerified && (
          <button
            type="submit"
            disabled={loading || isAnyUploading}
            className={`px-8 py-3 ${
              loading || isAnyUploading
                ? "bg-gray-500"
                : "bg-white hover:bg-gray-100"
            } cursor-pointer text-black font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200 w-full disabled:cursor-not-allowed`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-5 w-5 text-black mr-2 animate-spin" />
                Submitting KYC...
              </div>
            ) : isAnyUploading ? (
              "Uploading files..."
            ) : (
              "Complete KYC Registration"
            )}
          </button>
        )}

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-white/20" />
          <span className={`${lexendSmall.className} px-4 text-gray-400`}>
            Secure & Encrypted
          </span>
          <div className="flex-grow border-t border-white/20" />
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <p className={`${lexendSmall.className} text-gray-400 text-sm`}>
            Your documents are processed securely and will be verified within
            24-48 hours.
          </p>
        </div>
      </form>
    </div>
  );
}

"use client";
import dynamic from "next/dynamic";
import type React from "react";
import { useState } from "react";
import Aurora from "../others/Utils/ReactBits/Aurora";
import { Lexend } from "next/font/google";
import { useRouter } from "next/navigation";
import ForgotPassword from "../others/components/Auth/ForgotPassword";
import {
  forgotPassword,
  resetPassword,
  verifyPasswordResetOtp,
} from "../others/services/authServices/authService";

const lexend = Lexend({
  weight: "500",
  subsets: ["latin"],
});
const lexendSmall = Lexend({
  weight: "200",
  subsets: ["latin"],
});
export default function ForgotPasswordPage() {
  const router = useRouter();
  
  const [storedEmail, setStoredEmail] = useState("");
  const [storedOtp, setStoredOtp] = useState("");

  const handleBackToLogin = () => {
    router.push("/login");
  };

  const handleSubmitEmail = async (email: string) => {
    try {
      setStoredEmail(email);
      const result = await forgotPassword(email);
      console.log(result);
      if (!result.success) {
        throw new Error(result.message);
      }
    } catch (error) {
      console.log(error);
      throw error; 
    }
  };

  const handleSubmitOTP = async (otp: string) => {
    try {
      setStoredOtp(otp); // ✅ Store the OTP
      // ✅ Pass the required parameters
      const response = await verifyPasswordResetOtp(storedEmail, otp);
      console.log(response);
      if (!response.success) {
        throw new Error(response.message);
      }
    } catch (error) {
      console.log(error);
      throw error; // ✅ Re-throw to show error in component
    }
  };

  const handleSubmitNewPassword = async (
    password: string,
    confirmPassword: string
  ) => {
    try {
      // ✅ Pass all required parameters
      const response = await resetPassword(storedEmail, storedOtp, password);
      console.log(response);
      if (!response.success) {
        throw new Error(response.message);
      }
    } catch (error) {
      console.log(error);
      throw error; // ✅ Re-throw to show error in component
    }
  };

  const handleComplete = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-black overflow-hidden p-4">
      <div className="absolute inset-0 z-0">
        <Aurora
          colorStops={["#5B2EFF", "#FF5A3C", "#2EFF68"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>

      <div className="relative z-10 w-full max-w-md border border-gray-500 p-8 rounded-2xl backdrop-blur-sm">
        <ForgotPassword
          onBackToLogin={handleBackToLogin}
          onSubmitEmail={handleSubmitEmail}
          onSubmitOTP={handleSubmitOTP}
          onSubmitNewPassword={handleSubmitNewPassword}
          onComplete={handleComplete}
        />
      </div>
    </div>
  );
}

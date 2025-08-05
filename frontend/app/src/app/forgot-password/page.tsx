"use client";
import dynamic from "next/dynamic";
import type React from "react";
import { useState } from "react";
import Aurora from "../others/Utils/ReactBits/Aurora";
import { Lexend } from "next/font/google";
import { useRouter } from "next/navigation";
import ForgotPassword from "../others/components/Auth/ForgotPassword";
import Orb from "../others/Utils/ReactBits/Orb";

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

  const handleBackToLogin = () => {
    router.push("/login");
  };

  const handleSubmitEmail = async (email: string) => {
    console.log("Sending OTP to:", email);
    
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (email.includes("test")) {
          resolve();
        } else {
          reject(new Error("Email not found"));
        }
      }, 2000);
    });
  };

  const handleSubmitOTP = async (otp: string) => {
    console.log("Verifying OTP:", otp);
    
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (otp === "123456") {
          resolve();
        } else {
          reject(new Error("Invalid OTP"));
        }
      }, 1500);
    });
  };

  const handleSubmitNewPassword = async (password: string, confirmPassword: string) => {
    console.log("Resetting password");
    
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
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
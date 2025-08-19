"use client";

import dynamic from "next/dynamic";
import type React from "react";
import { useState } from "react";
import Image from "next/image";
import Aurora from "../others/Utils/ReactBits/Aurora";
import { Lexend } from "next/font/google";
import { Eye, EyeClosed } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  loginUser,
  clearError,
  googleLogin,
} from "../others/redux/slices/authSlice";
import AuthForm from "../others/components/Auth/AuthForm";
import OTPStep from "../others/components/Auth/common/OTPStep";
import {
  resendOTP,
  signup,
  verifyOTP,
} from "../others/services/userServices/authServices";
import RouteGuard from "../others/components/Auth/common/RouteGuard";
import { useDispatch } from "react-redux";
import { verifyOtp } from "../others/redux/slices/authSlice";
import { useAppDispatch } from "../others/redux/hooks/redux";

const lexend = Lexend({
  weight: "500",
  subsets: ["latin"],
});
const lexendSmall = Lexend({
  weight: "200",
  subsets: ["latin"],
});

export default function SignUp() {
  const [step, setStep] = useState<"signup" | "otp">("signup");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const router = useRouter();
  const dispatch = useAppDispatch();
  const handleSubmit = async (data: any) => {
    setLoading(true);
    setError("");
    try {
      if (data.confirmPassword && data.password !== data.confirmPassword) {
        setError("Passwords don't match");
        setLoading(false);
        return;
      }

      const username = data.username || data.email.split("@")[0];

      const signupData = {
        username,
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        language: "en",
      };

      const result = await signup(signupData);

      if (result.success) {
        setEmail(data.email);
        setStep("otp");
        console.log("Signup successful, moving to OTP step");
      } else {
        setError(result.message || "Signup failed");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Signup failed. Please try again."
      );
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  const goToSignIn = () => {
    router.push("/login");
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpLoading(true);
    setError("");
    try {
      const resultAction = await dispatch(verifyOtp({ email, otp }));
      if (verifyOtp.fulfilled.match(resultAction)) {
        router.push("/");
      } else {
        setError(resultAction.payload as string);
      }
    } catch (err: any) {
      setError(err.message || "OTP verification failed. Please try again.");
      console.error("OTP verification error:", err);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    setError("");

    try {
      console.log("Resending OTP to:", email);

      const result = await resendOTP(email);

      if (result.success) {
        console.log("OTP resent successfully:", result.message);
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP. Please try again.");
      console.error("Resend OTP error:", err);
    } finally {
      setResendLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    dispatch(clearError());

    try {

      const resultAction = await dispatch(googleLogin(credentialResponse));

      if (googleLogin.fulfilled.match(resultAction)) {
        const data = resultAction.payload;
        localStorage.setItem("role", data.user.role);
        redirectBasedOnRole(data.user.role);
      } else {
        console.error("Google auth failed:", resultAction);
      }
    } catch (error) {
      console.error("Google Sign-In error:", error);
    }
  };

  const redirectBasedOnRole = (userRole: string) => {
    if (userRole === "admin") {
      router.push("/admin/dashboard");
    } else if (userRole === "owner") {
      router.push("/owner/dashboard");
    } else {
      router.push("/");
    }
  };


  return (
    <RouteGuard excludedRoles={["owner", "user", "admin"]}>
      <div className="min-h-screen relative flex items-center justify-center bg-black overflow-hidden p-4">
        <div className="absolute inset-0 z-0">
          <Aurora
            colorStops={["#5B2EFF", "#FF5A3C", "#2EFF68"]}
            blend={0.5}
            amplitude={1.0}
            speed={0.5}
          />
        </div>

        {step === "signup" ? (
          <div className="relative z-10 w-full max-w-md border border-gray-500 p-8 rounded-2xl backdrop-blur-sm">
            <div className="text-center mb-8">
              <h1 className={`${lexend.className} text-3xl text-white mb-2`}>
                Are you new here?
              </h1>
              <p className={`${lexendSmall.className} text-gray-300`}>
                Create your account
              </p>
              <button
                onClick={() => router.push("/owner")}
                className="py-2 px-2 mt-2 border border-gray-400 text-white rounded-4xl"
              >
                Or Become an Owner
              </button>
            </div>
            <AuthForm
              isSignup
              onSubmit={handleSubmit}
              onSwitch={goToSignIn}
              onGoogleSuccess={handleGoogleSuccess}
              error={error}
              loading={loading}
            />
          </div>
        ) : (
          <div className="relative z-10 w-full max-w-md border border-gray-500 p-8 rounded-2xl backdrop-blur-sm">
            <OTPStep
              email={email}
              otp={otp}
              setOtp={setOtp}
              loading={otpLoading}
              error={error}
              onSubmit={handleVerifyOTP}
              onResend={handleResendOTP}
              lexend={lexend}
              lexendSmall={lexendSmall}
              resendLoading={resendLoading}
            />
          </div>
        )}
      </div>
    </RouteGuard>
  );
}

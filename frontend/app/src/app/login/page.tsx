"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Aurora from "../others/components/ReactBits/Aurora";
import { Lexend } from "next/font/google";
import AuthForm from "../others/components/Auth/AuthForm";
import { useAppDispatch, useAppSelector } from "../others/redux/hooks/redux";
import {
  loginUser,
  clearError,
  googleLogin,
} from "../others/redux/slices/authSlice";
import { googleAuth } from "../others/services/authServices/authService";
import RouteGuard from "../others/components/Auth/common/RouteGuard";

const lexend = Lexend({
  weight: "500",
  subsets: ["latin"],
});
const lexendSmall = Lexend({
  weight: "200",
  subsets: ["latin"],
});

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { loading, error } = useAppSelector(
    (state) => state.auth
  );

  const handleSubmit = async (data: { email: string; password: string }) => {
    const { email, password } = data;

    dispatch(clearError());

    if (!email.trim() || !password.trim() || password.length < 6) {
      return;
    }

    try {
      const resultAction = await dispatch(loginUser({ email, password }));
      console.log('reslt acn login page is :',resultAction);
      

      if (loginUser.fulfilled.match(resultAction)) {
        const userData = resultAction.payload;
        redirectBasedOnRole(userData.role);
        console.log(`${userData.role} login successful`);
      }
    } catch (err: any) {
      console.error("Login error:", err);
    }
  };
  const handleGoogleSuccess = async (credentialResponse: any) => {
    dispatch(clearError());

    try {
      
      const resultAction = await dispatch(googleLogin(credentialResponse));

      if (googleLogin.fulfilled.match(resultAction)) {
        const data = resultAction.payload;
        redirectBasedOnRole(data.user.role);
      } else {
        console.error("Google auth failed:", resultAction);
      }
    } catch (error) {
      console.error("Google Sign-In error:", error);
    }
  };
  const handleGuestLogin = () => {
    router.push('/')
  }

  const redirectBasedOnRole = (userRole: string) => {
    if (userRole === "admin") {
      router.push("/admin/dashboard");
    } else if (userRole === "owner") {
      router.push("/owner/dashboard");
    } else {
      router.push("/");
    }
  };

  const goToSignUp = () => {
    router.push("/signup");
  };

  const forgotPassword = () => {
    router.push("/forgot-password");
  };

  return (
    <RouteGuard allowUnauthenticated={true} excludedRoles={['admin', 'owner', 'user']}>
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
          <div className="text-center mb-8">
            <h1 className={`${lexend.className} text-3xl text-white mb-2`}>
              Welcome Back
            </h1>
            <p className={`${lexendSmall.className} text-gray-300`}>
              Sign in to your account
            </p>
          </div>

          <AuthForm
            error={error}
            loading={loading}
            onSubmit={handleSubmit}
            onForgotPassword={forgotPassword}
            onSwitch={goToSignUp}
            onGoogleSuccess={handleGoogleSuccess}
          />

          <div className="mt-6 text-center">
            <button
              onClick={handleGuestLogin} 
              className="w-full py-2 px-4 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-medium transition"
            >
              Continue as Guest
            </button>
          </div>
        </div>
      </div>
    </RouteGuard>
  );

}

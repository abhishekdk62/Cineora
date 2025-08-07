"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Aurora from "../others/Utils/ReactBits/Aurora";
import { Lexend } from "next/font/google";
import AuthForm from "../others/components/Auth/AuthForm";
import { useAppDispatch, useAppSelector } from "../others/redux/hooks/redux";
import { loginUser, clearError } from "../others/redux/slices/authSlice"; 

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
  
  // Get auth state from Redux
  const { loading, error, isAuthenticated, role } = useAppSelector((state) => state.auth);

  const handleSubmit = async (data: { email: string; password: string }) => {
    const { email, password } = data;
    
    dispatch(clearError());

    if (!email.trim() || !password.trim() || password.length < 6) {
      return;
    }

    try {
      const resultAction = await dispatch(loginUser({ email, password }));
      
      if (loginUser.fulfilled.match(resultAction)) {
        const userData = resultAction.payload;
        
        if (userData.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/');
        }
        
        console.log(`${userData.role} login successful`);
      }
    } catch (err: any) {
      console.error('Login error:', err);
    }
  };

  const goToSignUp = () => {
    router.push("/signup");
  };

  const forgotPassword = () => {
    router.push("/forgot-password");
  };

  useEffect(() => {
    if (isAuthenticated && role) {
      if (role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, role, router]);

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
        <div className="text-center mb-8">
          <h1 className={`${lexend.className} text-3xl text-white mb-2`}>
            Welcome Back
          </h1>
          <p className={`${lexendSmall.className} text-gray-300`}>
            Sign in to your account
          </p>
        </div>
        <AuthForm
          error={error} // Redux error state
          loading={loading} // Redux loading state
          onSubmit={handleSubmit}
          onForgotPassword={forgotPassword}
          onSwitch={goToSignUp}
        />
      </div>
    </div>
  );
}

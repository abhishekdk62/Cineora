"use client";

import { Eye, EyeClosed } from "lucide-react";
import { Lexend } from "next/font/google";
import React, { useState } from "react";
import { GoogleLogin } from '@react-oauth/google';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { loginSchema, signupSchema } from "../../Utils/zodSchemas";
import { GoogleCredentialResponse } from "../../types";
type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

const lexendSmall = Lexend({
  weight: "200",
  subsets: ["latin"],
});

interface AuthFormProps {
  isSignup?: boolean;
  onSubmit: (data: LoginFormData | SignupFormData) => void;
  onSwitch: () => void;
  onForgotPassword?: () => void;
  onGoogleSuccess?: (data: GoogleCredentialResponse) => void;
  error?: string | null;
  loading?: boolean;
}

const Form: React.FC<AuthFormProps> = ({
  isSignup = false,
  onSubmit,
  onSwitch,
  onForgotPassword,
  onGoogleSuccess,
  error,
  loading,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData | SignupFormData>({
    resolver: zodResolver(isSignup ? signupSchema : loginSchema)
  });


  const handleFormSubmit = (data: LoginFormData | SignupFormData) => {
    if (isSignup) {
      const signupData = data as SignupFormData;
      onSubmit({
        email: signupData.email,
        password: signupData.password,
        confirmPassword: signupData.confirmPassword,
        username: signupData.username,
      });
    } else {
      const loginData = data as LoginFormData;
      onSubmit({
        email: loginData.email,
        password: loginData.password,
      });
    }
  };


  const handleGoogleSuccess = async (credentialResponse: GoogleCredentialResponse) => {
    try {
      if (onGoogleSuccess) {
        onGoogleSuccess(credentialResponse);
      }
    } catch (error) {
      console.error('Google Sign-In error:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">





        {isSignup && (
          <div>
            <label
              htmlFor="username"
              className={`${lexendSmall.className} block text-sm font-medium text-gray-200 mb-2`}
            >
              Username:
            </label>
            <div className="relative">
              <input
                id="username"
                type={"text"}
                {...register('username')}
                className={`${lexendSmall.className} w-full px-4 py-3 bg-white/10 border ${errors.confirmPassword ? 'border-red-400' : 'border-white/20'
                  } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent backdrop-blur-sm pr-12`}
                placeholder="Enter your username"
              />
            </div>
            {errors.username && (  // ❌ Was missing this error display
              <p className={`${lexendSmall.className} text-red-400 text-sm mt-1`}>
                {errors.username?.message}
              </p>
            )}

          </div>

        )}
        <div>
          <label
            htmlFor="email"
            className={`${lexendSmall.className} block text-sm font-medium text-gray-200 mb-2`}
          >
            Email Address
          </label>
          <input
            id="email"
            {...register('email')}
            className={`${lexendSmall.className} w-full px-4 py-3 bg-white/10 border ${errors.email ? 'border-red-400' : 'border-white/20'
              } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent backdrop-blur-sm`}
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className={`${lexendSmall.className} text-red-400 text-sm mt-1`}>
              {errors.email.message}
            </p>
          )}
        </div>

        {/* PASSWORD FIELD - No changes needed */}
        <div>
          <label
            htmlFor="password"
            className={`${lexendSmall.className} block text-sm font-medium text-gray-200 mb-2`}
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register('password')}
              className={`${lexendSmall.className} w-full px-4 py-3 bg-white/10 border ${errors.password ? 'border-red-400' : 'border-white/20'
                } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent backdrop-blur-sm pr-12`}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`${lexendSmall.className} absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none`}
            >
              {showPassword ? <EyeClosed className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && (
            <p className={`${lexendSmall.className} text-red-400 text-sm mt-1`}>
              {errors.password.message}
            </p>
          )}
        </div>

        {/* FORGOT PASSWORD (LOGIN ONLY) - No changes needed */}
        {!isSignup && (
          <div className="text-right">
            <button
              type="button"
              onClick={onForgotPassword}
              className={`${lexendSmall.className} text-sm cursor-pointer text-blue-400 hover:text-blue-300`}
            >
              Forgot Password?
            </button>
          </div>
        )}

        {/* CONFIRM PASSWORD (SIGNUP ONLY) - ONLY CHANGES ARE HERE */}
        {isSignup && (
          <div>
            <label
              htmlFor="confirmpassword"
              className={`${lexendSmall.className} block text-sm font-medium text-gray-200 mb-2`}
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmpassword"
                type={showConfirmPassword ? "text" : "password"}
                {...register('confirmPassword')}
                className={`${lexendSmall.className} w-full px-4 py-3 bg-white/10 border ${errors.confirmPassword ? 'border-red-400' : 'border-white/20'
                  } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent backdrop-blur-sm pr-12`}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={`${lexendSmall.className} absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none`}
              >
                {showConfirmPassword ? <EyeClosed className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className={`${lexendSmall.className} text-red-400 text-sm mt-1`}>
                {errors.confirmPassword?.message}
              </p>
            )}

          </div>
        )}

        {/* SERVER ERROR DISPLAY - No changes needed */}
        {error && (
          <div className="text-red-400 text-sm text-center">{error}</div>
        )}

        {/* SUBMIT BUTTON - No changes needed */}
        <button
          type="submit"
          disabled={loading}
          className={`px-8 py-3 ${loading ? "bg-gray-500" : "bg-white"
            } cursor-pointer text-black font-semibold rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200 w-full`}
        >
          {loading ? 'Loading...' : (isSignup ? "Sign Up" : "Sign In")}
        </button>

        {/* REST OF THE FORM - No changes needed */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-white/20" />
          <span className={`${lexendSmall.className} px-4 text-gray-400`}>
            Or continue with
          </span>
          <div className="flex-grow border-t border-white/20" />
        </div>

        <div className="w-full">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => console.log('Google Sign-In Failed')}
            useOneTap={false}
            theme="filled_blue"
            text={isSignup ? "signup_with" : "signin_with"}
          />
        </div>

        <div className="text-center mt-6">
          <p className={`${lexendSmall.className} text-gray-400`}>
            {isSignup ? "Already have an account? " : "Don't have an account? "}
            <button
              type="button"
              onClick={onSwitch}
              className={`${lexendSmall.className} text-blue-400 cursor-pointer hover:text-blue-300 font-medium transition-colors ml-1`}
            >
              {isSignup ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Form;

"use client";

import { Eye, EyeClosed } from "lucide-react";
import { Lexend } from "next/font/google";
import React, { useState } from "react";
const lexendSmall = Lexend({
  weight: "200",
  subsets: ["latin"],
});

interface AuthFormProps {
  isSignup?: boolean;
  onSubmit: (data: any) => void; // This should accept the data object
  onSwitch: () => void;
  onForgotPassword?: () => void;
  error?: string | null;
  loading?: boolean; // Make sure you have this prop
}

const Form = ({
  isSignup = false,
  onSubmit,
  onSwitch,
  onForgotPassword,
  error,
  loading,
}: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      email,
      password,
      confirmPassword: isSignup ? confirmPassword : undefined,
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email field */}
        <div>
          <label
            htmlFor="email"
            className={`${lexendSmall.className} block text-sm font-medium text-gray-200 mb-2`}
          >
            Email Address
          </label>
          <input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`${lexendSmall.className} w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent backdrop-blur-sm`}
            placeholder="Enter your email"
          />
        </div>

        {/* Password field */}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${lexendSmall.className} w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent backdrop-blur-sm pr-12`}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`${lexendSmall.className} absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none`}
            >
              {showPassword ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <EyeClosed />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <Eye />
                </svg>
              )}
            </button>
          </div>
        </div>
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

        {isSignup && (
          <div>
            <label
              htmlFor="password"
              className={`${lexendSmall.className} block text-sm font-medium text-gray-200 mb-2`}
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmpassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`${lexendSmall.className} w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent backdrop-blur-sm pr-12`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={`${lexendSmall.className} absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none`}
              >
                {showConfirmPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <EyeClosed />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <Eye />
                  </svg>
                )}
              </button>
            </div>
          </div>
        )}
        {error && (
          <div className="text-red-400 text-sm text-center">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`px-8 py-3 ${
            loading ? "bg-gray-500" : "bg-white"
          } cursor-pointer  text-black font-semibold rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200 w-full`}
        >
          {isSignup ? "Sign Up" : "Sign In"}
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          {/* left line */}
          <div className="flex-grow border-t border-white/20" />

          {/* text with horizontal padding to create the gap */}
          <span className={`${lexendSmall.className} px-4 text-gray-400`}>
            Or continue with
          </span>

          {/* right line */}
          <div className="flex-grow border-t border-white/20" />
        </div>

        {/* Social login buttons */}
        <div>
          <button
            type="button"
            className={`${lexendSmall.className} flex cursor-pointer items-center w-full justify-center px-4 py-2 border border-white/20 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors duration-200`}
          >
            {/* ... */}
            Google
          </button>
        </div>

        {/* Sign up link */}
        <div className="text-center mt-6">
          <p className={`${lexendSmall.className} text-gray-400`}>
            {isSignup ? "Already have an account? " : "Dont have an account?"}
            <a
              onClick={onSwitch}
              className={`${lexendSmall.className} text-blue-400 cursor-pointer hover:text-blue-300 font-medium transition-colors`}
            >
              {isSignup ? "Sign In" : "Sign Up"}
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Form;

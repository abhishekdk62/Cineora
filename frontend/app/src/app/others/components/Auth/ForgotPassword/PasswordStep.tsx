"use client";
import React from "react";
import { Eye, EyeClosed } from "lucide-react";
import { lexendSmall } from "@/app/others/Utils/fonts";

export default function PasswordStep({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  loading,
  error,
  onSubmit,
}: {
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  confirmPassword: string;
  setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  showConfirmPassword: boolean;
  setShowConfirmPassword: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  error: string;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <div>
      <h2 className={`${lexendSmall.className} text-xl text-white mb-4`}>
        Reset Password
      </h2>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            className={`${lexendSmall.className} w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-400"
          >
            {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            className={`${lexendSmall.className} w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-3 text-gray-400"
          >
            {showConfirmPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {error && <p className="text-red-500 text-center text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-8 py-3 bg-blue-600 text-white rounded-full"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

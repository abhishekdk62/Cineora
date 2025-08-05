"use client";
import React from "react";

export default function EmailStep({
  email,
  setEmail,
  loading,
  error,
  onSubmit,
  lexend,
  lexendSmall,
}: {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  error: string;
  onSubmit: (e: React.FormEvent) => void;
  lexend: any;
  lexendSmall: any;
}) {
  return (
    <div>
      <div className="text-center mb-6">
        {/* <h2 className={`${lexend.className} text-2xl text-white mb-2`}>Forgot Password?</h2> */}
        <p className={`${lexendSmall.className} text-gray-300`}>
          Enter your email and we’ll send an OTP.
        </p>
      </div>
      <form onSubmit={onSubmit} className="space-y-6">
        <label
          htmlFor="email"
          className={`${lexendSmall.className} block text-sm text-gray-200 mb-2`}
        >
          Email Address
        </label>
        <input
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`${lexendSmall.className} w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white`}
          placeholder="Enter your email "
        />
        {error && <p className="text-red-500 text-center text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className={`w-full px-8 py-3 bg-white text-black rounded-full disabled:bg-gray-600/50 `}
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      </form>
    </div>
  );
}

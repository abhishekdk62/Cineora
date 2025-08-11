"use client";
import React, { useRef, useState, useEffect } from "react";

export default function OTPStep({
  email,
  otp,
  setOtp,
  loading,
  error,
  onSubmit,
  onResend,
  lexend,
  lexendSmall,
  resendLoading = false, 
}: {
  email: string;
  otp: string;
  setOtp: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  error: string;
  onSubmit: (e: React.FormEvent) => void;
  onResend: () => void;
  lexend: any;
  lexendSmall: any;
  resendLoading?: boolean; 
}) {
  const inputs = useRef<HTMLInputElement[]>([]);
  
  const [timeLeft, setTimeLeft] = useState(120); 
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const val = e.target.value.replace(/\D/, "");
    if (!val) return;
    const newOtp = otp.split("");
    newOtp[idx] = val;
    setOtp(newOtp.join(""));

    if (val && inputs.current[idx + 1]) {
      inputs.current[idx + 1].focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      
      const newOtp = otp.split("");
      newOtp[idx] = "";
      setOtp(newOtp.join(""));
      
      if (!e.currentTarget.value && inputs.current[idx - 1]) {
        inputs.current[idx - 1].focus();
      }
    }
  };

  const handleResend = () => {
    if (canResend && !resendLoading) { 
      onResend();
      setTimeLeft(120);
      setCanResend(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className={`${lexend.className} text-2xl text-white mb-2`}>
          Verify Your Email
        </h2>
        <p className={`${lexendSmall.className} text-gray-300`}>
          OTP sent to <span className="text-blue-400">{email}</span>
        </p>
      </div>
      
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="flex justify-between space-x-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <input
              key={i}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className="w-12 h-12 text-center text-white bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              value={otp[i] || ""}
              onChange={(e) => handleChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              ref={el => {
                if (el) inputs.current[i] = el;
              }}
              disabled={loading} 
            />
          ))}
        </div>

        {error && (
          <div className="text-red-400 text-sm text-center  rounded-lg p-3">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || otp.length !== 6}
          className={`w-full px-8 py-3 bg-white text-black rounded-full disabled:bg-gray-600/50 disabled:cursor-not-allowed transition-all duration-200 ${
            loading ? 'animate-pulse' : 'hover:bg-gray-100'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent mr-2"></div>
              Verifying...
            </div>
          ) : (
            "Verify OTP"
          )}
        </button>
      </form>

      {/* Fixed resend section */}
      <div className="text-center mt-4">
        {resendLoading ? (
          <span className={`${lexendSmall.className} flex items-center justify-center text-gray-400`}>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-400 border-t-transparent mr-2"></div>
            Sending...
          </span>
        ) : canResend ? (
          <button
            type="button"
            onClick={handleResend}
            className={`${lexendSmall.className} text-blue-400 hover:text-blue-300 transition-colors`}
          >
            Resend OTP
          </button>
        ) : (
          <p className={`${lexendSmall.className} text-gray-400`}>
            Resend OTP in {formatTime(timeLeft)}
          </p>
        )}
      </div>
    </div>
  );
}

"use client";
import React from "react";
import { CheckCircle } from "lucide-react";

export default function SuccessStep({
  onComplete,
  lexend,
  lexendSmall,
}: {
  onComplete: () => void;
  lexend: any;
  lexendSmall: any;
}) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle size={32} className="text-green-400" />
      </div>
      <h2 className={`${lexend.className} text-2xl text-white mb-2`}>
        Password Reset Successful!
      </h2>
      <p className={`${lexendSmall.className} text-gray-300 mb-6`}>
        You’ll be redirected shortly.
      </p>
      <div className="w-full bg-white/10 rounded-full h-2 mb-4">
        <div className="bg-green-400 h-2 rounded-full animate-pulse w-full" />
      </div>
      <button
        onClick={onComplete}
        className="px-8 py-3 bg-green-600 text-white rounded-full"
      >
        Go to Login
      </button>
    </div>
  );
}

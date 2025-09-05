"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface AuthButtonsProps {
  mounted: boolean;
  isAuthenticated: boolean;
  onLogout: () => void;
  isMobile?: boolean;
  onMobileClose?: () => void;
}

export default function AuthButtons({ mounted, isAuthenticated, onLogout, isMobile, onMobileClose }: AuthButtonsProps) {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
    if (isMobile && onMobileClose) onMobileClose();
  };

  const handleLogout = () => {
    onLogout();
    if (isMobile && onMobileClose) onMobileClose();
  };

  if (!mounted) {
    return <div className="w-20 h-10 bg-gray-600/30 rounded-full animate-pulse"></div>;
  }

  const buttonClass = isMobile
    ? "bg-[#FF5A3C] text-white px-6 py-2 rounded-full hover:bg-[#e54a32] transition-colors font-medium w-fit"
    : "bg-[#FF5A3C] text-white px-6 py-2 rounded-full hover:bg-[#e54a32] transition-colors font-medium";

  if (isAuthenticated) {
    return (
      <button onClick={handleLogout} className={buttonClass}>
        Logout
      </button>
    );
  }

  return (
    <button onClick={handleLogin} className={buttonClass}>
      Sign In
    </button>
  );
}

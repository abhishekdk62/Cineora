"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface NavLinksProps {
  lexendSmall: any;
  onAccountClick: () => void;
  isMobile?: boolean;
  onMobileClose?: () => void;
}

export default function NavLinks({ lexendSmall, onAccountClick, isMobile, onMobileClose }: NavLinksProps) {
  const router = useRouter();

  const handleClick = (path?: string) => {
    if (path) router.push(path);
    if (onAccountClick && !path) onAccountClick();
    if (isMobile && onMobileClose) onMobileClose();
  };

  const linkClass = isMobile 
    ? `${lexendSmall.className} text-gray-300 hover:text-white transition-colors text-left`
    : `${lexendSmall.className} text-gray-300 hover:text-white transition-colors`;

  return (
    <>
      <button onClick={() => handleClick("/search/movies")} className={linkClass}>
        Movies
      </button>
      <button onClick={() => handleClick("/search/theaters")} className={linkClass}>
        Theaters
      </button>
      <button className={linkClass}>
        Pricing
      </button>
      <button onClick={() => handleClick('/user/account')} className={linkClass}>
        My Account
      </button>
    </>
  );
}

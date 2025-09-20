"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { lexendSmall } from "../../Utils/fonts";

interface NavLinksProps {
  onAccountClick: () => void;
  isMobile?: boolean;
  onMobileClose?: () => void;
}

export default function NavLinks({  onAccountClick, isMobile, onMobileClose }: NavLinksProps) {
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
      <button onClick={()=>handleClick('/invites')} className={linkClass}>
        Invites and Chats
      </button>
      <button onClick={() => handleClick('/user/account')} className={linkClass}>
        My Account
      </button>
    </>
  );
}

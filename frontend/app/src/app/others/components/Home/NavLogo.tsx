"use client";
import React from "react";
import { Ticket } from "lucide-react";
import { useRouter } from "next/navigation";

interface NavLogoProps {
  lexendBold: any;
}

export default function NavLogo({ lexendBold }: NavLogoProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push("/")}
      className="flex items-center space-x-2 cursor-pointer"
    >
      <Ticket className="h-8 w-8 text-[#FF5A3C]" />
      <span className={`${lexendBold.className} text-2xl text-white`}>
        Cineora
      </span>
    </div>
  );
}

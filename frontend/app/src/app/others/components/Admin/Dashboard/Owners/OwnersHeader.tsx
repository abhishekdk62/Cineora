"use client";

import React from "react";
import { Lexend } from "next/font/google";

const lexend = Lexend({
  weight: "500",
  subsets: ["latin"],
});

const OwnersHeader: React.FC = () => {
  return (
    <div>
      <h1 className={`${lexend.className} text-3xl font-bold text-white mb-2`}>
        Owners Management
      </h1>
      <p className="text-gray-400">Manage cinema owners and their requests</p>
    </div>
  );
};

export default OwnersHeader;

"use client";

import RouteGuard from "@/app/others/components/Auth/common/RouteGuard";
import { NavBar } from "@/app/others/components/Home";
import AccountPage from "@/app/others/components/User/MyAcount/MyAcountManager";
import DarkVeil from "@/app/others/components/ReactBits/DarkVeil";
import React from "react";
import Prism from "@/app/others/components/ReactBits/Prism";

const page = () => {
  return (
    <RouteGuard allowedRoles={['user']}>
      <div className="relative min-h-screen bg-black">
        <div className="fixed top-9 inset-0 z-0">
          <Prism
            animationType="rotate"
            timeScale={0.5}
            height={3.5}
            baseWidth={4}
            scale={4}
            hueShift={0.7}
            colorFrequency={1}
            noise={0}
            glow={0.5}
          />
        </div>

        <div className="relative z-20">
          <NavBar />
        </div>

        <div className="relative z-10">
          <AccountPage />
        </div>
      </div>
    </RouteGuard>
  );
};

export default page;

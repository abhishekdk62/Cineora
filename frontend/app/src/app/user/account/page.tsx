"use client";

import RouteGuard from "@/app/others/components/Auth/common/RouteGuard";
import { NavBar } from "@/app/others/components/Home";
import AccountPage from "@/app/others/components/User/MyAcount/MyAcountManager";
import DarkVeil from "@/app/others/components/ReactBits/DarkVeil";
import React from "react";

const page = () => {
  return (
    <RouteGuard allowedRoles={['user']}>
    <div className="relative min-h-screen bg-black">
      <div className="fixed top-9 inset-0 z-0">
        <DarkVeil />
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

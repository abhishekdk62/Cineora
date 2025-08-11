"use client";
import React from "react";
import Orb from "../others/Utils/ReactBits/Orb";
import OwnerKYCForm from "../others/components/Owner/Auth/OwnerForm";
import Aurora from "../others/Utils/ReactBits/Aurora";
import RouteGuard from "../others/components/Auth/common/RouteGuard";

const page = () => {
  return (
    <RouteGuard excludedRoles={['owner','user','admin']} >
      <div>
        <div className="min-h-screen relative flex items-center justify-center bg-black overflow-hidden p-4">
          <div className="absolute inset-0 z-0">
            <Aurora
              colorStops={["#5B2EFF", "#FF5A3C", "#2EFF68"]}
              blend={0.5}
              amplitude={1.0}
              speed={0.5}
            />
          </div>
       
          <div className="z-10">
            <OwnerKYCForm />
          </div>
        </div>
      </div>
      </RouteGuard>
  );
};

export default page;

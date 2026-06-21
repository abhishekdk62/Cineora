"use client";
import React from "react";
import OwnerKYCForm from "../others/components/Owner/Auth/OwnerForm";
import DynamicAurora from "../others/components/ReactBits/DynamicAurora";
import RouteGuard from "../others/components/Auth/common/RouteGuard";

const page = () => {
  return (
    <RouteGuard excludedRoles={['owner','user','admin']} >
      <div>
        <div className="min-h-screen relative flex items-center justify-center bg-black overflow-hidden p-4">
          <div className="absolute inset-0 z-0">
            <DynamicAurora
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

"use client";

import RouteGuard from "@/app/others/components/Auth/common/RouteGuard";
import React, { useState } from "react";
import DynamicPrism from "@/app/others/components/ReactBits/DynamicPrism";
import Staff from "../others/components/Staff/Staff";
import StaffHeader from "../others/components/Staff/StaffHeader";

const StaffPage = () => {
    const [activeTab, setActiveTab] = useState<'account' | 'scanner'>('account');

    return (
        <RouteGuard allowedRoles={['staff']}>
        <div className="relative min-h-screen bg-black">
            <div className="fixed top-9 inset-0 z-0">
                <DynamicPrism
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
                <StaffHeader 
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />
            </div>

            <div className="relative z-10">
                <Staff activeTab={activeTab} />
            </div>
        </div>
         </RouteGuard>
    );
};

export default StaffPage;

"use client";

import React from "react";
import { Lexend } from "next/font/google";
import { User, UserCheck, UserX, Clock } from "lucide-react";
import { ActiveView } from "./OwnerManager";

const lexendSmall = Lexend({
    weight: "300",
    subsets: ["latin"],
});

interface ActiveCounts {
    activeOwners: number;
    inactiveOwners: number;
    pendingRequests: number;
    rejectedRequests: number;
}

interface OwnersStatsProps {
    activeView: ActiveView;
    setActiveView: (view: ActiveView) => void;
    activeCounts: {
        activeOwners: number;
        inactiveOwners: number;
        pendingRequests: number;
        rejectedRequests: number;
    };
    countsLoading: boolean;
}


const OwnersStats: React.FC<OwnersStatsProps> = ({
    activeView,
    setActiveView,
    activeCounts,
    countsLoading,
}) => {
    const safeActiveCounts = activeCounts || {
        activeOwners: 0,
        inactiveOwners: 0,
        pendingRequests: 0,
        rejectedRequests: 0,
    };

    const tabs = [
        {
            id: "active" as const,
            label: "Active Owners",
            icon: User,
            count: safeActiveCounts.activeOwners,
            color: "text-green-400",
        },
        {
            id: "inactive" as const,
            label: "Inactive Owners",
            icon: Clock,
            count: safeActiveCounts.inactiveOwners,
            color: "text-orange-400",
        },
        {
            id: "pending" as const,
            label: "Pending Requests",
            icon: UserCheck,
            count: safeActiveCounts.pendingRequests,
            color: "text-blue-400",
        },
        {
            id: "rejected" as const,
            label: "Rejected Requests",
            icon: UserX,
            count: safeActiveCounts.rejectedRequests,
            color: "text-red-400",
        },
    ];

    if (countsLoading) {
        return (
            <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-4 shadow-lg">
                <div className="flex items-center justify-center py-8">
                    <div className="text-gray-400">Loading counts...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-4 shadow-lg">
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeView === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveView(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive
                                    ? "bg-[#e78f03] text-black font-medium shadow-lg"
                                    : "text-gray-300 hover:text-white hover:bg-[#2a2a2a] border border-gray-500"
                                }`}
                        >
                            <Icon size={16} className={isActive ? "text-black" : tab.color} />
                            <span className={`${lexendSmall.className}`}>{tab.label}</span>
                            <span
                                className={`${isActive
                                        ? "bg-black/20 text-black"
                                        : "bg-[#2a2a2a] text-gray-300"
                                    } text-xs px-2 py-1 rounded-full ml-1`}
                            >
                                {tab.count}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default OwnersStats;

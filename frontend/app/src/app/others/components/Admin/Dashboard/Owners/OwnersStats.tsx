"use client";

import React from "react";
import { Lexend } from "next/font/google";
import { User, UserCheck, UserX, Clock, BarChart3 } from "lucide-react";
import { ActiveView } from "./OwnerManager";

const lexend = Lexend({
  weight: "500",
  subsets: ["latin"],
});

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
      bgColor: "bg-green-500/20",
      borderColor: "border-green-500/30",
    },
    {
      id: "inactive" as const,
      label: "Inactive Owners", 
      icon: Clock,
      count: safeActiveCounts.inactiveOwners,
      color: "text-orange-400",
      bgColor: "bg-orange-500/20",
      borderColor: "border-orange-500/30",
    },
    {
      id: "pending" as const,
      label: "Pending Requests",
      icon: UserCheck,
      count: safeActiveCounts.pendingRequests,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
      borderColor: "border-blue-500/30",
    },
    {
      id: "rejected" as const,
      label: "Rejected Requests",
      icon: UserX,
      count: safeActiveCounts.rejectedRequests,
      color: "text-red-400",
      bgColor: "bg-red-500/20",
      borderColor: "border-red-500/30",
    },
  ];

  const totalCount = Object.values(safeActiveCounts).reduce((sum, count) => sum + count, 0);

  if (countsLoading) {
    return (
      <div className="bg-gray-900/90 border border-yellow-500/20 rounded-lg p-6 transition-all duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-yellow-500/20 p-2 rounded-lg">
            <BarChart3 className="text-yellow-400" size={20} />
          </div>
          <h3 className={`${lexend.className} text-lg text-yellow-400 font-medium`}>
            Owners Statistics
          </h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-3 border-yellow-500 border-t-transparent"></div>
            <span className="text-gray-300 text-sm">Loading statistics...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/90 border border-yellow-500/20 rounded-lg p-6 transition-all duration-200">


   
      {/* Filter Tabs */}
      <div className="space-y-3">
        <h4 className={`${lexend.className} text-sm text-gray-400 uppercase tracking-wider`}>
          Filter by Category
        </h4>
        <div className="flex flex-wrap gap-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeView === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 min-w-[160px] ${
                  isActive
                    ? "bg-yellow-500 hover:bg-yellow-400 text-black shadow-lg transform scale-105"
                    : "bg-gray-800/50 border border-yellow-500/30 text-gray-300 hover:text-white hover:bg-gray-700/50 hover:border-yellow-500/50"
                }`}
              >
                <Icon size={18} className={isActive ? "text-black" : tab.color} />
                <div className="flex flex-col items-start">
                  <span className={`${lexendSmall.className} text-sm font-medium`}>
                    {tab.label}
                  </span>
                  <span className={`text-xs ${isActive ? 'text-black/70' : 'text-gray-400'}`}>
                    {tab.count} {tab.count === 1 ? 'item' : 'items'}
                  </span>
                </div>
                <div
                  className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${
                    isActive
                      ? "bg-black/20 text-black"
                      : `${tab.bgColor} ${tab.color}`
                  }`}
                >
                  {tab.count}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      {totalCount > 0 && (
        <div className="mt-6 pt-4 border-t border-yellow-500/20">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">
              Showing {tabs.find(tab => tab.id === activeView)?.label.toLowerCase() || 'all items'}
            </span>
            <div className="flex gap-2">
              <div className="bg-gray-800/50 px-3 py-1 rounded-lg">
                <span className="text-gray-300">
                  {((tabs.find(tab => tab.id === activeView)?.count || 0) / totalCount * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnersStats;

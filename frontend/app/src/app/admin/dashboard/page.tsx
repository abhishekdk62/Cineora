"use client";

import React, { useState } from "react";
import { Lexend } from "next/font/google";
import Sidebar from "@/app/others/components/Admin/Dashboard/Sidebar";
import MoviesManager from "@/app/others/components/Admin/Dashboard/Movies/MoviesManager";
import { AdminProvider } from "@/app/others/components/Admin/Dashboard/AdminContext";
import OwnersManager from "@/app/others/components/Admin/Dashboard/Owners/OwnerManager";
import UsersManager from "@/app/others/components/Admin/Dashboard/User/UserManager";
import RoleCheck from "@/app/others/components/Auth/common/RouteGuard";
import RouteGuard from "@/app/others/components/Auth/common/RouteGuard";
import ScreenAndShowManager from "@/app/others/components/Admin/Dashboard/Screens/ScreenAndShowManager";
import BookingsManager from "@/app/others/components/Admin/Dashboard/Bookings/BookingsManager";
import AnalyticsManager from "@/app/others/components/Admin/Dashboard/Analytics/AnalyticsManager";

const lexend = Lexend({
  weight: "500",
  subsets: ["latin"],
});

// Font variables for styling
const lexendMedium = { fontFamily: 'Lexend', fontWeight: '500' };
const lexendSmall = { fontFamily: 'Lexend', fontWeight: '400' };

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("movies");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderContent = () => {
    switch (activeTab) {
      case "movies":
        return <MoviesManager />;
      case "owners":
        return <OwnersManager />;
      case "users":
        return <UsersManager />;
      case 'screens':
        return <ScreenAndShowManager />
      case 'bookings':
        return <BookingsManager />
      case 'analytics':
        return <AnalyticsManager />
      default:
        return (
          <div className="flex items-center justify-center h-96">
            <div className="bg-black/95 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-8 text-center">
              <h2 className="text-2xl text-yellow-400 mb-2" style={lexendMedium}>
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h2>
              <p className="text-gray-300" style={lexendSmall}>This section is under development</p>
            </div>
          </div>
        );
    }
  };

  return (
    <RouteGuard allowedRoles={["admin"]}>
      <AdminProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
          <div className="flex-1 p-6 overflow-auto space-y-6">{renderContent()}</div>
        </div>
      </AdminProvider>
    </RouteGuard>
  );
};

export default AdminDashboard;

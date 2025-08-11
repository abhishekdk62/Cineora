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

const lexend = Lexend({
  weight: "500",
  subsets: ["latin"],
});

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
      default:
        return (
          <div className="flex items-center justify-center h-96">
            <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-8 text-center">
              <h2 className={`${lexend.className} text-2xl text-white mb-2`}>
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h2>
              <p className="text-gray-400">This section is under development</p>
            </div>
          </div>
        );
    }
  };

  return (
    <RouteGuard allowedRoles={["admin"]}>
      <AdminProvider>
        <div className="min-h-screen bg-[#040404] flex">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
          <div className="flex-1 p-8 overflow-auto">{renderContent()}</div>
        </div>
      </AdminProvider>
    </RouteGuard>
  );
};

export default AdminDashboard;

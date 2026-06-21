"use client";

import React, { useState } from "react";
import OwnerSidebar from "@/app/others/components/Owner/SideBar.tsx/Sidebar";
import RouteGuard from "@/app/others/components/Auth/common/RouteGuard";
import { lexendMedium, lexendSmall } from "@/app/others/Utils/fonts";
import dynamic from "next/dynamic";
import { lazyPanel } from "@/app/others/components/utils/dynamicPanels";
import TabPanelFallback from "@/app/others/components/utils/TabPanelFallback";

const TheaterManager = lazyPanel(
  () => import("@/app/others/components/Owner/Theatre/TheaterManager")
);
const ScreensManager = lazyPanel(
  () => import("@/app/others/components/Owner/Screens/ScreensManager")
);
const ShowtimesManager = lazyPanel(
  () => import("@/app/others/components/Owner/Showtimes/ShowtimesManager")
);
const OwnerStaffManager = lazyPanel(
  () => import("@/app/others/components/Owner/Staff/StaffManager")
);
const BookingsManager = lazyPanel(
  () => import("@/app/others/components/Owner/Bookings/BookingsManager")
);
const WalletManager = lazyPanel(
  () => import("@/app/others/components/Owner/Wallet/WalletManager")
);
const AnalyticsManager = lazyPanel(
  () => import("@/app/others/components/Owner/Analytics/AnalyticsManager")
);
const CouponsManager = lazyPanel(
  () => import("@/app/others/components/Owner/Coupons/CouponsManager")
);
const RevenueManager = dynamic(
  () =>
    import("@/app/others/components/Owner/Revenue/RevenueManager").then((m) => ({
      default: m.RevenueManager,
    })),
  { loading: () => <TabPanelFallback /> }
);
const MyAccount = lazyPanel(
  () => import("@/app/others/components/Owner/MyAccount/MyAccount")
);

const OwnerManager = () => {
  const [activeTab, setActiveTab] = useState("theaters");

  const renderContent = () => {
    switch (activeTab) {
      case "theaters":
        return <TheaterManager />;
      case "screens":
        return <ScreensManager />;
      case "shows":
        return <ShowtimesManager />;
      case "staff":
        return <OwnerStaffManager />;
      case "bookings":
        return (
          <BookingsManager lexendMedium={lexendMedium} lexendSmall={lexendSmall} />
        );
      case "wallet":
        return <WalletManager />;
      case "analytics":
        return <AnalyticsManager />;
      case "coupons":
        return <CouponsManager />;
      case "revenue":
        return <RevenueManager />;
      case "account":
        return <MyAccount />;
      default:
        return <TheaterManager />;
    }
  };

  return (
    <RouteGuard allowedRoles={["owner"]}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="flex">
          <OwnerSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="flex-1 ml-64">
            <div className="p-8">{renderContent()}</div>
          </div>
        </div>
      </div>
    </RouteGuard>
  );
};

export default OwnerManager;

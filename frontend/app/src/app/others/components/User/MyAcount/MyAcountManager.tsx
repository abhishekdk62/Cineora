"use client";

import { useEffect, useState } from "react";
import {
  X,
  User,
  Calendar,
  Wallet,
  Heart,
  CreditCard,
  Bell,
  LogOut,
  HelpCircle,
  Menu,
  Settings,
  Shield,
} from "lucide-react";
import MyAccountContent, { IUser } from "./Profile/MyAccountContent";
import { getUserProfile } from "@/app/others/services/userServices/authServices";

const lexendBold = { className: "font-bold" };
const lexendMedium = { className: "font-medium" };
const lexendSmall = { className: "font-normal text-sm" };

type SidebarItem =
  | "account"
  | "bookings"
  | "notifications"
  | "wallet"
  | "favorites"
  | "payment"
  | "help";

const AccountPage = () => {
  const [activeSection, setActiveSection] = useState<SidebarItem>("account");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [userData, setUserData] = useState<IUser | null>(null);
  useEffect(() => {
    getUeserDetails();
  }, []);
  async function getUeserDetails() {
    try {
      const result = await getUserProfile();
      console.log(result);
      const dto = (await getUserProfile()).data;

      const parsed: IUser = {
        ...dto,
        joinedAt: new Date(dto.joinedAt),
        lastActive: new Date(dto.lastActive),
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
      };

      setUserData(parsed);
    } catch (error) {
      console.log(error);
    }
  }
  const sidebarItems = [
    {
      id: "account" as SidebarItem,
      label: "Profile & Settings",
      icon: User,
      description: "Manage your personal information",
    },
    {
      id: "bookings" as SidebarItem,
      label: "My Bookings",
      icon: Calendar,
      description: "View your ticket history",
    },
    {
      id: "notifications" as SidebarItem,
      label: "Notifications",
      icon: Bell,
      description: "Manage your preferences",
    },
    {
      id: "wallet" as SidebarItem,
      label: "Wallet & Credits",
      icon: Wallet,
      description: "Balance and transactions",
    },
    {
      id: "favorites" as SidebarItem,
      label: "Favorites",
      icon: Heart,
      description: "Saved movies and theaters",
    },
    {
      id: "payment" as SidebarItem,
      label: "Payment Methods",
      icon: CreditCard,
      description: "Cards and payment history",
    },
    {
      id: "help" as SidebarItem,
      label: "Help & Support",
      icon: HelpCircle,
      description: "Get assistance",
    },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "account":
        return <MyAccountContent getUeserDetails={getUeserDetails} userData={userData} />;
      case "bookings":
        return <ComingSoonContent title="My Bookings" icon={Calendar} />;
      case "notifications":
        return <ComingSoonContent title="Notifications" icon={Bell} />;
      case "wallet":
        return <ComingSoonContent title="Wallet & Credits" icon={Wallet} />;
      case "favorites":
        return <ComingSoonContent title="Favorites" icon={Heart} />;
      case "payment":
        return <ComingSoonContent title="Payment Methods" icon={CreditCard} />;
      case "help":
        return <ComingSoonContent title="Help & Support" icon={HelpCircle} />;
      default:
        return <MyAccountContent getUeserDetails={getUeserDetails} userData={userData} />;
    }
  };

  const handleLogout = () => {
    console.log("Logging out...");
  };

  return (
    <div className="min-h-screen bg-transparent text-white">
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:w-80 lg:flex-col lg:fixed lg:inset-y-0 lg:bg-gradient-to-b lg:from-white/10 lg:to-white/5 lg:backdrop-blur-xl lg:border-r lg:border-white/10">
          <div className="flex flex-col flex-1 min-h-0">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between h-20 flex-shrink-0 px-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br bg-white  rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h1 className={`${lexendBold.className} text-lg text-white`}>
                    Account
                  </h1>
                  <p
                    className={`${lexendSmall.className} text-gray-400 text-xs`}
                  >
                    {userData?.firstName} {userData?.lastName}
                  </p>
                </div>
              </div>
              <Settings className="w-5 h-5 text-gray-400" />
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`${
                      lexendMedium.className
                    } w-full group relative flex flex-col px-4 py-4 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-white to-gray-100 text-black shadow-lg"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center w-full">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                          isActive
                            ? "bg-black/10"
                            : "bg-white/10 group-hover:bg-white/20"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium">{item.label}</p>
                        <p
                          className={`text-xs ${
                            isActive ? "text-gray-600" : "text-gray-500"
                          } group-hover:text-gray-400`}
                        >
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl border-r border-white/10">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full hover:bg-white/10"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>

              <div className="flex items-center justify-between h-20 flex-shrink-0 px-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1
                      className={`${lexendBold.className} text-lg text-white`}
                    >
                      Account
                    </h1>
                    <p
                      className={`${lexendSmall.className} text-gray-400 text-xs`}
                    >
                      {userData?.firstName} {userData?.lastName}
                    </p>
                  </div>
                </div>
              </div>

              <nav className="flex-1 px-4 py-6 space-y-1">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveSection(item.id);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={`${
                        lexendMedium.className
                      } w-full group relative flex flex-col px-4 py-4 rounded-xl transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-white to-gray-100 text-black shadow-lg"
                          : "text-gray-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center w-full">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                            isActive
                              ? "bg-black/10"
                              : "bg-white/10 group-hover:bg-white/20"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium">{item.label}</p>
                          <p
                            className={`text-xs ${
                              isActive ? "text-gray-600" : "text-gray-500"
                            } group-hover:text-gray-400`}
                          >
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}

                <div className="pt-6 mt-6 border-t border-white/10">
                  <button
                    onClick={handleLogout}
                    className={`${lexendMedium.className} w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 text-red-400 hover:bg-red-500/10 hover:text-red-300 group`}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 bg-red-500/10 group-hover:bg-red-500/20">
                      <LogOut className="w-4 h-4" />
                    </div>
                    <span>Sign Out</span>
                  </button>
                </div>
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 lg:pl-80">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border-b border-white/10">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <Menu className="h-6 w-6 text-white" />
            </button>
            <h1 className={`${lexendBold.className} text-lg text-white`}>
              {sidebarItems.find((item) => item.id === activeSection)?.label}
            </h1>
            <div className="w-10" />
          </div>

          {/* Content Area */}
          <main className="flex-1 p-6 bg-gradient-to-br from-transparent via-transparent to-white/5">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

const ComingSoonContent = ({
  title,
  icon: Icon,
}: {
  title: string;
  icon: any;
}) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/10 rounded-2xl p-12 backdrop-blur-xl">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <Icon className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className={`${lexendBold.className} text-3xl text-white mb-3`}>
            {title}
          </h2>
          <p
            className={`${lexendMedium.className} text-gray-300 mb-8 max-w-md mx-auto`}
          >
            We're crafting an amazing experience for this feature. It will be
            available very soon!
          </p>

          {/* Feature Preview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
              <Shield className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <p className={`${lexendSmall.className} text-gray-400 text-sm`}>
                Secure & Reliable
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
              <Settings className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <p className={`${lexendSmall.className} text-gray-400 text-sm`}>
                Easy to Use
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
              <Bell className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <p className={`${lexendSmall.className} text-gray-400 text-sm`}>
                Smart Notifications
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-grow border-t border-white/10" />
            <span
              className={`${lexendSmall.className} px-6 text-gray-400 bg-white/5 rounded-full py-2`}
            >
              Coming Soon
            </span>
            <div className="flex-grow border-t border-white/10" />
          </div>

          <p className={`${lexendSmall.className} text-gray-500 text-sm`}>
            Want to be notified when this feature launches? We'll send you an
            update!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;

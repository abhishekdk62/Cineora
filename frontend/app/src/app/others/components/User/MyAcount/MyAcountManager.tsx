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
  TicketCheck,
  LucideIcon,
} from "lucide-react";
import MyAccountContent, { IUser } from "./Profile/MyAccountContent";
import { getUserProfile } from "@/app/others/services/userServices/authServices";
import MobileTicket from "./Tickets/TicketsList";
import WalletPage from "./Wallet/WalletManager";
import FavoritesList from "./Favorites/FavoritesList";
import CouponManager from "./Coupon/CouponManager";
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
  | "help"
  | "coupons";

const AccountPage = () => {
  interface Booking {
    id: string;
    movieTitle: string;
    moviePoster: string;
    theaterName: string;
    date: string;
    time: string;
    row: string;
    seats: number[];
    bookingId: string;
    status: 'confirmed' | 'cancelled' | 'expired';
  }

  const mockBooking: Booking = {
    id: 'booking1',
    movieTitle: 'Thor: Love and Thunder',
    moviePoster: 'https://image.tmdb.org/t/p/w500/pIkRyD18kl4FhoCNQuWxWu5cBLM.jpg',
    theaterName: 'PVR Cinemas - DLF Mall',
    date: 'June 19',
    time: '8 p.m.',
    row: '1',
    seats: [1, 2],
    bookingId: 'TKT2025082601234567',
    status: 'confirmed'
  };

  const [activeSection, setActiveSection] = useState<SidebarItem>("account");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [userData, setUserData] = useState<IUser | null>(null);
  useEffect(() => {
    getUeserDetails();
  }, []);
  useEffect(() => {

    let val = localStorage.getItem('selectedTab')
    if (val == 'viewTicket') {
      setActiveSection('bookings')
    }

  })
  async function getUeserDetails() {
    try {
      const result = await getUserProfile();

      const dto = (await getUserProfile()).data;

      const parsed: IUser = {
        ...dto,
        joinedAt: new Date(dto.joinedAt),
        lastActive: new Date(dto.lastActive),
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
      };

      setUserData(parsed);
      console.log(parsed);

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
      label: "My Tickets",
      icon: Calendar,
      description: "View your tickets and ticket history",
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
      id: "coupons" as SidebarItem,
      label: "My Coupons",
      icon: TicketCheck,
      description: "Coupons and discounts",
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
        return <MobileTicket />;
      case "wallet":
        return <WalletPage />;
      case "favorites":
        return <FavoritesList />;
      case "coupons":
        return <CouponManager />;
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
        <div className="hidden lg:block relative">
          <div className="fixed left-0 top-0 w-2 h-full z-40 hover:w-80 group transition-all duration-300 ease-in-out">
            <div className="absolute left-0 top-0 w-16 h-full bg-black/20 backdrop-blur-md border-r border-white/10 flex flex-col items-center justify-start pt-20 group-hover:bg-transparent transition-all duration-300">
              <div className="p-3 rounded-lg bg-white/10 mb-4 group-hover:opacity-0 transition-opacity duration-200">
                <Menu className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col space-y-3 group-hover:opacity-0 transition-opacity duration-200">
                {sidebarItems.slice(0, 4).map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {

                        if (item.id !== 'bookings') {
                          localStorage.removeItem('selectedTab')
                        }
                        setActiveSection(item.id)
                      }}
                      className={`p-2 rounded-lg transition-all duration-200 ${isActive
                        ? "bg-white/20 text-white"
                        : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                        }`}
                      title={item.label}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="absolute left-0 top-0 w-80 h-full bg-black/10 backdrop-blur-md border-r border-white/10 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transform -translate-x-full group-hover:translate-x-0 transition-all duration-300 ease-out">
              <div className="flex flex-col flex-1 min-h-0">
                {/* Header */}
                <div className="px-6 py-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">C</span>
                    </div>
                    <div>
                      <h2 className={`${lexendBold.className} text-white text-lg`}>Cineora</h2>
                      <p className="text-gray-400 text-xs">Dashboard</p>
                    </div>
                  </div>
                </div>

                <nav className="flex-1 px-6 py-8 space-y-2">
                  {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {

                          if (item.id !== 'bookings') {
                            localStorage.removeItem('selectedTab')
                          }
                          setActiveSection(item.id)
                        }}
                        className={`${lexendMedium.className
                          } w-full group relative flex items-center px-4 py-4 rounded-xl transition-all duration-200 ${isActive
                            ? "bg-gradient-to-r from-white/20 to-white/10 border border-white/20 text-white shadow-lg"
                            : "text-gray-300 hover:bg-white/5 hover:text-white"
                          }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${isActive
                            ? "bg-white/10"
                            : "bg-white/5 group-hover:bg-white/10"
                            }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-semibold">{item.label}</p>
                          <p
                            className={`text-xs mt-0.5 ${isActive ? "text-gray-300" : "text-gray-400"
                              }`}
                          >
                            {item.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </nav>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-white/10">
                  <button
                    onClick={handleLogout}
                    className={`${lexendMedium.className} w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 text-red-400 hover:bg-red-500/10 hover:text-red-300 group`}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 bg-red-500/10 group-hover:bg-red-500/20">
                      <LogOut className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold">Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-black/10 backdrop-blur-md border-r border-white/10">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>

              <nav className="flex-1 px-6 py-8 mt-10 space-y-2">
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
                      className={`${lexendMedium.className
                        } w-full group relative flex items-center px-4 py-4 rounded-xl transition-all duration-200 ${isActive
                          ? "bg-white/90 text-black shadow-lg"
                          : "text-gray-300 hover:bg-white/5 hover:text-white"
                        }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${isActive
                          ? "bg-black/5"
                          : "bg-white/5 group-hover:bg-white/10"
                          }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-semibold">{item.label}</p>
                        <p
                          className={`text-xs mt-0.5 ${isActive ? "text-gray-500" : "text-gray-400"
                            }`}
                        >
                          {item.description}
                        </p>
                      </div>
                    </button>
                  );
                })}

                <div className="pt-6 mt-6 border-t border-white/10">
                  <button
                    onClick={handleLogout}
                    className={`${lexendMedium.className} w-full flex items-center px-4 py-4 rounded-xl transition-all duration-200 text-red-400 hover:bg-red-500/5 hover:text-red-300 group`}
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-4 bg-red-500/10 group-hover:bg-red-500/20">
                      <LogOut className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-semibold">Sign Out</span>
                  </button>
                </div>
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 lg:pl-16"> {/* Reduced padding since sidebar is now collapsed */}
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between h-16 px-6 bg-black/10 backdrop-blur-md border-b border-white/10">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/10 transition-colors"
            >
              <Menu className="h-6 w-6 text-white" />
            </button>
            <h1 className={`${lexendBold.className} text-lg text-white`}>
              {sidebarItems.find((item) => item.id === activeSection)?.label}
            </h1>
            <div className="w-10" />
          </div>

          {/* Content Area */}
          <main className="flex-1 min-h-screen bg-transparent">
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
  icon: LucideIcon;
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

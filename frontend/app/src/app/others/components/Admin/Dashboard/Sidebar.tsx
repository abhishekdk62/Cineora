import React from "react";
import { Lexend } from "next/font/google";
import {
  Film,
  Users,
  User,
  BarChart3,
  TvMinimal,
  Calendar,
  Ticket,
  Menu,
  LogOut,
} from "lucide-react";
import { logoutUser } from "@/app/others/redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/others/redux/store";
import { useRouter } from "next/navigation";

const lexend = Lexend({
  weight: "500",
  subsets: ["latin"],
});

const lexendSmall = Lexend({
  weight: "300",
  subsets: ["latin"],
});

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const sidebarItems = [
    { id: "movies", label: "Movies", icon: Film, count: 0 },
    { id: "users", label: "Users", icon: Users, count: 1247 },
    { id: "owners", label: "Owners and Theaters", icon: User, count: 12 },
    { id: "screens", label: "Screens and Showtimes", icon: TvMinimal, count: 1247 },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "bookings", label: "Bookings", icon: Calendar, count: 89 },
    { id: "coupons", label: "Coupons", icon: Ticket, count: 5 },
  ];

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter()
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      console.log("Logged out successfully");
      router.push('/login')
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div
      className={`${sidebarOpen ? "w-72" : "w-20"
        } bg-[#0a0a0a] border-r border-gray-700 transition-all duration-300 flex flex-col shadow-lg`}
    >
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {sidebarOpen && (
            <div>
              <h2
                className={`${lexend.className} text-xl font-bold text-white`}
              >
                Showteria
              </h2>
              <p className={`${lexendSmall.className} text-gray-300 text-sm`}>
                Movie Management
              </p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white hover:bg-[#1a1a1a] p-2 rounded-md transition-colors"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${isActive
                      ? "bg-[#e78f03] text-black border-l-4 border-[#d17a02] shadow-lg font-medium"
                      : "text-gray-300 hover:text-white hover:bg-[#1a1a1a]"
                    }`}
                >
                  <Icon size={20} />
                  {sidebarOpen && (
                    <>
                      <span
                        className={`${lexendSmall.className} flex-1 text-left`}
                      >
                        {item.label}
                      </span>
                    </>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 transition-colors"
        >
          <LogOut size={20} />
          {sidebarOpen && (
            <span className={`${lexendSmall.className}`}>Logout</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

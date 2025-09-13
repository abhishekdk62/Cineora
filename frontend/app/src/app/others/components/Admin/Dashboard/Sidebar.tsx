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
  Wallet,
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

// Font variables for styling
const lexendMedium = { fontFamily: 'Lexend', fontWeight: '500' };
const lexendSmallStyle = { fontFamily: 'Lexend', fontWeight: '400' };

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
    { id: "wallet", label: "Wallet", icon: Wallet },
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
        } bg-black/95 backdrop-blur-sm border-r border-yellow-500/20 transition-all duration-300 flex flex-col`}
    >
      {/* Sidebar Header */}
      <div className="p-6 border-b border-yellow-500/20">
        <div className="flex items-center justify-between">
          {sidebarOpen && (
            <div>
              <h2 
                className="text-xl text-yellow-400 mb-1" 
                style={lexendMedium}
              >
                Showteria
              </h2>
              <p 
                className="text-gray-400 text-sm" 
                style={lexendSmallStyle}
              >
                Movie Management
              </p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 p-2 rounded-lg transition-all duration-200"
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
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-yellow-500 text-black"
                      : "text-gray-300 hover:text-yellow-400 hover:bg-yellow-500/10"
                  }`}
                >
                  <Icon 
                    size={20} 
                    className={isActive ? "text-black" : "text-yellow-400"}
                  />
                  {sidebarOpen && (
                    <div className="flex-1 flex items-center justify-between">
                      <span 
                        className="text-left" 
                        style={lexendSmallStyle}
                      >
                        {item.label}
                      </span>
                  
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-yellow-500/20">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut size={20} className="text-red-400" />
          {sidebarOpen && (
            <span style={lexendSmallStyle}>Logout</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

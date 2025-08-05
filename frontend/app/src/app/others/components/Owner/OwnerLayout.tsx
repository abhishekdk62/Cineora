"use client"

import React, { useState } from "react"
import { Lexend } from "next/font/google"
import { 
  Building, 
  Monitor, 
  Settings, 
  Calendar, 
  Wallet, 
  BarChart3, 
  Gift, 
  User,
  Menu,
  X,
  LogOut
} from "lucide-react"

const lexendBold = Lexend({
  weight: "700",
  subsets: ["latin"],
})

const lexendMedium = Lexend({
  weight: "500",
  subsets: ["latin"],
})

const lexendSmall = Lexend({
  weight: "300",
  subsets: ["latin"],
})

interface OwnerLayoutProps {
  children: React.ReactNode
  activeTab: string
}

const OwnerLayout: React.FC<OwnerLayoutProps> = ({ children, activeTab }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const menuItems = [
    { 
      id: "theaters", 
      label: "My Theaters", 
      icon: Building, 
      href: "/owner/theaters",
      color: "text-blue-400" 
    },
    { 
      id: "screens", 
      label: "Screens", 
      icon: Monitor, 
      href: "/owner/screens",
      color: "text-green-400" 
    },
    { 
      id: "shows", 
      label: "Shows & Pricing", 
      icon: Calendar, 
      href: "/owner/shows",
      color: "text-purple-400" 
    },
    { 
      id: "wallet", 
      label: "Wallet", 
      icon: Wallet, 
      href: "/owner/wallet",
      color: "text-yellow-400" 
    },
    { 
      id: "analytics", 
      label: "Analytics", 
      icon: BarChart3, 
      href: "/owner/analytics",
      color: "text-red-400" 
    },
    { 
      id: "offers", 
      label: "Offers", 
      icon: Gift, 
      href: "/owner/offers",
      color: "text-pink-400" 
    },
    { 
      id: "settings", 
      label: "Settings", 
      icon: Settings, 
      href: "/owner/settings",
      color: "text-gray-400" 
    },
  ]

  return (
    <div className="min-h-screen bg-black">
      {/* Mobile Header */}
      <div className="lg:hidden bg-black/90 backdrop-blur-sm border-b border-gray-500/30 p-4">
        <div className="flex items-center justify-between">
          <h1 className={`${lexendBold.className} text-xl text-white`}>
            Owner Dashboard
          </h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-black/90 backdrop-blur-sm border-r border-gray-500/30 transition-transform duration-300 ease-in-out`}>
          
          <div className="p-6 border-b border-gray-500/30">
            <h1 className={`${lexendBold.className} text-2xl text-white`}>
              Cineora
            </h1>
            <p className={`${lexendSmall.className} text-gray-400 mt-1`}>
              Owner Dashboard
            </p>
          </div>

          {/* Profile Section */}
          <div className="p-4 border-b border-gray-500/30">
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className={`${lexendMedium.className} text-white text-sm`}>
                  Abhishek Dk
                </p>
                <p className={`${lexendSmall.className} text-gray-400 text-xs`}>
                  Owner
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              
              return (
                <a
                  key={item.id}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? "bg-white text-black"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Icon 
                    className={`w-5 h-5 ${
                      isActive ? "text-black" : item.color
                    }`} 
                  />
                  <span className={`${lexendMedium.className} text-sm`}>
                    {item.label}
                  </span>
                </a>
              )
            })}
          </nav>

          {/* Profile & Logout */}
          <div className="absolute bottom-4 left-4 right-4 space-y-2">
            <a
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-gray-300 hover:bg-white/10 hover:text-white ${
                activeTab === "profile" ? "bg-white text-black" : ""
              }`}
            >
              <User className={`w-5 h-5 ${activeTab === "profile" ? "text-black" : "text-gray-400"}`} />
              <span className={`${lexendMedium.className} text-sm`}>
                My Profile
              </span>
            </a>
            
            <button className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-gray-300 hover:bg-red-500/20 hover:text-red-400 w-full">
              <LogOut className="w-5 h-5 text-red-400" />
              <span className={`${lexendMedium.className} text-sm`}>
                Logout
              </span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {/* Overlay for mobile */}
          {isSidebarOpen && (
            <div 
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
          
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

export default OwnerLayout

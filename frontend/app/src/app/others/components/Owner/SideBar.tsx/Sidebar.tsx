"use client"

import React, { useState, useEffect } from "react"
import { Lexend } from "next/font/google"
import {
  Building2,
  Monitor,
  Calendar,
  Wallet,
  BarChart3,
  Gift,
  User,
  LogOut,
  Menu,
  DollarSign,
  Ticket,
  X,
  TrafficCone
} from "lucide-react"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/app/others/redux/store"
import { useRouter } from "next/navigation"
import { logoutUser } from "@/app/others/redux/slices/authSlice"

const lexendBold = Lexend({
  weight: "700",
  subsets: ["latin"],
})

const lexendMedium = Lexend({
  weight: "500",
  subsets: ["latin"],
})

interface OwnerSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const OwnerSidebar: React.FC<OwnerSidebarProps> = ({ activeTab, setActiveTab }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const menuItems = [
    { id: "theaters", label: "My Theaters", icon: Building2 },
    { id: "screens", label: "Screens", icon: Monitor },
    { id: "shows", label: "Shows & Pricing", icon: Calendar },
    { id: "staff", label: "Staff's", icon: TrafficCone },
    { id: "bookings", label: "Bookings", icon: Calendar },
    { id: "wallet", label: "Wallet", icon: Wallet },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "revenue", label: "Revenue", icon: DollarSign },
    { id: "coupons", label: "Coupons", icon: Ticket },
    { id: "account", label: "My Account", icon: User },
  ]

  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false) // Close mobile menu on larger screens
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap()
      console.log("Logged out successfully")
      router.push('/login')
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const handleMenuItemClick = (tabId: string) => {
    setActiveTab(tabId)
    if (isMobile) {
      setIsMobileMenuOpen(false) // Close mobile menu after selection
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Sidebar content component
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-black" />
            </div>
            <div>
              <h2 className={`${lexendBold.className} text-white text-lg`}>
                Owner Panel
              </h2>
              <p className={`${lexendMedium.className} text-gray-400 text-sm`}>
                Dashboard
              </p>
            </div>
          </div>
          {/* Close button for mobile */}
          {isMobile && (
            <button
              onClick={toggleMobileMenu}
              className="md:hidden text-gray-400 hover:text-white p-2"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <button
              key={item.id}
              onClick={() => handleMenuItemClick(item.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                ${isActive
                  ? 'bg-white text-black'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className={`${lexendMedium.className}`}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-500/30">
        <button
          onClick={handleLogout}
          className={`
            ${lexendMedium.className} w-full flex items-center gap-3 px-4 py-3 rounded-xl
            text-red-400 hover:bg-red-500/20 transition-all duration-300
          `}
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="fixed top-4 left-4 z-[60] md:hidden bg-black/90 backdrop-blur-sm border border-gray-500/30 text-white p-3 rounded-xl hover:bg-white/10 transition-all duration-300"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Desktop Sidebar - Always visible on md+ */}
      <div className="hidden md:block fixed left-0 top-0 h-full w-64 bg-black/95 backdrop-blur-sm border-r border-gray-500/30 z-50">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar - Toggleable overlay on sm and below */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Mobile Sidebar */}
          <div className={`
            fixed left-0 top-0 h-full w-80 bg-black/95 backdrop-blur-sm border-r border-gray-500/30 z-50 md:hidden
            transform transition-transform duration-300 ease-in-out
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
            <SidebarContent />
          </div>
        </>
      )}
    </>
  )
}

export default OwnerSidebar

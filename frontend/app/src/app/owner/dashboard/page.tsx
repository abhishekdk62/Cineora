"use client"

import React, { useState } from "react"
import TheaterManager from "@/app/others/components/Owner/Theatre/TheaterManager"
import MyAccount from "@/app/others/components/Owner/MyAccount/MyAccount"
import OwnerSidebar from "@/app/others/components/Owner/SideBar.tsx/Sidebar"
import RouteGuard from "@/app/others/components/Auth/common/RouteGuard"

const OwnerManager = () => {
  const [activeTab, setActiveTab] = useState("theaters")

  const renderContent = () => {
    switch (activeTab) {
      case "theaters":
        return <TheaterManager />
      case "screens":
        return <div className="text-white">Screens component coming soon...</div>
      case "shows":
        return <div className="text-white">Shows & Pricing component coming soon...</div>
      case "wallet":
        return <div className="text-white">Wallet component coming soon...</div>
      case "analytics":
        return <div className="text-white">Analytics component coming soon...</div>
      case "offers":
        return <div className="text-white">Offers component coming soon...</div>
      case "account":
        return <MyAccount />
      default:
        return <TheaterManager />
    }
  }

  return (

    <RouteGuard allowedRoles={['owner']} >
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="flex">
          <OwnerSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="flex-1 ml-64">
            <div className="p-8">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
      </RouteGuard>
  )
}

export default OwnerManager

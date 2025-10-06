"use client";
import React from "react";
import { useState, useEffect } from "react";
import { Lexend } from "next/font/google";
import { Menu, X } from "lucide-react";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/slices/authSlice";

import NavLogo from "./NavLogo";
import NavLinks from "./NavLinks";
import AuthButtons from "./AuthButtons";
import NotificationBell from "./NotificationBell";
import NotificationModal, { BackendNotification } from './NotificationModal'
import { getAllUserNotifications, getFullUserNotifications, markAllNotificationAsSeen, markNotificationAsSeen } from "../../services/userServices/notificationServices";

const lexendSmall = Lexend({
  weight: "200",
  subsets: ["latin"],
});

const lexendBold = Lexend({
  weight: "700",
  subsets: ["latin"],
});

interface NotificationItem {
  id: string;
  type: 'booking' | 'payment' | 'reminder' | 'cancellation' | 'offer';
  title: string;
  message: string;
  createdAt: Date;
  isRead: boolean;
}

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false); 
  const [notifications, setNotifications] = useState<BackendNotification[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState<BackendNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getUnreadNotifications = async () => {
    try {
      const data = await getAllUserNotifications()
      setUnreadNotifications(data.data.notifications)
      setUnreadCount(data.data.unreadCount)
    } catch (error) {
      console.log(error);
    }
  }
  
  const getAllNotifications = async () => {
    try {
      const data = await getFullUserNotifications()
      setNotifications(data.data.notifications)
      setUnreadCount(data.data.unreadCount)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      getAllNotifications()
      getUnreadNotifications()
    }
  }, [isAuthenticated]);

  const handleClickAcc = () => {
    localStorage.removeItem('selectedTab');
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleNotificationClick = async (notification: {notificationId:string}) => {
    try {
      const data = await markNotificationAsSeen(notification.notificationId)
      console.log(data);
      setUnreadCount(unreadCount-1)
      let notif = notifications.filter((n, i) => n.notificationId != notification.notificationId)
      setNotifications(notif)
    } catch (error) {
      console.log(error);
    }
  };

  const markAllAsRead = async () => {
    try {
      setUnreadNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      let data = await markAllNotificationAsSeen()
      setUnreadCount(0);
    } catch (error) {
      console.log(error);
    }
  };

  const handleViewAllNotifications = () => {
    setShowNotifications(false);
    setShowNotificationModal(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-notification-container]')) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  return (
    <>
      <nav className="relative z-50 border-b border-gray-800/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            <div className="flex items-center">
              <NavLogo />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <NavLinks
                onAccountClick={handleClickAcc}
              />

              {mounted && isAuthenticated && (
                <NotificationBell
                  notifications={unreadNotifications}
                  unreadCount={unreadCount}
                  showNotifications={showNotifications}
                  onToggle={() => setShowNotifications(!showNotifications)}
                  onMarkAllRead={markAllAsRead}
                  onNotificationClick={handleNotificationClick}
                  onViewAll={handleViewAllNotifications} 
                />
              )}

              <AuthButtons
                mounted={mounted}
                isAuthenticated={isAuthenticated}
                onLogout={handleLogout}
              />
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center gap-2 sm:gap-4">
              {mounted && isAuthenticated && (
                <div className="relative">
                  <NotificationBell
                    notifications={unreadNotifications}
                    unreadCount={unreadCount}
                    showNotifications={showNotifications}
                    onToggle={() => setShowNotifications(!showNotifications)}
                    onMarkAllRead={markAllAsRead}
                    onNotificationClick={handleNotificationClick}
                    onViewAll={handleViewAllNotifications} 
                    isMobile={true}
                  />
                </div>
              )}

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-white p-1 sm:p-2 transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X size={20} className="sm:hidden" />
                ) : (
                  <Menu size={20} className="sm:hidden" />
                )}
                {isMenuOpen ? (
                  <X size={24} className="hidden sm:block md:hidden" />
                ) : (
                  <Menu size={24} className="hidden sm:block md:hidden" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-800/50 py-3 sm:py-4 bg-black/95 backdrop-blur-md">
              <div className="flex flex-col space-y-3 sm:space-y-4 px-1 sm:px-2">
                <NavLinks
                  onAccountClick={handleClickAcc}
                  isMobile={true}
                  onMobileClose={() => setIsMenuOpen(false)}
                />

                <div className="pt-2 sm:pt-3 border-t border-gray-800/30">
                  <AuthButtons
                    mounted={mounted}
                    isAuthenticated={isAuthenticated}
                    onLogout={handleLogout}
                    isMobile={true}
                    onMobileClose={() => setIsMenuOpen(false)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <NotificationModal
        unreadNotifications={unreadNotifications}
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        notifications={notifications}
        onMarkAllRead={markAllAsRead}
      />
    </>
  );
}

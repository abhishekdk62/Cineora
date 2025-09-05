"use client";
import React from "react";
import { Bell } from "lucide-react";

interface NotificationBellProps {
  notifications: BackendNotification[];
  unreadCount: number;
  showNotifications: boolean;
  onToggle: () => void;
  onMarkAllRead: () => void;
  onNotificationClick: (notification: BackendNotification) => void;
  onViewAll: () => void;
  lexendSmall: any;
  isMobile?: boolean;
}

// ✅ Updated interface to match your backend structure
interface BackendNotification {
  _id: string;
  notificationId: string;
  userId: string;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'reminder' | 'cancellation' | 'offer';
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  scheduledTime?: string;
  sent?: boolean;
  data?: {
    bookingId?: string;
    movieTitle?: string;
    theaterName?: string;
    showTime?: string;
    seats?: string;
    amount?: number;
    refundAmount?: number;
  };
}

export default function NotificationBell({
  notifications,
  unreadCount,
  showNotifications,
  onToggle,
  onMarkAllRead,
  onNotificationClick,
  onViewAll,
  lexendSmall,
  isMobile
}: NotificationBellProps) {

  const getNotificationIcon = () => {
    return <Bell className="w-6 h-6 text-white" />;
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  return (
    <div className="relative" data-notification-container>
      <button
        onClick={onToggle}
        className={`text-gray-300 hover:text-white transition-colors relative ${isMobile ? 'p-1' : 'p-2'}`}
      >
        <svg className="w-6 h-6 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        
        {unreadCount > 0 && (
          <span className={`absolute bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold ${
            isMobile ? '-top-1 -right-1 h-4 w-4' : '-top-1 -right-1 h-5 w-5'
          }`}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showNotifications && !isMobile && (
        <div className="absolute right-0 mt-2 w-80 backdrop-blur-sm bg-black rounded-2xl border border-gray-500/30 shadow-2xl z-50">
          <div className="p-6 border-b border-gray-600/30">
            <div className="flex justify-between items-center">
              <h3 className={`${lexendSmall.className} font-semibold text-white text-lg`}>
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button 
                  onClick={onMarkAllRead}
                  className="text-sm text-[#FF5A3C] hover:text-[#e54a32] transition-all duration-200 hover:scale-105"
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="mb-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gray-700/50 flex items-center justify-center mb-3">
                    <Bell className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className={`${lexendSmall.className} text-gray-300 font-medium`}>
                    No notifications yet
                  </p>
                  <p className={`${lexendSmall.className} text-gray-400 text-sm mt-2`}>
                    We'll notify you about your bookings here
                  </p>
                </div>
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification._id}
                  className={`p-4 border-b border-gray-600/20 hover:bg-gradient-to-r hover:from-gray-700/30 hover:to-gray-800/30 cursor-pointer transition-all duration-200 ${
                    !notification.isRead ? ' border-l-4 border-l-[#FF5A3C]' : ''
                  }`}
                  onClick={() => onNotificationClick(notification)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 ${!notification.isRead ? 'drop-shadow-lg' : ''}`}>
                      {getNotificationIcon()}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className={`${lexendSmall.className} font-medium text-white text-sm mb-1`}>
                        {notification.title}
                      </p>
                      <p className="text-gray-300 text-sm leading-relaxed line-clamp-2 mb-2">
                        {notification.message}
                      </p>
                      
                  
                      <p className="text-gray-500 text-xs">
                        {formatTimeAgo(notification.createdAt)}
                      </p>
                    </div>
                    
                    {!notification.isRead && (
                      <div className="w-3 h-3 bg-[#FF5A3C] rounded-full mt-2 animate-pulse shadow-lg shadow-[#FF5A3C]/50"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-4 border-t border-gray-600/30 text-center">
              <button 
                onClick={onViewAll}
                className={`${lexendSmall.className} text-gray-400 hover:text-white text-sm transition-colors duration-200`}
              >
                View All Notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

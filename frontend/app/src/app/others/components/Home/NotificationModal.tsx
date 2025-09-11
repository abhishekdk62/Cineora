"use client";
import React, { useState } from "react";
import { X, Bell } from "lucide-react";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: BackendNotification[];
  onMarkAllRead: () => void;
  onNotificationClick: (notification: BackendNotification) => void;
  lexendSmall: any;
  lexendBold: any;
}

export interface BackendNotification {
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

export default function NotificationModal({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onNotificationClick,
  lexendSmall,
  lexendBold
}: NotificationModalProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  if (!isOpen) return null;

  const getNotificationIcon = () => {
    return <Bell className="w-8 h-8 text-white" />;
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

  const filteredNotifications = selectedFilter === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === selectedFilter);

  const filterOptions = [
    { value: 'all', label: 'All', count: notifications.length },
    { value: 'booking', label: 'Bookings', count: notifications.filter(n => n.type === 'booking').length },
    { value: 'payment', label: 'Payments', count: notifications.filter(n => n.type === 'payment').length },
    { value: 'reminder', label: 'Reminders', count: notifications.filter(n => n.type === 'reminder').length },
    { value: 'cancellation', label: 'Cancellations', count: notifications.filter(n => n.type === 'cancellation').length },
    { value: 'offer', label: 'Offers', count: notifications.filter(n => n.type === 'offer').length },
  ];

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative w-full max-w-4xl h-[90vh] backdrop-blur-sm bg-black rounded-2xl border border-gray-500/30 shadow-2xl flex flex-col overflow-hidden">
          
          {/* Header - Fixed */}
          <div className="flex items-center justify-between p-6 border-b border-gray-600/30 flex-shrink-0">
            <div>
              <h2 className={`${lexendBold.className} text-white text-2xl`}>
                All Notifications
              </h2>
              <p className={`${lexendSmall.className} text-gray-400 text-sm mt-1`}>
                Manage all your notifications in one place
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={onMarkAllRead}
                className={`${lexendSmall.className} text-[#FF5A3C] hover:text-[#e54a32] transition-colors text-sm`}
              >
                Mark all as read
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-2"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Filter Buttons - Fixed */}
          <div className="flex items-center gap-1 p-6 border-b border-gray-600/30 overflow-x-auto flex-shrink-0">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedFilter(option.value)}
                className={`${lexendSmall.className} px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-200 ${
                  selectedFilter === option.value
                    ? 'bg-[#FF5A3C] text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                {option.label} ({option.count})
              </button>
            ))}
          </div>

          {/* Content Area - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6 min-h-0">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-20 h-20 rounded-full bg-gray-700/50 flex items-center justify-center mb-4">
                  <Bell className="w-10 h-10 text-gray-400" />
                </div>
                <p className={`${lexendSmall.className} text-gray-300 font-medium text-lg`}>
                  No notifications found
                </p>
                <p className={`${lexendSmall.className} text-gray-400 text-sm mt-2`}>
                  {selectedFilter === 'all' 
                    ? "You're all caught up! No notifications to show."
                    : `No ${selectedFilter} notifications found.`
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification._id}
                    onClick={() => onNotificationClick(notification)}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.01] hover:bg-gradient-to-r hover:from-gray-700/30 hover:to-gray-800/30 ${
                      !notification.isRead 
                        ? 'border border-gray-500/30 bg-gray-800/30' 
                        : 'border border-gray-500/30 bg-gray-800/30'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`mt-1 ${!notification.isRead ? 'drop-shadow-lg' : ''}`}>
                        {getNotificationIcon()}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className={`${lexendSmall.className} font-medium text-white text-base`}>
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <div className="w-3 h-3 bg-[#FF5A3C] rounded-full animate-pulse shadow-lg shadow-[#FF5A3C]/50 ml-4"></div>
                          )}
                        </div>
                        
                        <p className="text-gray-300 text-sm leading-relaxed mb-3">
                          {notification.message}
                        </p>

                        {/* Enhanced details section */}
                        {notification.data && (
                          <div className="bg-gray-800/50 rounded-lg p-3 mb-3">
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              {notification.data.movieTitle && (
                                <div className="text-gray-400">
                                  <span className="text-white">Movie:</span> {notification.data.movieTitle}
                                </div>
                              )}
                              {notification.data.theaterName && (
                                <div className="text-gray-400">
                                  <span className="text-white">Theater:</span> {notification.data.theaterName}
                                </div>
                              )}
                              {notification.data.showTime && (
                                <div className="text-gray-400">
                                  <span className="text-white">Time:</span> {notification.data.showTime}
                                </div>
                              )}
                              {notification.data.seats && (
                                <div className="text-gray-400">
                                  <span className="text-white">Seats:</span> {notification.data.seats}
                                </div>
                              )}
                              {notification.data.bookingId && (
                                <div className="text-gray-400 col-span-2">
                                  <span className="text-white">Booking ID:</span> {notification.data.bookingId}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500 text-xs">
                            {formatTimeAgo(notification.createdAt)}
                          </span>
                          <span className={`${lexendSmall.className} text-xs px-2 py-1 rounded-full ${
                            notification.type === 'booking' ? 'bg-blue-500/20 text-blue-300' :
                            notification.type === 'payment' ? 'bg-green-500/20 text-green-300' :
                            notification.type === 'reminder' ? 'bg-orange-500/20 text-orange-300' :
                            notification.type === 'cancellation' ? 'bg-red-500/20 text-red-300' :
                            'bg-purple-500/20 text-purple-300'
                          }`}>
                            {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

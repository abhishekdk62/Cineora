import { INotificationService } from "../interfaces/notification.service.interface";
import { INotificationRepository } from "../interfaces/notification.repository.interface";
import { ServiceResponse } from "../../../interfaces/interface";
import mongoose from "mongoose";

type NotificationType = "booking" | "payment" | "reminder" | "offer" | "general" | "cancellation";
type NotificationPriority = "low" | "medium" | "high";
type NotificationStatus = "pending" | "sent" | "delivered" | "failed" | "read";
type ChannelType = "app" | "email" | "sms" | "push"; 

export class NotificationService implements INotificationService {
  constructor(private readonly notificationRepo: INotificationRepository) {}
  
  async sendNotification(
    userId: string,
    title: string,
    message: string,
    type: string,
    channels: string[] = ["app"], 
    data?: any,
    scheduledFor?: Date
  ): Promise<ServiceResponse> {
    try {
      const validTypes: NotificationType[] = ["booking", "payment", "reminder", "offer", "general", "cancellation"];
      if (!validTypes.includes(type as NotificationType)) {
        return {
          success: false,
          message: `Invalid notification type: ${type}. Allowed types: ${validTypes.join(", ")}`,
          data: null,
        };
      }

      const validChannels: ChannelType[] = ["app", "email", "sms", "push"];
      const invalidChannels = channels.filter(channel => !validChannels.includes(channel as ChannelType));
      if (invalidChannels.length > 0) {
        return {
          success: false,
          message: `Invalid channels: ${invalidChannels.join(", ")}. Allowed channels: ${validChannels.join(", ")}`,
          data: null,
        };
      }

      const notificationId = `NOT${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      
      const validatedType = type as NotificationType;
      const validatedChannels = channels as ChannelType[]; 
      const priority: NotificationPriority = (validatedType === "booking" || validatedType === "payment") ? "high" : "medium";
      const status: NotificationStatus = scheduledFor ? "pending" : "sent";
      
      const notificationPayload = {
        notificationId,
        userId: new mongoose.Types.ObjectId(userId),
        title,
        message,
        type: validatedType,
        priority,
        channels: validatedChannels, 
        data,
        scheduledFor,
        status,
      };
      
      const notification = await this.notificationRepo.create(notificationPayload);
      
      if (!notification) {
        throw new Error("Failed to create notification");
      }
      
      if (!scheduledFor) {
        await this.deliverNotification(notification);
      }
      
      return {
        success: true,
        message: "Notification sent successfully",
        data: notification,
      };
      
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to send notification",
        data: null,
      };
    }
  }
  
  private async deliverNotification(notification: any): Promise<void> {
    const sentVia: ChannelType[] = []; 
    
    try {
      if (notification.channels.includes("app")) {
        sentVia.push("app");
      }
      
      // TODO: Implement actual delivery mechanisms
      if (notification.channels.includes("email")) {
        sentVia.push("email");
      }
      
      if (notification.channels.includes("sms")) {
        sentVia.push("sms");
      }
      
      if (notification.channels.includes("push")) {
        sentVia.push("push");
      }
      
      await this.notificationRepo.updateStatus(
        notification.notificationId,
        "delivered",
        sentVia
      );
      
    } catch (error) {
      await this.notificationRepo.updateStatus(
        notification.notificationId,
        "failed",
        sentVia
      );
      console.error('Failed to deliver notification:', error);
    }
  }
  
  async getUserNotifications(
    userId: string,
    page: number = 1,
    limit: number = 20,
    type?: string,
    isRead?: boolean
  ): Promise<ServiceResponse> {
    try {
      const filters: any = {};
      if (type) {
        const validTypes: NotificationType[] = ["booking", "payment", "reminder", "offer", "general", "cancellation"];
        if (validTypes.includes(type as NotificationType)) {
          filters.type = type;
        }
      }
      if (isRead !== undefined) filters.isRead = isRead;
      
      const result = await this.notificationRepo.findByUserId(
        userId,
        page,
        limit,
        filters
      );
      
      return {
        success: true,
        message: "Notifications retrieved successfully",
        data: result,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to get notifications",
        data: null,
      };
    }
  }
  
  async markAsRead(notificationId: string): Promise<ServiceResponse> {
    try {
      const notification = await this.notificationRepo.markAsRead(notificationId);
      
      if (!notification) {
        return {
          success: false,
          message: "Notification not found",
          data: null,
        };
      }
      
      return {
        success: true,
        message: "Notification marked as read",
        data: notification,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to mark notification as read",
        data: null,
      };
    }
  }
  
  async markAllAsRead(userId: string): Promise<ServiceResponse> {
    try {
      const count = await this.notificationRepo.markAllAsRead(userId);
      
      return {
        success: true,
        message: `${count} notifications marked as read`,
        data: { count },
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to mark all notifications as read",
        data: null,
      };
    }
  }
  
  async sendBookingNotification(
    userId: string,
    bookingData: any
  ): Promise<ServiceResponse> {
    const title = "Booking Confirmed! 🎬";
    const message = `Your booking for ${bookingData.movieTitle} at ${bookingData.theaterName} is confirmed for ${bookingData.showDate} at ${bookingData.showTime}.`;
    
    return this.sendNotification(
      userId,
      title,
      message,
      "booking",
      ["app", "email"], 
      {
        bookingId: bookingData.bookingId,
        movieTitle: bookingData.movieTitle,
        theaterName: bookingData.theaterName,
        showDate: bookingData.showDate,
        showTime: bookingData.showTime,
        url: `/bookings/${bookingData.bookingId}`,
      }
    );
  }
  
  async sendPaymentNotification(
    userId: string,
    paymentData: any
  ): Promise<ServiceResponse> {
    const title = paymentData.status === "completed" ? "Payment Successful! 💳" : "Payment Failed ❌";
    const message = paymentData.status === "completed" 
      ? `Your payment of ₹${paymentData.amount} has been processed successfully.`
      : `Your payment of ₹${paymentData.amount} could not be processed. Please try again.`;
    
    return this.sendNotification(
      userId,
      title,
      message,
      "payment",
      ["app", "email"],
      {
        paymentId: paymentData.paymentId,
        amount: paymentData.amount,
        status: paymentData.status,
        url: `/payments/${paymentData.paymentId}`,
      }
    );
  }
  
  async sendReminderNotification(
    userId: string,
    reminderData: any
  ): Promise<ServiceResponse> {
    const title = "Movie Reminder! 🍿";
    const message = `Don't forget! Your movie ${reminderData.movieTitle} starts in 2 hours at ${reminderData.theaterName}.`;
    
    const showDateTime = new Date(`${reminderData.showDate} ${reminderData.showTime}`);
    const reminderTime = new Date(showDateTime.getTime() - 2 * 60 * 60 * 1000);
    
    return this.sendNotification(
      userId,
      title,
      message,
      "reminder",
      ["app", "push"], 
      reminderData,
      reminderTime
    );
  }
  
  async getUnreadCount(userId: string): Promise<ServiceResponse> {
    try {
      const count = await this.notificationRepo.findUnreadCount(userId);
      
      return {
        success: true,
        message: "Unread count retrieved successfully",
        data: { count },
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to get unread count",
        data: null,
      };
    }
  }
  
  async processScheduledNotifications(): Promise<ServiceResponse> {
    try {
      const scheduledNotifications = await this.notificationRepo.findScheduledNotifications();
      
      for (const notification of scheduledNotifications) {
        await this.deliverNotification(notification);
      }
      
      return {
        success: true,
        message: `${scheduledNotifications.length} scheduled notifications processed`,
        data: { count: scheduledNotifications.length },
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to process scheduled notifications",
        data: null,
      };
    }
  }
  
  async getNotificationById(notificationId: string): Promise<ServiceResponse> {
    try {
      const notification = await this.notificationRepo.findByNotificationId(notificationId);
      
      if (!notification) {
        return {
          success: false,
          message: "Notification not found",
          data: null,
        };
      }
      
      return {
        success: true,
        message: "Notification found",
        data: notification,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to get notification",
        data: null,
      };
    }
  }
  
  async deleteNotification(notificationId: string): Promise<ServiceResponse> {
    try {
      const notification = await this.notificationRepo.findByNotificationId(notificationId);
      
      if (!notification) {
        return {
          success: false,
          message: "Notification not found",
          data: null,
        };
      }
      
      const deleted = await this.notificationRepo.deleteById(notification._id.toString());
      
      return {
        success: deleted,
        message: deleted ? "Notification deleted successfully" : "Failed to delete notification",
        data: null,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to delete notification",
        data: null,
      };
    }
  }
  
  async clearUserNotifications(userId: string): Promise<ServiceResponse> {
    try {
      const count = await this.notificationRepo.deleteByUserId(userId);
      
      return {
        success: true,
        message: `${count} notifications cleared`,
        data: { count },
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to clear notifications",
        data: null,
      };
    }
  }
  
  async sendBulkNotifications(
    userIds: string[],
    title: string,
    message: string,
    type: string,
    channels: string[] = ["app"]
  ): Promise<ServiceResponse> {
    try {
      const results = await Promise.allSettled(
        userIds.map(userId => 
          this.sendNotification(userId, title, message, type, channels)
        )
      );
      
      const successful = results.filter(r => r.status === "fulfilled").length;
      const failed = results.filter(r => r.status === "rejected").length;
      
      return {
        success: true,
        message: `Bulk notifications sent: ${successful} successful, ${failed} failed`,
        data: { successful, failed, total: userIds.length },
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to send bulk notifications",
        data: null,
      };
    }
  }
  
  async sendOfferNotification(
    userId: string,
    offerData: any
  ): Promise<ServiceResponse> {
    const title = "Special Offer! 🎁";
    const message = `${offerData.title} - Get ${offerData.discount}% off on your next booking!`;
    
    return this.sendNotification(
      userId,
      title,
      message,
      "offer",
      ["app", "push"],
      offerData
    );
  }
  
  async getNotificationStats(): Promise<ServiceResponse> {
    try {
      const stats = {
        totalNotifications: 0,
        unreadNotifications: 0,
        notificationsByType: {},
        notificationsByStatus: {},
      };
      
      // TODO: Implement actual stats aggregation here or add method to repo
      
      return {
        success: true,
        message: "Notification stats retrieved successfully",
        data: stats,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to get notification stats",
        data: null,
      };
    }
  }
  
  async retryFailedNotifications(): Promise<ServiceResponse> {
    try {
      const failedNotifications = await this.notificationRepo.findFailedNotifications();
      
      for (const notification of failedNotifications) {
        await this.deliverNotification(notification);
      }
      
      return {
        success: true,
        message: `${failedNotifications.length} failed notifications retried`,
        data: { count: failedNotifications.length },
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to retry failed notifications",
        data: null,
      };
    }
  }
}

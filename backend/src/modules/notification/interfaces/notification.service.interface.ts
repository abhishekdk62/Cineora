import { ServiceResponse } from "../../../interfaces/interface";

export interface INotificationService {
  sendNotification(
    userId: string,
    title: string,
    message: string,
    type: string,
    channels?: string[],
    data?: any,
    scheduledFor?: Date
  ): Promise<ServiceResponse>;
  
  getUserNotifications(
    userId: string,
    page?: number,
    limit?: number,
    type?: string,
    isRead?: boolean
  ): Promise<ServiceResponse>;
  
  getNotificationById(notificationId: string): Promise<ServiceResponse>;
  
  markAsRead(notificationId: string): Promise<ServiceResponse>;
  
  markAllAsRead(userId: string): Promise<ServiceResponse>;
  
  deleteNotification(notificationId: string): Promise<ServiceResponse>;
  
  clearUserNotifications(userId: string): Promise<ServiceResponse>;
  
  getUnreadCount(userId: string): Promise<ServiceResponse>;
  
  sendBulkNotifications(
    userIds: string[],
    title: string,
    message: string,
    type: string,
    channels?: string[]
  ): Promise<ServiceResponse>;
  
  sendBookingNotification(
    userId: string,
    bookingData: any
  ): Promise<ServiceResponse>;
  
  sendPaymentNotification(
    userId: string,
    paymentData: any
  ): Promise<ServiceResponse>;
  
  sendReminderNotification(
    userId: string,
    reminderData: any
  ): Promise<ServiceResponse>;
  
  sendOfferNotification(
    userId: string,
    offerData: any
  ): Promise<ServiceResponse>;
  
  getNotificationStats(): Promise<ServiceResponse>;
  
  processScheduledNotifications(): Promise<ServiceResponse>;
  
  retryFailedNotifications(): Promise<ServiceResponse>;
}

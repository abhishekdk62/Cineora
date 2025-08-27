import { INotification } from "./notification.model.interface";

export interface INotificationRepository {
  create(notificationData: Partial<INotification>): Promise<INotification | null>;
  
  findById(id: string): Promise<INotification | null>;
  
  findByNotificationId(notificationId: string): Promise<INotification | null>;
  
  findByUserId(
    userId: string,
    page: number,
    limit: number,
    filters?: {
      type?: string;
      isRead?: boolean;
    }
  ): Promise<{
    notifications: INotification[];
    total: number;
    unreadCount: number;
  }>;
  
  markAsRead(notificationId: string): Promise<INotification | null>;
  
  markAllAsRead(userId: string): Promise<number>;
  
  updateStatus(
    notificationId: string,
    status: string,
    sentVia?: string[]
  ): Promise<INotification | null>;
  
  deleteById(id: string): Promise<boolean>;
  
  deleteByUserId(userId: string): Promise<number>;
  
  findScheduledNotifications(): Promise<INotification[]>;
  
  findUnreadCount(userId: string): Promise<number>;
  
  findByType(
    type: string,
    page: number,
    limit: number
  ): Promise<{
    notifications: INotification[];
    total: number;
  }>;
  
  findFailedNotifications(): Promise<INotification[]>;
}

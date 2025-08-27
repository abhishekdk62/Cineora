import { INotification } from "../interfaces/notification.model.interface";
import Notification from "../models/notification.model";
import { INotificationRepository } from "../interfaces/notification.repository.interface";

export class NotificationRepository implements INotificationRepository {
  async create(notificationData: Partial<INotification>): Promise<INotification | null> {
    const notification = new Notification(notificationData);
    return notification.save();
  }
  
  async findById(id: string): Promise<INotification | null> {
    return Notification.findById(id).populate("userId", "firstName lastName email");
  }
  
  async findByNotificationId(notificationId: string): Promise<INotification | null> {
    return Notification.findOne({ notificationId })
      .populate("userId", "firstName lastName email");
  }
  
  async findByUserId(
    userId: string,
    page: number = 1,
    limit: number = 20,
    filters?: { type?: string; isRead?: boolean }
  ): Promise<{
    notifications: INotification[];
    total: number;
    unreadCount: number;
  }> {
    const skip = (page - 1) * limit;
    const query: any = { userId };
    
    if (filters?.type) {
      query.type = filters.type;
    }
    
    if (filters?.isRead !== undefined) {
      query.isRead = filters.isRead;
    }
    
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ 
      userId, 
      isRead: false 
    });
    
    return { notifications, total, unreadCount };
  }
  
  async markAsRead(notificationId: string): Promise<INotification | null> {
    return Notification.findOneAndUpdate(
      { notificationId },
      { 
        isRead: true, 
        readAt: new Date(),
        status: "read"
      },
      { new: true }
    );
  }
  
  async markAllAsRead(userId: string): Promise<number> {
    const result = await Notification.updateMany(
      { userId, isRead: false },
      { 
        isRead: true, 
        readAt: new Date(),
        status: "read"
      }
    );
    
    return result.modifiedCount;
  }
  
  async updateStatus(
    notificationId: string,
    status: string,
    sentVia?: string[]
  ): Promise<INotification | null> {
    const updateData: any = { status };
    
    if (status === "sent" || status === "delivered") {
      updateData.sentAt = new Date();
    }
    
    if (sentVia) {
      updateData.sentVia = sentVia;
    }
    
    return Notification.findOneAndUpdate(
      { notificationId },
      updateData,
      { new: true }
    );
  }
  
  async deleteById(id: string): Promise<boolean> {
    const result = await Notification.findByIdAndDelete(id);
    return !!result;
  }
  
  async deleteByUserId(userId: string): Promise<number> {
    const result = await Notification.deleteMany({ userId });
    return result.deletedCount;
  }
  
  async findScheduledNotifications(): Promise<INotification[]> {
    const now = new Date();
    return Notification.find({
      status: "pending",
      scheduledFor: { $lte: now }
    }).populate("userId", "firstName lastName email phone");
  }
  
  async findUnreadCount(userId: string): Promise<number> {
    return Notification.countDocuments({ userId, isRead: false });
  }
  
  async findByType(
    type: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    notifications: INotification[];
    total: number;
  }> {
    const skip = (page - 1) * limit;
    
    const notifications = await Notification.find({ type })
      .populate("userId", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await Notification.countDocuments({ type });
    
    return { notifications, total };
  }
  
  async findFailedNotifications(): Promise<INotification[]> {
    return Notification.find({ status: "failed" })
      .populate("userId", "firstName lastName email phone")
      .sort({ createdAt: -1 });
  }
}

import { INotification } from "../interfaces/notification.model.interface";
import { 

  INotificationRepository 
} from "../interfaces/notification.repository.interface";
import Notification from "../models/notification.model";
import { CreateNotificationDTO, NotificationFilterDTO } from "../dtos/dto";

export class NotificationRepository implements INotificationRepository {
  async createNotification(notificationData: CreateNotificationDTO): Promise<INotification> {
    try {
      const notification = new Notification(notificationData);
      const savedNotification = await notification.save();
      if (!savedNotification) {
        throw new Error("Failed to create notification");
      }
      return savedNotification;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred while creating notification";
      throw new Error(`Create notification failed: ${errorMessage}`);
    }
  }

  async findNotificationsByUserId(userId: string): Promise<INotification[]> {
    try {
      const notifications = await Notification.find({ userId })
        .sort({ createdAt: -1 })
        .lean();
      return notifications;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred while finding notifications";
      throw new Error(`Find notifications by userId failed: ${errorMessage}`);
    }
  }

  async findUnreadNotificationsByUserId(userId: string): Promise<INotification[]> {
    try {
      const notifications = await Notification.find({ userId, isRead: false })
        .sort({ createdAt: -1 })
        .lean();
      return notifications;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred while finding unread notifications";
      throw new Error(`Find unread notifications failed: ${errorMessage}`);
    }
  }
  async findAllNotificationsByUserId(userId: string): Promise<INotification[]> {
    try {
      const notifications = await Notification.find({ userId })
        .sort({ createdAt: -1 })
        .lean();
      return notifications;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred while finding unread notifications";
      throw new Error(`Find unread notifications failed: ${errorMessage}`);
    }
  }
async markAllNotificationsRead(userId:string):Promise<boolean>
{
  const data=await Notification.updateMany({userId},{isRead:true}).exec()
  return !!data
}
  async markNotificationAsRead(notificationId: string): Promise<INotification> {
    try {
      const updatedNotification = await Notification.findOneAndUpdate(
        { notificationId },
        {
          isRead: true,
          readAt: new Date()
        },
        { new: true }
      );
      
      if (!updatedNotification) {
        throw new Error("Notification not found");
      }
      
      return updatedNotification;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred while marking notification as read";
      throw new Error(`Mark notification as read failed: ${errorMessage}`);
    }
  }

  async deleteNotificationById(notificationId: string): Promise<boolean> {
    try {
      const result = await Notification.findOneAndDelete({ notificationId });
      return !!result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred while deleting notification";
      throw new Error(`Delete notification failed: ${errorMessage}`);
    }
  }

  async countUnreadNotificationsByUserId(userId: string): Promise<number> {
    try {
      const count = await Notification.countDocuments({
        userId,
        isRead: false
      });
      return count;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred while counting unread notifications";
      throw new Error(`Count unread notifications failed: ${errorMessage}`);
    }
  }

  async findNotificationByNotificationId(notificationId: string): Promise<INotification | null> {
    try {
      const notification = await Notification.findOne({ notificationId }).lean();
      return notification;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred while finding notification";
      throw new Error(`Find notification by ID failed: ${errorMessage}`);
    }
  }
}

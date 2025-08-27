import { Request, Response } from "express";
import { NotificationService } from "../services/notification.service";
import { INotificationService } from "../interfaces/notification.service.interface";
import { CreateNotificationDto, BulkNotificationDto } from "../dtos/dto";

export class NotificationController {
  constructor(private readonly notificationService: INotificationService) {}
  
  async getUserNotifications(req: Request, res: Response): Promise<any> {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 20, type, isRead } = req.query;
      
      const result = await this.notificationService.getUserNotifications(
        userId,
        Number(page),
        Number(limit),
        type as string,
        isRead ? isRead === "true" : undefined
      );
      
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }
  
  async getNotificationById(req: Request, res: Response): Promise<any> {
    try {
      const { notificationId } = req.params;
      const result = await this.notificationService.getNotificationById(notificationId);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }
  
  async markAsRead(req: Request, res: Response): Promise<any> {
    try {
      const { notificationId } = req.params;
      const result = await this.notificationService.markAsRead(notificationId);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }
  
  async markAllAsRead(req: Request, res: Response): Promise<any> {
    try {
      const { userId } = req.params;
      const result = await this.notificationService.markAllAsRead(userId);
      
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }
  
  async deleteNotification(req: Request, res: Response): Promise<any> {
    try {
      const { notificationId } = req.params;
      const result = await this.notificationService.deleteNotification(notificationId);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }
  
  async clearUserNotifications(req: Request, res: Response): Promise<any> {
    try {
      const { userId } = req.params;
      const result = await this.notificationService.clearUserNotifications(userId);
      
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }
  
  async getUnreadCount(req: Request, res: Response): Promise<any> {
    try {
      const { userId } = req.params;
      const result = await this.notificationService.getUnreadCount(userId);
      
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }
  
  async sendBulkNotifications(req: Request, res: Response): Promise<any> {
    try {
      const { userIds, title, message, type, channels }: BulkNotificationDto = req.body;
      
      const result = await this.notificationService.sendBulkNotifications(
        userIds,
        title,
        message,
        type,
        channels
      );
      
      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }
}

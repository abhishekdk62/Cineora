import { ServiceResponse } from "../../../interfaces/interface";
import mongoose from "mongoose";
import { INotificationService } from "../interfaces/notification.service.interface";
import { INotificationRepository } from "../interfaces/notification.repository.interface";
import {
  CreateNotificationDTO,
  NotificationResponseDTO,
  UserNotificationsResponseDTO,
  BookingNotificationDataDTO,
  PaymentNotificationDataDTO,
  CancellationNotificationDataDTO,
  ReminderNotificationDataDTO,
} from "../dtos/dto";
import { NotificationType } from "../models/notification.model";

export class NotificationService implements INotificationService {
  constructor(
    private readonly notificationRepository: INotificationRepository
  ) {}

  async sendNotification(
    userId: string,
    title: string,
    message: string,
    type: NotificationType,
    data?: Record<string, unknown>
  ): Promise<ServiceResponse<NotificationResponseDTO>> {
    try {
      if (!userId || !title || !message || !type) {
        return {
          success: false,
          message:
            "Missing required fields: userId, title, message, and type are required",
          data: null,
        };
      }

      const notificationId = this.generateNotificationId();

      const createNotificationData: CreateNotificationDTO = {
        notificationId,
        userId: new mongoose.Types.ObjectId(userId),
        title,
        message,
        type,
        isRead: false,
        data,
      };

      const notification = await this.notificationRepository.createNotification(
        createNotificationData
      );

      const responseData: NotificationResponseDTO = {
        notificationId: notification.notificationId,
        userId: notification.userId.toString(),
        title: notification.title,
        message: notification.message,
        type: notification.type,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
        data: notification.data,
      };

      return {
        success: true,
        message: "Notification sent successfully",
        data: responseData,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to send notification";
      return {
        success: false,
        message: errorMessage,
        data: null,
      };
    }
  }

  async getUserNotifications(
    userId: string
  ): Promise<ServiceResponse<UserNotificationsResponseDTO>> {
    try {
      if (!userId) {
        return {
          success: false,
          message: "UserId is required",
          data: null,
        };
      }

      const notifications =
        await this.notificationRepository.findUnreadNotificationsByUserId(
          userId
        );
      const unreadCount =
        await this.notificationRepository.countUnreadNotificationsByUserId(
          userId
        );

      const notificationDTOs: NotificationResponseDTO[] = notifications.map(
        (notification) => ({
          notificationId: notification.notificationId,
          userId: notification.userId.toString(),
          title: notification.title,
          message: notification.message,
          type: notification.type,
          isRead: notification.isRead,
          createdAt: notification.createdAt,
          readAt: notification.readAt,
          data: notification.data,
        })
      );

      const responseData: UserNotificationsResponseDTO = {
        notifications: notificationDTOs,
        unreadCount,
      };

      return {
        success: true,
        message: "Notifications retrieved successfully",
        data: responseData,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to get notifications";
      return {
        success: false,
        message: errorMessage,
        data: null,
      };
    }
  }

  async getAllUserNotifications(
    userId: string
  ): Promise<ServiceResponse<UserNotificationsResponseDTO>> {
    try {
      if (!userId) {
        return {
          success: false,
          message: "UserId is required",
          data: null,
        };
      }

      const notifications =
        await this.notificationRepository.findAllNotificationsByUserId(userId);
      const unreadCount =
        await this.notificationRepository.countUnreadNotificationsByUserId(
          userId
        );

      const notificationDTOs: NotificationResponseDTO[] = notifications.map(
        (notification) => ({
          notificationId: notification.notificationId,
          userId: notification.userId.toString(),
          title: notification.title,
          message: notification.message,
          type: notification.type,
          isRead: notification.isRead,
          createdAt: notification.createdAt,
          readAt: notification.readAt,
          data: notification.data,
        })
      );

      const responseData: UserNotificationsResponseDTO = {
        notifications: notificationDTOs,
        unreadCount,
      };

      return {
        success: true,
        message: "Notifications retrieved successfully",
        data: responseData,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to get notifications";
      return {
        success: false,
        message: errorMessage,
        data: null,
      };
    }
  }
  async markAllNotificationsRead(
    userId: string
  ): Promise<ServiceResponse<boolean>> {
    try {
      if (!userId) {
        return {
          success: false,
          message: "UserId is required",
          data: null,
        };
      }
      let data = this.notificationRepository.markAllNotificationsRead(userId);
      if (data) {
        return {
          success: true,
          message: "marked as read",
          data: true,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  }
  async markNotificationAsRead(
    notificationId: string
  ): Promise<ServiceResponse<NotificationResponseDTO>> {
    try {
      if (!notificationId) {
        return {
          success: false,
          message: "NotificationId is required",
          data: null,
        };
      }

      const notification =
        await this.notificationRepository.markNotificationAsRead(
          notificationId
        );

      const responseData: NotificationResponseDTO = {
        notificationId: notification.notificationId,
        userId: notification.userId.toString(),
        title: notification.title,
        message: notification.message,
        type: notification.type,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
        readAt: notification.readAt,
        data: notification.data,
      };

      return {
        success: true,
        message: "Notification marked as read",
        data: responseData,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to mark notification as read";
      return {
        success: false,
        message: errorMessage,
        data: null,
      };
    }
  }

  async deleteNotification(
    notificationId: string
  ): Promise<ServiceResponse<null>> {
    try {
      if (!notificationId) {
        return {
          success: false,
          message: "NotificationId is required",
          data: null,
        };
      }

      const deleted = await this.notificationRepository.deleteNotificationById(
        notificationId
      );

      return {
        success: deleted,
        message: deleted
          ? "Notification deleted successfully"
          : "Notification not found",
        data: null,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to delete notification";
      return {
        success: false,
        message: errorMessage,
        data: null,
      };
    }
  }

  async sendBookingNotification(
    userId: string,
    bookingData: BookingNotificationDataDTO
  ): Promise<ServiceResponse<NotificationResponseDTO>> {
    try {
      if (!bookingData.bookingId || !bookingData.movieTitle) {
        return {
          success: false,
          message:
            "Missing required booking data: bookingId and movieTitle are required",
          data: null,
        };
      }

      const title = "Booking Confirmed! 🎬";
      const message = `Your booking for ${bookingData.movieTitle} is confirmed.`;

      return this.sendNotification(userId, title, message, "booking", {
        bookingId: bookingData.bookingId,
        movieTitle: bookingData.movieTitle,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to send booking notification";
      return {
        success: false,
        message: errorMessage,
        data: null,
      };
    }
  }

  async sendPaymentNotification(
    userId: string,
    paymentData: PaymentNotificationDataDTO
  ): Promise<ServiceResponse<NotificationResponseDTO>> {
    try {
      if (!paymentData.amount || !paymentData.status) {
        return {
          success: false,
          message:
            "Missing required payment data: amount and status are required",
          data: null,
        };
      }

      const title =
        paymentData.status === "completed"
          ? "Payment Successful! "
          : "Payment Failed ";
      const message =
        paymentData.status === "completed"
          ? `Your payment of Rs ${paymentData.amount} has been processed successfully.`
          : `Your payment of Rs ${paymentData.amount} could not be processed.`;

      return this.sendNotification(userId, title, message, "payment", {
        amount: paymentData.amount,
        status: paymentData.status,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to send payment notification";
      return {
        success: false,
        message: errorMessage,
        data: null,
      };
    }
  }

  async sendReminderNotification(
    userId: string,
    reminderData: ReminderNotificationDataDTO
  ): Promise<ServiceResponse<NotificationResponseDTO>> {
    try {
      if (!reminderData.movieTitle) {
        return {
          success: false,
          message: "Missing required reminder data: movieTitle is required",
          data: null,
        };
      }

      const title = "Movie Reminder! 🍿";
      const message = `Your movie ${reminderData.movieTitle} starts in 2 hours.`;

      return this.sendNotification(userId, title, message, "reminder", {
        movieTitle: reminderData.movieTitle,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to send reminder notification";
      return {
        success: false,
        message: errorMessage,
        data: null,
      };
    }
  }

  async sendCancellationNotification(
    userId: string,
    cancellationData: CancellationNotificationDataDTO
  ): Promise<ServiceResponse<NotificationResponseDTO>> {
    try {
      if (
        !cancellationData.bookingId ||
        cancellationData.refundAmount === undefined
      ) {
        return {
          success: false,
          message:
            "Missing required cancellation data: bookingId and refundAmount are required",
          data: null,
        };
      }

      const title = "Booking Cancelled";
      const message = `Your booking has been cancelled. Rs ${cancellationData.refundAmount} has been refunded.`;

      return this.sendNotification(userId, title, message, "cancellation", {
        bookingId: cancellationData.bookingId,
        refundAmount: cancellationData.refundAmount,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to send cancellation notification";
      return {
        success: false,
        message: errorMessage,
        data: null,
      };
    }
  }

  private generateNotificationId(): string {
    return `NOT${Date.now()}${Math.random()
      .toString(36)
      .substr(2, 4)
      .toUpperCase()}`;
  }
}

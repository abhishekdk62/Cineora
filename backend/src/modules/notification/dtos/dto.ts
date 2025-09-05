import mongoose from "mongoose";
import { NotificationType } from "../models/notification.model";

// Create DTOs
export interface CreateNotificationDTO {
  notificationId: string;
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  data?: Record<string, unknown>;
  scheduledTime?: Date;
  sent?: boolean;
}

// Response DTOs
export interface NotificationResponseDTO {
  notificationId: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: Date;
  readAt?: Date;
  data?: Record<string, unknown>;
}

export interface UserNotificationsResponseDTO {
  notifications: NotificationResponseDTO[];
  unreadCount: number;
}

// Request DTOs
export interface SendNotificationRequestDTO {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  data?: Record<string, unknown>;
}

export interface MarkAsReadRequestDTO {
  notificationId: string;
}

export interface DeleteNotificationRequestDTO {
  notificationId: string;
}

// Specific notification data DTOs
export interface BookingNotificationDataDTO {
  bookingId: string;
  movieTitle: string;
}

export interface PaymentNotificationDataDTO {
  amount: number;
  status: "completed" | "failed";
}

export interface ReminderNotificationDataDTO {
  movieTitle: string;
}

export interface CancellationNotificationDataDTO {
  bookingId: string;
  refundAmount: number;
}

// Request DTOs for specific notification types
export interface BookingNotificationRequestDTO {
  userId: string;
  bookingData: BookingNotificationDataDTO;
}

export interface PaymentNotificationRequestDTO {
  userId: string;
  paymentData: PaymentNotificationDataDTO;
}

export interface ReminderNotificationRequestDTO {
  userId: string;
  reminderData: ReminderNotificationDataDTO;
}

export interface CancellationNotificationRequestDTO {
  userId: string;
  cancellationData: CancellationNotificationDataDTO;
}

// Filter DTOs
export interface NotificationFilterDTO {
  userId?: string;
  type?: NotificationType;
  isRead?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface PaginationDTO {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

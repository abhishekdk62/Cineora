import { ServiceResponse } from "../../../interfaces/interface";
import {
  NotificationResponseDTO,
  UserNotificationsResponseDTO,
  BookingNotificationDataDTO,
  PaymentNotificationDataDTO,
  ReminderNotificationDataDTO,
  CancellationNotificationDataDTO,
} from "../dtos/dto";
import { NotificationType } from "../models/notification.model";
import { INotification } from "./notification.model.interface";

export interface INotificationService {
  sendNotification(
    userId: string,
    title: string,
    message: string,
    type: NotificationType,
    data?: Record<string, unknown>
  ): Promise<ServiceResponse<NotificationResponseDTO>>;

  getUserNotifications(
    userId: string
  ): Promise<ServiceResponse<UserNotificationsResponseDTO>>;
  getAllUserNotifications(
    userId: string
  ): Promise<ServiceResponse<UserNotificationsResponseDTO>>;
  markNotificationAsRead(
    notificationId: string
  ): Promise<ServiceResponse<NotificationResponseDTO>>;
  deleteNotification(notificationId: string): Promise<ServiceResponse<null>>;
  markAllNotificationsRead(userId: string): Promise<ServiceResponse<boolean>>;
  sendBookingNotification(
    userId: string,
    bookingData: BookingNotificationDataDTO
  ): Promise<ServiceResponse<NotificationResponseDTO>>;
  sendPaymentNotification(
    userId: string,
    paymentData: PaymentNotificationDataDTO
  ): Promise<ServiceResponse<NotificationResponseDTO>>;
  sendReminderNotification(
    userId: string,
    reminderData: ReminderNotificationDataDTO
  ): Promise<ServiceResponse<NotificationResponseDTO>>;
  sendCancellationNotification(
    userId: string,
    cancellationData: CancellationNotificationDataDTO
  ): Promise<ServiceResponse<NotificationResponseDTO>>;
}

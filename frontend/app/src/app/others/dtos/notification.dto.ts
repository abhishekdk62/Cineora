import { ApiResponse, PaginationQuery } from './common.dto';

export interface NotificationDataDto {
  bookingId?: string;
  movieTitle?: string;
  amount?: number;
}

export interface NotificationEntity {
  _id: string;
  notificationId: string;
  userId: string;
  title: string;
  message: string;
  type: "booking" | "payment" | "reminder" | "cancellation" | "offer";
  isRead: boolean;
  readAt?: Date;
  sent: boolean;
  scheduledTime: Date;
  data?: NotificationDataDto;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNotificationRequestDto {
  userId: string;
  title: string;
  message: string;
  type: "booking" | "payment" | "reminder" | "cancellation" | "offer";
  scheduledTime?: Date;
  data?: NotificationDataDto;
}

export interface UpdateNotificationRequestDto {
  title?: string;
  message?: string;
  scheduledTime?: Date;
  data?: NotificationDataDto;
}

export interface MarkNotificationReadRequestDto {
  isRead: boolean;
}

export interface GetNotificationsQueryDto extends PaginationQuery {
  userId?: string;
  type?: "booking" | "payment" | "reminder" | "cancellation" | "offer";
  isRead?: boolean;
  sent?: boolean;
}

export interface NotificationResponseDto {
  _id: string;
  notificationId: string;
  userId: string;
  title: string;
  message: string;
  type: "booking" | "payment" | "reminder" | "cancellation" | "offer";
  isRead: boolean;
  readAt?: Date;
  sent: boolean;
  scheduledTime: Date;
  data?: NotificationDataDto;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNotificationResponseDto extends ApiResponse<NotificationResponseDto> {}
export interface GetNotificationResponseDto extends ApiResponse<NotificationResponseDto> {}
export interface GetNotificationsResponseDto extends ApiResponse<NotificationResponseDto[]> {}
export interface UpdateNotificationResponseDto extends ApiResponse<NotificationResponseDto> {}
export interface MarkNotificationReadResponseDto extends ApiResponse<NotificationResponseDto> {}
export interface DeleteNotificationResponseDto extends ApiResponse<null> {}

export interface CreateNotificationDto {
  userId: string;
  title: string;
  message: string;
  type: "booking" | "payment" | "reminder" | "offer" | "general" | "cancellation";
  priority?: "low" | "medium" | "high";
  channels?: ("app" | "email" | "sms" | "push")[];
  data?: any;
  scheduledFor?: Date;
}

export interface NotificationResponseDto {
  notificationId: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  status: string;
  isRead: boolean;
  readAt?: string;
  sentVia: string[];
  data?: any;
  createdAt: string;
}

export interface BulkNotificationDto {
  userIds: string[];
  title: string;
  message: string;
  type: string;
  channels?: string[];
  data?: any;
}

export interface NotificationFiltersDto {
  type?: string;
  isRead?: boolean;
  page?: number;
  limit?: number;
}

export interface NotificationStatsDto {
  totalNotifications: number;
  unreadNotifications: number;
  notificationsByType: { [key: string]: number };
  notificationsByStatus: { [key: string]: number };
}

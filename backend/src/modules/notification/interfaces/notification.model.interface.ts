import mongoose, { Document, Types } from "mongoose";

export interface INotificationData {
  bookingId?: string;
  movieTitle?: string;
  theaterName?: string;
  showDate?: string;
  showTime?: string;
  amount?: number;
  url?: string;
}

export interface INotification extends Document {
  notificationId: string;
  userId: mongoose.Types.ObjectId;
  
  // Notification Content
  title: string;
  message: string;
  type: "booking" | "payment" | "reminder" | "offer" | "general" | "cancellation";
  priority: "low" | "medium" | "high";
  
  // Notification Status
  status: "pending" | "sent" | "delivered" | "failed" | "read";
  isRead: boolean;
  readAt?: Date;
  
  // Delivery Channels
  channels: ("app" | "email" | "sms" | "push")[];
  sentVia: ("app" | "email" | "sms" | "push")[];
  
  // Additional Data
  data?: INotificationData;
  
  // Scheduling
  scheduledFor?: Date;
  sentAt?: Date;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

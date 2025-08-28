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
  
  title: string;
  message: string;
  type: "booking" | "payment" | "reminder" | "offer" | "general" | "cancellation";
  priority: "low" | "medium" | "high";
  
  status: "pending" | "sent" | "delivered" | "failed" | "read";
  isRead: boolean;
  readAt?: Date;
  
  channels: ("app" | "email" | "sms" | "push")[];
  sentVia: ("app" | "email" | "sms" | "push")[];
  
  data?: INotificationData;
  
  scheduledFor?: Date;
  sentAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

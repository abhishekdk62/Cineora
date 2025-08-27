import mongoose, { Schema } from "mongoose";
import { INotification, INotificationData } from "../interfaces/notification.model.interface";

const NotificationDataSchema = new Schema<INotificationData>({
  bookingId: {
    type: String,
  },
  movieTitle: {
    type: String,
  },
  theaterName: {
    type: String,
  },
  showDate: {
    type: String,
  },
  showTime: {
    type: String,
  },
  amount: {
    type: Number,
  },
  url: {
    type: String,
  },
});

const NotificationSchema = new Schema<INotification>({
  notificationId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  
  // Notification Content
  title: {
    type: String,
    required: true,
    maxlength: 100,
  },
  message: {
    type: String,
    required: true,
    maxlength: 500,
  },
  type: {
    type: String,
    enum: ["booking", "payment", "reminder", "offer", "general", "cancellation"],
    required: true,
    index: true,
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  
  // Notification Status
  status: {
    type: String,
    enum: ["pending", "sent", "delivered", "failed", "read"],
    default: "pending",
    index: true,
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true,
  },
  readAt: {
    type: Date,
  },
  
  // Delivery Channels
  channels: {
    type: [String],
    enum: ["app", "email", "sms", "push"],
    default: ["app"],
  },
  sentVia: {
    type: [String],
    enum: ["app", "email", "sms", "push"],
    default: [],
  },
  
  // Additional Data
  data: {
    type: NotificationDataSchema,
  },
  
  // Scheduling
  scheduledFor: {
    type: Date,
  },
  sentAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Indexes for performance
NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
NotificationSchema.index({ type: 1, createdAt: -1 });
NotificationSchema.index({ status: 1, scheduledFor: 1 });
NotificationSchema.index({ notificationId: 1 });

export default mongoose.model<INotification>("Notification", NotificationSchema);

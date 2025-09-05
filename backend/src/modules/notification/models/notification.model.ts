import mongoose, { Schema } from "mongoose";
import { INotification } from "../interfaces/notification.model.interface";
export type NotificationType = "booking" | "payment" | "reminder" | "cancellation" | "offer";

const notificationSchema = new Schema<INotification>(
  {
    notificationId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["booking", "payment", "reminder", "cancellation", "offer"],
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
    data: {
      type: Schema.Types.Mixed,
    },
    scheduledTime: { type: Date }, 
    sent: { type: Boolean, default: false }, 
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });

const Notification = mongoose.model<INotification>("Notification", notificationSchema);

export default Notification;

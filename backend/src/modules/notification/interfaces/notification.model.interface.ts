import mongoose, { Document } from "mongoose";

export interface INotification extends Document {
  notificationId: string;
  userId: mongoose.Types.ObjectId;
  
  title: string;
  message: string;
  type: "booking" | "payment" | "reminder" | "cancellation" | "offer";
  
  isRead: boolean;
  readAt?: Date;
  sent:boolean;
  scheduledTime:Date;
  data?: {
    bookingId?: string;
    movieTitle?: string;
    amount?: number;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

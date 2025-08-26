import mongoose, { Document, Types } from "mongoose";

export interface IReview extends Document {
  reviewId: string;
  userId: mongoose.Types.ObjectId;
  
  // Review Target (Either Movie or Theater)
  movieId?: mongoose.Types.ObjectId;
  theaterId?: mongoose.Types.ObjectId;
  reviewType: "movie" | "theater";
  
  // Review Content
  rating: number; // 1-5 stars
  title: string;
  comment: string;
  
  // Moderation
  status: "pending" | "approved" | "rejected";
  moderatedBy?: mongoose.Types.ObjectId;
  moderatedAt?: Date;
  rejectionReason?: string;
  
  // Engagement
  likesCount: number;
  dislikesCount: number;
  helpfulCount: number;
  
  // Verification
  isVerifiedReview: boolean; // User actually booked/watched
  bookingId?: mongoose.Types.ObjectId; // Reference to actual booking
  
  createdAt: Date;
  updatedAt: Date;
}

export interface IReviewLike extends Document {
  userId: mongoose.Types.ObjectId;
  reviewId: mongoose.Types.ObjectId;
  type: "like" | "dislike" | "helpful";
  createdAt: Date;
}

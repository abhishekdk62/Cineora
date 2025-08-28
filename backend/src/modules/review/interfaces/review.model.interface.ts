import mongoose, { Document, Types } from "mongoose";

export interface IReview extends Document {
  reviewId: string;
  userId: mongoose.Types.ObjectId;
  
  movieId?: mongoose.Types.ObjectId;
  theaterId?: mongoose.Types.ObjectId;
  reviewType: "movie" | "theater";
  
  rating: number;
  title: string;
  comment: string;
  
  status: "pending" | "approved" | "rejected";
  moderatedBy?: mongoose.Types.ObjectId;
  moderatedAt?: Date;
  rejectionReason?: string;
  
  likesCount: number;
  dislikesCount: number;
  helpfulCount: number;
  
  isVerifiedReview: boolean; 
  bookingId?: mongoose.Types.ObjectId; 
  
  createdAt: Date;
  updatedAt: Date;
}

export interface IReviewLike extends Document {
  userId: mongoose.Types.ObjectId;
  reviewId: mongoose.Types.ObjectId;
  type: "like" | "dislike" | "helpful";
  createdAt: Date;
}

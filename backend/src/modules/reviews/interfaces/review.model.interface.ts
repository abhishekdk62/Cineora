import { Document, Types } from "mongoose";

export interface IReview extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  movieId?: Types.ObjectId;
  theaterId?: Types.ObjectId;
  bookingId?: Types.ObjectId;
  rating: number; // 1-5 stars
  reviewText?: string;
  reviewType: 'movie' | 'theater' | 'experience';
  isVerifiedBooking: boolean;
  helpfulCount: number;
  reportCount: number;
  status: 'active' | 'hidden' | 'reported';
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewData {
  userId: string;
  movieId?: string;
  theaterId?: string;
  bookingId?: string;
  rating: number;
  reviewText?: string;
  reviewType: 'movie' | 'theater' | 'experience';
}

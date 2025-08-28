import mongoose, { Schema } from "mongoose";
import { IReview, IReviewLike } from "../interfaces/review.model.interface";

const ReviewSchema = new Schema<IReview>({
  reviewId: {
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
  
  movieId: {
    type: Schema.Types.ObjectId,
    ref: "Movie",
    index: true,
  },
  theaterId: {
    type: Schema.Types.ObjectId,
    ref: "Theater",
    index: true,
  },
  reviewType: {
    type: String,
    enum: ["movie", "theater"],
    required: true,
    index: true,
  },
  
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  title: {
    type: String,
    required: true,
    maxlength: 100,
  },
  comment: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
    index: true,
  },
  moderatedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  moderatedAt: {
    type: Date,
  },
  rejectionReason: {
    type: String,
  },
  
  likesCount: {
    type: Number,
    default: 0,
  },
  dislikesCount: {
    type: Number,
    default: 0,
  },
  helpfulCount: {
    type: Number,
    default: 0,
  },
  
  isVerifiedReview: {
    type: Boolean,
    default: false,
  },
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: "Booking",
  },
}, {
  timestamps: true,
});

const ReviewLikeSchema = new Schema<IReviewLike>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reviewId: {
    type: Schema.Types.ObjectId,
    ref: "Review",
    required: true,
  },
  type: {
    type: String,
    enum: ["like", "dislike", "helpful"],
    required: true,
  },
}, {
  timestamps: true,
});

ReviewSchema.index({ movieId: 1, status: 1, rating: -1 });
ReviewSchema.index({ theaterId: 1, status: 1, rating: -1 });
ReviewSchema.index({ userId: 1, createdAt: -1 });
ReviewSchema.index({ status: 1, createdAt: -1 });

ReviewLikeSchema.index({ userId: 1, reviewId: 1 }, { unique: true });
ReviewLikeSchema.index({ reviewId: 1, type: 1 });

ReviewSchema.index(
  { userId: 1, movieId: 1 }, 
  { unique: true, partialFilterExpression: { movieId: { $exists: true } } }
);
ReviewSchema.index(
  { userId: 1, theaterId: 1 }, 
  { unique: true, partialFilterExpression: { theaterId: { $exists: true } } }
);

export const Review = mongoose.model<IReview>("Review", ReviewSchema);
export const ReviewLike = mongoose.model<IReviewLike>("ReviewLike", ReviewLikeSchema);

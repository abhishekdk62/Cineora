import { Schema, model } from "mongoose";
import { IReview } from "../interfaces/review.model.interface";

const reviewSchema = new Schema<IReview>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    movieId: {
      type: Schema.Types.ObjectId,
      ref: "Movie",
      required: function() { return this.reviewType === 'movie' || this.reviewType === 'experience'; }
    },
    theaterId: {
      type: Schema.Types.ObjectId,
      ref: "Theater",
      required: function() { return this.reviewType === 'theater' || this.reviewType === 'experience'; }
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: false,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    reviewText: {
      type: String,
      maxlength: 1000,
    },
    reviewType: {
      type: String,
      enum: ['movie', 'theater', 'experience'],
      required: true,
    },
    isVerifiedBooking: {
      type: Boolean,
      default: false,
    },
    helpfulCount: {
      type: Number,
      default: 0,
    },
    reportCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'hidden', 'reported'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);


export const Review = model<IReview>("Review", reviewSchema);

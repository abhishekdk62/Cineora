import { Schema } from "mongoose";
import { IUser } from "../interfaces/user.model.interface";
import { model } from "mongoose";

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    groupBookingStats: {
      totalInvitesSent: { type: Number, default: 0 },
      totalInvitesReceived: { type: Number, default: 0 },
      totalGroupBookings: { type: Number, default: 0 },
      totalGroupBookingsCancelled: { type: Number, default: 0 },
      reliabilityScore: { type: Number, default: 5.0, min: 0, max: 5 },
      averageRating: { type: Number, default: 5.0, min: 1, max: 5 },
      totalRatings: { type: Number, default: 0 },
    },

    googleId: {
      type: String,
      sparse: true,
    },
    authProvider: {
      type: String,
      enum: ["email", "google"],
      default: "email",
    },
    avatar: {
      type: String,
    },
    password: {
      type: String,
      required: false,
      minlength: 6,
    },
    firstName: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    dateOfBirth: {
      type: Date,
    },
    language: {
      type: String,
      default: "en",
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    phone: {
      type: String,
      trim: true,
    },
    refreshToken: {
      type: String,
      required: false,
    },
    profilePicture: {
      type: String,
    },
    locationCity: {
      type: String,
      trim: true,
    },
    locationState: {
      type: String,
      trim: true,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        required: false,
        validate: {
          validator: function (v: number[]) {
            return v.length === 2;
          },
          message: "Coordinates must be [longitude, latitude]",
        },
      },
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    xpPoints: {
      type: Number,
      default: 0,
      min: 0,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1, authProvider: 1 });
userSchema.index({ username: 1 });
userSchema.index({ location: "2dsphere" });
userSchema.index({ isActive: 1, lastActive: -1 });

userSchema.pre("save", function (next) {
  if (!this.isNew) {
    this.lastActive = new Date();
  }
  next();
});

export const User = model<IUser>("User", userSchema);



import {Document } from "mongoose";
export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  language?: string;
  gender?: "male" | "female" | "other";
  phone?: string;
  profilePicture?: string;
  locationCity?: string;
  googleId?: string;
    groupBookingStats: {
    totalInvitesSent: number;
    totalInvitesReceived: number;
    totalGroupBookings: number;
    totalGroupBookingsCancelled: number;
    reliabilityScore: number;
    averageRating: number;
    totalRatings: number;
  };

  authProvider: "email" | "google";
  avatar?: string;
  locationState?: string;
  location?: {
    type: "Point";
    coordinates: [number, number]; 
  };
  isVerified: boolean;
  xpPoints: number;
  updatedAt: Date;
  joinedAt: Date;
  lastActive: Date;
  isActive: boolean;
  refreshToken?: string;
}











import {Document } from "mongoose";

export interface IUserService {
  signup(userData: SignupData): Promise<ServiceResponse>;
  verifyOTP(email: string, otp: string): Promise<ServiceResponse>;
  resendOTP(email: string): Promise<ServiceResponse>;
  getUserProfile(id: string): Promise<ServiceResponse>;
  updateProfile(id: string, updateData: UpdateProfileData): Promise<ServiceResponse>;
  getNearbyUsers(userId: string, maxDistance?: number): Promise<ServiceResponse>;
  addXpPoints(userId: string, points: number): Promise<ServiceResponse>;
  changePassword(userId: string, oldPassword: string, newPassword: string): Promise<ServiceResponse>;
  sendEmailChangeOTP(id: string, email: string, password: string): Promise<ServiceResponse>;
  verifyEmailChangeOTP(id: string, email: string, otp: string): Promise<ServiceResponse>;
  getUserCounts(): Promise<ServiceResponse>;
  getUsers(filters: any): Promise<ServiceResponse>;
  toggleUserStatus(userId: string): Promise<ServiceResponse>;
  getUserDetails(userId: string): Promise<ServiceResponse>;

}


export interface SignupData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  phone?: string;
  language?: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  phone?: string;
  language?: string;
  profilePicture?: string;
  locationCity?: string;
  locationState?: string;
  coordinates?: [number, number];
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
}


export interface ServiceResponse {
  success: boolean;
  message: string;
  data?: any;
}
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
  authProvider: "email" | "google";
  avatar?: string;
  locationState?: string;
  location?: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  isVerified: boolean;
  xpPoints: number;
  updatedAt: Date;
  joinedAt: Date;
  lastActive: Date;
  isActive: boolean;
  refreshToken?: string;
}

export interface IUserRepository {
  create(userData: Partial<IUser>): Promise<IUser>;
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  findByUsername(username: string): Promise<IUser | null>;
  findByIdWithPassword(id: string): Promise<IUser | null>;
  verifyEmail(email: string): Promise<boolean>;
  updateProfile(id: string, updateData: Partial<IUser>): Promise<IUser | null>;
  updateLastActive(id: string): Promise<boolean>;
  updatePassword(id: string, hashedPassword: string): Promise<boolean>;
  deactivateUser(id: string): Promise<boolean>;
  toggleStatus(id: string): Promise<IUser | null>;
  addXpPoints(id: string, points: number): Promise<boolean>;
  findNearbyUsers(coordinates: [number, number], maxDistance: number): Promise<IUser[]>;
  findActiveUsers(limit: number): Promise<IUser[]>;
  findAll(page: number, limit: number): Promise<{ users: IUser[], total: number }>;
  findByStatus(status: string, page: number, limit: number): Promise<{ users: IUser[], total: number }>;
  findByVerification(isVerified: boolean, page: number, limit: number): Promise<{ users: IUser[], total: number }>;
  findByGoogleId(googleId: string): Promise<IUser | null>;
  findByGoogleIdOrEmail(googleId: string, email: string): Promise<IUser | null>;
  createGoogleUser(userData: Partial<IUser>): Promise<IUser>;
  linkGoogleAccount(userId: string, googleId: string, googleData: Partial<IUser>): Promise<IUser | null>;
  updateUserFromGoogle(userId: string, googleData: Partial<IUser>): Promise<IUser | null>;
}

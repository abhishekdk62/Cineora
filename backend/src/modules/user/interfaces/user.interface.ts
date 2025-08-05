import { IUser } from '../models/user.model';

export interface IUserRepository {
  create(userData: Partial<IUser>): Promise<IUser>;
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  findByUsername(username: string): Promise<IUser | null>;
  verifyEmail(email: string): Promise<boolean>;
  updateProfile(id: string, updateData: Partial<IUser>): Promise<IUser | null>;
  updateLastActive(id: string): Promise<boolean>;
  deactivateUser(id: string): Promise<boolean>;
  findNearbyUsers(coordinates: [number, number], maxDistance: number): Promise<IUser[]>;
  findActiveUsers(limit?: number): Promise<IUser[]>;
  addXpPoints(id: string, points: number): Promise<boolean>;
}

export interface IUserService {
  signup(userData: SignupData): Promise<ServiceResponse>;
  verifyOTP(email: string, otp: string): Promise<ServiceResponse>;
  resendOTP(email: string): Promise<ServiceResponse>;
  getUserProfile(id: string): Promise<ServiceResponse>;
  updateProfile(id: string, updateData: UpdateProfileData): Promise<ServiceResponse>;
  getNearbyUsers(userId: string, maxDistance: number): Promise<ServiceResponse>;
  addXpPoints(userId: string, points: number): Promise<ServiceResponse>;
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
}

export interface ServiceResponse {
  success: boolean;
  message: string;
  data?: any;
}

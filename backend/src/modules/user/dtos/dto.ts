// All DTOs for User module

export interface CreateUserDto {
  username: string;
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  language?: string;
  gender?: 'male' | 'female' | 'other';
  phone?: string;
  profilePicture?: string;
  locationCity?: string;
  locationState?: string;
  coordinates?: [number, number];
}

export interface UpdateUserProfileDto {
  username?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  language?: string;
  gender?: 'male' | 'female' | 'other';
  phone?: string;
  profilePicture?: string;
  locationCity?: string;
  locationState?: string;
  coordinates?: [number, number];
}

export interface UserResponseDto {
  id?: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isVerified: boolean;
  xpPoints: number;
  joinedAt: Date;
  lastActive: Date;
  isActive: boolean;
}


import { IUser } from '../interfaces/user.model.interface';

// All DTOs for User module

export interface SignupDto {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  language?: string;
  gender?: 'male' | 'female' | 'other';
  phone?: string;
  profilePicture?: string;
  locationCity?: string;
  locationState?: string;
  coordinates?: [number, number];
}

export interface SignupResponseDto {
  email: string;
  username: string;
}

export interface VerifyOTPResponseDto {
  user: IUser;
  xpBonus: number;
}

export interface UpdateProfileDto {
  username?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  language?: string;
  gender?: 'male' | 'female' | 'other';
  phone?: string;
  profilePicture?: string;
  locationCity?: string;
  locationState?: string;
  coordinates?: [number, number];
}

export interface UserResponseDto {
  _id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  language?: string;
  gender?: string;
  phone?: string;
  locationCity?: string;
  locationState?: string;
  location?: any;
  isVerified: boolean;
  xpPoints: number;
  joinedAt: Date;
  lastActive: Date;
  isActive: boolean;
  profilePicture?: string;
}

export interface UserResponseDtoWithUrl extends UserResponseDto {
  profilePictureUrl?: string;
}

export interface SendEmailChangeOTPResponseDto {
  email: string;
  expiresIn: number;
}

export interface VerifyEmailChangeOTPResponseDto {
  email: string;
  oldEmail?: string;
}

export interface UserCountsResponseDto {
  counts: {
    activeUsers: number;
    inactiveUsers: number;
    verifiedUsers: number;
    unverifiedUsers: number;
  };
}

export interface GetUsersResponseDto {
  users: any[];
  meta: {
    pagination: {
      currentPage: number;
      totalPages: number;
      total: number;
      limit: number;
    };
  };
}


// ... your existing DTOs ...

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

export interface GetUsersFilterDto {
  search?: string;
  status?: 'active' | 'inactive';
  isVerified?: boolean;
  sortBy?: 'username' | 'email' | 'joinedAt' | 'lastActive';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface ResendOTPDto {
  email: string;
}

export interface SendEmailChangeOTPDto {
  email: string;
  password: string;
}

export interface VerifyEmailChangeOTPDto {
  email: string;
  otp: string;
}

export interface VerifyEmailChangeOTPResponseDto {
  email: string;
  oldEmail?: string;
  message?: string;
}

export interface VerifyOTPDto {
  email: string;
  otp: string;
}

// Additional DTOs you might need
export interface AddXpPointsDto {
  userId: string;
  points: number;
  reason?: string;
}

export interface UserLocationDto {
  latitude: number;
  longitude: number;
}

export interface UserNotificationPreferencesDto {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
}

export interface UserSettingsDto {
  language: string;
  timezone: string;
  theme: 'light' | 'dark';
  notifications: UserNotificationPreferencesDto;
}

export interface UserSearchDto {
  query: string;
  filters?: {
    isActive?: boolean;
    isVerified?: boolean;
    location?: {
      latitude: number;
      longitude: number;
      radius: number;
    };
  };
  page?: number;
  limit?: number;
}

export interface BulkUserActionDto {
  userIds: string[];
  action: 'activate' | 'deactivate' | 'verify' | 'delete';
  reason?: string;
}

export interface UserExportDto {
  format: 'csv' | 'excel' | 'json';
  filters?: GetUsersFilterDto;
  fields?: string[];
}

export interface UserImportDto {
  file: Express.Multer.File;
  options?: {
    skipDuplicates: boolean;
    sendWelcomeEmail: boolean;
  };
}

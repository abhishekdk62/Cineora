export interface SignupDto {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  language?: string;
  gender?: "male" | "female" | "other";
  phone?: string;
  locationCity?: string;
  locationState?: string;
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
}

export interface VerifyOTPDto {
  email: string;
  otp: string;
}

export interface ResendOTPDto {
  email: string;
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  language?: string;
  gender?: "male" | "female" | "other";
  phone?: string;
  profilePicture?: string;
  locationCity?: string;
  locationState?: string;
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

export interface SendEmailChangeOTPDto {
  email: string;
  password: string;
}

export interface VerifyEmailChangeOTPDto {
  email: string;
  otp: string;
}

export interface GetUsersFilterDto {
  search?: string;
  status?: string;
  isVerified?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface GetNearbyUsersDto {
  maxDistance?: number;
}

export interface AddXpPointsDto {
  points: number;
}

// Output DTOs
export interface UserResponseDto {
  _id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  language?: string;
  gender?: "male" | "female" | "other";
  phone?: string;
  profilePicture?: string;
  locationCity?: string;
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
  authProvider: "email" | "google";
}

export interface SignupResponseDto {
  email: string;
  username: string;
}

export interface VerifyOTPResponseDto {
  user: UserResponseDto;
  xpBonus: number;
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
  users: UserResponseDto[];
  meta: {
    pagination: {
      currentPage: number;
      totalPages: number;
      total: number;
      limit: number;
    };
  };
}

export interface EmailChangeResponseDto {
  email: string;
  oldEmail?: string;
  expiresIn?: number;
}


export interface SendEmailChangeOTPResponseDto {
  email: string;
  expiresIn: number;
}

export interface VerifyEmailChangeOTPResponseDto {
  email: string;
  oldEmail: string;
}




export interface UserResponseDtoWithUrl {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date | string; 
  language: string;
  gender: string;
  phone: string;
  locationCity: string;
  locationState: string;
  location: string;
  isVerified: boolean;
  xpPoints: number;
  joinedAt: Date | string;
  lastActive: Date | string;
  isActive: boolean;
  profilePicture: string; 
}

import { ApiResponse, PaginationQuery } from './common.dto';

export interface CreateUserRequestDto {
  username: string;
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  authProvider: "email" | "google";
  googleId?: string;
}

export interface UpdateUserRequestDto {
  username?: string;
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

export interface UserFilters extends PaginationQuery {
  search?: string;
  isActive?: boolean;
  isVerified?: boolean;
  authProvider?: "email" | "google";
  gender?: "male" | "female" | "other";
  city?: string;
  state?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface AddXpPointsRequestDto {
  points: number;
}

export interface UpdateLocationRequestDto {
  latitude: number;
  longitude: number;
}

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
  googleId?: string;
  authProvider: "email" | "google";
  avatar?: string;
  isVerified: boolean;
  xpPoints: number;
  updatedAt: Date;
  joinedAt: Date;
  lastActive: Date;
  isActive: boolean;
}

export interface UserCountsResponseDto {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  emailUsers: number;
  googleUsers: number;
}

export interface NearbyUsersResponseDto {
  _id: string;
  username: string;
  profilePicture?: string;
  distance: number;
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
}

export interface CreateUserResponseDto extends ApiResponse<UserResponseDto> {}
export interface GetUserResponseDto extends ApiResponse<UserResponseDto> {}
export interface GetUsersResponseDto extends ApiResponse<UserResponseDto[]> {}
export interface UpdateUserResponseDto extends ApiResponse<UserResponseDto> {}
export interface DeleteUserResponseDto extends ApiResponse<null> {}
export interface GetUserCountsResponseDto extends ApiResponse<UserCountsResponseDto> {}
export interface GetUserDetailsResponseDto extends ApiResponse<UserResponseDto> {}
export interface ToggleUserStatusResponseDto extends ApiResponse<UserResponseDto> {}
export interface GetUserProfileResponseDto extends ApiResponse<UserResponseDto> {}
export interface UpdateProfileResponseDto extends ApiResponse<UserResponseDto> {}
export interface GetNearbyUsersResponseDto extends ApiResponse<NearbyUsersResponseDto[]> {}
export interface AddXpPointsResponseDto extends ApiResponse<{ message: string; newXpPoints: number }> {}
export interface UpdateLocationResponseDto extends ApiResponse<UserResponseDto> {}

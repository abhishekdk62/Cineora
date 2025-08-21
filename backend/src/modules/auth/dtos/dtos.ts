import { ServiceResponse } from "../../../interfaces/interface";

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    user: any;
    token: string;
    role: "user" | "admin" | "owner";
    redirectTo: string;
  };
}

export interface TokenPayload {
  id: string;
  email: string;
  role: "user" | "admin" | "owner";
  userId?: string;
  adminId?: string;
  ownerId?: string;
}


// Login DTOs
export interface LoginRequestDto {
  email: string;
  password: string;
}

// Password Reset DTOs
export interface SendPasswordResetOtpDto {
  email: string;
}

export interface VerifyPasswordResetOtpDto {
  email: string;
  otp: string;
}

export interface ResetPasswordWithOtpDto {
  email: string;
  otp: string;
  newPassword: string;
}

// Google Auth DTOs
export interface GoogleAuthDto {
  credential: string;
}

// Token DTOs
export interface RefreshTokenDto {
  refreshToken: string;
}

export interface LogoutDto {
  userId: string;
  userType: 'user' | 'admin' | 'owner';
}

export interface CheckAuthProviderDto {
  email: string;
}

// JWT Payload DTOs
export interface JwtPayloadDto {
  email: string;
  role: string;
  adminId?: string;
  ownerId?: string;
  userId?: string;
  tokenType?: string;
}
// Login Response DTOs
export interface UserDataDto {
  id: string;
  email: string;
  role: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatar?:string;
  ownerName?: string;
  phone?: string;
  isVerified?: boolean;
  isActive?: boolean;
  xpPoints?: number;
  lastActive?:string
}

export interface LoginSuccessDataDto {
  user: UserDataDto;
  accessToken: string;
  refreshToken: string;
  role: 'user' | 'admin' | 'owner';
  redirectTo: string;
}

export interface LoginResponseDto {
  success: boolean;
  message: string;
  data?: LoginSuccessDataDto;
}

// Password Reset Response DTOs
export interface SendPasswordResetOtpSuccessDataDto {
  email: string;
  userType: string;
  expiresIn: number;
}

export interface SendPasswordResetOtpResponseDto {
  success: boolean;
  message: string;
  data?: SendPasswordResetOtpSuccessDataDto;
}

export interface VerifyPasswordResetOtpSuccessDataDto {
  email: string;
  verified: boolean;
  userType: string;
}

export interface VerifyPasswordResetOtpResponseDto {
  success: boolean;
  message: string;
  data?: VerifyPasswordResetOtpSuccessDataDto;
}

export interface ResetPasswordWithOtpSuccessDataDto {
  userType: string;
}

export interface ResetPasswordWithOtpResponseDto {
  success: boolean;
  message: string;
  data?: ResetPasswordWithOtpSuccessDataDto;
}

// Google Auth Response DTOs
export interface GoogleAuthSuccessDataDto {
  accessToken: string;
  refreshToken: string;
  user: UserDataDto;
  isNewUser: boolean;
}

export interface GoogleAuthResponseDto {
  success: boolean;
  message: string;
  data?: GoogleAuthSuccessDataDto;
}

// Token Response DTOs
export interface RefreshTokenSuccessDataDto {
  accessToken: string;
  refreshToken: string;
  user?: UserDataDto;
}

export interface RefreshTokenResponseDto {
  success: boolean;
  message: string;
  data?: RefreshTokenSuccessDataDto;
}

// Auth Provider Response DTOs
export interface CheckAuthProviderSuccessDataDto {
  authProvider: string;
  hasGoogleLinked: boolean;
  hasPassword: boolean;
  canUseEmailLogin: boolean;
  canUseGoogleLogin: boolean;
}

export interface CheckAuthProviderResponseDto {
  success: boolean;
  message: string;
  data?: CheckAuthProviderSuccessDataDto;
}

// Generic Response DTOs
export interface AuthSuccessResponseDto {
  success: true;
  message: string;
}

export interface AuthErrorResponseDto {
  success: false;
  message: string;
}

// Google User Data DTO (internal)
export interface GoogleUserDataDto {
  googleId: string;
  email: string;
  name: string;
  avatar: string;
  emailVerified: boolean;
}

// User lookup response DTO
export interface UserLookupResponseDto {
  _id: string;
  email: string;
  role: string;
  name: string;
  ownerName: string | null;
}

// Token Pair Response DTO
export interface TokenPairDto {
  accessToken: string;
  refreshToken: string;
}

// Create Google User Input DTO
export interface CreateGoogleUserDto {
  username: string;
  email: string;
  googleId: string;
  firstName: string;
  avatar: string;
  authProvider: string;
  isVerified: boolean;
}

// Update Google User DTO
export interface UpdateGoogleUserDto {
  firstName: string;
  avatar: string;
  isVerified: boolean;
}

// Link Google Account DTO
export interface LinkGoogleAccountDto {
  firstName: string;
  avatar: string;
  isVerified: boolean;
}


export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface SendPasswordResetOtpRequestDto {
  email: string;
}

export interface VerifyPasswordResetOtpRequestDto {
  email: string;
  otp: string;
}

export interface ResetPasswordRequestDto {
  email: string;
  otp: string;
  newPassword: string;
}

export interface GoogleAuthRequestDto {
  credential: string;
}

export interface CheckAuthProviderParamsDto {
  email: string;
}

export interface CurrentUserResponseDto {
  id: string;
  email: string;
  role: string;
  name: string;
  ownerName: string | null;
}

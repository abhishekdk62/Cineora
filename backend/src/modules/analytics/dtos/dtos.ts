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


export interface LoginRequestDto {
  email: string;
  password: string;
}

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

export interface GoogleAuthDto {
  credential: string;
}

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

export interface JwtPayloadDto {
  email: string;
  role: string;
  adminId?: string;
  ownerId?: string;
  userId?: string;
  tokenType?: string;
}
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

export interface AuthSuccessResponseDto {
  success: true;
  message: string;
}

export interface AuthErrorResponseDto {
  success: false;
  message: string;
}

export interface GoogleUserDataDto {
  googleId: string;
  email: string;
  name: string;
  avatar: string;
  emailVerified: boolean;
}

export interface UserLookupResponseDto {
  _id: string;
  email: string;
  role: string;
  name: string;
  ownerName: string | null;
}

export interface TokenPairDto {
  accessToken: string;
  refreshToken: string;
}

export interface CreateGoogleUserDto {
  username: string;
  email: string;
  googleId: string;
  firstName: string;
  avatar: string;
  authProvider: string;
  isVerified: boolean;
}

export interface UpdateGoogleUserDto {
  firstName: string;
  avatar: string;
  isVerified: boolean;
}

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

import {
  AuthErrorResponseDto,
  AuthSuccessResponseDto,
  CheckAuthProviderResponseDto,
  GoogleAuthResponseDto,
  GoogleUserDataDto,
  LoginResponseDto,
  RefreshTokenResponseDto,
  ResetPasswordWithOtpResponseDto,
  SendPasswordResetOtpResponseDto,
  TokenPairDto,
  UserDataDto,
  UserLookupResponseDto,
  VerifyPasswordResetOtpResponseDto,
} from "../dtos/dtos";

export interface IAuthService {
  login(
    email: string,
    password: string
  ): Promise<LoginResponseDto>;

  generateTokenPair(
    user: UserDataDto,
    role: string
  ): TokenPairDto;

  getUserByIdAndRole(
    userId: string,
    role: string
  ): Promise<UserLookupResponseDto | null>;

  storeRefreshToken(
    userId: string,
    refreshToken: string,
    userType: "user" | "admin" | "owner"
  ): Promise<void>;

  sendPasswordResetOTP(
    email: string
  ): Promise<SendPasswordResetOtpResponseDto>;

  verifyPasswordResetOtp(
    email: string,
    otp: string
  ): Promise<VerifyPasswordResetOtpResponseDto>;

  resetPasswordWithOTP(
    email: string,
    otp: string,
    newPassword: string
  ): Promise<ResetPasswordWithOtpResponseDto>;

  googleAuth(
    credential: string
  ): Promise<GoogleAuthResponseDto>;

  refreshAccessToken(
    refreshToken: string
  ): Promise<RefreshTokenResponseDto>;

  logout(
    userId: string,
    userType: "user" | "admin" | "owner",
    refreshToken:string
  ): Promise<AuthSuccessResponseDto | AuthErrorResponseDto>;

  checkAuthProvider(
    email: string
  ): Promise<CheckAuthProviderResponseDto>;
}

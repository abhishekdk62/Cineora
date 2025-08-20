import { ServiceResponse } from "../../user/interfaces/user.interface";

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

export interface IAuthService {
  // Auth flows
  login(email: string, password: string): Promise<ServiceResponse>;
  googleAuth(credential: string): Promise<ServiceResponse>;
  logout(userId: string, userType: "user" | "admin" | "owner"): Promise<ServiceResponse>;

  // Tokens
  generateTokenPair(user: any, role: "user" | "owner" | "admin"): {
    accessToken: string;
    refreshToken: string;
  };

  refreshAccessToken(refreshToken: string): Promise<{
    success: boolean;
    message: string;
    data?: { accessToken: string; refreshToken: string; user?: any };
  }>;

  storeRefreshToken(
    userId: string,
    refreshToken: string,
    userType: "user" | "admin" | "owner"
  ): Promise<void>;

  // Password / OTP flows
  sendPasswordResetOTP(email: string): Promise<ServiceResponse>;
  verifyPasswordResetOtp(email: string, otp: string): Promise<ServiceResponse>;
  resetPasswordWithOTP(email: string, otp: string, newPassword: string): Promise<ServiceResponse>;

  // User lookup / helpers
  getUserByIdAndRole(userId: string, role: string): Promise<any | null>;
  checkAuthProvider(email: string): Promise<ServiceResponse>;


 

}

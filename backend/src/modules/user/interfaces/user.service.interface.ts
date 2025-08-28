import {
  SignupDto,
  SignupResponseDto,
  UpdateProfileDto,
  UserResponseDto,
  VerifyOTPResponseDto,
  SendEmailChangeOTPResponseDto,
  VerifyEmailChangeOTPResponseDto,
  UserCountsResponseDto,
  GetUsersFilterDto,
  GetUsersResponseDto,
} from "../dtos/dto";
import { ServiceResponse } from "../../../interfaces/interface";

export interface IUserService {
  signup(userData: SignupDto): Promise<ServiceResponse<SignupResponseDto>>;
  verifyOTP(
    email: string,
    otp: string
  ): Promise<ServiceResponse<VerifyOTPResponseDto>>;
  resendOTP(email: string): Promise<ServiceResponse<void>>;
  getUserProfile(id: string): Promise<ServiceResponse<UserResponseDto>>;
  updateProfile(
    id: string,
    updateData: UpdateProfileDto
  ): Promise<ServiceResponse<UserResponseDto>>;

  getNearbyUsers(
    userId: string,
    maxDistance?: number
  ): Promise<ServiceResponse<UserResponseDto[]>>;
  addXpPoints(userId: string, points: number): Promise<ServiceResponse<void>>;
  changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<ServiceResponse<void>>;

  sendEmailChangeOTP(
    id: string,
    email: string,
    password: string
  ): Promise<ServiceResponse<SendEmailChangeOTPResponseDto>>;
  verifyEmailChangeOTP(
    id: string,
    email: string,
    otp: string
  ): Promise<ServiceResponse<VerifyEmailChangeOTPResponseDto>>;

  getUserCounts(): Promise<ServiceResponse<UserCountsResponseDto>>;
  getUsers(
    filters: GetUsersFilterDto
  ): Promise<ServiceResponse<GetUsersResponseDto>>;

  toggleUserStatus(userId: string): Promise<ServiceResponse<UserResponseDto>>;
  getUserDetails(userId: string): Promise<ServiceResponse<UserResponseDto>>;
}

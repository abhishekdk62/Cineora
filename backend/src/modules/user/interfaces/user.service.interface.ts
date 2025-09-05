import { IUser } from './user.model.interface';
import { 
  SignupDto,
  UpdateProfileDto,
  SignupResponseDto,
  VerifyOTPResponseDto,
  SendEmailChangeOTPResponseDto,
  VerifyEmailChangeOTPResponseDto,
  UserCountsResponseDto,
  GetUsersResponseDto,
  UserResponseDto
} from '../dtos/dto';
import { ApiResponse } from '../../../utils/createResponse';

export interface IUserService {
  signup(userData: SignupDto): Promise<ApiResponse<SignupResponseDto>>;
  verifyOTP(email: string, otp: string): Promise<ApiResponse<VerifyOTPResponseDto>>;
  resendOTP(email: string): Promise<ApiResponse<void>>;
  getUserProfile(id: string): Promise<ApiResponse<any>>;
  updateUserProfile(id: string, updateData: UpdateProfileDto, file?: Express.Multer.File): Promise<ApiResponse<UserResponseDto>>;
  getNearbyUsers(userId: string, maxDistance: number): Promise<ApiResponse<UserResponseDto[]>>;
  addUserXpPoints(userId: string, points: number): Promise<ApiResponse<void>>;
  changeUserPassword(userId: string, oldPassword: string, newPassword: string): Promise<ApiResponse<void>>;
  sendEmailChangeOTP(id: string, email: string, password: string): Promise<ApiResponse<SendEmailChangeOTPResponseDto>>;
  verifyEmailChangeOTP(id: string, email: string, otp: string): Promise<ApiResponse<VerifyEmailChangeOTPResponseDto>>;
  getUserCounts(): Promise<ApiResponse<UserCountsResponseDto>>;
  getUsers(filters: any): Promise<ApiResponse<GetUsersResponseDto>>;
  toggleUserStatus(userId: string): Promise<ApiResponse<UserResponseDto>>;
  getUserDetails(userId: string): Promise<ApiResponse<UserResponseDto>>;
}

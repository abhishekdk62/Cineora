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
  UserResponseDto,
  GetUsersFilterDto
} from '../dtos/dto'; 
import { UserDto } from '../../../mappers/user.mapper';
import { ApiResponse } from '../../../utils/createResponse';

export interface IUserService {
  signup(userData: SignupDto): Promise<ApiResponse<SignupResponseDto>>;
  verifyOTP(email: string, otp: string): Promise<ApiResponse<VerifyOTPResponseDto>>;
  resendOTP(email: string): Promise<ApiResponse<void>>;
  getUserProfile(id: string): Promise<ApiResponse<any>>;
  updateUserProfile(id: string, updateData: Partial<UpdateProfileDto>, file?: Express.Multer.File): Promise<ApiResponse<UserDto>>;
  getNearbyUsers(userId: string, maxDistance: number): Promise<ApiResponse<UserDto[]>>;
  addUserXpPoints(userId: string, points: number): Promise<ApiResponse<void>>;
  changeUserPassword(userId: string, oldPassword: string, newPassword: string): Promise<ApiResponse<void>>;
  sendEmailChangeOTP(id: string, email: string, password: string): Promise<ApiResponse<SendEmailChangeOTPResponseDto>>;
  verifyEmailChangeOTP(id: string, email: string, otp: string): Promise<ApiResponse<VerifyEmailChangeOTPResponseDto>>;
  getUserCounts(): Promise<ApiResponse<UserCountsResponseDto>>;
  getUsers(filters: GetUsersFilterDto): Promise<ApiResponse<GetUsersResponseDto>>;
  toggleUserStatus(userId: string): Promise<ApiResponse<UserDto>>;
  getUserDetails(userId: string): Promise<ApiResponse<UserDto>>;
}

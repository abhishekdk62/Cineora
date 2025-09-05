import { ApiResponse } from './common.dto';

export interface AdminEntity {
  _id: string;
  email: string;
  password: string;
  refreshToken: string;
}

export interface AdminLoginRequestDto {
  email: string;
  password: string;
}

export interface AdminResponseDto {
  _id: string;
  email: string;
}

export interface AdminLoginResponseDto extends ApiResponse<{
  admin: AdminResponseDto;
  accessToken: string;
  refreshToken: string;
}> {}

export interface AdminRefreshTokenResponseDto extends ApiResponse<{
  accessToken: string;
}> {}

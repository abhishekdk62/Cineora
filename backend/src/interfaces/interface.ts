
export interface ServiceResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface RefreshTokenResponseDto {
  accessToken: string;
  refreshToken: string;
}

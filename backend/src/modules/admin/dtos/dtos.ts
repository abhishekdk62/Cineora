export interface UpdateRefreshTokenDto {
  userId: string;
  hashedRefreshToken: string;
}

export interface ClearRefreshTokenDto {
  userId: string;
}

export interface AdminResponseDto {
  _id: string;
  email: string;
  password: string;
  refreshToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

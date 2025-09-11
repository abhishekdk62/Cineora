import { IUser } from "../modules/user/interfaces/user.model.interface";

export interface UserDto {
  _id: string;
  username: string;
  email: string;
  googleId?: string;
  authProvider: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  language: string;
  gender?: string;
  phone?: string;
  refreshToken?: string;        
  profilePicture?: string;
  locationCity?: string;
  locationState?: string;
  location?: {
    type: string;
    coordinates?: number[];
  };
  isVerified: boolean;
  xpPoints: number;
  joinedAt: Date;
  lastActive: Date;
  updatedAt: Date;
  isActive: boolean;
}

export class UserMapper {
  static toDto(user: IUser): UserDto {
    return {
      _id: user._id?.toString() || '',
      username: user.username,
      email: user.email,
      googleId: user.googleId,
      authProvider: user.authProvider,
      avatar: user.avatar,
      firstName: user.firstName,
      lastName: user.lastName,
      dateOfBirth: user.dateOfBirth,
      language: user.language,
      gender: user.gender,
      phone: user.phone,
      refreshToken: user.refreshToken,   
      profilePicture: user.profilePicture,
      locationCity: user.locationCity,
      locationState: user.locationState,
      location: user.location,
      isVerified: user.isVerified,
      xpPoints: user.xpPoints,
      joinedAt: user.joinedAt,
      lastActive: user.lastActive,
      updatedAt: user.updatedAt,
      isActive: user.isActive,
    };
  }
}

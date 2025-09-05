import { IUser } from './user.model.interface';

export interface IReadUserRepository {
  findUserById(userId: string): Promise<IUser | null>;
  findUserByEmail(userEmail: string): Promise<IUser | null>;
  findUserByUsername(username: string): Promise<IUser | null>;
  findUserByIdWithPassword(userId: string): Promise<IUser | null>;
  findUserByGoogleId(googleId: string): Promise<IUser | null>;
  findUserByGoogleIdOrEmail(googleId: string, email: string): Promise<IUser | null>;
  findNearbyUsers(coordinates: [number, number], maxDistance: number): Promise<IUser[]>;
  findActiveUsers(limit: number): Promise<IUser[]>;
  findAllUsers(page: number, limit: number): Promise<{ users: IUser[], total: number }>;
  findUsersByStatus(status: string, page: number, limit: number): Promise<{ users: IUser[], total: number }>;
  findUsersByVerification(isVerified: boolean, page: number, limit: number): Promise<{ users: IUser[], total: number }>;
}

export interface IWriteUserRepository {
  createUser(userData: Partial<IUser>): Promise<IUser>;
  createGoogleUser(userData: Partial<IUser>): Promise<IUser>;
  updateUserProfile(userId: string, updateData: Partial<IUser>): Promise<IUser | null>;
  updateUserLastActive(userId: string): Promise<boolean>;
  updateUserPassword(userId: string, hashedPassword: string): Promise<boolean>;
  updateUserRefreshToken(userId: string, hashedRefreshToken: string): Promise<IUser | null>;
  clearUserRefreshToken(userId: string): Promise<IUser | null>;
  verifyUserEmail(userEmail: string): Promise<boolean>;
  deactivateUser(userId: string): Promise<boolean>;
  toggleUserStatus(userId: string): Promise<IUser | null>;
  addUserXpPoints(userId: string, points: number): Promise<boolean>;
  linkGoogleAccount(userId: string, googleId: string, googleData: Partial<IUser>): Promise<IUser | null>;
  updateUserFromGoogle(userId: string, googleData: Partial<IUser>): Promise<IUser | null>;
}

export interface IUserRepository 
  extends IReadUserRepository, IWriteUserRepository {}

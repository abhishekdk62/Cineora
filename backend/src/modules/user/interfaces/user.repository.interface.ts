import { IBaseReadRepository, IBaseRepository, IBaseWriteRepository } from '../../../repositories/baseRepository.interface';
import { IUser } from './user.model.interface';

export interface IReadUserRepository extends IBaseReadRepository<IUser> {
  findUserByUsername(username: string): Promise<IUser | null>;
  findUserByIdWithPassword(userId: string): Promise<IUser | null>;
  findUserByGoogleId(googleId: string): Promise<IUser | null>;
  findUserByGoogleIdOrEmail(googleId: string, email: string): Promise<IUser | null>;
  findNearbyUsers(coordinates: [number, number], maxDistance: number): Promise<IUser[]>;
  findActiveUsers(limit: number): Promise<IUser[]>;
  findUsersByVerification(isVerified: boolean, page: number, limit: number): Promise<{ users: IUser[], total: number }>;
}

export interface IWriteUserRepository extends IBaseWriteRepository<IUser> {
  createGoogleUser(userData: Partial<IUser>): Promise<IUser>;
  updateUserProfile(userId: string, updateData: Partial<IUser>): Promise<IUser | null>;
  updateUserLastActive(userId: string): Promise<boolean>;
  verifyUserEmail(userEmail: string): Promise<boolean>;
  deactivateUser(userId: string): Promise<boolean>;
  addUserXpPoints(userId: string, points: number): Promise<boolean>;
  linkGoogleAccount(userId: string, googleId: string, googleData: Partial<IUser>): Promise<IUser | null>;
  updateUserFromGoogle(userId: string, googleData: Partial<IUser>): Promise<IUser | null>;
}

export interface IUserRepository extends IReadUserRepository, IWriteUserRepository {}

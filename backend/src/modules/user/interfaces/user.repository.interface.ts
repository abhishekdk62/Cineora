import { IUser } from "./user.model.interface";

export interface IUserRepository {
  create(userData: Partial<IUser>): Promise<IUser>;
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  findByUsername(username: string): Promise<IUser | null>;
  findByIdWithPassword(id: string): Promise<IUser | null>;
  verifyEmail(email: string): Promise<boolean>;
  updateProfile(id: string, updateData: Partial<IUser>): Promise<IUser | null>;
  updateLastActive(id: string): Promise<boolean>;
  updatePassword(id: string, hashedPassword: string): Promise<boolean>;
  deactivateUser(id: string): Promise<boolean>;
  toggleStatus(id: string): Promise<IUser | null>;
  addXpPoints(id: string, points: number): Promise<boolean>;
  findNearbyUsers(coordinates: [number, number], maxDistance: number): Promise<IUser[]>;
  findActiveUsers(limit: number): Promise<IUser[]>;
  findAll(page: number, limit: number): Promise<{ users: IUser[], total: number }>;
  findByStatus(status: string, page: number, limit: number): Promise<{ users: IUser[], total: number }>;
  findByVerification(isVerified: boolean, page: number, limit: number): Promise<{ users: IUser[], total: number }>;
  findByGoogleId(googleId: string): Promise<IUser | null>;
  findByGoogleIdOrEmail(googleId: string, email: string): Promise<IUser | null>;
  createGoogleUser(userData: Partial<IUser>): Promise<IUser>;
  linkGoogleAccount(userId: string, googleId: string, googleData: Partial<IUser>): Promise<IUser | null>;
  updateUserFromGoogle(userId: string, googleData: Partial<IUser>): Promise<IUser | null>;
}

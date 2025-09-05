import { IOwner, IOwnerRequest } from "./owner.model.interface";


export interface IOwnerRequestReadRepository {
  findByEmail(email: string): Promise<IOwnerRequest | null>;
  findByPhone(phone: string): Promise<IOwnerRequest | null>;
  findByAadhaar(aadhaar: string): Promise<IOwnerRequest | null>;
  findByPan(pan: string): Promise<IOwnerRequest | null>;
  findById(id: string): Promise<IOwnerRequest | null>;
  findByStatus(status: string, page?: number, limit?: number): Promise<{ requests: IOwnerRequest[]; total: number }>;
  findAll(page?: number, limit?: number): Promise<{ requests: IOwnerRequest[]; total: number }>;
  searchRequests(searchTerm: string, page?: number, limit?: number): Promise<{ requests: IOwnerRequest[]; total: number }>;
  getRequestsByDateRange(startDate: Date, endDate: Date, page?: number, limit?: number): Promise<{ requests: IOwnerRequest[]; total: number }>;
  findExistingNonRejected(data: { phone: string; email: string; aadhaar: string; pan: string }): Promise<IOwnerRequest | null>;
}

export interface IOwnerRequestWriteRepository {
  create(data: Partial<IOwnerRequest>): Promise<IOwnerRequest>;
  update(id: string, updateData: Partial<IOwnerRequest>): Promise<IOwnerRequest | null>;
  updateStatus(id: string, status: string, reviewedBy?: string, rejectionReason?: string): Promise<IOwnerRequest | null>;
  delete(id: string): Promise<IOwnerRequest | null>;
}

export interface IOwnerRequestRepository extends IOwnerRequestReadRepository, IOwnerRequestWriteRepository {}


export interface IOwnerReadRepository {
  findByEmail(ownerEmail: string): Promise<IOwner | null>;
  findByKycRequestId(kycRequestId: string): Promise<IOwner | null>;
  findById(ownerId: string): Promise<IOwner | null>;
  findAll(page?: number, limit?: number): Promise<{ owners: IOwner[]; total: number }>;
  findByStatus(status: string, page?: number, limit?: number): Promise<{ owners: IOwner[]; total: number }>;
  findByPhone(phoneNumber: string): Promise<IOwner | null>;
  findByPan(panNumber: string): Promise<IOwner | null>;
  findByAadhaar(aadhaarNumber: string): Promise<IOwner | null>;
  searchOwners(searchTerm: string, page?: number, limit?: number): Promise<{ owners: IOwner[]; total: number }>;
  getOwnerStats(ownerId: string): Promise<IOwner | null>;
}

export interface IOwnerWriteRepository {
  create(data: Partial<IOwner>): Promise<IOwner>;
  update(ownerId: string, updateData: Partial<IOwner>): Promise<IOwner | null>;
  updateRefreshToken(ownerId: string, hashedRefreshToken: string): Promise<IOwner | null>;
  clearRefreshToken(ownerId: string): Promise<IOwner | null>;
  updateLastLogin(ownerId: string): Promise<IOwner | null>;
  updatePassword(ownerId: string, hashedPassword: string): Promise<boolean>;
  updateProfile(ownerId: string, profileData: Partial<IOwner>): Promise<IOwner | null>;
  toggleStatus(ownerId: string): Promise<IOwner | null>;
  delete(ownerId: string): Promise<IOwner | null>;
  addTheatre(ownerId: string, theatreId: string): Promise<IOwner | null>;
  removeTheatre(ownerId: string, theatreId: string): Promise<IOwner | null>;
  bulkUpdateStatus(ownerIds: string[], isActive: boolean): Promise<{ modifiedCount: number }>;
}

export interface IOwnerRepository extends IOwnerReadRepository, IOwnerWriteRepository {}




import { IOwner, IOwnerRequest } from "./owner.model.interface";

export interface IOwnerRequestRepository {
  findByEmail(email: string): Promise<IOwnerRequest|null>;
  findByPhone(phone: string): Promise<IOwnerRequest|null>;
  findByAadhaar(aadhaar: string): Promise<IOwnerRequest|null>;
  findByPan(pan: string): Promise<IOwnerRequest|null>;
  findExistingNonRejected(data: { 
    phone: string; 
    email: string; 
    aadhaar: string; 
    pan: string 
  }): Promise<IOwnerRequest|null>;
  findById(id: string): Promise<IOwnerRequest|null>;
  findByStatus(status: string, page: number, limit: number): Promise<{ requests: IOwnerRequest[], total: number }>;
  findAll(page?: number, limit?: number): Promise<{ requests: IOwnerRequest[], total: number }>;
  create(data: Partial<IOwnerRequest>): Promise<IOwnerRequest>;
  updateStatus(id: string, status: string, reviewedBy?: string, rejectionReason?: string): Promise<IOwnerRequest|null>;
  update(id: string, updateData: Partial<IOwnerRequest>): Promise<IOwnerRequest|null>;
  delete(id: string): Promise<IOwnerRequest|null>;
}

export interface IOwnerRepository {
  findByEmail(email: string): Promise<IOwner | null>;
  findByKycRequestId(requestId: string): Promise<IOwner | null>;
  findById(id: string): Promise<IOwner | null>;
  findAll(
    page?: number,
    limit?: number
  ): Promise<{ owners: IOwner[]; total: number }>;
  findByStatus(
    status: string,
    page?: number,
    limit?: number
  ): Promise<{ owners: IOwner[]; total: number }>;
  create(data: Partial<IOwner>): Promise<IOwner | null>;
  toggleStatus(id: string): Promise<IOwner | null>;
  updateLastLogin(id: string): Promise<IOwner | null>;
  updatePassword(id: string, hashedPassword: string): Promise<boolean>;
  update(id: string, updateData: Partial<IOwner>): Promise<IOwner | null>;
  delete(id: string): Promise<IOwner | null>;

  findByPhone(phone: string): Promise<IOwner | null>;
  findByPan(pan: string): Promise<IOwner | null>;
  findByAadhaar(aadhaar: string): Promise<IOwner | null>;
  updateProfile(
    id: string,
    profileData: Partial<IOwner>
  ): Promise<IOwner | null>;
  addTheatre(ownerId: string, theatreId: string): Promise<IOwner | null>;
  removeTheatre(ownerId: string, theatreId: string): Promise<IOwner | null>;
  searchOwners(
    searchTerm: string,
    page?: number,
    limit?: number
  ): Promise<{ owners: IOwner[]; total: number }>;
  getOwnerStats(ownerId: string): Promise<IOwner | null>;
  bulkUpdateStatus(
    ownerIds: string[],
    isActive: boolean
  ): Promise<{ modifiedCount: number }>;
  updateRefreshToken(
    userId: string,
    hashedRefreshToken: string
  ): Promise<IOwner | null>;
  clearRefreshToken(userId: string): Promise<IOwner | null>;
}


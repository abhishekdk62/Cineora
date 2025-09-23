import { IBaseReadRepository, IBaseRepository, IBaseWriteRepository } from "../../../repositories/baseRepository.interface";
import { IOwner, IOwnerRequest } from "./owner.model.interface";

export interface IOwnerRequestReadRepository extends IBaseRepository<IOwnerRequest> {
  findByAadhaar(aadhaar: string): Promise<IOwnerRequest | null>;
  findByPan(pan: string): Promise<IOwnerRequest | null>;
  searchRequests(searchTerm: string, page?: number, limit?: number): Promise<{ requests: IOwnerRequest[]; total: number }>;
  getRequestsByDateRange(startDate: Date, endDate: Date, page?: number, limit?: number): Promise<{ requests: IOwnerRequest[]; total: number }>;
  findExistingNonRejected(data: { phone: string; email: string; aadhaar: string; pan: string }): Promise<IOwnerRequest | null>;
}

export interface IOwnerRequestWriteRepository extends IBaseRepository<IOwnerRequest> {
  updateStatus(id: string, status: string, reviewedBy?: string, rejectionReason?: string): Promise<IOwnerRequest | null>;
}

export interface IOwnerRequestRepository extends IOwnerRequestReadRepository, IOwnerRequestWriteRepository {}

export interface IOwnerReadRepository extends IBaseReadRepository<IOwner> {
  findByKycRequestId(kycRequestId: string): Promise<IOwner | null>;
  findByPan(panNumber: string): Promise<IOwner | null>;
  findByAadhaar(aadhaarNumber: string): Promise<IOwner | null>;
  searchOwners(searchTerm: string, page?: number, limit?: number): Promise<{ owners: IOwner[]; total: number }>;
  getOwnerStats(ownerId: string): Promise<IOwner | null>;
}

export interface IOwnerWriteRepository extends IBaseWriteRepository<IOwner> {
  updateLastLogin(ownerId: string): Promise<IOwner | null>;
  updateProfile(ownerId: string, profileData: Partial<IOwner>): Promise<IOwner | null>;
  addTheatre(ownerId: string, theatreId: string): Promise<IOwner | null>;
  removeTheatre(ownerId: string, theatreId: string): Promise<IOwner | null>;
  bulkUpdateStatus(ownerIds: string[], isActive: boolean): Promise<{ modifiedCount: number }>;
}

export interface IOwnerRepository extends IOwnerReadRepository, IOwnerWriteRepository {}

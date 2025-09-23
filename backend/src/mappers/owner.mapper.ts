import { TheaterInfoDto } from "../modules/chatroom/dtos/dto";
import { IOwner } from "../modules/owner/interfaces/owner.model.interface";

export interface OwnerDto {
  id: string;
  ownerName: string;
  phone: string;
  email: string;
  aadhaar: string;
  refreshToken?: string;
  pan: string;
  accountHolder?: string;
  bankName?: string;
  accountNumber?: string;
  ifsc?: string;
  aadhaarUrl: string;
  panUrl: string;
  ownerPhotoUrl?: string | null;
  kycRequestId: string;
  approvedAt: Date;
  approvedBy: string;
  isActive: boolean;
  isVerified: boolean;
  theatres?: string[];
  lastLogin?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class OwnerMapper {
  static toDto(owner: IOwner): OwnerDto {
    const data = (owner as string)._doc || owner;
    
    return {
      id: data._id?.toString() || '',
      ownerName: data.ownerName || '',
      phone: data.phone || '',
      email: data.email || '',
      aadhaar: data.aadhaar || '',
      refreshToken: data.refreshToken,
      pan: data.pan || '',
      accountHolder: data.accountHolder,
      bankName: data.bankName,
      accountNumber: data.accountNumber,
      ifsc: data.ifsc,
      aadhaarUrl: data.aadhaarUrl || '',
      panUrl: data.panUrl || '',
      ownerPhotoUrl: data.ownerPhotoUrl || null,
      kycRequestId: data.kycRequestId?.toString() || '',
      approvedAt: data.approvedAt,
      approvedBy: data.approvedBy || '',
      isActive: data.isActive || false,
      isVerified: data.isVerified || false,
      theatres: data.theatres?.map((t: TheaterInfoDto) => t?.toString()).filter(Boolean) || [],
      lastLogin: data.lastLogin || null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}

export interface StaffMember {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  ownerId?: {
    ownerName?: string;
    email?: string;
    phone?: string;
    bankName?: string;
    accountHolder?: string;
    isVerified?: boolean;
    lastLogin?: string;
    createdAt?: string;
  };
  theaterId?: {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    phone?: string;
    screens?: number;
    facilities?: string[];
    isVerified?: boolean;
    createdAt?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface StaffPagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface StaffResponse {
  staffs: StaffMember[];
  pagination: StaffPagination;
}

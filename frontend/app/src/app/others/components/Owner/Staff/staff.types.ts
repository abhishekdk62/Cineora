export interface StaffTheaterRef {
  _id: string;
  name: string;
  city?: string;
  state?: string;
  address?: string;
  pincode?: string;
  phone?: string;
  screens?: number;
  facilities?: string[];
  isVerified?: boolean;
}

export interface StaffMember {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  theaterId?: StaffTheaterRef;
  createdAt?: string;
  updatedAt?: string;
}

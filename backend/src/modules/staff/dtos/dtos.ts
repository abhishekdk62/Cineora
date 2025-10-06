export class CreateStaffDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  theaterId?: string;
}

export class StaffResponseDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  ownerId?: string;
  theaterId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class StaffDetailsDTO extends StaffResponseDTO {
  owner?: any;
  theater?: any;
}

export class GetAllStaffsQueryDTO {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

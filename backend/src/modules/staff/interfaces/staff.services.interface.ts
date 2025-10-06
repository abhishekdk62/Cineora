import {
  CreateStaffDTO,
  StaffResponseDTO,
  StaffDetailsDTO,
  GetAllStaffsQueryDTO,
} from "../dtos/dtos";

export interface IStaffService {
  createStaff(
    ownerId: string,
    createStaffData: CreateStaffDTO
  ): Promise<StaffResponseDTO>;

  getStaffDetails(staffId: string): Promise<StaffDetailsDTO>;

  getAllStaffsPaginated(
    queryParams: GetAllStaffsQueryDTO,
    ownerId?: string
  ): Promise<{
    staffs: StaffResponseDTO[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      hasNext: boolean;
      hasPrevious: boolean;
    };
  }>;

  toggleStaffStatus(
    staffId: string,
  ): Promise<StaffResponseDTO>;
}

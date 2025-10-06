import bcrypt from "bcrypt";
import { IUserRepository } from "../../user/interfaces/user.repository.interface";
import {
  IOwnerRepository,
  IOwnerRequestRepository,
} from "../../owner/interfaces/owner.repository.interface";
import {
  CreateStaffDTO,
  StaffResponseDTO,
  StaffDetailsDTO,
  GetAllStaffsQueryDTO,
} from "../dtos/dtos";
import { STAFF_MESSAGES } from "../../../utils/messages.constants";
import { IStaffService } from "../interfaces/staff.services.interface";
import { IStaffRepository } from "../interfaces/staff.repository.interface";

export class StaffService implements IStaffService {
  constructor(
    private readonly staffRepo: IStaffRepository,
    private readonly userRepo: IUserRepository,
    private readonly ownerRepo: IOwnerRepository,
    private readonly ownerReqRepo: IOwnerRequestRepository
  ) {}

  async createStaff(
    ownerId: string,
    createStaffData: CreateStaffDTO
  ): Promise<StaffResponseDTO> {
    const { firstName, lastName, email, password, theaterId } = createStaffData;

    // Check if email exists across all systems
    const [userExists, ownerExists, ownerReqExists, staffExists] =
      await Promise.all([
        this.userRepo.findByEmail(email),
        this.ownerRepo.findByEmail(email),
        this.ownerReqRepo.findByEmail(email),
        this.staffRepo.findByEmail(email),
      ]);

    if (userExists || ownerExists || ownerReqExists || staffExists) {
      return 'Exists';
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStaff = await this.staffRepo.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      ownerId: ownerId as any,
      theaterId: theaterId as any,
      role: "staff",
      isActive: true,
    });

    return this.mapToStaffResponseDTO(newStaff);
  }

  async getStaffDetails(staffId: string): Promise<StaffDetailsDTO> {
    const staff = await this.staffRepo.findById(staffId);
    if (!staff) {
      throw new Error("Staff not found");
    }

    return this.mapToStaffDetailsDTO(staff);
  }

  async getAllStaffsPaginated(
      queryParams: GetAllStaffsQueryDTO,
    ownerId?: string,
  ): Promise<{
    staffs: StaffResponseDTO[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      hasNext: boolean;
      hasPrevious: boolean;
    };
  }> {
    const page = queryParams.page || 1;
    const limit = queryParams.limit || 10;

    let filters: any = {  };
  if (ownerId) {
    filters.ownerId = ownerId; 
  }


    if (queryParams.isActive !== undefined) {
      filters.isActive = queryParams.isActive;
    }
    if (queryParams.search) {
      filters.$or = [
        { firstName: { $regex: queryParams.search, $options: "i" } },
        { lastName: { $regex: queryParams.search, $options: "i" } },
        { email: { $regex: queryParams.search, $options: "i" } },
      ];
    }

    const result = await this.staffRepo.findAllPaginated(page, limit, filters);

    return {
      staffs: result.staffs,
      pagination: {
        currentPage: page,
        totalPages: result.totalPages,
        totalCount: result.totalCount,
        hasNext: page < result.totalPages,
        hasPrevious: page > 1,
      },
    };
  }


  async toggleStaffStatus(
    staffId: string,
  ): Promise<StaffResponseDTO> {
    const staff = await this.staffRepo.findById(staffId);
    if (!staff) {
      throw new Error("Staff not found");
    }
    const updatedStaff = await this.staffRepo.updateById(staffId, {
      isActive: !staff.isActive,
    });

    return this.mapToStaffResponseDTO(updatedStaff!);
  }

  private mapToStaffResponseDTO(staff: any): StaffResponseDTO {
    return {
      id: staff._id.toString(),
      firstName: staff.firstName,
      lastName: staff.lastName,
      email: staff.email,
      role: staff.role,
      isActive: staff.isActive,
      ownerId: staff.ownerId?.toString(),
      theaterId: staff.theaterId?.toString(),
      createdAt: staff.createdAt,
      updatedAt: staff.updatedAt,
    };
  }

  private mapToStaffDetailsDTO(staff: any): StaffDetailsDTO {
    return {
      ...this.mapToStaffResponseDTO(staff),
      owner: staff.ownerId,
      theater: staff.theaterId,
    };
  }
}

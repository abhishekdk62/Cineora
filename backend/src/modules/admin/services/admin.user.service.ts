import { ServiceResponse } from "../interfaces/admin.owner.interface";
import { AdminUserRepository } from "../repositories/admin.user.repository";

interface UserFilters {
  search?: string;
  status?: 'active' | 'inactive';
  isVerified?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export class AdminUserService {
  private userRepo = new AdminUserRepository();

  async getUserCounts(): Promise<ServiceResponse> {
    try {
      const [activeUsers, inactiveUsers, verifiedUsers, unverifiedUsers] = await Promise.all([
        this.userRepo.findByStatus('active', 1, 1).then(result => result.total),
        this.userRepo.findByStatus('inactive', 1, 1).then(result => result.total),
        this.userRepo.findByVerification(true, 1, 1).then(result => result.total),
        this.userRepo.findByVerification(false, 1, 1).then(result => result.total),
      ]);

      return {
        success: true,
        message: "User counts fetched successfully",
        data: {
          counts: {
            activeUsers,
            inactiveUsers,
            verifiedUsers,
            unverifiedUsers
          }
        }
      };
    } catch (error) {
      console.error("Get user counts error:", error);
      return {
        success: false,
        message: "Something went wrong",
      };
    }
  }

  async getUsers(filters: UserFilters): Promise<ServiceResponse> {
    try {
      const { search, status, isVerified, sortBy, sortOrder, page = 1, limit = 10 } = filters;
      
      let result;
      if (status) {
        result = await this.userRepo.findByStatus(status, Number(page), Number(limit));
      } else {
        result = await this.userRepo.findAll(Number(page), Number(limit));
      }

      // Apply search filter if provided
      if (search) {
        result.users = result.users.filter((user: any) =>
          user.username.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase()) ||
          (user.firstName && user.firstName.toLowerCase().includes(search.toLowerCase())) ||
          (user.lastName && user.lastName.toLowerCase().includes(search.toLowerCase()))
        );
      }

      // Apply verification filter
      if (isVerified !== undefined) {
        result.users = result.users.filter((user: any) => user.isVerified === isVerified);
      }

      // Apply sorting if provided
      if (sortBy) {
        result.users.sort((a: any, b: any) => {
          let aValue = a[sortBy];
          let bValue = b[sortBy];
          
          if (sortBy.includes('Date') || sortBy.includes('At') || sortBy === 'joinedAt') {
            aValue = new Date(aValue);
            bValue = new Date(bValue);
          }
          
          if (sortOrder === 'desc') {
            return bValue > aValue ? 1 : -1;
          }
          return aValue > bValue ? 1 : -1;
        });
      }

      return {
        success: true,
        message: "Users fetched successfully",
        data: {
          users: result.users,
          meta: {
            pagination: {
              currentPage: Number(page),
              totalPages: Math.ceil(result.total / Number(limit)),
              total: result.total,
              limit: Number(limit),
            },
          },
        },
      };
    } catch (error) {
      console.error("Get users error:", error);
      return {
        success: false,
        message: "Something went wrong",
      };
    }
  }

  async toggleUserStatus(userId: string): Promise<ServiceResponse> {
    try {
      if (!userId) {
        return {
          success: false,
          message: "User ID is required",
        };
      }

      const updatedUser = await this.userRepo.toggleStatus(userId);

      if (!updatedUser) {
        return {
          success: false,
          message: "User not found",
        };
      }

      return {
        success: true,
        message: `User ${updatedUser.isActive ? 'activated' : 'deactivated'} successfully`,
        data: updatedUser,
      };
    } catch (error) {
      console.error("Toggle user status error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Something went wrong",
      };
    }
  }

  async getUserDetails(userId: string): Promise<ServiceResponse> {
    try {
      if (!userId) {
        return {
          success: false,
          message: "User ID is required",
        };
      }

      const user = await this.userRepo.findById(userId);

      if (!user) {
        return {
          success: false,
          message: "User not found",
        };
      }

      return {
        success: true,
        message: "User details fetched successfully",
        data: user,
      };
    } catch (error) {
      console.error("Get user details error:", error);
      return {
        success: false,
        message: "Something went wrong",
      };
    }
  }
}

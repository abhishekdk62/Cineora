import { AdminOwnerRepository } from "../repositories/admin.owner.repository";
import { AdminOwnerRequestRepository } from "../repositories/admin.owner.request.repository";
import { ServiceResponse } from "../interfaces/admin.owner.interface";
import { OwnerService } from "../../owner/services/owner.service";

interface OwnerFilters {
  search?: string;
  status?: 'active' | 'inactive';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

interface OwnerRequestFilters {
  search?: string;
  status?: 'pending' | 'under_review' | 'approved' | 'rejected';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export class AdminOwnerService {
  private ownerRepo = new AdminOwnerRepository();
  private ownerRequestRepo = new AdminOwnerRequestRepository();
  private ownerService = new OwnerService();

  async getOwnerCounts(): Promise<ServiceResponse> {
    try {
      const [activeOwners, inactiveOwners, pendingRequests, approvedRequests, rejectedRequests] = await Promise.all([
        this.ownerRepo.findByStatus('active', 1, 1).then(result => result.total),
        this.ownerRepo.findByStatus('inactive', 1, 1).then(result => result.total),
        this.ownerRequestRepo.findByStatus('pending', 1, 1).then(result => result.total),
        this.ownerRequestRepo.findByStatus('approved', 1, 1).then(result => result.total),
        this.ownerRequestRepo.findByStatus('rejected', 1, 1).then(result => result.total),
      ]);

      return {
        success: true,
        message: "Owner counts fetched successfully",
        data: {
          counts: {
            activeOwners,
            inactiveOwners,
            pendingRequests,
            approvedRequests,
            rejectedRequests
          }
        }
      };
    } catch (error) {
      console.error("Get owner counts error:", error);
      return {
        success: false,
        message: "Something went wrong",
      };
    }
  }

  async getOwners(filters: OwnerFilters): Promise<ServiceResponse> {
    try {
      const { search, status, sortBy, sortOrder, page = 1, limit = 10 } = filters;
      
      let result;
      if (status) {
        result = await this.ownerRepo.findByStatus(status, Number(page), Number(limit));
      } else {
        result = await this.ownerRepo.findAll(Number(page), Number(limit));
      }

      // Apply search filter if provided
      if (search) {
        result.owners = result.owners.filter((owner: any) =>
          owner.ownerName.toLowerCase().includes(search.toLowerCase()) ||
          owner.email.toLowerCase().includes(search.toLowerCase()) ||
          owner.phone.includes(search)
        );
      }

      // Apply sorting if provided
      if (sortBy) {
        result.owners.sort((a: any, b: any) => {
          let aValue = a[sortBy];
          let bValue = b[sortBy];
          
          if (sortBy.includes('Date') || sortBy.includes('At')) {
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
        message: "Owners fetched successfully",
        data: {
          owners: result.owners,
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
      console.error("Get owners error:", error);
      return {
        success: false,
        message: "Something went wrong",
      };
    }
  }

  async getOwnerRequests(filters: OwnerRequestFilters): Promise<ServiceResponse> {
    try {
      const { search, status, sortBy, sortOrder, page = 1, limit = 10 } = filters;
      
      let result;
      if (status) {
        result = await this.ownerRequestRepo.findByStatus(status, Number(page), Number(limit));
      } else {
        result = await this.ownerRequestRepo.findAll(Number(page), Number(limit));
      }

      // Apply search filter if provided
      if (search) {
        result.requests = result.requests.filter((request: any) =>
          request.ownerName.toLowerCase().includes(search.toLowerCase()) ||
          request.email.toLowerCase().includes(search.toLowerCase()) ||
          request.phone.includes(search)
        );
      }

      // Apply sorting if provided
      if (sortBy) {
        result.requests.sort((a: any, b: any) => {
          let aValue = a[sortBy];
          let bValue = b[sortBy];
          
          if (sortBy.includes('Date') || sortBy.includes('At')) {
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
        message: "Owner requests fetched successfully",
        data: {
          requests: result.requests,
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
      console.error("Get owner requests error:", error);
      return {
        success: false,
        message: "Something went wrong",
      };
    }
  }

  async toggleOwnerStatus(ownerId: string): Promise<ServiceResponse> {
    try {
      // ✅ Add validation
      if (!ownerId) {
        return {
          success: false,
          message: "Owner ID is required",
        };
      }

      const updatedOwner = await this.ownerRepo.toggleStatus(ownerId);

      if (!updatedOwner) {
        return {
          success: false,
          message: "Owner not found",
        };
      }

      return {
        success: true,
        message: `Owner ${updatedOwner.isActive ? 'activated' : 'blocked'} successfully`,
        data: updatedOwner,
      };
    } catch (error) {
      console.error("Toggle owner status error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Something went wrong",
      };
    }
  }

  async acceptOwnerRequest(requestId: string, adminId?: string): Promise<ServiceResponse> {
    try {
      // ✅ Add validation
      if (!requestId) {
        return {
          success: false,
          message: "Request ID is required",
        };
      }

      return await this.ownerService.updateRequestStatus(requestId, 'approved', adminId);
    } catch (error) {
      console.error("Accept owner request error:", error);
      return {
        success: false,
        message: "Something went wrong while accepting the request",
      };
    }
  }

  async rejectOwnerRequest(requestId: string, rejectionReason?: string, adminId?: string): Promise<ServiceResponse> {
    try {
      // ✅ Add validation
      if (!requestId) {
        return {
          success: false,
          message: "Request ID is required",
        };
      }

      if (!rejectionReason) {
        return {
          success: false,
          message: "Rejection reason is required",
        };
      }

      return await this.ownerService.updateRequestStatus(requestId, 'rejected', adminId, rejectionReason);
    } catch (error) {
      console.error("Reject owner request error:", error);
      return {
        success: false,
        message: "Something went wrong while rejecting the request",
      };
    }
  }
}

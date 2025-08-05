import { OwnerRepository } from "../repositories/owner.repository";
import { OwnerRequestRepository } from "../repositories/ownerRequest.repository";
import { ServiceResponse } from "../interfaces/owner.interface";
import { OwnerService } from "./owner.service";

export class AdminOwnerService {
  private ownerRepo = new OwnerRepository();
  private ownerRequestRepo = new OwnerRequestRepository();
  private ownerService = new OwnerService();

  async getOwnerCounts(): Promise<ServiceResponse> {
    try {
      const [activeOwners, inactiveOwners, pendingRequests, approvedRequests, rejectedRequests] = await Promise.all([
        this.ownerRepo.findByStatus('active', 1, 1).then(result => result.total),
        this.ownerRepo.findByStatus('blocked', 1, 1).then(result => result.total),
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

  async getOwners(filters: any): Promise<ServiceResponse> {
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

  async getOwnerRequests(filters: any): Promise<ServiceResponse> {
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
      const updatedOwner = await this.ownerRepo.toggleStatus(ownerId);

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
    return await this.ownerService.updateRequestStatus(requestId, 'approved', adminId);
  }

  async rejectOwnerRequest(requestId: string, rejectionReason?: string, adminId?: string): Promise<ServiceResponse> {
    return await this.ownerService.updateRequestStatus(requestId, 'rejected', adminId, rejectionReason);
  }
}

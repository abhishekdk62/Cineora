
import { IOwnerRepository, IOwnerRequestRepository, ServiceResponse } from "../interfaces/owner.interface";

export class OwnerService {
  constructor(
    private ownerRepo: IOwnerRepository,
    private ownerRequestRepo: IOwnerRequestRepository
  ) {}

  async getOwnerProfile(requestId: string): Promise<ServiceResponse> {
    try {
      const owner = await this.ownerRepo.findByKycRequestId(requestId);

      if (!owner) {
        return {
          success: false,
          message: "Owner account not found",
        };
      }

      return {
        success: true,
        message: "Owner account fetched successfully",
        data: owner,
      };
    } catch (error) {
      console.error("Get owner account error:", error);
      return {
        success: false,
        message: "Something went wrong",
      };
    }
  }

  async getOwnerById(ownerId: string): Promise<ServiceResponse> {
    try {
      const owner = await this.ownerRepo.findById(ownerId);

      if (!owner) {
        return {
          success: false,
          message: "Owner not found",
        };
      }

      return {
        success: true,
        message: "Owner fetched successfully",
        data: owner,
      };
    } catch (error) {
      console.error("Get owner by ID error:", error);
      return {
        success: false,
        message: "Something went wrong",
      };
    }
  }

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
        message: "Something went wrong" 
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

      if (search) {
        result.owners = result.owners.filter((owner: any) =>
          owner.ownerName.toLowerCase().includes(search.toLowerCase()) ||
          owner.email.toLowerCase().includes(search.toLowerCase()) ||
          owner.phone.includes(search)
        );
      }

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
        message: "Something went wrong" 
      };
    }
  }

  async toggleOwnerStatus(ownerId: string): Promise<ServiceResponse> {
    try {
      if (!ownerId) {
        return { 
          success: false, 
          message: "Owner ID is required" 
        };
      }

      const updatedOwner = await this.ownerRepo.toggleStatus(ownerId);

      if (!updatedOwner) {
        return { 
          success: false, 
          message: "Owner not found" 
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
        message: "Something went wrong" 
      };
    }
  }

  async updateOwner(ownerId: string, updateData: any): Promise<ServiceResponse> {
    try {
      const updatedOwner = await this.ownerRepo.update(ownerId, updateData);

      if (!updatedOwner) {
        return {
          success: false,
          message: "Owner not found",
        };
      }

      return {
        success: true,
        message: "Owner updated successfully",
        data: updatedOwner,
      };
    } catch (error) {
      console.error("Update owner error:", error);
      return {
        success: false,
        message: "Something went wrong",
      };
    }
  }

  async deleteOwner(ownerId: string): Promise<ServiceResponse> {
    try {
      const deletedOwner = await this.ownerRepo.delete(ownerId);

      if (!deletedOwner) {
        return {
          success: false,
          message: "Owner not found",
        };
      }

      return {
        success: true,
        message: "Owner deleted successfully",
      };
    } catch (error) {
      console.error("Delete owner error:", error);
      return {
        success: false,
        message: "Something went wrong",
      };
    }
  }
}

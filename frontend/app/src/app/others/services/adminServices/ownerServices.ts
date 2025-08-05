// services/adminServices/ownerService.ts
import apiClient from "../../Utils/apiClient";

export interface OwnerFilters {
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
  status?: string
}

export interface OwnerRequestFilters {
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
  status?: 'pending' | 'approved' | 'rejected'
}

const buildQuery = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== null) {
      searchParams.append(key, value.toString());
    }
  });
  return searchParams.toString();
};

export const getOwners = async (filters: OwnerFilters) => {
  const query = buildQuery(filters);
  const response = await apiClient.get(`/admin/owners?${query}`);
  return response.data;
};

export const getOwnerRequests = async (filters: OwnerRequestFilters) => {
  const query = buildQuery(filters);
  const response = await apiClient.get(`/admin/owners/requests?${query}`);
  return response.data;
};

export const getOwnerCounts = async () => {
  const response = await apiClient.get('/admin/owners/counts');
  return response.data;
};

export const acceptOwnerRequest = async (requestId: string) => {
  const response = await apiClient.patch(`/admin/owners/requests/${requestId}/accept`);
  return response.data;
};

export const rejectOwnerRequest = async (requestId: string, rejectionReason?: string) => {
  const response = await apiClient.patch(`/admin/owners/requests/${requestId}/reject`, {
    rejectionReason
  });
  return response.data;
};

export const toggleOwnerStatus = async (ownerId: string) => {
  const response = await apiClient.patch(`/admin/owners/${ownerId}/toggle-status`);
  return response.data;
};

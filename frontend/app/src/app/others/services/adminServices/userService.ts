import apiClient from "../../Utils/apiClient";

export interface UserFilters {
  search?: string;
  status?: 'active' | 'inactive';
  isVerified?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
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

export const getUserCounts = async () => {
  const response = await apiClient.get('/admin/users/counts');
  return response.data;
};

export const getUsers = async (filters: UserFilters) => {
  const query = buildQuery(filters);
  const response = await apiClient.get(`/admin/users?${query}`);
  return response.data;
};

export const getUserDetails = async (userId: string) => {
  const response = await apiClient.get(`/admin/users/${userId}`);
  return response.data;
};

export const toggleUserStatus = async (userId: string) => {
  const response = await apiClient.patch(`/admin/users/${userId}/toggle-status`);
  return response.data;
};



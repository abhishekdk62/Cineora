import ADMIN_STAFF from "../../constants/adminConstants/staffConstants";
import apiClient from "../../Utils/apiClient";
import { GetCouponsResponseDto } from "../userServices/couponServices";

export const getAllStaffs = async (query?: {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}) => {
  const params = new URLSearchParams();
  
  if (query?.page) params.append('page', query.page.toString());
  if (query?.limit) params.append('limit', query.limit.toString());
  if (query?.search) params.append('search', query.search);
  if (query?.isActive !== undefined) params.append('isActive', query.isActive.toString());
  
  const data = await apiClient.get(ADMIN_STAFF.GET_STAFF, { params });
  return data.data;
};

export const toggleStatus = async (staffId:string): Promise<GetCouponsResponseDto> => {
  
  const data = await apiClient.patch(ADMIN_STAFF.TOGGLE_STATUS(staffId));
  return data.data;
};

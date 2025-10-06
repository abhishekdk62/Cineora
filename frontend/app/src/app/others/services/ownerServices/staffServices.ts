import OWNER_STAFF from "../../constants/ownerConstants/staffConstants";
import OWNER_WALLET from "../../constants/ownerConstants/walletConstants";
import {
  GetTransactionDetailsResponseDto,
  GetWalletUserResponseDto,
} from "../../dtos";
import apiClient from "../../Utils/apiClient";

export const createStaff = async (datas): Promise<GetWalletUserResponseDto> => {
  const data = await apiClient.post(OWNER_STAFF.CREATE, datas);
  return data.data;
};
export const verifyTicket = async (
  datas: string
): Promise<GetWalletUserResponseDto> => {
  const data = await apiClient.post(OWNER_STAFF.VERIFY_TICKET, { data: datas });
  return data.data;
};
export const getStaffDetails = async (): Promise<GetWalletUserResponseDto> => {
  const data = await apiClient.get(OWNER_STAFF.GET_DETAILS);
  return data.data.data;
};

export const toggleStatus = async (staffId: string) => {
  const data = await apiClient.patch(OWNER_STAFF.TOGGLE_STAFF(staffId));
  return data.data
};
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
  
  const data = await apiClient.get(OWNER_STAFF.GET_STAFF, { params });
  return data.data;
};


import OWNER_STAFF from "../../constants/ownerConstants/staffConstants";
import OWNER_WALLET from "../../constants/ownerConstants/walletConstants";
import { GetTransactionDetailsResponseDto, GetWalletUserResponseDto } from "../../dtos";
import apiClient from "../../Utils/apiClient";

export const createStaff = async (datas): Promise<GetWalletUserResponseDto> => {
  const data = await apiClient.post(OWNER_STAFF.CREATE,datas);
  return data.data;
};
export const verifyTicket = async (datas:string): Promise<GetWalletUserResponseDto> => {
  const data = await apiClient.post(OWNER_STAFF.VERIFY_TICKET,{data:datas});
  return data.data;
};
export const getStaffDetails = async (): Promise<GetWalletUserResponseDto> => {
  const data = await apiClient.get(OWNER_STAFF.GET_DETAILS,);
  return data.data.data
};

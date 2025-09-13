import OWNER_WALLET from "../../constants/ownerConstants/walletConstants";
import { GetTransactionDetailsResponseDto, GetWalletUserResponseDto } from "../../dtos";
import apiClient from "../../Utils/apiClient";

export const getWalletOwner = async (): Promise<GetWalletUserResponseDto> => {
  const data = await apiClient.get(OWNER_WALLET.WALLET);
  return data.data;
};
export const getTransactionDetailsOwner = async (): Promise<GetTransactionDetailsResponseDto> => {
  const data = await apiClient.get(OWNER_WALLET.TRANSACTIONS);
  return data.data;
};
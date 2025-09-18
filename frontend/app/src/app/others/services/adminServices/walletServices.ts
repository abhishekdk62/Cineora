import USER_WALLET from "../../constants/userConstants/walletConstants";
import apiClient from "../../Utils/apiClient";
import {
  GetWalletUserResponseDto,
  GetTransactionDetailsResponseDto,
  CreditWalletRequestDto,
  CreditWalletResponseDto
} from '../../dtos/wallet.dto';
import ADMIN_WALLET from "../../constants/adminConstants/walletConstants";
import { AdminTransaction } from "../../components/Admin/Dashboard/Wallet/AdminTransactionHistory";

export const getWalletAdmin = async (): Promise<GetWalletUserResponseDto> => {
  const data = await apiClient.get(ADMIN_WALLET.WALLET);
  return data.data;
};

export const getTransactionDetailsAdmin = async (): Promise<{data:AdminTransaction[]}> => {
  const data = await apiClient.get(ADMIN_WALLET.TRANSACTIONS);
  return data.data;
};



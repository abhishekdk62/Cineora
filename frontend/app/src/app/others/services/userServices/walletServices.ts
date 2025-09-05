import USER_WALLET from "../../constants/userConstants/walletConstants";
import apiClient from "../../Utils/apiClient";
import {
  GetWalletUserResponseDto,
  GetTransactionDetailsResponseDto,
  CreditWalletRequestDto,
  CreditWalletResponseDto
} from '../../dtos/wallet.dto';

export const getWallet = async (): Promise<GetWalletUserResponseDto> => {
  const data = await apiClient.get(USER_WALLET.WALLET);
  return data.data;
};

export const getTransactionDetails = async (): Promise<GetTransactionDetailsResponseDto> => {
  const data = await apiClient.get(USER_WALLET.TRANSACTIONS);
  return data.data;
};

export const creditWallet = async (params: CreditWalletRequestDto): Promise<CreditWalletResponseDto> => {
  const data = await apiClient.post(USER_WALLET.CREDIT_TRANSACTION, params);
  return data.data;
};

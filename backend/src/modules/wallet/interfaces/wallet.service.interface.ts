import { IWallet } from './wallet.model.interface';
import { CreateWalletDto, CreditWalletDto, DebitWalletDto } from '../dtos/dto';
import { ApiResponse } from '../../../utils/createResponse';

export interface IWalletService {
  createWallet(data: CreateWalletDto): Promise<ApiResponse<IWallet>>;
  creditWallet(data: CreditWalletDto): Promise<ApiResponse<IWallet>>;
  debitWallet(data: DebitWalletDto): Promise<ApiResponse<IWallet>>;
  getWalletBalance(userId: string, userModel: "User" | "Owner"|"Admin"): Promise<ApiResponse<{ balance: number }>>;
  getWalletDetails(userId: string, userModel: "User" | "Owner"|"Admin"): Promise<ApiResponse<IWallet>>;
  debitWalletAllowNegative(data: DebitWalletDto): Promise<ApiResponse<IWallet>>
}

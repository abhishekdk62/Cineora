import { ShowtimeData } from "@/app/book/tickets/[showtimeId]/page";
import apiClient from "../../Utils/apiClient";
import USER_BOOKING_ROUTES from "../../constants/userConstants/bookingConstants";
import {
  BookTicketResponseDto,
  WalletBookRequestDto,
  WalletBookResponseDto
} from '../../dtos/booking.dto';

export const bookTicket = async (bookingDatasRedux: ShowtimeData): Promise<BookTicketResponseDto> => {
  const response = await apiClient.post(USER_BOOKING_ROUTES.CREATE_BOOKING, bookingDatasRedux);
  return response.data;
};

export const walletBook = async (amount: number, userModel: string): Promise<WalletBookResponseDto> => {
  const requestData: WalletBookRequestDto = { amount, userModel };
  const response = await apiClient.post(USER_BOOKING_ROUTES.WALLET_DEBIT, requestData);
  return response.data;
};

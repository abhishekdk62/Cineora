import USER_TICKETS from "../../constants/userConstants/ticketConstants";
import apiClient from "../../Utils/apiClient";
import {
  GetTicketsApiResponseDto,
  CancelTicketResponseDto,
} from "../../dtos/ticket.dto";

export const getTicketsApi = async (
  page?: number,
  limit?: number,
  type?: string
): Promise<GetTicketsApiResponseDto> => {
  const response = await apiClient.get(USER_TICKETS.LIST, {
    params: {
      page,
      limit,
      type,
    },
  });
  return response.data;
};

export const cancelTicket = async (
  bookingId: string,
  amount: number
): Promise<CancelTicketResponseDto> => {
  const result = await apiClient.delete(USER_TICKETS.CANCEL, {
    params: { bookingId, amount },
  });
  return result.data;
};
export const cancelSingleTicket = async (
  ticketIds: string[],
  totalAmount: number,
): Promise<CancelTicketResponseDto> => {
  const result = await apiClient.post(USER_TICKETS.CANCEL_SINGLE, {
    ticketIds,
    totalAmount
  });
  return result.data;
};


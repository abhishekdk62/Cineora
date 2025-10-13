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
): Promise<CancelTicketResponseDto> => {
  const result = await apiClient.delete(USER_TICKETS.CANCEL, {
    params: { bookingId },
  });
  return result.data;
};
export const cancelSingleTicket = async (
  ticketIds: string[],
  
): Promise<CancelTicketResponseDto> => {
  console.log('calledddd');
  
  const result = await apiClient.post(USER_TICKETS.CANCEL_SINGLE, {
    ticketIds
  });
  return result.data;
};


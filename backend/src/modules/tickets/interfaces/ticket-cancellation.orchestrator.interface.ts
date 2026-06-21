import { ApiResponse } from "../../../utils/createResponse";
import { ITicket } from "./ticket.model.interface";
import { RefundCalculationDto } from "../dtos/dto";

export interface SingleTicketCancellationInput {
  userId: string;
  cancelledTickets: ITicket[];
  cancellationData: RefundCalculationDto;
  totalAmount: number;
}

export interface BookingCancellationInput {
  userId: string;
  bookingId: string;
  amount: number;
  cancellationData: RefundCalculationDto;
}

export interface ITicketCancellationOrchestrator {
  processSingleTicketCancellation(
    input: SingleTicketCancellationInput
  ): Promise<ApiResponse<unknown>>;

  processBookingCancellation(
    input: BookingCancellationInput
  ): Promise<ApiResponse<unknown>>;
}

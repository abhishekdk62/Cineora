import { ITicket } from './ticket.model.interface';
import { 
  CreateTicketFromRowsDto,
  CreateTicketFromBookingDto,
  CancelTicketDto,
  GetUserTicketsDto,
  ValidateTicketDto,
  TicketResponseDto,
  PaginatedTicketsResponseDto,
  TicketValidationResponseDto,
  RefundCalculationDto,
  CancelSingleTicketDto
} from '../dtos/dto';
import { ApiResponse } from '../../../utils/createResponse';

export interface ITicketService {
  createTicketsFromRows(data: CreateTicketFromRowsDto): Promise<ApiResponse<ITicket[]>>;
  createTicketsFromBooking(data: CreateTicketFromBookingDto): Promise<ApiResponse<ITicket[]>>;
  cancelTicket(data: CancelTicketDto): Promise<ApiResponse<any>>;
  getTicketByIds(id: string[]);
  verifyTicket(encryptedData: string, staffId: string): Promise<ApiResponse<any>> 
  cancelSingleTicket(data: CancelSingleTicketDto): Promise<ApiResponse<RefundCalculationDto>>
  getTicketById(ticketId: string): Promise<ApiResponse<TicketResponseDto>>;
  getUserTickets(data: GetUserTicketsDto): Promise<ApiResponse<PaginatedTicketsResponseDto>>;
  markTicketAsUsed(ticketId: string): Promise<ApiResponse<TicketResponseDto>>;
  validateTicket(data: ValidateTicketDto): Promise<ApiResponse<TicketValidationResponseDto>>;
  getTicketsByBookingId(bookingId: string): Promise<ApiResponse<ITicket[]>>;
  getTicketHistory(userId: string): Promise<ApiResponse<ITicket[]>>;
  generateQRCode(ticketId: string): Promise<ApiResponse<{ qrCode: string }>>;
  deleteTicket(ticketId: string): Promise<ApiResponse<boolean>>;
}

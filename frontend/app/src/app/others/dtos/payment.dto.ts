import { ApiResponse, PaginationQuery } from './common.dto';

export interface TransactionDetailsDto {
  gatewayTransactionId?: string;
  gatewayResponse?: any;
  failureReason?: string;
  processingTime?: number;
}

export interface CreatePaymentRequestDto {
  bookingId: string;
  userId: string;
  amount: number;
  currency: string;
  paymentMethod: "upi" | "card" | "netbanking" | "wallet";
  paymentGateway: "razorpay" | "stripe" | "paytm" | "phonepe";
}

export interface UpdatePaymentRequestDto {
  status?: "pending" | "processing" | "completed" | "failed" | "cancelled" | "refunded";
  transactionDetails?: TransactionDetailsDto;
  completedAt?: Date;
}

export interface RefundPaymentRequestDto {
  refundAmount: number;
  refundReason: string;
}

export interface GetPaymentsQueryDto extends PaginationQuery {
  userId?: string;
  bookingId?: string;
  status?: "pending" | "processing" | "completed" | "failed" | "cancelled" | "refunded";
  paymentMethod?: "upi" | "card" | "netbanking" | "wallet";
  paymentGateway?: "razorpay" | "stripe" | "paytm" | "phonepe";
  dateFrom?: Date;
  dateTo?: Date;
}

export interface PaymentResponseDto {
  _id: string;
  paymentId: string;
  bookingId: string;
  userId: string;
  amount: number;
  currency: string;
  paymentMethod: "upi" | "card" | "netbanking" | "wallet";
  paymentGateway: "razorpay" | "stripe" | "paytm" | "phonepe";
  status: "pending" | "processing" | "completed" | "failed" | "cancelled" | "refunded";
  transactionDetails?: TransactionDetailsDto;
  refundAmount?: number;
  refundDate?: Date;
  refundReason?: string;
  refundTransactionId?: string;
  initiatedAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePaymentResponseDto extends ApiResponse<PaymentResponseDto> {}
export interface GetPaymentResponseDto extends ApiResponse<PaymentResponseDto> {}
export interface GetPaymentsResponseDto extends ApiResponse<PaymentResponseDto[]> {}
export interface UpdatePaymentResponseDto extends ApiResponse<PaymentResponseDto> {}
export interface RefundPaymentResponseDto extends ApiResponse<PaymentResponseDto> {}

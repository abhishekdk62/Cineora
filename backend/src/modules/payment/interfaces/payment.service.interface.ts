import { ServiceResponse } from "../../../interfaces/interface";
import {
  InitiatePaymentDTO,
  PaymentCallbackDTO,
  RefundPaymentDTO,
  CreateRazorpayOrderDTO,
  VerifyRazorpayPaymentDTO,
  ConfirmPayoutDTO,
  CreatePayoutOrderDTO
} from "../dtos/dto";

export interface IPaymentService {
  initiatePayment(paymentData: InitiatePaymentDTO): Promise<ServiceResponse>;
  createRazorpayOrder(orderData: CreateRazorpayOrderDTO): Promise<ServiceResponse>;
  verifyRazorpayPayment(paymentData: VerifyRazorpayPaymentDTO): Promise<ServiceResponse>;
  processPaymentCallback(paymentId: string, gatewayResponse: PaymentCallbackDTO): Promise<ServiceResponse>;
  getPaymentById(paymentId: string): Promise<ServiceResponse>;
    getLatestPaymentData(
    userId: string
  ): Promise<ServiceResponse>;

  getUserPayments(userId: string): Promise<ServiceResponse>;
  refundPayment(paymentId: string, refundAmount: number, refundReason: string): Promise<ServiceResponse>;
  getPaymentsByBooking(bookingId: string): Promise<ServiceResponse>;
  confirmPayout(data: ConfirmPayoutDTO) ;
   createPayoutOrder(data: CreatePayoutOrderDTO)
  cancelPayment(paymentId: string): Promise<ServiceResponse>;
  verifyPayment(paymentId: string, gatewayTransactionId: string): Promise<ServiceResponse>;
  getPaymentStatus(paymentId: string): Promise<ServiceResponse>;
  retryPayment(paymentId: string): Promise<ServiceResponse>;
  getFailedPayments(): Promise<ServiceResponse>;
  getPendingPayments(): Promise<ServiceResponse>;
}

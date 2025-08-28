import { ServiceResponse } from "../../../interfaces/interface";
import { CreateRazorpayOrderDto, VerifyRazorpayPaymentDto } from "../dtos/dto";

export interface IPaymentService {
  initiatePayment(paymentData: any): Promise<ServiceResponse>;
  
  processPaymentCallback(
    paymentId: string,
    gatewayResponse: any
  ): Promise<ServiceResponse>;
  
  getPaymentById(paymentId: string): Promise<ServiceResponse>;
  
  getPaymentsByBooking(bookingId: string): Promise<ServiceResponse>;
  
  getUserPayments(userId: string): Promise<ServiceResponse>;
    createRazorpayOrder(orderData: CreateRazorpayOrderDto): Promise<any>;
  verifyRazorpayPayment(paymentData: VerifyRazorpayPaymentDto): Promise<any>;

  refundPayment(
    paymentId: string,
    refundAmount: number,
    refundReason: string
  ): Promise<ServiceResponse>;
  
  cancelPayment(paymentId: string): Promise<ServiceResponse>;
  
  verifyPayment(
    paymentId: string,
    gatewayTransactionId: string
  ): Promise<ServiceResponse>;
  
  getPaymentStatus(paymentId: string): Promise<ServiceResponse>;
  
  retryPayment(paymentId: string): Promise<ServiceResponse>;
  
  getFailedPayments(): Promise<ServiceResponse>;
  
  getPendingPayments(): Promise<ServiceResponse>;
}

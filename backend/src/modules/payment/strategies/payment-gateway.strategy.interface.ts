import { CreateRazorpayOrderDTO } from "../dtos/dto";

export interface PaymentGatewayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt?: string;
  [key: string]: unknown;
}

export interface IPaymentGatewayStrategy {
  readonly gatewayName: string;
  createOrder(orderData: CreateRazorpayOrderDTO): Promise<PaymentGatewayOrder>;
  verifyPaymentSignature(
    orderId: string,
    paymentId: string,
    signature: string
  ): boolean;
}

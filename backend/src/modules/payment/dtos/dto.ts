export interface InitiatePaymentDto {
  bookingId: string;
  userId: string;
  amount: number;
  currency?: string;
  paymentMethod: "upi" | "card" | "netbanking" | "wallet";
  paymentGateway: "razorpay" | "stripe" | "paytm" | "phonepe";
  successUrl?: string;
  failureUrl?: string;
}

export interface PaymentCallbackDto {
  paymentId: string;
  gatewayTransactionId: string;
  status: "success" | "failure";
  amount: number;
  gatewayResponse: any;
}

export interface RefundPaymentDto {
  paymentId: string;
  refundAmount: number;
  refundReason: string;
}

export interface PaymentResponseDto {
  paymentId: string;
  bookingId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentGateway: string;
  status: string;
  initiatedAt: string;
  completedAt?: string;
  gatewayUrl?: string;
}

export interface VerifyPaymentDto {
  paymentId: string;
  gatewayTransactionId: string;
  signature?: string;
}


export interface CreateRazorpayOrderDto {
  amount: number;
  currency?: string;
}

export interface VerifyRazorpayPaymentDto {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  bookingData: any;
}

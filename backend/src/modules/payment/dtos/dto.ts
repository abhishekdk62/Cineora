import { ITransactionDetails } from "../interfaces/payment.model.interface";

export interface CreatePaymentDTO {
  paymentId: string;
  bookingId: string;
  userId: string;
  amount: number;
  currency: string;
  paymentMethod: "upi" | "card" | "netbanking" | "wallet";
  paymentGateway: "razorpay" | "stripe" | "paytm" | "phonepe";
  status?: "pending" | "processing" | "completed" | "failed" | "cancelled" | "refunded";
  transactionDetails?: ITransactionDetails;
  initiatedAt?: Date;
}

export interface UpdatePaymentDTO {
  amount?: number;
  currency?: string;
  paymentMethod?: "upi" | "card" | "netbanking" | "wallet";
  paymentGateway?: "razorpay" | "stripe" | "paytm" | "phonepe";
  status?: "pending" | "processing" | "completed" | "failed" | "cancelled" | "refunded";
  transactionDetails?: ITransactionDetails;
  completedAt?: Date;
}

export interface PaymentStatusUpdateDTO {
  status: "pending" | "processing" | "completed" | "failed" | "cancelled" | "refunded";
  transactionDetails?: ITransactionDetails;
}

export interface RefundPaymentDTO {
  refundAmount: number;
  refundReason: string;
  refundTransactionId?: string;
}

export interface InitiatePaymentDTO {
  bookingId: string;
  userId: string;
  amount: number;
  currency?: string;
  paymentMethod: "upi" | "card" | "netbanking" | "wallet";
  paymentGateway: "razorpay" | "stripe" | "paytm" | "phonepe";
}

export interface PaymentCallbackDTO {
  status: "success" | "failed";
  transactionId: string;
  [key: string]: unknown;
}

export interface CreateRazorpayOrderDTO {
  amount: number;
  currency?: string;
}

export interface VerifyRazorpayPaymentDTO {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  bookingData?: unknown;
}



export interface CreatePayoutOrderDTO {
  ownerId: string;
  amount: number;
  mode: string;
  purpose: string;
}

export interface ConfirmPayoutDTO {
  ownerId: string;
  amount: number;
  mode: string;
  razorpay_payment_id: string;
  order_id: string;
}
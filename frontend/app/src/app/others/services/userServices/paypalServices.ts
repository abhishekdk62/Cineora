import apiClient from "../../Utils/apiClient";

export interface CreateOrderData {
  amount: number;
  currency?: string;
}
export interface PaymentVerificationData {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  bookingData: any; 
}
export interface CreateOrderResponse {
  id: string;
  data:{id:string}
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}
export interface PaymentVerificationResponse {
  success: boolean;
  message: string;
}
export const createRazorpayOrder = async (
  orderData: CreateOrderData
): Promise<CreateOrderResponse> => {
  const response = await apiClient.post("/users/razorpay/create-order", {
    amount: orderData.amount,
    currency: orderData.currency || "INR",
  });
  return response.data;
};
export const verifyRazorpayPayment = async (
  paymentData: PaymentVerificationData
): Promise<PaymentVerificationResponse> => {
  const response = await apiClient.post("/users/razorpay/verify-payment", {
    razorpay_payment_id: paymentData.razorpay_payment_id,
    razorpay_order_id: paymentData.razorpay_order_id,
    razorpay_signature: paymentData.razorpay_signature,
    bookingData: paymentData.bookingData,
  });
  return response.data;
};


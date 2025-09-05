import USER_PAYMENTS from "../../constants/userConstants/paypalConstants";
import apiClient from "../../Utils/apiClient";
import { CreateOrderData, CreateOrderResponse, PaymentVerificationData, PaymentVerificationResponse } from "./interfaces";



export const createRazorpayOrder = async (
  orderData: CreateOrderData
): Promise<CreateOrderResponse> => {
  const response = await apiClient.post(USER_PAYMENTS.CREATE_RAZORPAY_ORDER, {
    amount: orderData.amount,
    currency: orderData.currency || "INR",
  });
  return response.data;
};

export const verifyRazorpayPayment = async (
  paymentData: PaymentVerificationData
): Promise<PaymentVerificationResponse> => {
  const response = await apiClient.post(USER_PAYMENTS.VERIFY_RAZORPAY_PAYMENT, {
    razorpay_payment_id: paymentData.razorpay_payment_id,
    razorpay_order_id: paymentData.razorpay_order_id,
    razorpay_signature: paymentData.razorpay_signature,
    bookingData: paymentData.bookingData,
  });
  return response.data;
};

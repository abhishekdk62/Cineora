import axios from "axios";
import apiClient from "../../Utils/apiClient";
import OWNER_PAYOUT from "../../constants/ownerConstants/payoutConstants";


export const createRazorpayPayout = async (payoutData: {
  amount: number;
  mode: "IMPS" | "NEFT" | "RTGS";
  purpose: string;
}) => {
  const response = await apiClient.post(
    OWNER_PAYOUT.CREATE_ORDER,
    payoutData
  );

  return response.data;
};

export const confirmPayout = async (confirmData: {
  razorpay_payment_id: string;
  amount: number;
  mode: string;
  order_id: string;
}) => {
  const response = await apiClient.post(
    OWNER_PAYOUT.CONFIRM_ORDER,
    confirmData
  );

  return response.data;
};


// services/ownerServices/ownerService.ts
import apiClient from "../../Utils/apiClient";

export interface OwnerRequestResponse {
  success: boolean;
  message: string;
  requestId?: string;
  data?: any;
}

export interface OwnerRequestData {
  ownerName: string;
  phone: string;
  email: string;
  aadhaar: string;
  pan: string;
  declaration: boolean;
  agree: boolean;
  aadhaarUrl: string;
  panUrl: string;
  ownerPhotoUrl: string | null;
  // Optional bank details
  accountHolder?: string;
  bankName?: string;
  accountNumber?: string;
  ifsc?: string;
}

export const sendOwnerOTP = async (email: string) => {
  const response = await apiClient.post('/owners/send-otp', { email });
  return response.data;
};

export const verifyOwnerOTP = async (email: string, otp: string) => {
  const response = await apiClient.post('/owners/verify-otp', { email, otp });
  return response.data;
};

export const submitOwnerRequest = async (requestData: OwnerRequestData) => {
  const response = await apiClient.post('/owners/submit-kyc', requestData);
  return response.data;
};

export const getOwnerRequestStatus = async (requestId: string) => {
  const response = await apiClient.get(`/owners/request-status/${requestId}`);
  return response.data;
};

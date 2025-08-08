// services/ownerServices/ownerService.ts
import { UserProfile } from "../../components/Owner/MyAccount/MyAccount";
import apiClient from "../../Utils/apiClient";
type Partial<UserProfile> = {
  [P in keyof UserProfile]?: UserProfile[P]
}

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

export const getOwnerProfile=async()=>{
  const result=await apiClient.get('/owner/profile')
  return result.data
}

export const updateOwnerProfile=async(data: Partial<UserProfile>)=>{
const result=await apiClient.put('/owner',data)
return result.data
}

export const resetPassword = async (data: { newPassword: string; oldPassword: string }) => {
  const response = await apiClient.patch('/owner/reset-password', {
    newPassword: data.newPassword,
    oldPassword: data.oldPassword,
  });
  return response.data;
};


export const sendEmailChangeOtp = async (data: { newEmail: string; password: string }) => {
  const response = await apiClient.post('/owner/email/change', {
    newEmail: data.newEmail,  
    password: data.password
  });
  return response.data;
}

export const verifyEmailChangeOtp = async (data: { email: string; otp: string }) => {
  const response = await apiClient.post('/owner/email/verify', {
    email: data.email, 
    otp: data.otp
  });
  return response.data;
}

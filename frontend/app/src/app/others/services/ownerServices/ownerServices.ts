// Add these imports and functions to the existing ownerService.ts file

import { UserProfile } from "../../components/Owner/MyAccount/MyAccount";
import OWNER_ROUTES from "../../constants/ownerConstants/ownerConstants";
import {
  OwnerRequestData,
  PartialUserProfile,
  SendOwnerOTPRequestDto,
  SendOwnerOTPResponseDto,
  VerifyOwnerOTPRequestDto,
  VerifyOwnerOTPResponseDto,
  SubmitOwnerRequestResponseDto,
  GetOwnerRequestStatusResponseDto,
  GetOwnerProfileResponseDto,
  UpdateOwnerProfileResponseDto,
  ResetPasswordRequestDto,
  ResetPasswordResponseDto,
  SendEmailChangeOtpRequestDto,
  SendEmailChangeOtpResponseDto,
  VerifyEmailChangeOtpRequestDto,
  VerifyEmailChangeOtpResponseDto
} from '../../dtos/owner.dto';
import apiClient from "../../Utils/apiClient";

// Add these functions to existing owner service

export const sendOwnerOTP = async (email: string): Promise<SendOwnerOTPResponseDto> => {
  const requestData: SendOwnerOTPRequestDto = { email };
  const response = await apiClient.post(OWNER_ROUTES.SEND_OTP, requestData);
  return response.data;
};

export const verifyOwnerOTP = async (email: string, otp: string): Promise<VerifyOwnerOTPResponseDto> => {
  const requestData: VerifyOwnerOTPRequestDto = { email, otp };
  const response = await apiClient.post(OWNER_ROUTES.VERIFY_OTP, requestData);
  return response.data;
};

export const submitOwnerRequest = async (requestData: OwnerRequestData): Promise<SubmitOwnerRequestResponseDto> => {
  const response = await apiClient.post(OWNER_ROUTES.SUBMIT_REQUEST, requestData);
  return response.data;
};

export const getOwnerRequestStatus = async (requestId: string): Promise<GetOwnerRequestStatusResponseDto> => {
  const response = await apiClient.get(OWNER_ROUTES.REQUEST_STATUS(requestId));
  return response.data;
};

export const getOwnerProfile = async (): Promise<GetOwnerProfileResponseDto> => {
  const result = await apiClient.get(OWNER_ROUTES.PROFILE);
  return result.data;
};

export const updateOwnerProfile = async (data: PartialUserProfile): Promise<UpdateOwnerProfileResponseDto> => {
  const result = await apiClient.put(OWNER_ROUTES.UPDATE_PROFILE, data);
  return result.data;
};

export const resetPassword = async (data: ResetPasswordRequestDto): Promise<ResetPasswordResponseDto> => {
  const response = await apiClient.patch(OWNER_ROUTES.RESET_PASSWORD, data);
  return response.data;
};

export const sendEmailChangeOtp = async (data: SendEmailChangeOtpRequestDto): Promise<SendEmailChangeOtpResponseDto> => {
  const response = await apiClient.post(OWNER_ROUTES.EMAIL_CHANGE_OTP_SEND, data);
  return response.data;
};

export const verifyEmailChangeOtp = async (data: VerifyEmailChangeOtpRequestDto): Promise<VerifyEmailChangeOtpResponseDto> => {
  const response = await apiClient.post(OWNER_ROUTES.EMAIL_CHANGE_OTP_VERIFY, data);
  return response.data;
};

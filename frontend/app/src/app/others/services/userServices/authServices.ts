import USER_AUTH_ROUTES from "../../constants/userConstants/authConstants";
import apiClient from "../../Utils/apiClient";

export const signup = async (userData: any) => {
  const response = await apiClient.post(USER_AUTH_ROUTES.SIGNUP, userData);
  return response.data;
};

export const verifyOTP = async (email: string, otp: string) => {
  const response = await apiClient.post(USER_AUTH_ROUTES.VERIFY_OTP, { email, otp });
  return response.data;
};

export const resendOTP = async (email: string) => {
  const response = await apiClient.post(USER_AUTH_ROUTES.RESEND_OTP, { email });
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await apiClient.post(USER_AUTH_ROUTES.LOGIN, { email, password });
  return response.data;
};

export const getUserProfile = async () => {
  const response = await apiClient.get(USER_AUTH_ROUTES.PROFILE);
  return response.data;
};

export const updateProfile = async (updateData: any) => {
  const response = await apiClient.put(USER_AUTH_ROUTES.PROFILE, updateData);
  return response.data;
};

export const getNearbyUsers = async (userId: string, maxDistance: number = 5000) => {
  const response = await apiClient.get(USER_AUTH_ROUTES.NEARBY_USERS(userId, maxDistance));
  return response.data;
};

export const addXpPoints = async (userId: string, points: number) => {
  const response = await apiClient.post(USER_AUTH_ROUTES.ADD_XP(userId), { points });
  return response.data;
};

export const resetPassword = async (newPassword: string, oldpassword: string) => {
  const response = await apiClient.patch(USER_AUTH_ROUTES.RESET_PASSWORD, { newPassword, oldpassword });
  return response.data;
};

export const sendEmailChangeOtp = async (data: { newEmail: string; password: string }) => {
  const response = await apiClient.post(USER_AUTH_ROUTES.EMAIL_CHANGE_OTP_SEND, {
    newEmail: data.newEmail,
    password: data.password,
  });
  return response.data;
};

export const verifyEmailChangeOtp = async (data: { email: string; otp: string }) => {
  const response = await apiClient.post(USER_AUTH_ROUTES.EMAIL_CHANGE_OTP_VERIFY, {
    email: data.email,
    otp: data.otp,
  });
  return response.data;
};

// services/userServices/userService.ts
import apiClient from "../../Utils/apiClient";

// User Signup - Creates account and sends OTP email (Public)
export const signup = async (userData: any) => {
  const response = await apiClient.post('/users/signup', userData);
  return response.data;
};

// Verify OTP - Verifies email with OTP code (Public)
export const verifyOTP = async (email: string, otp: string) => {
  const response = await apiClient.post('/users/verify-otp', { email, otp });
  return response.data;
};

// Resend OTP - Resends OTP to email (Public)
export const resendOTP = async (email: string) => {
  const response = await apiClient.post('/users/resend-otp', { email });
  return response.data;
};

export const getUserProfile = async () => {
  const response = await apiClient.get(`/users/profile`);
  return response.data;
};

export const updateProfile = async ( updateData: any) => {
  const response = await apiClient.put(`/users/profile`, updateData);
  return response.data;
};

export const getNearbyUsers = async (userId: string, maxDistance: number = 5000) => {
  const response = await apiClient.get(`/users/nearby/${userId}?maxDistance=${maxDistance}`);
  return response.data;
};

export const addXpPoints = async (userId: string, points: number) => {
  const response = await apiClient.post(`/users/xp/${userId}`, { points });
  return response.data;
};

import apiClient from "../../Utils/apiClient";

// User Signup - Creates account and sends OTP email
export const signup = async (userData: any) => {
  const response = await apiClient.post('/users/signup', userData);
  return response.data;
};

// Verify OTP - Verifies email with OTP code
export const verifyOTP = async (email: string, otp: string) => {
  const response = await apiClient.post('/users/verify-otp', { email, otp });
  return response.data;
};

// Resend OTP - Resends OTP to email
export const resendOTP = async (email: string) => {
  const response = await apiClient.post('/users/resend-otp', { email });
  return response.data;
};

// User Login (for future use)
export const login = async (email: string, password: string) => {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data;
};

// Get User Profile by ID
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

// Add XP Points
export const addXpPoints = async (userId: string, points: number) => {
  const response = await apiClient.post(`/users/xp/${userId}`, { points });
  return response.data;
};

// Forgot Password (for future use)
export const forgotPassword = async (email: string) => {
  const response = await apiClient.post('/users/forgot-password', { email });
  return response.data;
};

// Reset Password (for future use)
export const resetPassword = async ( newPassword: string) => {
  const response = await apiClient.patch('/users/reset-password', {  newPassword });
  return response.data;
};

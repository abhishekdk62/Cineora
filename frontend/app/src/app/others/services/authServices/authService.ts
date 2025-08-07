// services/authService.ts (Keep only one login function)
import axios from "axios";
import apiClient from "../../Utils/apiClient";

export const login = async (email: string, password: string) => {
  const response = await apiClient.post("/auth/login", { email, password });
  return response.data;
};
export const forgotPassword = async (email: string) => {
  const response = await apiClient.post("/auth/forgot-password/send-otp", {
    email,
  });
  return response.data;
};

export const verifyPasswordResetOtp = async (email: string, otp: string) => {
  const response = await apiClient.post("/auth/forgot-password/verify-otp", {
    email,
    otp,
  });
  return response.data;
};

export const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string
) => {
  const response = await apiClient.post("/auth/forgot-password/reset-password", {
    email,
    otp,
    newPassword,
  });
  return response.data;
};

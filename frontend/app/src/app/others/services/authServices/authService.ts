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

export const googleAuth=async(credentialResponse: any)=>{

  const result=await apiClient.post('/auth/google',{credential: credentialResponse.credential})
  return result.data

}

export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get("/auth/me");
       if (response.data?.success) {
      return response.data.data;
    }

    return null;
  } catch {
    return null;
  }
};
export const getUserRole = async (): Promise<
  "admin" | "owner" | "user" | null
> => {
  const user = await getCurrentUser();
  return user?.role || null;
};

export const isAuthenticated = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return user !== null;
};

export const logout = async () => {
  try {
    const response = await apiClient.post("/auth/logout", {});
    
        return response.data?.success || false;

  } catch {
    return false;
  }
};

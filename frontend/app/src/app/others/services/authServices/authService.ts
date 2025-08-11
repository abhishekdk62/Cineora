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
  console.log('🔍 getCurrentUser called');
  
  try {
    const userData = localStorage.getItem('userData');
    console.log('📦 Raw data from localStorage:', userData);
    
    if (!userData) {
      console.log('❌ No userData found in localStorage');
      console.log('🗄️ All localStorage items:', {...localStorage});
      return null;
    }
    
    const parsedUser = JSON.parse(userData);
    console.log('✅ Parsed user data:', parsedUser);
    
    return parsedUser;
    
  } catch (error) {
    console.log('💥 getCurrentUser error:', error);
    localStorage.removeItem('userData');
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
    localStorage.removeItem('authToken'); 
        return response.data?.success || false;

  } catch {
        localStorage.removeItem('authToken');

    return false;
  }
};


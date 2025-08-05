// services/authService.ts (Keep only one login function)
import apiClient from "../../Utils/apiClient"

export const login = async (email: string, password: string) => {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data;
};

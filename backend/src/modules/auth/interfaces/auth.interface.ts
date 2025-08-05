export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    user: any;
    token: string;
    role: 'user' | 'admin' | 'owner';
    redirectTo: string;
  };
}

export interface TokenPayload {
  id: string;
  email: string;
  role: 'user' | 'admin' | 'owner';
  userId?: string;
  adminId?: string;
  ownerId?: string;
}

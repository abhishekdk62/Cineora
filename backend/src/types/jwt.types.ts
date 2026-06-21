export interface DecodedAccessToken {
  role: "admin" | "owner" | "user" | "staff";
  email: string;
  userId?: string;
  adminId?: string;
  ownerId?: string;
  staffId?: string;
  iat?: number;
  exp?: number;
}

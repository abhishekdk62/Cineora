import { LoginResponseDto } from "../../dtos/dtos";

export type AuthRole = "admin" | "owner" | "staff" | "user";

export interface AuthLoginContext {
  issueTokens(
    entity: { _id?: unknown; id?: string; email: string },
    role: AuthRole,
    userPayload: Record<string, unknown>,
    message: string,
    redirectTo: string
  ): Promise<LoginResponseDto>;

  onOwnerLogin?(ownerId: string): Promise<void>;
  onUserLogin?(userId: string): Promise<void>;
}

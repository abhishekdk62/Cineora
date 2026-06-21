import { LoginResponseDto } from "../../dtos/dtos";
import { AuthLoginContext } from "./auth-login.context";

export interface AuthLoginEntity {
  _id?: unknown;
  id?: string;
  email: string;
  password: string;
  isActive?: boolean;
  isVerified?: boolean;
  ownerName?: string;
  phone?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  xpPoints?: number;
}

export interface IRoleLoginHandler {
  readonly priority: number;
  findByEmail(email: string): Promise<AuthLoginEntity | null>;
  login(
    entity: AuthLoginEntity,
    password: string,
    context: AuthLoginContext
  ): Promise<LoginResponseDto | null>;
}

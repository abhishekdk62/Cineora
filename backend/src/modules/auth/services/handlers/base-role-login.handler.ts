import * as bcrypt from "bcryptjs";
import { LoginResponseDto } from "../../dtos/dtos";
import { AuthLoginContext } from "./auth-login.context";
import { AuthLoginEntity, IRoleLoginHandler } from "./role-login.handler.interface";

export abstract class BaseRoleLoginHandler implements IRoleLoginHandler {
  abstract readonly priority: number;

  abstract findByEmail(email: string): Promise<AuthLoginEntity | null>;

  abstract login(
    entity: AuthLoginEntity,
    password: string,
    context: AuthLoginContext
  ): Promise<LoginResponseDto | null>;

  protected async _validatePassword(
    entity: AuthLoginEntity,
    password: string
  ): Promise<LoginResponseDto | null> {
    const isValidPassword = await bcrypt.compare(password, entity.password);
    if (!isValidPassword) {
      return { success: false, message: "Invalid Password" };
    }
    return null;
  }
}

import { LoginResponseDto } from "../../dtos/dtos";
import { AuthLoginContext } from "./auth-login.context";
import { IRoleLoginHandler } from "./role-login.handler.interface";

/**
 * Open/Closed: add a new role by registering a handler — no changes to the chain logic.
 */
export class RoleLoginChain {
  private readonly _handlers: IRoleLoginHandler[];

  constructor(handlers: IRoleLoginHandler[]) {
    this._handlers = [...handlers].sort((a, b) => a.priority - b.priority);
  }

  async login(
    email: string,
    password: string,
    context: AuthLoginContext
  ): Promise<LoginResponseDto> {
    for (const handler of this._handlers) {
      const entity = await handler.findByEmail(email);
      if (!entity) continue;

      const result = await handler.login(entity, password, context);

      if (result) return result;
    }

    return { success: false, message: "Account not found please signup" };
  }
}

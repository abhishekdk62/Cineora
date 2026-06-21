import { IAdminRepository } from "../../../admin/interfaces/admin.repository.interface";
import { LoginResponseDto } from "../../dtos/dtos";
import { BaseRoleLoginHandler } from "./base-role-login.handler";
import { AuthLoginContext } from "./auth-login.context";
import { AuthLoginEntity } from "./role-login.handler.interface";

export class AdminLoginHandler extends BaseRoleLoginHandler {
  readonly priority = 1;

  constructor(private readonly adminRepo: IAdminRepository) {
    super();
  }

  async findByEmail(email: string): Promise<AuthLoginEntity | null> {
    const admin = await this.adminRepo.findByEmail(email);
    return admin as AuthLoginEntity | null;
  }

  async login(
    entity: AuthLoginEntity,
    password: string,
    context: AuthLoginContext
  ): Promise<LoginResponseDto | null> {
    const passwordError = await this._validatePassword(entity, password);
    if (passwordError) return passwordError;

    return context.issueTokens(
      entity,
      "admin",
      {
        id: String(entity._id),
        email: entity.email,
        role: "admin",
      },
      "Admin login successful",
      "/admin/dashboard"
    );
  }
}

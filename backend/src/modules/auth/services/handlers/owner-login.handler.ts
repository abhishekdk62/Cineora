import { IOwnerRepository } from "../../../owner/interfaces/owner.repository.interface";
import { LoginResponseDto } from "../../dtos/dtos";
import { BaseRoleLoginHandler } from "./base-role-login.handler";
import { AuthLoginContext } from "./auth-login.context";
import { AuthLoginEntity } from "./role-login.handler.interface";

export class OwnerLoginHandler extends BaseRoleLoginHandler {
  readonly priority = 2;

  constructor(private readonly ownerRepo: IOwnerRepository) {
    super();
  }

  async findByEmail(email: string): Promise<AuthLoginEntity | null> {
    const owner = await this.ownerRepo.findByEmail(email);
    return owner as AuthLoginEntity | null;
  }

  async login(
    entity: AuthLoginEntity,
    password: string,
    context: AuthLoginContext
  ): Promise<LoginResponseDto | null> {
    const passwordError = await this._validatePassword(entity, password);
    if (passwordError) return passwordError;

    if (!entity.isActive) {
      return {
        success: false,
        message: "Your account has been blocked. Please contact support.",
      };
    }

    if (!entity.isVerified) {
      return { success: false, message: "Your account is not verified yet." };
    }

    const ownerId = String(entity._id);
    await context.onOwnerLogin?.(ownerId);

    return context.issueTokens(
      entity,
      "owner",
      {
        id: ownerId,
        ownerName: entity.ownerName,
        email: entity.email,
        phone: entity.phone,
        isVerified: entity.isVerified,
        isActive: entity.isActive,
        role: "owner",
      },
      "Owner login successful",
      "/owner/dashboard"
    );
  }
}

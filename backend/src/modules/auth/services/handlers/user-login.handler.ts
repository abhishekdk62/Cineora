import { IUserRepository } from "../../../user/interfaces/user.repository.interface";
import { LoginResponseDto } from "../../dtos/dtos";
import { BaseRoleLoginHandler } from "./base-role-login.handler";
import { AuthLoginContext } from "./auth-login.context";
import { AuthLoginEntity } from "./role-login.handler.interface";

export class UserLoginHandler extends BaseRoleLoginHandler {
  readonly priority = 4;

  constructor(private readonly userRepo: IUserRepository) {
    super();
  }

  async findByEmail(email: string): Promise<AuthLoginEntity | null> {
    const user = await this.userRepo.findByEmail(email);
    return user as AuthLoginEntity | null;
  }

  async login(
    entity: AuthLoginEntity,
    password: string,
    context: AuthLoginContext
  ): Promise<LoginResponseDto | null> {
    const passwordError = await this._validatePassword(entity, password);
    if (passwordError) return passwordError;

    if (!entity.isVerified) {
      return {
        success: false,
        message: "Please verify your email before logging in",
      };
    }

    if (!entity.isActive) {
      return {
        success: false,
        message: "Your account has been blocked. Please contact support.",
      };
    }

    const userId = String(entity._id);
    await context.onUserLogin?.(userId);

    return context.issueTokens(
      entity,
      "user",
      {
        id: userId,
        username: entity.username,
        email: entity.email,
        firstName: entity.firstName,
        lastName: entity.lastName,
        isVerified: entity.isVerified,
        xpPoints: entity.xpPoints,
        role: "user",
      },
      "Login successful",
      "/dashboard"
    );
  }
}
  
import { IStaffRepository } from "../../../staff/interfaces/staff.repository.interface";
import { LoginResponseDto } from "../../dtos/dtos";
import { BaseRoleLoginHandler } from "./base-role-login.handler";
import { AuthLoginContext } from "./auth-login.context";
import { AuthLoginEntity } from "./role-login.handler.interface";

export class StaffLoginHandler extends BaseRoleLoginHandler {
  readonly priority = 3;

  constructor(private readonly staffRepo: IStaffRepository) {
    super();
  }

  async findByEmail(email: string): Promise<AuthLoginEntity | null> {
    const staff = await this.staffRepo.findByEmail(email);
    return staff as AuthLoginEntity | null;
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

    return context.issueTokens(
      entity,
      "staff",
      {
        id: String(entity._id),
        firstName: entity.firstName,
        lastName: entity.lastName,
        email: entity.email,
        role: "staff",
      },
      "Staff login successful",
      "/staff/dashboard"
    );
  }
}

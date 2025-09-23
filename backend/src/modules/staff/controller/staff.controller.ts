import { Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  NOTIFICATION_MESSAGES,
  OWNER_MESSAGES,
} from "../../../utils/messages.constants";
import { StatusCodes } from "../../../utils/statuscodes";
import { createResponse } from "../../../utils/createResponse";
import { Staff } from "../model/staff.model";
import { AuthService } from "../../auth/services/auth.service";

export class StaffController {
  constructor() {}

  async createStaff(req: Request, res: Response): Promise<void> {
    try {
      const ownerId = req.owner?.ownerId;
      const { firstName, lastName, email, password, theaterId } = req.body;
      if (!ownerId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: NOTIFICATION_MESSAGES.AUTH_REQUIRED,
          })
        );
        return;
      }

      if (!firstName || !lastName || !email || !password) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: "All fields are required",
          })
        );
        return;
      }

      const existingStaff = await Staff.findOne({ email });
      if (existingStaff) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: "Staff with this email already exists",
          })
        );
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newStaff = await Staff.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        ownerId,
        theaterId: theaterId || null,
        role: "staff",
        isActive: true,
      });

      const staffResponse = {
        id: newStaff._id,
        firstName: newStaff.firstName,
        lastName: newStaff.lastName,
        email: newStaff.email,
        role: newStaff.role,
        isActive: newStaff.isActive,
      };

      res.status(StatusCodes.CREATED).json(
        createResponse({
          success: true,
          message: "Staff created successfully",
          data: { staff: staffResponse },
        })
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : NOTIFICATION_MESSAGES.INTERNAL_SERVER_ERROR;
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: errorMessage,
        })
      );
    }
  }

  private _setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string
  ): void {
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  async getStaffDetails(req: Request, res: Response): Promise<void> {
    try {
      const staffId = req.staff.staffId;
      const staff = await Staff.findById(staffId).populate('ownerId').populate('theaterId')

      res.status(StatusCodes.CREATED).json(
        createResponse({
          success: true,
          message: "Staff Details fetched successfully",
          data: { staff },
        })
      );

      return;
    } catch (error) {}
  }
}

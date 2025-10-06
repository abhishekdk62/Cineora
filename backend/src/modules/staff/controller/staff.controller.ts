import { Request, Response } from "express";
import { StatusCodes } from "../../../utils/statuscodes";
import { createResponse } from "../../../utils/createResponse";
import { NOTIFICATION_MESSAGES, STAFF_MESSAGES } from "../../../utils/messages.constants";
import { CreateStaffDTO, GetAllStaffsQueryDTO } from "../dtos/dtos";
import { IStaffService } from "../interfaces/staff.services.interface";

export class StaffController {
  constructor(private readonly staffService: IStaffService) {}

  async createStaff(req: Request, res: Response): Promise<void> {
    try {
      const ownerId = req.owner?.ownerId;
      const createStaffData: CreateStaffDTO = req.body;
      if (!ownerId) {
        return res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: NOTIFICATION_MESSAGES.AUTH_REQUIRED,
          })
        );
      }
      if (!createStaffData.firstName || !createStaffData.lastName || 
          !createStaffData.email || !createStaffData.password) {
        return res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: "All fields are required",
          })
        );
      }

      const staff = await this.staffService.createStaff(ownerId, createStaffData);
      if(staff=='Exists')
      {
            return res.status(StatusCodes.CONFLICT).json(
        createResponse({
          success: true,
          message: STAFF_MESSAGES.EMAIL_ALREADY_IN_USE,
          data: { staff },
        })
      );
      }

      return res.status(StatusCodes.CREATED).json(
        createResponse({
          success: true,
          message:STAFF_MESSAGES.CREATED_SUCCESSFULLY,
          data: { staff },
        })
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : NOTIFICATION_MESSAGES.INTERNAL_SERVER_ERROR;
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: errorMessage,
        })
      );
    }
  }

  async getStaffDetails(req: Request, res: Response): Promise<void> {
    try {
      const staffId = req.staff.staffId;
      const staff = await this.staffService.getStaffDetails(staffId);

      return res.status(StatusCodes.OK).json(
        createResponse({
          success: true,
          message: "Staff details fetched successfully",
          data: { staff },
        })
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : NOTIFICATION_MESSAGES.INTERNAL_SERVER_ERROR;
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: errorMessage,
        })
      );
    }
  }

  async getAllStaffsPaginated(req: Request, res: Response): Promise<void> {
    try {
      const ownerId = req.owner?.ownerId;
      const queryParams: GetAllStaffsQueryDTO = req.query;

     

      const result = await this.staffService.getAllStaffsPaginated( queryParams,ownerId);

      return res.status(StatusCodes.OK).json(
        createResponse({
          success: true,
          message: "Staffs fetched successfully",
          data: result,
        })
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : NOTIFICATION_MESSAGES.INTERNAL_SERVER_ERROR;
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: errorMessage,
        })
      );
    }
  }

  async toggleStaffStatus(req: Request, res: Response): Promise<void> {
    try {
      const { staffId } = req.params;
      const staff = await this.staffService.toggleStaffStatus(staffId);

      return res.status(StatusCodes.OK).json(
        createResponse({
          success: true,
          message: "Staff status updated successfully",
          data: { staff },
        })
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : NOTIFICATION_MESSAGES.INTERNAL_SERVER_ERROR;
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: errorMessage,
        })
      );
    }
  }

  private _setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
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
}

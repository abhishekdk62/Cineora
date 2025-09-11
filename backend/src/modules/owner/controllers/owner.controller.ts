import { Request, Response } from "express";
import { createResponse } from "../../../utils/createResponse";
import { IOwnerService } from "../interfaces/owner.services.interfaces";
import {
  EmailChangeRequestDto,
  EmailChangeVerificationDto,
  OwnerFilterDto,
  UpdateOwnerProfileDto,
  UpdateToNewPasswordDto,
} from "../dtos/owner.dtos";
import { StatusCodes } from "../../../utils/statuscodes";
import { OWNER_MESSAGES } from "../../../utils/messages.constants";

export class OwnerController {
  constructor(private readonly _ownerService: IOwnerService) {}

  async getOwnerProfile(req: Request, res: Response): Promise<void> {
    try {
      const owner = req.owner;
      const requestId = owner?.ownerId;
      
      if (!requestId) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: OWNER_MESSAGES.REQUEST_ID_REQUIRED,
          })
        );
        return;
      }

      const result = await this._ownerService.getOwnerProfile(requestId);

      if (!result.success) {
        res.status(StatusCodes.NOT_FOUND).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
        return;
      }
      

      res.status(StatusCodes.OK).json(
        createResponse({
          success: true,
          message: result.message,
          data: result.data,
        })
      );
    } catch (error: unknown) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: error instanceof Error ? error.message : OWNER_MESSAGES.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }

  async getOwnerById(req: Request, res: Response): Promise<void> {
    try {
      const { ownerId } = req.params;

      if (!ownerId) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: OWNER_MESSAGES.OWNER_ID_REQUIRED,
          })
        );
        return;
      }

      const result = await this._ownerService.getOwnerById(ownerId);

      if (!result.success) {
        res.status(StatusCodes.NOT_FOUND).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
        return;
      }

      res.status(StatusCodes.OK).json(
        createResponse({
          success: true,
          message: result.message,
          data: result.data,
        })
      );
    } catch (error: unknown) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: error instanceof Error ? error.message : OWNER_MESSAGES.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }

  async updateOwner(req: Request, res: Response): Promise<void> {
    try {
      const { ownerId } = req.owner;
      const updateOwnerProfileDto: UpdateOwnerProfileDto = req.body;

      if (!ownerId) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: OWNER_MESSAGES.OWNER_ID_REQUIRED,
          })
        );
        return;
      }

      const result = await this._ownerService.updateOwner(ownerId, updateOwnerProfileDto);

      if (!result.success) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
        return;
      }

      res.status(StatusCodes.OK).json(
        createResponse({
          success: true,
          message: result.message,
          data: result.data,
        })
      );
    } catch (error: unknown) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: error instanceof Error ? error.message : OWNER_MESSAGES.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }

  async deleteOwner(req: Request, res: Response): Promise<void> {
    try {
      const { ownerId } = req.params;

      if (!ownerId) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: OWNER_MESSAGES.OWNER_ID_REQUIRED,
          })
        );
        return;
      }

      const result = await this._ownerService.deleteOwner(ownerId);

      if (!result.success) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
        return;
      }

      res.status(StatusCodes.OK).json(
        createResponse({
          success: true,
          message: result.message,
        })
      );
    } catch (error: unknown) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: error instanceof Error ? error.message : OWNER_MESSAGES.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }

  async sendEmailChangeOtp(req: Request, res: Response): Promise<void> {
    try {
      const { ownerId } = req.owner;
      const emailChangeRequestDto: EmailChangeRequestDto = req.body;

      if (!emailChangeRequestDto.newEmail || !emailChangeRequestDto.password) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: OWNER_MESSAGES.NEW_EMAIL_PASSWORD_REQUIRED,
          })
        );
        return;
      }

      const result = await this._ownerService.sendEmailChangeOtp(
        ownerId,
        emailChangeRequestDto.newEmail,
        emailChangeRequestDto.password
      );

      if (!result.success) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
        return;
      }

      res.status(StatusCodes.OK).json(
        createResponse({
          success: true,
          message: result.message,
          data: result.data,
        })
      );
    } catch (error: unknown) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: error instanceof Error ? error.message : OWNER_MESSAGES.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }

  async verifyEmailChangeOtp(req: Request, res: Response): Promise<void> {
    try {
      const { ownerId } = req.owner;
      const emailChangeVerificationDto: EmailChangeVerificationDto = req.body;

      if (!emailChangeVerificationDto.email || !emailChangeVerificationDto.otp) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: OWNER_MESSAGES.EMAIL_OTP_REQUIRED,
          })
        );
        return;
      }

      const result = await this._ownerService.verifyEmailChangeOtp(
        ownerId,
        emailChangeVerificationDto.email,
        emailChangeVerificationDto.otp
      );

      if (!result.success) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
        return;
      }

      res.status(StatusCodes.OK).json(
        createResponse({
          success: true,
          message: result.message,
          data: result.data,
        })
      );
    } catch (error: unknown) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: error instanceof Error ? error.message : OWNER_MESSAGES.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }

  async resetOwnerPassword(req: Request, res: Response): Promise<void> {
    try {
      const { ownerId } = req.owner;
      const updatePasswordDto: UpdateToNewPasswordDto = req.body;

      if (!ownerId) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: OWNER_MESSAGES.OWNER_ID_REQUIRED,
          })
        );
        return;
      }

      if (!updatePasswordDto.newPassword || !updatePasswordDto.oldPassword) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: OWNER_MESSAGES.PASSWORDS_REQUIRED,
          })
        );
        return;
      }

      const result = await this._ownerService.changeOwnerPassword(
        ownerId,
        updatePasswordDto.oldPassword,
        updatePasswordDto.newPassword
      );

      if (!result.success) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
        return;
      }

      res.status(StatusCodes.OK).json(
        createResponse({
          success: true,
          message: OWNER_MESSAGES.PASSWORD_UPDATED_SUCCESS,
        })
      );
    } catch (error: unknown) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: error instanceof Error ? error.message : OWNER_MESSAGES.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }

  async getOwnerCounts(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._ownerService.getOwnerCounts();

      res.status(StatusCodes.OK).json(
        createResponse({
          success: result.success,
          message: result.message,
          data: result.data,
        })
      );
    } catch (error: unknown) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: error instanceof Error ? error.message : OWNER_MESSAGES.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }

  async getOwners(req: Request, res: Response): Promise<void> {
    try {
      const filters: OwnerFilterDto = {
        search: req.query.search as string,
        status: req.query.status as string,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as "asc" | "desc",
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
      };

      const result = await this._ownerService.getOwners(filters);

      res.status(StatusCodes.OK).json(
        createResponse({
          success: result.success,
          message: result.message,
          data: result.data,
        })
      );
    } catch (error: unknown) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: error instanceof Error ? error.message : OWNER_MESSAGES.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }

  async toggleOwnerStatus(req: Request, res: Response): Promise<void> {
    try {
      const { ownerId } = req.params;

      if (!ownerId) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: OWNER_MESSAGES.OWNER_ID_REQUIRED,
          })
        );
        return;
      }

      const result = await this._ownerService.toggleOwnerStatus(ownerId);

      if (!result.success) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
        return;
      }

      res.status(StatusCodes.OK).json(
        createResponse({
          success: true,
          message: result.message,
          data: result.data,
        })
      );
    } catch (error: unknown) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: error instanceof Error ? error.message : OWNER_MESSAGES.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }
}

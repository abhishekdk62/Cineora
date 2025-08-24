import { Request, Response, NextFunction } from "express";
import { createResponse } from "../../../utils/createResponse";
import { IOwnerService } from "../interfaces/owner.services.interfaces";
import {
  EmailChangeRequestDto,
  EmailChangeVerificationDto,
  OwnerFilterDto,
  UpdateOwnerProfileDto,
  UpdateToNewPasswordDto,
} from "../dtos/owner.dtos";
import { ServiceResponse } from "../../../interfaces/interface";

export class OwnerController {
  constructor(private readonly ownerService: IOwnerService) {}

  async getOwnerProfile(req: Request, res: Response): Promise<any> {
    try {
      const owner = req.owner;
      const requestId = owner.ownerId;
      if (!requestId) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "Request ID is required",
          })
        );
      }

      const result = await this.ownerService.getOwnerProfile(requestId);

      if (!result.success) {
        return res.status(404).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }

      return res.status(200).json(
        createResponse({
          success: true,
          message: result.message,
          data: result.data,
        })
      );
    } catch (err) {
      res.status(500).json(
        createResponse({
          success: false,
          message: err.message,
        })
      );
    }
  }

  async getOwnerById(req: Request, res: Response): Promise<any> {
    try {
      const { ownerId } = req.params;

      if (!ownerId) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "Owner ID is required",
          })
        );
      }

      const result = await this.ownerService.getOwnerById(ownerId);

      if (!result.success) {
        return res.status(404).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }

      return res.status(200).json(
        createResponse({
          success: true,
          message: result.message,
          data: result.data,
        })
      );
    } catch (err) {
      res.status(500).json(
        createResponse({
          success: false,
          message: err.message,
        })
      );
    }
  }

  async updateOwner(req: Request, res: Response): Promise<any> {
    try {
      const { ownerId } = req.owner;
      const updateOwnerProfileDto: UpdateOwnerProfileDto = req.body;

      if (!ownerId) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "Owner ID is required",
          })
        );
      }
      const result = await this.ownerService.updateOwner(
        ownerId,
        updateOwnerProfileDto
      );

      if (!result.success) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }

      return res.status(200).json(
        createResponse({
          success: true,
          message: result.message,
          data: result.data,
        })
      );
    } catch (err) {
      res.status(500).json(
        createResponse({
          success: false,
          message: err.message,
        })
      );
    }
  }

  async deleteOwner(req: Request, res: Response): Promise<any> {
    try {
      const { ownerId } = req.params;

      if (!ownerId) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "Owner ID is required",
          })
        );
      }

      const result = await this.ownerService.deleteOwner(ownerId);

      if (!result.success) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }

      return res.status(200).json(
        createResponse({
          success: true,
          message: result.message,
        })
      );
    } catch (err) {
      res.status(500).json(
        createResponse({
          success: false,
          message: err.message,
        })
      );
    }
  }

  async sendEmailChangeOtp(req: Request, res: Response): Promise<any> {
    try {
      const { ownerId } = req.owner;
      const emailChangeRequestDto: EmailChangeRequestDto = req.body; 

      if (!emailChangeRequestDto.newEmail || !emailChangeRequestDto.password) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "New email and password required",
          })
        );
      }
      const result = await this.ownerService.sendEmailChangeOtp(
        ownerId,
        emailChangeRequestDto.newEmail,
        emailChangeRequestDto.password
      );

      if (!result.success) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }

      return res.status(200).json(
        createResponse({
          success: true,
          message: result.message,
          data: result.data,
        })
      );
    } catch (error) {
      res.status(500).json(
        createResponse({
          success: false,
          message: error.message,
        })
      );
    }
  }

  async verifyEmailChangeOtp(req: Request, res: Response): Promise<any> {
    try {
      const { ownerId } = req.owner;
      const emailChangeVerificationDto: EmailChangeVerificationDto = req.body; 

      if (
        !emailChangeVerificationDto.email ||
        !emailChangeVerificationDto.otp
      ) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "Email and OTP are required",
          })
        );
      }
      const result = await this.ownerService.verifyEmailChangeOtp(
        ownerId,
        emailChangeVerificationDto.email,
        emailChangeVerificationDto.otp
      );

      if (!result.success) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }

      return res.status(200).json(
        createResponse({
          success: true,
          message: result.message,
          data: result.data,
        })
      );
    } catch (error) {
      res.status(500).json(
        createResponse({
          success: false,
          message: error.message,
        })
      );
    }
  }

  async resetOwnerPassword(req: Request, res: Response): Promise<any> {
    try {
      const { ownerId } = req.owner;
      const updatePasswordDto: UpdateToNewPasswordDto = req.body;

      if (!ownerId) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "Owner Id is not provided",
          })
        );
      }
      if (!updatePasswordDto.newPassword || !updatePasswordDto.oldPassword) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "New password and old password are required",
          })
        );
      }
      const result = await this.ownerService.changeOwnerPassword(
        ownerId,
        updatePasswordDto.oldPassword,
        updatePasswordDto.newPassword
      );

      if (!result.success) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }

      return res.status(200).json(
        createResponse({
          success: true,
          message: "Password updated succusfully",
        })
      );
    } catch (error) {
      res.status(500).json(
        createResponse({
          success: false,
          message: error.message,
        })
      );
    }
  }

  async getOwnerCounts(req: Request, res: Response): Promise<any> {
    try {
      const result = await this.ownerService.getOwnerCounts();

      return res.status(200).json(
        createResponse({
          success: result.success,
          message: result.message,
          data: result.data,
        })
      );
    } catch (err) {
      res.status(500).json(
        createResponse({
          success: false,
          message: err.message,
        })
      );
    }
  }

  async getOwners(req: Request, res: Response): Promise<any> {
    try {
      const filters = req.query as unknown as OwnerFilterDto
      const result = await this.ownerService.getOwners(filters);
      return res.status(200).json(
        createResponse({
          success: result.success,
          message: result.message,
          data: result.data,
        })
      );
    } catch (err) {
      res.status(500).json(
        createResponse({
          success: false,
          message: err.message,
        })
      );
    }
  }

  async toggleOwnerStatus(req: Request, res: Response): Promise<any> {
    try {
      const { ownerId } = req.params;

      if (!ownerId) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "Owner ID is required",
          })
        );
      }

      const result = await this.ownerService.toggleOwnerStatus(ownerId);

      if (!result.success) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }

      return res.status(200).json(
        createResponse({
          success: true,
          message: result.message,
          data: result.data,
        })
      );
    } catch (err) {
      res.status(500).json(
        createResponse({
          success: false,
          message: err.message,
        })
      );
    }
  }
}

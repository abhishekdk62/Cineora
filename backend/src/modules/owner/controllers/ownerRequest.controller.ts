import { Request, Response, NextFunction } from "express";

import { createResponse } from "../../../utils/createResponse";
import { IOwnerRequestService } from "../interfaces/owner.services.interfaces";
import {
  GetAllRequestsDto,
  SendOTPDto,
  SubmitKYCDto,
  UpdateRequestStatusDto,
  VerifyOTPDto,
} from "../dtos/owner.dtos";

export class OwnerRequestController {
  constructor(private readonly ownerRequestService: IOwnerRequestService) {}

  async sendOTP(req: Request, res: Response): Promise<any> {
    try {
      const sendOTPDto: SendOTPDto = req.body;

      if (!sendOTPDto.email) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "Email is required",
          })
        );
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(sendOTPDto.email)) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "Please enter a valid email address",
          })
        );
      }
      const result = await this.ownerRequestService.sendOTP(sendOTPDto.email);

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

  async verifyOTP(req: Request, res: Response): Promise<any> {
    try {
      const verifyOTPDto: VerifyOTPDto = req.body;

      if (!verifyOTPDto.email || !verifyOTPDto.otp) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "Email and OTP are required",
          })
        );
      }

      if (!/^\d{6}$/.test(verifyOTPDto.otp)) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "OTP must be a 6-digit number",
          })
        );
      }
      console.log('going to berify');
      
      const result = await this.ownerRequestService.verifyOTP(
        verifyOTPDto.email,
        verifyOTPDto.otp
      );
      console.log('after to berify');

      if (!result.success) {
      console.log('we fd up berify');

        return res.status(400).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }
      console.log('no run berify');

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

  async submitKYC(req: Request, res: Response): Promise<any> {
    try {
      const ownerData = req.body;
      const submitKYCDto: SubmitKYCDto = req.body;

      const requiredFields = [
        "ownerName",
        "phone",
        "email",
        "aadhaar",
        "pan",
        "aadhaarUrl",
        "panUrl",
        "declaration",
        "agree",
      ];

      for (const field of requiredFields) {
        if (!ownerData[field]) {
          return res.status(400).json(
            createResponse({
              success: false,
              message: `${field} is required`,
            })
          );
        }
      }

      if (ownerData.declaration !== true || ownerData.agree !== true) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "Declaration and agreement must be accepted",
          })
        );
      }
      const result = await this.ownerRequestService.submitKYC(submitKYCDto);

      if (!result.success) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }

      return res.status(201).json(
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

  async getRequestStatus(req: Request, res: Response): Promise<any> {
    try {
      const { requestId } = req.params;

      if (!requestId) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "Request ID is required",
          })
        );
      }

      const result = await this.ownerRequestService.getRequestStatus(requestId);

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



  async getAllRequests(req: Request, res: Response): Promise<any> {
    try {
      const getAllRequestsDto: GetAllRequestsDto = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        status: req.query.status as string,
      };
      const result = await this.ownerRequestService.getAllRequests(
        getAllRequestsDto.page,
        getAllRequestsDto.limit,
        getAllRequestsDto.status
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

  async updateRequestStatus(req: Request, res: Response): Promise<any> {
    try {
      const { requestId } = req.params;
      const updateRequestStatusDto: UpdateRequestStatusDto = req.body;

      if (!requestId) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "Request ID is required",
          })
        );
      }

      if (!updateRequestStatusDto.status) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "Status is required",
          })
        );
      }
      const result = await this.ownerRequestService.updateRequestStatus(
        requestId,
        updateRequestStatusDto.status,
        updateRequestStatusDto.reviewedBy,
        updateRequestStatusDto.rejectionReason
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

  async getOwnerRequests(req: Request, res: Response): Promise<any> {
    try {
      const filters = req.query;
      const result = await this.ownerRequestService.getOwnerRequests(filters);

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

  async acceptOwnerRequest(req: Request, res: Response): Promise<any> {
    try {
      const { requestId } = req.params;
      const adminId = req.admin.adminId;

      if (!requestId) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "Request ID is required",
          })
        );
      }

      if (!adminId) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "Admin authentication required",
          })
        );
      }

      const result = await this.ownerRequestService.updateRequestStatus(
        requestId,
        "approved",
        adminId
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

  async rejectOwnerRequest(req: Request, res: Response): Promise<any> {
    try {
      const { requestId } = req.params;
      const { rejectionReason } = req.body;
      const adminId = req.admin.adminId;

      if (!requestId) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "Request ID is required",
          })
        );
      }

      if (!rejectionReason) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "Rejection reason is required",
          })
        );
      }

      if (!adminId) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "Admin authentication required",
          })
        );
      }

      const result = await this.ownerRequestService.updateRequestStatus(
        requestId,
        "rejected",
        adminId,
        rejectionReason
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

    async uploadFile(req: Request, res: Response): Promise<any> {
    try {
      if (!req.file) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "No file uploaded",
          })
        );
      }

      const { folder } = req.body;
      
      if (!folder) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "Folder parameter is required",
          })
        );
      }

      const uploadFileDto = {
        file: req.file,
        folder: folder,
      };

      const result = await this.ownerRequestService.uploadFile(uploadFileDto);

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
          message: err.message || "File upload failed",
        })
      );
    }
  }

  async uploadMultipleFiles(req: Request, res: Response): Promise<any> {
    try {
      if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "No files uploaded",
          })
        );
      }

      const { folder } = req.body;
      
      if (!folder) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "Folder parameter is required",
          })
        );
      }

      const uploadMultipleDto = {
        files: req.files as Express.Multer.File[],
        folder: folder,
      };

      const result = await this.ownerRequestService.uploadMultipleFiles(uploadMultipleDto);

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
          message: err.message || "Multiple file upload failed",
        })
      );
    }
  }

  async getSignedUrl(req: Request, res: Response): Promise<any> {
    try {
      const { publicId, width, height, crop } = req.body;
      
      if (!publicId) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "Public ID is required",
          })
        );
      }

      const signedUrlDto = {
        publicId,
        width,
        height,
        crop,
      };

      const result = await this.ownerRequestService.generateSignedUrl(signedUrlDto);

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
          message: err.message || "Failed to generate signed URL",
        })
      );
    }
  }
}



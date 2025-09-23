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
import { StatusCodes } from "../../../utils/statuscodes";
import { OWNER_REQUEST_MESSAGES } from "../../../utils/messages.constants";

export class OwnerRequestController {
  constructor(private readonly _ownerRequestService: IOwnerRequestService) {}

  async sendOTP(req: Request, res: Response): Promise<void> {
    try {
      const sendOTPDto: SendOTPDto = req.body;

      if (!sendOTPDto.email) {
        return res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: OWNER_REQUEST_MESSAGES.EMAIL_REQUIRED,
          })
        );
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(sendOTPDto.email)) {
        return res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: OWNER_REQUEST_MESSAGES.INVALID_EMAIL,
          })
        );
      }
      const result = await this._ownerRequestService.sendOTP(sendOTPDto.email);

      if (!result.success) {
        return res.status(StatusCodes.NOT_FOUND).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }

      return res.status(StatusCodes.OK).json(
        createResponse({
          success: true,
          message: result.message,
        })
      );
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: err.message,
        })
      );
    }
  }

  async verifyOTP(req: Request, res: Response): Promise<void> {
    try {
      const verifyOTPDto: VerifyOTPDto = req.body;

      if (!verifyOTPDto.email || !verifyOTPDto.otp) {
        return res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: OWNER_REQUEST_MESSAGES.EMAIL_OTP_REQUIRED,
          })
        );
      }

      if (!/^\d{6}$/.test(verifyOTPDto.otp)) {
        return res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: OWNER_REQUEST_MESSAGES.INVALID_OTP_FORMAT,
          })
        );
      }
      console.log('going to berify');
      
      const result = await this._ownerRequestService.verifyOTP(
        verifyOTPDto.email,
        verifyOTPDto.otp
      );
 

      if (!result.success) {
  

        return res.status(StatusCodes.NOT_FOUND).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }


      return res.status(StatusCodes.OK).json(
        createResponse({
          success: true,
          message: result.message,
        })
      );
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: err.message,
        })
      );
    }
  }

  async submitKYC(req: Request, res: Response): Promise<void> {
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
          return res.status(StatusCodes.BAD_REQUEST).json(
            createResponse({
              success: false,
              message: OWNER_REQUEST_MESSAGES.FIELD_REQUIRED(field),
            })
          );
        }
      }

      if (ownerData.declaration !== true || ownerData.agree !== true) {
        return res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: OWNER_REQUEST_MESSAGES.DECLARATION_AGREEMENT_REQUIRED,
          })
        );
      }
      const result = await this._ownerRequestService.submitKYC(submitKYCDto);

      if (!result.success) {
        return res.status(StatusCodes.NOT_FOUND).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }

      return res.status(StatusCodes.CREATED).json(
        createResponse({
          success: true,
          message: result.message,
          data: result.data,
        })
      );
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: err.message,
        })
      );
    }
  }

  async getRequestStatus(req: Request, res: Response): Promise<void> {
    try {
      const { requestId } = req.params;

      if (!requestId) {
        return res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: OWNER_REQUEST_MESSAGES.REQUEST_ID_REQUIRED,
          })
        );
      }

      const result = await this._ownerRequestService.getRequestStatus(requestId);

      if (!result.success) {
        return res.status(StatusCodes.NOT_FOUND).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }

      return res.status(StatusCodes.OK).json(
        createResponse({
          success: true,
          message: result.message,
          data: result.data,
        })
      );
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: err.message,
        })
      );
    }
  }



  async getAllRequests(req: Request, res: Response): Promise<void> {
    try {
      const getAllRequestsDto: GetAllRequestsDto = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        status: req.query.status as string,
      };
      const result = await this._ownerRequestService.getAllRequests(
        getAllRequestsDto.page,
        getAllRequestsDto.limit,
        getAllRequestsDto.status
      );

      if (!result.success) {
        return res.status(StatusCodes.NOT_FOUND).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }

      return res.status(StatusCodes.OK).json(
        createResponse({
          success: true,
          message: result.message,
          data: result.data,
        })
      );
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: err.message,
        })
      );
    }
  }

  async updateRequestStatus(req: Request, res: Response): Promise<void> {
    try {
      const { requestId } = req.params;
      const updateRequestStatusDto: UpdateRequestStatusDto = req.body;

      if (!requestId) {
        return res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: OWNER_REQUEST_MESSAGES.REQUEST_ID_REQUIRED,
          })
        );
      }

      if (!updateRequestStatusDto.status) {
        return res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: OWNER_REQUEST_MESSAGES.STATUS_REQUIRED,
          })
        );
      }
      const result = await this._ownerRequestService.updateRequestStatus(
        requestId,
        updateRequestStatusDto.status,
        updateRequestStatusDto.reviewedBy,
        updateRequestStatusDto.rejectionReason
      );

      if (!result.success) {
        return res.status(StatusCodes.NOT_FOUND).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }

      return res.status(StatusCodes.OK).json(
        createResponse({
          success: true,
          message: result.message,
          data: result.data,
        })
      );
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: err.message,
        })
      );
    }
  }

  async getOwnerRequests(req: Request, res: Response): Promise<void> {
    try {
      const filters = req.query;
      const result = await this._ownerRequestService.getOwnerRequests(filters);

      if (!result.success) {
        return res.status(StatusCodes.NOT_FOUND).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }

      return res.status(StatusCodes.OK).json(
        createResponse({
          success: true,
          message: result.message,
          data: result.data,
        })
      );
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: err.message,
        })
      );
    }
  }

  async acceptOwnerRequest(req: Request, res: Response): Promise<void> {
    try {
      const { requestId } = req.params;
      const adminId = req.admin.adminId;

      if (!requestId) {
        return res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: OWNER_REQUEST_MESSAGES.REQUEST_ID_REQUIRED,
          })
        );
      }

      if (!adminId) {
        return res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: OWNER_REQUEST_MESSAGES.ADMIN_AUTH_REQUIRED,
          })
        );
      }

      const result = await this._ownerRequestService.updateRequestStatus(
        requestId,
        "approved",
        adminId
      );

      if (!result.success) {
        return res.status(StatusCodes.NOT_FOUND).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }

      return res.status(StatusCodes.OK).json(
        createResponse({
          success: true,
          message: result.message,
          data: result.data,
        })
      );
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: err.message,
        })
      );
    }
  }

  async rejectOwnerRequest(req: Request, res: Response): Promise<void> {
    try {
      const { requestId } = req.params;
      const { rejectionReason } = req.body;
      const adminId = req.admin.adminId;

      if (!requestId) {
        return res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: OWNER_REQUEST_MESSAGES.REQUEST_ID_REQUIRED,
          })
        );
      }

      if (!rejectionReason) {
        return res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: OWNER_REQUEST_MESSAGES.REJECTION_REASON_REQUIRED,
          })
        );
      }

      if (!adminId) {
        return res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: OWNER_REQUEST_MESSAGES.ADMIN_AUTH_REQUIRED,
          })
        );
      }

      const result = await this._ownerRequestService.updateRequestStatus(
        requestId,
        "rejected",
        adminId,
        rejectionReason
      );

      if (!result.success) {
        return res.status(StatusCodes.NOT_FOUND).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }

      return res.status(StatusCodes.OK).json(
        createResponse({
          success: true,
          message: result.message,
          data: result.data,
        })
      );
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: err.message,
        })
      );
    }
  }

    async uploadFile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        return res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: OWNER_REQUEST_MESSAGES.NO_FILE_UPLOADED,
          })
        );
      }

      const { folder } = req.body;
      
      if (!folder) {
        return res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: OWNER_REQUEST_MESSAGES.FOLDER_REQUIRED,
          })
        );
      }

      const uploadFileDto = {
        file: req.file,
        folder: folder,
      };

      const result = await this._ownerRequestService.uploadFile(uploadFileDto);

      if (!result.success) {
        return res.status(StatusCodes.NOT_FOUND).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }

      return res.status(StatusCodes.OK).json(
        createResponse({
          success: true,
          message: result.message,
          data: result.data,
        })
      );
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: err.message || OWNER_REQUEST_MESSAGES.FILE_UPLOAD_FAILED,
        })
      );
    }
  }

  async uploadMultipleFiles(req: Request, res: Response): Promise<void> {
    try {
      if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
        return res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: OWNER_REQUEST_MESSAGES.NO_FILES_UPLOADED,
          })
        );
      }

      const { folder } = req.body;
      
      if (!folder) {
        return res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: OWNER_REQUEST_MESSAGES.FOLDER_REQUIRED,
          })
        );
      }

      const uploadMultipleDto = {
        files: req.files as Express.Multer.File[],
        folder: folder,
      };

      const result = await this._ownerRequestService.uploadMultipleFiles(uploadMultipleDto);

      if (!result.success) {
        return res.status(StatusCodes.NOT_FOUND).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }

      return res.status(StatusCodes.OK).json(
        createResponse({
          success: true,
          message: result.message,
          data: result.data,
        })
      );
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: err.message || OWNER_REQUEST_MESSAGES.MULTIPLE_UPLOAD_FAILED,
        })
      );
    }
  }

  async getSignedUrl(req: Request, res: Response): Promise<void> {
    try {
      const { publicId, width, height, crop } = req.body;
      
      if (!publicId) {
        return res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: OWNER_REQUEST_MESSAGES.PUBLIC_ID_REQUIRED,
          })
        );
      }

      const signedUrlDto = {
        publicId,
        width,
        height,
        crop,
      };

      const result = await this._ownerRequestService.generateSignedUrl(signedUrlDto);

      if (!result.success) {
        return res.status(StatusCodes.NOT_FOUND).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }

      return res.status(StatusCodes.OK).json(
        createResponse({
          success: true,
          message: result.message,
          data: result.data,
        })
      );
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: err.message || OWNER_REQUEST_MESSAGES.SIGNED_URL_FAILED,
        })
      );
    }
  }
}



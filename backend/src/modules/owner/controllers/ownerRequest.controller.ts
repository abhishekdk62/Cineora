import { Request, Response, NextFunction } from "express";

import { createResponse } from "../../../utils/createResponse";
import { OwnerRequestService } from "../services/ownerRequest.service";
import { IOwnerRequestService } from "../interfaces/owner.interface";

export class OwnerRequestController {
  constructor(private readonly ownerRequestService: IOwnerRequestService) {}

  async sendOTP(req: Request, res: Response, ) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "Email is required",
          })
        );
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "Please enter a valid email address",
          })
        );
      }

      const result = await this.ownerRequestService.sendOTP(email);

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
        )
    }
  }

  async verifyOTP(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "Email and OTP are required",
          })
        );
      }

      if (!/^\d{6}$/.test(otp)) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "OTP must be a 6-digit number",
          })
        );
      }

      const result = await this.ownerRequestService.verifyOTP(email, otp);

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
        )
    }
  }

  async submitKYC(req: Request, res: Response) {
    try {
      const ownerData = req.body;

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

      const result = await this.ownerRequestService.submitKYC(ownerData);

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
        )
    }
  }

  async getRequestStatus(req: Request, res: Response) {
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
        )
    }
  }

  async getAllRequests(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, status } = req.query;

      const result = await this.ownerRequestService.getAllRequests(
        Number(page),
        Number(limit),
        status as string
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
        )
    }
  }

  async updateRequestStatus(req: Request, res: Response) {
    try {
      const { requestId } = req.params;
      const { status, reviewedBy, rejectionReason } = req.body;

      if (!requestId) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "Request ID is required",
          })
        );
      }

      if (!status) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "Status is required",
          })
        );
      }

      const result = await this.ownerRequestService.updateRequestStatus(
        requestId,
        status,
        reviewedBy,
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
        )
    }
  }

  async getOwnerRequests(req: Request, res: Response) {
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
        )
    }
  }

  async acceptOwnerRequest(req: Request, res: Response) {
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
        )
    }
  }

  async rejectOwnerRequest(req: Request, res: Response) {
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
        )
    }
  }
}

import { Request, Response } from "express";
import { ICouponService } from "../interfaces/coupons.service.interface";
import {
  CreateCouponDto,
  ToggleStatusDto,
  UpdateCouponDto,
  ValidateCouponDto,
  ValidateCouponDtoNew,
} from "../dtos/dto";
import { StatusCodes } from "../../../utils/statuscodes";
import { COUPON_MESSAGES } from "../../../utils/messages.constants";
import { createResponse } from "../../../utils/createResponse";
import { Types } from "mongoose";

interface AuthenticatedRequest extends Request {
  user?: { id: string; role?: string };
  owner?: { ownerId: string; role?: string };
  admin?: { adminId: string; role?: string };
}

export class CouponController {
  constructor(private readonly couponService: ICouponService) {}

  async createCoupon(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const ownerId = req.owner?.ownerId;

      if (!ownerId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: COUPON_MESSAGES.OWNER_AUTH_REQUIRED,
          })
        );
        return;
      }

      const {
        name,
        uniqueId,
        theaterIds,
        discountPercentage,
        description,
        expiryDate,
        maxUsageCount,
        theaterNames,
        minAmount
      } = req.body;

      const createDto: CreateCouponDto = {
        name,
        uniqueId,
        theaterIds: theaterIds.map((id: string) => new Types.ObjectId(id)),
        discountPercentage,
        description,
        expiryDate: new Date(expiryDate),
        maxUsageCount: maxUsageCount || 1,
        createdBy: new Types.ObjectId(ownerId),
        theaterNames,
        minAmount
      };

      const result = await this.couponService.createCoupon(createDto);

      if (result.success) {
        res.status(StatusCodes.CREATED).json(result);
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(result);
      }
    } catch (error: unknown) {
      this._handleControllerError(
        res,
        error,
        COUPON_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async validateCouponByCode(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(StatusCodes.UNAUTHORIZED).json(
        createResponse({
          success: false,
          message: COUPON_MESSAGES.USER_AUTH_REQUIRED,
        })
      );
      return;
    }

    const { couponCode, theaterId } = req.body;

    if (!couponCode || !theaterId) {
      res.status(StatusCodes.BAD_REQUEST).json(
        createResponse({
          success: false,
          message: "Coupon code and theater ID are required",
        })
      );
      return;
    }

    const validateDto: ValidateCouponDtoNew = {
      couponCode: couponCode.trim().toUpperCase(),
      theaterId: new Types.ObjectId(theaterId),
    };

    const result = await this.couponService.validateCouponByCode(validateDto);

    if (result.success) {
      res.status(StatusCodes.OK).json(result);
    } else {
      res.status(StatusCodes.BAD_REQUEST).json(result);
    }
  } catch (error: unknown) {
    this._handleControllerError(
      res,
      error,
      COUPON_MESSAGES.INTERNAL_SERVER_ERROR
    );
  }
  }
  async updateCoupon(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const ownerId = req.owner?.ownerId;
      const { couponId } = req.params;
      if (!ownerId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: COUPON_MESSAGES.OWNER_AUTH_REQUIRED,
          })
        );
        return;
      }
      if (!Types.ObjectId.isValid(couponId)) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: COUPON_MESSAGES.INVALID_COUPON_ID,
          })
        );
        return;
      }
      const updateDto: UpdateCouponDto = { ...req.body };
      if (updateDto.theaterIds && Array.isArray(updateDto.theaterIds)) {
        updateDto.theaterIds = (updateDto.theaterIds as any[]).map(
          (id: string) => new Types.ObjectId(id)
        );
      }
      if (updateDto.expiryDate) {
        updateDto.expiryDate = new Date(updateDto.expiryDate);
      }
      const result = await this.couponService.updateCoupon(
        new Types.ObjectId(couponId),
        updateDto
      );
      if (result.success) {
        res.status(StatusCodes.OK).json(result);
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(result);
      }
    } catch (error: unknown) {
      this._handleControllerError(
        res,
        error,
        COUPON_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }
  async toggleStatusCoupon(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const ownerId = req.owner?.ownerId||req.admin?.adminId;
      const { couponId } = req.params;
      if (!ownerId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: COUPON_MESSAGES.OWNER_AUTH_REQUIRED,
          })
        );
        return;
      }
      if (!Types.ObjectId.isValid(couponId)) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: COUPON_MESSAGES.INVALID_COUPON_ID,
          })
        );
        return;
      }
      const updateDto: ToggleStatusDto = { ...req.body };
      console.log(updateDto);
      
      const result = await this.couponService.updateCoupon(
        new Types.ObjectId(couponId),
        updateDto
      );
      if (result.success) {
        res.status(StatusCodes.OK).json(result);
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(result);
      }
    } catch (error: unknown) {
      this._handleControllerError(
        res,
        error,
        COUPON_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }
  async deleteCoupon(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const ownerId = req.owner?.ownerId;
      const { couponId } = req.params;

      if (!ownerId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: COUPON_MESSAGES.OWNER_AUTH_REQUIRED,
          })
        );
        return;
      }

      if (!Types.ObjectId.isValid(couponId)) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: COUPON_MESSAGES.INVALID_COUPON_ID,
          })
        );
        return;
      }

      const result = await this.couponService.deleteCoupon(
        new Types.ObjectId(couponId),
        new Types.ObjectId(ownerId)
      );

      if (result.success) {
        res.status(StatusCodes.OK).json(result);
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(result);
      }
    } catch (error: unknown) {
      this._handleControllerError(
        res,
        error,
        COUPON_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }
  async getCouponById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { couponId } = req.params;

      if (!Types.ObjectId.isValid(couponId)) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: COUPON_MESSAGES.INVALID_COUPON_ID,
          })
        );
        return;
      }

      const result = await this.couponService.getCouponById(
        new Types.ObjectId(couponId)
      );

      if (result.success) {
        res.status(StatusCodes.OK).json(result);
      } else {
        res.status(StatusCodes.NOT_FOUND).json(result);
      }
    } catch (error: unknown) {
      this._handleControllerError(
        res,
        error,
        COUPON_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }
  async getAllCoupons(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      let ownerId: Types.ObjectId | undefined;

      if (req.owner?.ownerId) {
        ownerId = new Types.ObjectId(req.owner.ownerId);
      }

      if (req.admin?.adminId && req.query.ownerId) {
        ownerId = new Types.ObjectId(req.query.ownerId as string);
      }

      const result = await this.couponService.getAllCoupons(
        page,
        limit,
        ownerId
      );

      if (result.success) {
        res.status(StatusCodes.OK).json(result);
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(result);
      }
    } catch (error: unknown) {
      this._handleControllerError(
        res,
        error,
        COUPON_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }
 async getCouponsByTheaterId(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { theaterId } = req.params;

    if (!Types.ObjectId.isValid(theaterId)) {
      res.status(StatusCodes.BAD_REQUEST).json(createResponse({
        success: false,
        message: "Invalid theater ID",
      }));
      return;
    }

    const result = await this.couponService.getCouponsByTheaterId(new Types.ObjectId(theaterId));
    
    if (result.success) {
      res.status(StatusCodes.OK).json(result);
    } else {
      res.status(StatusCodes.BAD_REQUEST).json(result);
    }
  } catch (error: unknown) {
    this._handleControllerError(res, error, COUPON_MESSAGES.INTERNAL_SERVER_ERROR);
  }
  }
 async validateAndUseCoupon(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(StatusCodes.UNAUTHORIZED).json(
        createResponse({
          success: false,
          message: COUPON_MESSAGES.USER_AUTH_REQUIRED,
        })
      );
      return;
    }

    const { uniqueId, theaterId, totalAmount } = req.body;

    if (!uniqueId || !theaterId || !totalAmount) {
      res.status(StatusCodes.BAD_REQUEST).json(
        createResponse({
          success: false,
          message: COUPON_MESSAGES.VALIDATION_DATA_REQUIRED,
        })
      );
      return;
    }

    const validateDto: ValidateCouponDto = {
      uniqueId,
      theaterId: new Types.ObjectId(theaterId), // Single theater ID, not array
      totalAmount,
      userId: new Types.ObjectId(userId),
    };

    const result = await this.couponService.validateAndUseCoupon(validateDto);

    if (result.success) {
      res.status(StatusCodes.OK).json(result);
    } else {
      res.status(StatusCodes.BAD_REQUEST).json(result);
    }
  } catch (error: unknown) {
    this._handleControllerError(
      res,
      error,
      COUPON_MESSAGES.INTERNAL_SERVER_ERROR
    );
  }
  }
  async getCouponsByOwner(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const ownerId = req.owner?.ownerId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!ownerId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: COUPON_MESSAGES.OWNER_AUTH_REQUIRED,
          })
        );
        return;
      }

      const result = await this.couponService.getCouponsByOwner(
        new Types.ObjectId(ownerId),
        page,
        limit
      );

      if (result.success) {
        res.status(StatusCodes.OK).json(result);
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(result);
      }
    } catch (error: unknown) {
      this._handleControllerError(
        res,
        error,
        COUPON_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }
  private _handleControllerError(
    res: Response,
    error: unknown,
    defaultMessage: string
  ): void {
    const message = error instanceof Error ? error.message : defaultMessage;
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      createResponse({
        success: false,
        message,
      })
    );
  }
}

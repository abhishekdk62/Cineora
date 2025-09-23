import { ICouponService } from "../interfaces/coupons.service.interface";
import { ICouponRepository } from "../interfaces/coupons.repository.interface";
import {
  CreateCouponDto,
  UpdateCouponDto,
  ValidateCouponDto,
  ValidateCouponDtoNew,
} from "../dtos/dto";
import { ApiResponse, createResponse } from "../../../utils/createResponse";
import { ICoupon } from "../interfaces/coupons.model.interface";
import { IPaginatedResult } from "../interfaces/coupons.repository.interface";
import { Types } from "mongoose";

export class CouponService implements ICouponService {
  constructor(private readonly couponRepository: ICouponRepository) {}

  async createCoupon(data: CreateCouponDto): Promise<ApiResponse<ICoupon>> {
    try {
      this._validateCreateCouponData(data);

      const existingCoupon = await this.couponRepository.findCouponByUniqueId(
        data.uniqueId
      );
      if (existingCoupon) {
        return createResponse({
          success: false,
          message: "Coupon with this unique ID already exists",
        });
      }

      const couponData = this._prepareCouponData(data);
      const coupon = await this.couponRepository.createCoupon(couponData);

      if (!coupon) {
        return createResponse({
          success: false,
          message: "Failed to create coupon",
        });
      }

      return createResponse({
        success: true,
        message: "Coupon created successfully",
        data: coupon,
      });
    } catch (error: unknown) {
      return this._handleServiceError(error, "Failed to create coupon");
    }
  }
  async validateCouponByCode(
    data: ValidateCouponDtoNew
  ): Promise<ApiResponse<ICoupon>> {
    try {
      const { couponCode, theaterId } = data;

      const coupon = await this.couponRepository.findCouponByUniqueId(
        couponCode
      );

      if (!coupon) {
        return createResponse({
          success: false,
          message: "Coupon doesn't exist or expired",
        });
      }

      if (!coupon.isActive) {

        return createResponse({
          success: false,
          message: "Coupon doesn't exist or expired",
        });
      }

      if (coupon.expiryDate && new Date() > coupon.expiryDate) {

        return createResponse({
          success: false,
          message: "Coupon doesn't exist or expired",
        });
      }

      if (coupon.currentUsageCount >= coupon.maxUsageCount) {

        return createResponse({
          success: false,
          message: "Coupon doesn't exist or expired",
        });
      }

      const isValidForTheater = coupon.theaterIds.some(
        (theater) => theater._id.toString() === theaterId.toString()
      );
     
      if (!isValidForTheater) {
        console.log('isValidForTheater');
        
        return createResponse({
          success: false,
          message: "Coupon doesn't exist or expired",
        });
      }

      return createResponse({
        success: true,
        message: "Coupon is valid",
        data: coupon,
      });
    } catch (error: unknown) {
      return this._handleServiceError(error, "Failed to validate coupon");
    }
  }

  async updateCoupon(
    couponId: Types.ObjectId,
    data: UpdateCouponDto
  ): Promise<ApiResponse<ICoupon>> {
    try {
      const existingCoupon = await this.couponRepository.findCouponById(
        couponId
      );
      if (!existingCoupon) {
        return createResponse({
          success: false,
          message: "Coupon not found",
        });
      }

      if (data.uniqueId && data.uniqueId !== existingCoupon.uniqueId) {
        const duplicateCoupon =
          await this.couponRepository.findCouponByUniqueId(data.uniqueId);
        if (duplicateCoupon) {
          return createResponse({
            success: false,
            message: "Coupon with this unique ID already exists",
          });
        }
      }

      const updatedCoupon = await this.couponRepository.updateCoupon(
        couponId,
        data
      );

      if (!updatedCoupon) {
        return createResponse({
          success: false,
          message: "Failed to update coupon",
        });
      }

      return createResponse({
        success: true,
        message: "Coupon updated successfully",
        data: updatedCoupon,
      });
    } catch (error: unknown) {
      return this._handleServiceError(error, "Failed to update coupon");
    }
  }

  async deleteCoupon(
    couponId: Types.ObjectId,
    ownerId: Types.ObjectId
  ): Promise<ApiResponse<void>> {
    try {
      const existingCoupon = await this.couponRepository.findCouponById(
        couponId
      );
      if (!existingCoupon) {
        return createResponse({
          success: false,
          message: "Coupon not found",
        });
      }

      if (existingCoupon.createdBy.toString() !== ownerId.toString()) {
        return createResponse({
          success: false,
          message: "Unauthorized: You can only delete your own coupons",
        });
      }

      const deleted = await this.couponRepository.deleteCoupon(couponId);

      if (!deleted) {
        return createResponse({
          success: false,
          message: "Failed to delete coupon",
        });
      }

      return createResponse({
        success: true,
        message: "Coupon deleted successfully",
      });
    } catch (error: unknown) {
      return this._handleServiceError(error, "Failed to delete coupon");
    }
  }

  async getCouponById(couponId: Types.ObjectId): Promise<ApiResponse<ICoupon>> {
    try {
      const coupon = await this.couponRepository.findCouponById(couponId);

      if (!coupon) {
        return createResponse({
          success: false,
          message: "Coupon not found",
        });
      }

      return createResponse({
        success: true,
        message: "Coupon retrieved successfully",
        data: coupon,
      });
    } catch (error: unknown) {
      return this._handleServiceError(error, "Failed to get coupon");
    }
  }

  async getAllCoupons(
    page: number,
    limit: number,
    ownerId?: Types.ObjectId
  ): Promise<ApiResponse<IPaginatedResult<ICoupon>>> {
    try {
      this._validatePaginationParams(page, limit);

      const result = await this.couponRepository.findAllCoupons(
        page,
        limit,
        ownerId
      );

      return createResponse({
        success: true,
        message: "Coupons retrieved successfully",
        data: result,
      });
    } catch (error: unknown) {
      return this._handleServiceError(error, "Failed to get all coupons");
    }
  }
 

  async getCouponsByTheaterId(
    theaterId: Types.ObjectId
  ): Promise<ApiResponse<ICoupon[]>> {
    try {
      if (!theaterId) {
        return createResponse({
          success: false,
          message: "Theater ID is required",
        });
      }

      const coupons = await this.couponRepository.findCouponsByTheaterId(
        theaterId
      );

      return createResponse({
        success: true,
        message: "Theater coupons retrieved successfully",
        data: coupons,
      });
    } catch (error: unknown) {
      return this._handleServiceError(error, "Failed to get theater coupons");
    }
  }

  async validateAndUseCoupon(
    data: ValidateCouponDto
  ): Promise<ApiResponse<{ coupon: ICoupon; discountAmount: number }>> {
    try {
      const coupon = await this.couponRepository.findCouponByUniqueId(
        data.uniqueId
      );

      if (!coupon) {
        return createResponse({
          success: false,
          message: "Invalid coupon code",
        });
      }

      const validationResult = this._validateCouponForUse(
        coupon,
        data.theaterId,
        data.totalAmount
      );
      if (!validationResult.isValid) {
        return createResponse({
          success: false,
          message: validationResult.message,
        });
      }

      const discountAmount = Math.round(
        (data.totalAmount * coupon.discountPercentage) / 100
      );

      const updatedCoupon = await this.couponRepository.markCouponAsUsed(
        coupon._id
      );

      if (!updatedCoupon) {
        return createResponse({
          success: false,
          message: "Failed to apply coupon",
        });
      }

      return createResponse({
        success: true,
        message: "Coupon applied successfully",
        data: {
          coupon: updatedCoupon,
          discountAmount,
        },
      });
    } catch (error: unknown) {
      return this._handleServiceError(
        error,
        "Failed to validate and use coupon"
      );
    }
  }
async incrementCouponUsage(couponId: string): Promise<ApiResponse<void>> {
  try {
    if (!couponId) {
      return createResponse({
        success: false,
        message: "Coupon ID is required",
      });
    }

    const objectId = new Types.ObjectId(couponId);

    // Check if coupon exists
    const existingCoupon = await this.couponRepository.findCouponById(objectId);
    if (!existingCoupon) {
      return createResponse({
        success: false,
        message: "Coupon not found",
      });
    }

    if (existingCoupon.currentUsageCount >= existingCoupon.maxUsageCount) {
      return createResponse({
        success: false,
        message: "Coupon usage limit already reached",
      });
    }

    await this.couponRepository.incrementCouponUsage(objectId);

    return createResponse({
      success: true,
      message: "Coupon usage incremented successfully",
    });

  } catch (error: unknown) {
    return this._handleServiceError(error, "Failed to increment coupon usage");
  }
}

  async getCouponsByOwner(
    ownerId: Types.ObjectId,
    page: number,
    limit: number
  ): Promise<ApiResponse<IPaginatedResult<ICoupon>>> {
    try {
      this._validatePaginationParams(page, limit);

      const result = await this.couponRepository.findCouponsByOwner(
        ownerId,
        page,
        limit
      );

      return createResponse({
        success: true,
        message: "Owner coupons retrieved successfully",
        data: result,
      });
    } catch (error: unknown) {
      return this._handleServiceError(error, "Failed to get owner coupons");
    }
  }

  private _validateCreateCouponData(data: CreateCouponDto): void {
    if (!data.name?.trim()) {
      throw new Error("Coupon name is required");
    }
    if (!data.uniqueId?.trim()) {
      throw new Error("Unique ID is required");
    }
    if (!data.theaterIds || data.theaterIds.length === 0) {
      throw new Error("At least one theater ID is required");
    }
    if (
      !data.discountPercentage ||
      data.discountPercentage < 1 ||
      data.discountPercentage > 100
    ) {
      throw new Error("Discount percentage must be between 1 and 100");
    }
    if (!data.expiryDate || new Date(data.expiryDate) <= new Date()) {
      throw new Error("Expiry date must be in the future");
    }
    if (!data.createdBy) {
      throw new Error("Creator ID is required");
    }
  }

  private _prepareCouponData(data: CreateCouponDto): Partial<ICoupon> {
    const theaterNames = data.theaterNames || [];
    const description =
      data.description ||
      `Get ${data.discountPercentage}% off on bookings at ${theaterNames.join(
        ", "
      )} theaters. Valid till ${new Date(
        data.expiryDate
      ).toLocaleDateString()}`;

    return {
      name: data.name.trim(),
      uniqueId: data.uniqueId.trim().toUpperCase(),
      theaterIds: data.theaterIds,
      discountPercentage: data.discountPercentage,
      description,
      expiryDate: new Date(data.expiryDate),
      maxUsageCount: data.maxUsageCount || 1,
      createdBy: data.createdBy,
      isActive: true,
      isUsed: false,
      currentUsageCount: 0,
      minAmount:data.minAmount
    };
  }

  private _validateCouponForUse(
    coupon: ICoupon,
    theaterId: Types.ObjectId,
    totalAmount: number
  ): { isValid: boolean; message: string } {
    if (!coupon.isActive) {
      return { isValid: false, message: "Coupon is inactive" };
    }

    if (new Date() > coupon.expiryDate) {
      return { isValid: false, message: "Coupon has expired" };
    }

    if (coupon.currentUsageCount >= coupon.maxUsageCount) {
      return { isValid: false, message: "Coupon usage limit reached" };
    }

    const hasValidTheater = coupon.theaterIds.some(
      (couponTheaterId) => couponTheaterId.toString() === theaterId.toString()
    );

    if (!hasValidTheater) {
      return {
        isValid: false,
        message: "Coupon is not valid for selected theater",
      };
    }

    if (totalAmount <= 0) {
      return { isValid: false, message: "Invalid total amount" };
    }

    return { isValid: true, message: "Coupon is valid" };
  }

  private _validatePaginationParams(page: number, limit: number): void {
    if (page < 1) throw new Error("Page must be greater than 0");
    if (limit < 1 || limit > 100)
      throw new Error("Limit must be between 1 and 100");
  }

  private _handleServiceError(
    error: unknown,
    defaultMessage: string
  ): ApiResponse<any> {
    const message = error instanceof Error ? error.message : defaultMessage;
    return createResponse({
      success: false,
      message,
    });
  }
}

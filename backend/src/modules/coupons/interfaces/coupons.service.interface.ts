import { Types } from 'mongoose';
import { ICoupon } from './coupons.model.interface';
import { IPaginatedResult } from './coupons.repository.interface';
import { ApiResponse } from '../../../utils/createResponse';
import { CreateCouponDto, UpdateCouponDto, ValidateCouponDto, ValidateCouponDtoNew } from '../dtos/dto';

export interface ICouponService {
  createCoupon(data: CreateCouponDto): Promise<ApiResponse<ICoupon>>;
  updateCoupon(couponId: Types.ObjectId, data: UpdateCouponDto): Promise<ApiResponse<ICoupon>>;
  deleteCoupon(couponId: Types.ObjectId, ownerId: Types.ObjectId): Promise<ApiResponse<void>>;
  getCouponById(couponId: Types.ObjectId): Promise<ApiResponse<ICoupon>>;
    validateCouponByCode(data: ValidateCouponDtoNew): Promise<ApiResponse<ICoupon>>;
incrementCouponUsage(couponId: string): Promise<ApiResponse<void>>
  getAllCoupons(page: number, limit: number, ownerId?: Types.ObjectId): Promise<ApiResponse<IPaginatedResult<ICoupon>>>;
getCouponsByTheaterId(theaterId: Types.ObjectId): Promise<ApiResponse<ICoupon[]>>;
  validateAndUseCoupon(data: ValidateCouponDto): Promise<ApiResponse<{ coupon: ICoupon; discountAmount: number }>>;
  getCouponsByOwner(ownerId: Types.ObjectId, page: number, limit: number): Promise<ApiResponse<IPaginatedResult<ICoupon>>>;
}

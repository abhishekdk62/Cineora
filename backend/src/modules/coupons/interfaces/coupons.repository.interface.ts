import { Types } from 'mongoose';
import { ICoupon } from './coupons.model.interface';

export interface IPaginatedResult<T> {
  data: T[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ICouponRepository {
  createCoupon(couponData: Partial<ICoupon>): Promise<ICoupon | null>;
  updateCoupon(couponId: Types.ObjectId, updateData: Partial<ICoupon>): Promise<ICoupon | null>;
  deleteCoupon(couponId: Types.ObjectId): Promise<boolean>;
  findCouponById(couponId: Types.ObjectId): Promise<ICoupon | null>;
  findCouponByUniqueId(uniqueId: string): Promise<ICoupon | null>;
    findCouponByUniqueId(uniqueId: string): Promise<ICoupon | null>;
incrementCouponUsage(couponId: Types.ObjectId): Promise<ICoupon | null>
  findAllCoupons(page: number, limit: number, ownerId?: Types.ObjectId): Promise<IPaginatedResult<ICoupon>>;
  findCouponsByTheaterIds(theaterIds: Types.ObjectId[], page: number, limit: number): Promise<IPaginatedResult<ICoupon>>;
findCouponsByTheaterId(theaterId: Types.ObjectId): Promise<ICoupon[]>;
  markCouponAsUsed(couponId: Types.ObjectId): Promise<ICoupon | null>;
  findCouponsByOwner(ownerId: Types.ObjectId, page: number, limit: number): Promise<IPaginatedResult<ICoupon>>;
}

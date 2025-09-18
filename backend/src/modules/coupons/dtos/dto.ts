import { Types } from 'mongoose';

export interface CreateCouponDto {
  name: string;
  uniqueId: string;
  theaterIds: Types.ObjectId[];
  discountPercentage: number;
  description?: string;
  expiryDate: Date;
  maxUsageCount?: number;
  createdBy: Types.ObjectId;
  theaterNames?: string[]; // For auto-generating description
  minAmount:number;
}

export interface UpdateCouponDto {
  name?: string;
  uniqueId?: string;
  theaterIds?: Types.ObjectId[];
  discountPercentage?: number;
  description?: string;
  expiryDate?: Date;
  maxUsageCount?: number;
  isActive?: boolean;
  minAmount?:number;

}
export interface ToggleStatusDto {
 
  isActive: boolean;
}

export interface ValidateCouponDto {
  uniqueId: string;
  theaterId: Types.ObjectId;
  totalAmount: number;
  userId: Types.ObjectId;
}
export interface ValidateCouponDtoNew {
  couponCode: string;
  theaterId: Types.ObjectId;
}



export interface GetCouponsDto {
  page?: number;
  limit?: number;
  ownerId?: Types.ObjectId;
}

export interface GetCouponsByTheaterDto {
  theaterIds: Types.ObjectId[];
  page?: number;
  limit?: number;
}

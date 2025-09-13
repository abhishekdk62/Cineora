import { Document, Types } from 'mongoose';

export interface ICoupon extends Document {
  _id: Types.ObjectId;
  name: string;
  uniqueId: string;
  theaterIds: Types.ObjectId[];
  discountPercentage: number;
  description: string;
  expiryDate: Date;
  isActive: boolean;
  isUsed: boolean;
  maxUsageCount: number;
  currentUsageCount: number;
  createdBy: Types.ObjectId; // Owner ID who created the coupon
  createdAt: Date;
  updatedAt: Date;
}

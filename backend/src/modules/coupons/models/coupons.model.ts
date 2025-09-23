import mongoose, { Schema } from "mongoose";
import { ICoupon } from "../interfaces/coupons.model.interface";

const CouponSchema = new Schema<ICoupon>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  uniqueId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    maxlength: 20
  },
  theaterIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Theater',
    required: true
  }],
  discountPercentage: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  minAmount:{
    type:Number,
    required:true,
  },
  expiryDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(value: Date) {
        return value > new Date();
      },
      message: 'Expiry date must be in the future'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  maxUsageCount: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  currentUsageCount: {
    type: Number,
    default: 0,
    min: 0
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'Owner',
    required: true
  }
}, {
  timestamps: true,
});

CouponSchema.index({ uniqueId: 1 });
CouponSchema.index({ theaterIds: 1 });
CouponSchema.index({ createdBy: 1 });
CouponSchema.index({ expiryDate: 1 });
CouponSchema.index({ isActive: 1, isUsed: 1 });

export default mongoose.model<ICoupon>("Coupon", CouponSchema);

import Coupon from "../models/coupons.model";
import {
  ICouponRepository,
  IPaginatedResult,
} from "../interfaces/coupons.repository.interface";
import { ICoupon } from "../interfaces/coupons.model.interface";
import { Types } from "mongoose";
import path from "path";

export class CouponRepository implements ICouponRepository {
  async createCoupon(couponData: Partial<ICoupon>): Promise<ICoupon | null> {
    try {
      const coupon = new Coupon(couponData);
      return await coupon.save();
    } catch (error) {
      throw new Error(
        `Failed to create coupon: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
  // Add this method to your existing CouponRepository class
  async incrementCouponUsage(
    couponId: Types.ObjectId
  ): Promise<ICoupon | null> {
    try {
      return await Coupon.findByIdAndUpdate(
        couponId,
        {
          $inc: { currentUsageCount: 1 },
        },
        { new: true } // Return the updated document
      );
    } catch (error) {
      throw new Error(
        `Failed to increment coupon usage: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async updateCoupon(
    couponId: Types.ObjectId,
    updateData: Partial<ICoupon>
  ): Promise<ICoupon | null> {
    try {
      return await Coupon.findByIdAndUpdate(
        couponId,
        { $set: updateData },
        { new: true, runValidators: true }
      ).populate("theaterIds", "name location");
    } catch (error) {
      throw new Error(
        `Failed to update coupon: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async deleteCoupon(couponId: Types.ObjectId): Promise<boolean> {
    try {
      const result = await Coupon.findByIdAndDelete(couponId);
      return !!result;
    } catch (error) {
      throw new Error(
        `Failed to delete coupon: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async findCouponById(couponId: Types.ObjectId): Promise<ICoupon | null> {
    try {
      return await Coupon.findById(couponId).populate(
        "theaterIds",
        "name location"
      );
    } catch (error) {
      throw new Error(
        `Failed to find coupon by ID: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async findCouponByUniqueId(uniqueId: string): Promise<ICoupon | null> {
    try {
      return await Coupon.findOne({
        uniqueId: uniqueId.toUpperCase(),
      }).populate("theaterIds", "name location");
    } catch (error) {
      throw new Error(
        `Failed to find coupon by unique ID: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async findAllCoupons(
    page: number,
    limit: number,
    ownerId?: Types.ObjectId
  ): Promise<IPaginatedResult<ICoupon>> {
    try {
      const skip = (page - 1) * limit;
      const filter: Record<string, any> = ownerId ? { createdBy: ownerId } : {};

      const [data, totalCount] = await Promise.all([
        Coupon.find(filter)
          .populate("theaterIds", "name location city state")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Coupon.countDocuments(filter),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        data,
        totalCount,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    } catch (error) {
      throw new Error(
        `Failed to find all coupons: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async findCouponsByTheaterIds(
    theaterIds: Types.ObjectId[],
    page: number,
    limit: number
  ): Promise<IPaginatedResult<ICoupon>> {
    try {
      const skip = (page - 1) * limit;
      const filter = {
        theaterIds: { $in: theaterIds },
        isActive: true,
        expiryDate: { $gt: new Date() },
      };

      const [data, totalCount] = await Promise.all([
        Coupon.find(filter)
          .populate("theaterIds", "name location")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Coupon.countDocuments(filter),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        data,
        totalCount,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    } catch (error) {
      throw new Error(
        `Failed to find coupons by theater IDs: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async findCouponsByTheaterId(theaterId: Types.ObjectId): Promise<ICoupon[]> {
    try {
      return await Coupon.find({
        theaterIds: theaterId,
        isActive: true,
        expiryDate: { $gt: new Date() },
        $expr: { $lt: ["$currentUsageCount", "$maxUsageCount"] },
      })
        .populate("theaterIds", "name location")
        .sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(
        `Failed to find coupons by theater ID: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async markCouponAsUsed(couponId: Types.ObjectId): Promise<ICoupon | null> {
    try {
      return await Coupon.findByIdAndUpdate(
        couponId,
        {
          $inc: { currentUsageCount: 1 },
          $set: {
            isUsed: true, // This will be set to true when currentUsageCount >= maxUsageCount
          },
        },
        { new: true }
      );
    } catch (error) {
      throw new Error(
        `Failed to mark coupon as used: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async findCouponsByOwner(
    ownerId: Types.ObjectId,
    page: number,
    limit: number
  ): Promise<IPaginatedResult<ICoupon>> {
    try {
      const skip = (page - 1) * limit;
      const filter = { createdBy: ownerId };

      const [data, totalCount] = await Promise.all([
        Coupon.find(filter)
          .populate("theaterIds", "name location")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Coupon.countDocuments(filter),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        data,
        totalCount,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    } catch (error) {
      throw new Error(
        `Failed to find coupons by owner: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}

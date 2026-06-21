import { CouponResponseDto } from "../dtos/coupon.dto";
import { CouponData } from "../types";

export const toCouponData = (coupon: CouponResponseDto): CouponData => ({
  _id: coupon._id,
  name: coupon.name,
  uniqueId: coupon.uniqueId,
  discountPercentage: coupon.discountPercentage,
  description: coupon.description,
  expiryDate: coupon.expiryDate,
  isActive: coupon.isActive,
  maxUsageCount: coupon.maxUsageCount,
  theaterIds: coupon.theaterIds?.map((t) => ({ _id: t._id, name: t.name })),
});

export const normalizeCouponResponse = (
  data: CouponResponseDto | CouponResponseDto[] | undefined
): CouponData | undefined => {
  if (!data) return undefined;
  const coupon = Array.isArray(data) ? data[0] : data;
  return coupon ? toCouponData(coupon) : undefined;
};

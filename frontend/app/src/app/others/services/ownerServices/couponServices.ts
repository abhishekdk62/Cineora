import OWNER_COUPON from "../../constants/ownerConstants/couponConstants";
import apiClient from "../../Utils/apiClient";
import {
  CreateCouponRequestDto,
  CreateCouponResponseDto,
  UpdateCouponRequestDto,
  UpdateCouponResponseDto,
  DeleteCouponResponseDto,
  GetCouponsResponseDto,
  GetCouponsQueryDto
} from '../../dtos/coupon.dto';

export const createCoupon = async (params: CreateCouponRequestDto): Promise<CreateCouponResponseDto> => {
  const data = await apiClient.post(OWNER_COUPON.CREATE, params);
  return data.data;
};

export const getOwnerCoupons = async (query?: GetCouponsQueryDto): Promise<GetCouponsResponseDto> => {
  const params = new URLSearchParams();
  
  if (query?.page) params.append('page', query.page.toString());
  if (query?.limit) params.append('limit', query.limit.toString());
  
  const queryString = params.toString();
  const url = queryString ? `${OWNER_COUPON.GET_ALL}?${queryString}` : OWNER_COUPON.GET_ALL;
  
  const data = await apiClient.get(url);
  return data.data;
};

export const updateCoupon = async (couponId: string, params: UpdateCouponRequestDto): Promise<UpdateCouponResponseDto> => {
  const data = await apiClient.put(`${OWNER_COUPON.UPDATE}/${couponId}`, params);
  return data.data;
};

export const deleteCoupon = async (couponId: string): Promise<DeleteCouponResponseDto> => {
  const data = await apiClient.delete(`${OWNER_COUPON.DELETE}/${couponId}`);
  return data.data;
};

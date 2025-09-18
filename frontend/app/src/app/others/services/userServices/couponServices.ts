import USER_COUPON from "../../constants/userConstants/couponConstants";
import apiClient from "../../Utils/apiClient";
import {
  GetCouponsByTheaterResponseDto,
  GetCouponsQueryDto,
  CouponResponseDto
} from '../../dtos/coupon.dto';

export const getCouponsByTheaterId = async (theaterId: string): Promise<GetCouponsByTheaterResponseDto> => {
  const data = await apiClient.get(`${USER_COUPON.GET_BY_THEATER}/${theaterId}`);
  return data.data;
};
export const checkCoupon = async (theaterId:string,couponCode:string): Promise<GetCouponsByTheaterResponseDto> => {
  const data = await apiClient.post(`${USER_COUPON.CHECK}`,{couponCode,theaterId});
  return data.data;
};
export interface GetCouponsResponseDto {
  data: {
    data: CouponResponseDto[];        // Your actual coupon array
    totalCount: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  success: boolean;
  message?: string;
}

export const getAllCoupons = async (query?: GetCouponsQueryDto): Promise<GetCouponsResponseDto> => {
  const params = new URLSearchParams();
  
  if (query?.page) params.append('page', query.page.toString());
  if (query?.limit) params.append('limit', query.limit.toString());
  
  const queryString = params.toString();
  const url = queryString ? `${USER_COUPON.GET_ALL}?${queryString}` : USER_COUPON.GET_ALL;
  
  const data = await apiClient.get(url);
  return data.data;
};

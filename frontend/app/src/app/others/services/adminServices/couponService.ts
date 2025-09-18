import ADMIN_COUPONS from "../../constants/adminConstants/couponsConstants";
import apiClient from "../../Utils/apiClient";
import { GetCouponsResponseDto } from "../userServices/couponServices";

export const getOwnerCoupons = async (query?:{page:number,limit:number}): Promise<GetCouponsResponseDto> => {
  const params = new URLSearchParams();
  
  if (query?.page) params.append('page', query.page.toString());
  if (query?.limit) params.append('limit', query.limit.toString());
  
 
  const data = await apiClient.get(ADMIN_COUPONS.BASE,{params});
  return data.data;
};
export const toggleStatus = async (couponId:string,val:boolean): Promise<GetCouponsResponseDto> => {
  
  const data = await apiClient.patch(ADMIN_COUPONS.TOGGLE_STATUS(couponId),{isActive: val});
  return data.data;
};
